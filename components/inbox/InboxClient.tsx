'use client';

import { useEffect, useState, useRef } from 'react';
import { getConversations, getMessages, sendMessage } from '@/actions/message/conversation';
import { createClient } from '@/utils/supabase/client';
import { Send, Paperclip } from 'lucide-react';
import Image from 'next/image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface Conversation {
  id: string;
  customer_id: string;
  professional_id: string;
  created_at: string;
  other_user_name: string;
  last_message?: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  file_url?: string;
  read_at?: string;
  sent_at?: string;
}

export default function InboxClient({ userId }: { userId: string }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [typing, setTyping] = useState(false);
  const supabase = createClient();
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const messagesBottomRef = useRef<HTMLDivElement>(null);

// Scroll to bottom when messages change
  useEffect(() => {
    messagesBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    (async () => {
      const data = await getConversations(userId);
      setConversations(data);
    })();
  }, [userId]);

  useEffect(() => {
    if (!selectedConversation) return;

    (async () => {
      const data = await getMessages(selectedConversation.id);
      setMessages(data);

      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', selectedConversation.id)
        .neq('sender_id', userId)
        .is('read_at', null);
    })();
  }, [selectedConversation]);

  // ✅ Realtime - new message
  useEffect(() => {
    if (!selectedConversation) return;

    const channel = supabase
      .channel(`conversation-${selectedConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation.id}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          if (newMessage.sender_id !== userId) {
            setMessages((prev) => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation?.id, userId]);

  // ✅ Realtime - read_at update
  useEffect(() => {
    if (!selectedConversation) return;

    const readChannel = supabase
      .channel(`read-${selectedConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation.id}`,
        },
        (payload) => {
          const updatedMsg = payload.new as Message;
          setMessages((prev) =>
            prev.map((msg) => (msg.id === updatedMsg.id ? updatedMsg : msg))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(readChannel);
    };
  }, [selectedConversation?.id]);

  // ✅ Typing indicator
  useEffect(() => {
    if (!selectedConversation) return;

    const typingChannel = supabase.channel(`typing-${selectedConversation.id}`)
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.sender_id !== userId) setTyping(true);
      })
      .on('broadcast', { event: 'stop_typing' }, ({ payload }) => {
        if (payload.sender_id !== userId) setTyping(false);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(typingChannel);
    };
  }, [selectedConversation?.id, userId]);

  const broadcastTyping = () => {
    const typingChannel = supabase.channel(`typing-${selectedConversation?.id}`);
    typingChannel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { sender_id: userId },
    });

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      typingChannel.send({
        type: 'broadcast',
        event: 'stop_typing',
        payload: { sender_id: userId },
      });
    }, 2000);
  };

  const handleSend = async () => {
    if (!selectedConversation || (!newMessage.trim() && files.length === 0)) return;

    setUploading(true);
    const uploadedUrls: string[] = [];
    const token = (await supabase.auth.getSession()).data.session?.access_token;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop();
      const filePath = `messages/${selectedConversation.id}/${Date.now()}-${i}.${ext}`;
      const uploadUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/chatmedia/${filePath}`;

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', uploadUrl);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.setRequestHeader('x-upsert', 'true');
        xhr.setRequestHeader('Content-Type', file.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round(((i + event.loaded / event.total) / files.length) * 100);
            setUploadProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            uploadedUrls.push(
              `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/chatmedia/${filePath}`
            );
            resolve();
          } else {
            console.error('Upload failed', xhr.responseText);
            reject();
          }
        };

        xhr.onerror = () => {
          console.error('Upload error');
          reject();
        };

        xhr.send(file);
      });
    }

    setUploading(false);
    setUploadProgress(0);
    setFiles([]);

    const messagesToAdd: Message[] = [];

    if (uploadedUrls.length === 0) {
      const sent = await sendMessage(selectedConversation.id, userId, newMessage);
      if (sent) messagesToAdd.push(sent);
    } else {
      for (const url of uploadedUrls) {
        const sent = await sendMessage(selectedConversation.id, userId, newMessage, url);
        if (sent) messagesToAdd.push(sent);
      }
    }

    setNewMessage('');
    setMessages((prev) => [...prev, ...messagesToAdd]);
  };

  return (
   <div className="flex flex-col md:flex-row h-[80vh] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 max-w-full overflow-x-hidden">
    {/* On small devices: horizontal scroll of user avatars */}
    <div className="md:hidden min-h-[60px] flex items-center space-x-4 overflow-x-auto px-4 py-2 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
    {conversations.map((conv) => (
      <button
        key={conv.id}
        onClick={() => setSelectedConversation(conv)}
        className={`flex-shrink-0 w-12 h-12 rounded-full border-2 transition-colors duration-200 ${
          selectedConversation?.id === conv.id
            ? 'border-blue-500'
            : 'border-transparent'
        }`}
        aria-label={`Conversation with ${conv.other_user_name}`}
      >
        <div className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-800 dark:text-gray-200 font-semibold text-sm">
          {conv.other_user_name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </div>
      </button>
    ))}
  </div>


  {/* Sidebar for conversations - hidden on sm */}
  <aside className="hidden md:block w-80 border-r border-gray-300 dark:border-gray-700 overflow-y-auto">
    <ul>
      {conversations.map((conv) => (
        <li
          key={conv.id}
          className={`cursor-pointer p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 ${
            selectedConversation?.id === conv.id
              ? 'bg-gray-200 dark:bg-gray-700 font-semibold'
              : ''
          }`}
          onClick={() => setSelectedConversation(conv)}
        >
          <div className="flex justify-between items-center">
            <span className='font-semibold text-sm'>{conv.other_user_name}</span>
            <small className="text-xs text-gray-500 dark:text-gray-400">
              {dayjs(conv.created_at).fromNow()}
            </small>
          </div>
          {conv.last_message && (() => {
          const urlPattern = /(https?:\/\/[^\s]+)/g;
          const fileExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'mp4', 'mp3', 'mov'];
          const isFileUrl = (() => {
            if (!conv.last_message) return false;
            const match = conv.last_message.match(urlPattern);
            if (!match) return false;
            const url = match[0];
            return fileExtensions.some(ext => url.toLowerCase().endsWith(`.${ext}`));
          })();

          if (isFileUrl) {
            return (
              <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400 mt-1">
                <Paperclip size={12} />
                <span>Attachment</span>
              </div>
            );
          }

          return (
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-full mt-1">
              {conv.last_message.length > 50
                ? conv.last_message.slice(0, 50) + '...'
                : conv.last_message}
            </p>
          );
        })()}

        </li>
      ))}
    </ul>
  </aside>

  {/* Main chat panel */}
  <section className="flex flex-col flex-1">
    {/* Header */}
    <header className="p-4 border-b border-gray-300 dark:border-gray-700 flex items-center justify-between">
      {selectedConversation ? (
        <>
          <h2 className="text-lg font-semibold">{selectedConversation.other_user_name}</h2>
          {typing && <span className="text-sm text-green-500 italic">Typing...</span>}
        </>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">Select a conversation</p>
      )}
    </header>

    {/* Messages area */}
    {/* Messages area */}
    <div
      className="flex-1 overflow-y-auto px-4 py-2 bg-gray-50 dark:bg-gray-800"
      style={{ scrollbarWidth: 'thin' }}
    >
    {selectedConversation ? (
      messages.length > 0 ? (
        messages.map((msg) => {
          const isMine = msg.sender_id === userId;
        return (
        <div
          key={msg.id}
          className={`flex ${isMine ? 'justify-end' : 'justify-start'} px-2`}
        >
          <div className="flex flex-col items-end max-w-[70%]">
            <div
              className={`break-words whitespace-pre-wrap ${
                msg.file_url && !msg.message
                  ? ''
                  : isMine
                    ? 'rounded-full px-3 py-1 bg-sky-500 text-white dark:bg-sky-600'
                    : 'rounded-full px-3 py-1 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
            >
              {msg.file_url && (
                <Image
                  src={msg.file_url}
                  alt="attachment"
                  width={200}
                  height={200}
                  className="rounded mb-1"
                />
              )}
              {msg.message && <p>{msg.message}</p>}
            </div>

            {/* Timestamp below message bubble */}
            <small
              className={`text-xs mb-2 ${
                isMine ? 'text-right text-gray-400' : 'text-left text-gray-500'
              }`}
            >
              {msg.sent_at ? dayjs(msg.sent_at).fromNow() : ''}
              {msg.read_at && isMine && ' ✓'}
            </small>
          </div>
        </div>
      );


        })
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center mt-10">
          No messages yet. Say hi!
        </p>
      )
    ) : (
      <p className="text-gray-500 dark:text-gray-400 text-center mt-10">
        Select a conversation to start chatting.
      </p>
    )}
    {/* Scroll helper div */}
    <div ref={messagesBottomRef} />

  </div>


    {/* Input area */}
    {/* Input area */}
    {selectedConversation && (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="border-t border-gray-300 dark:border-gray-700 p-4 flex items-center space-x-2 bg-white dark:bg-gray-900"
      >
        <label
          htmlFor="file-upload"
          className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          title="Attach files"
        >
          <Paperclip size={20} />
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              setFiles(Array.from(e.target.files));
            }
          }}
        />
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            broadcastTyping();
          }}
        />
        <button
          type="submit"
          disabled={uploading || (!newMessage.trim() && files.length === 0)}
          className={`p-2 rounded-md ${
            uploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          title="Send message"
        >
          {uploading ? 'Sending...' : <Send size={20} />}
        </button>
      </form>
    )}

    {/* Upload progress bar */}
    {uploading && (
      <div className="h-1 bg-blue-300 dark:bg-blue-600">
        <div
          className="h-full bg-blue-600 dark:bg-blue-400 transition-all duration-300"
          style={{ width: `${uploadProgress}%` }}
        />
      </div>
    )}
  </section>
</div>

  );
}
