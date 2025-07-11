'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Send, Paperclip, Inbox, QrCode, CheckCheck, Camera } from 'lucide-react';
import Image from 'next/image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import UserDetails from './UserDetails';
import CameraModal from './CameraModel';
import { setupPresence } from '@/utils/SetupPresence';

import {
  getConversations,
  getMessages,
  sendMessage,
  markMessagesAsRead
} from '@/actions/message/conversation';




dayjs.extend(relativeTime);

interface Conversation {
  id: string;
  customer_id: string;
  professional_id: string;
  created_at: string;
  other_user_name: string;
  last_message?: string;
  other_user_id?: string;
  other_user_profile_picture?: string;
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
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  // camera modal state
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo');

  // setup user presence
  const [onlineUsers, setOnlineUsers] = useState<Record<string, unknown>>({});

  useEffect(() => {
  if (!userId) return;
  let cleanup: () => void;
  (async () => {
    cleanup = await setupPresence(userId, setOnlineUsers);
  })();
  return () => cleanup?.();
}, [userId]);

console.log("Esmatullah Online Users: ", onlineUsers);




// Scroll to bottom when messages change
  useEffect(() => {
  const container = messagesContainerRef.current;
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}, [messages, uploading]);

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

    try {
      await markMessagesAsRead(selectedConversation.id, userId);
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  })();
}, [selectedConversation]);

  // useEffect(() => {
  //   if (!selectedConversation) return;

  //   (async () => {
  //     const data = await getMessages(selectedConversation.id);
  //     setMessages(data);

  //     await supabase
  //       .from('messages')
  //       .update({ read_at: new Date().toISOString() })
  //       .eq('conversation_id', selectedConversation.id)
  //       .neq('sender_id', userId)
  //       .is('read_at', null);
  //   })();
  // }, [selectedConversation]);

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
    <div className="max-w-screen-xl mx-auto sm:px-6 lg:px-8 overflow-hidden flex flex-col">
      <p className="my-3 font-bold">
        <Inbox className='w-6 h-6 inline-block align-middle mr-2'/>Inbox
      </p>
      <div className="flex flex-col md:flex-row h-screen sm:h-screen lg:h-[80vh] gap-4">
        {/* converstion */}
        <div className="md:flex-3 flex-1 flex flex-col md:flex-row bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 max-w-full overflow-x-hidden border p-4 border-gray-300 dark:border-gray-700 rounded-md">
          {/* On small devices: horizontal scroll of user avatars */}
          <div className="md:hidden min-h-[60px] flex items-center space-x-4 overflow-x-auto px-4 py-2 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
            {conversations.map((conv) => {

                const isOnline = conv.other_user_id ? Object.hasOwn(onlineUsers, conv.other_user_id) : false;

                console.log("Current online user IDs:", Object.keys(onlineUsers));
                console.log("Checking user:", conv.other_user_id, " → isOnline:", isOnline);
                console.log("ONline Users Objects: ", onlineUsers);
                console.log('Online UUU:', isOnline);
              return (
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
                  <div className="relative w-full h-full">
                    <div className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-800 dark:text-gray-200 font-semibold text-sm">
                      {conv.other_user_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>

                    {/* Online status dot */}
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
                        isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                      title={isOnline ? 'Online' : 'Offline'}
                    />
                  </div>
                </button>
              );
            })}

          </div>


          {/* Sidebar for conversations - hidden on sm */}
          <aside className="hidden md:block w-80 border-r border-gray-300 dark:border-gray-700 overflow-y-auto">
          
            <ul>
              {conversations.map((conv) => {
                const isOnline = conv.other_user_id ? Object.hasOwn(onlineUsers, conv.other_user_id) : false;
                console.log("Current online user IDs:", Object.keys(onlineUsers));
                console.log("Checking user:", conv.other_user_id, " → isOnline:", isOnline);

                console.log("ONline Users Objects: ", onlineUsers);
                console.log('Online UUU:', isOnline);
                return (
                  <li
                    key={conv.id}
                    className={`cursor-pointer p-2 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      selectedConversation?.id === conv.id
                        ? 'bg-gray-200 dark:bg-gray-700 font-semibold'
                        : ''
                    }`}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <div className="flex flex-row items-start space-x-3 relative">
                      {/* Avatar */}
                      <div className="relative">
                        {conv.other_user_profile_picture ? (
                          <Image
                            src={conv.other_user_profile_picture}
                            alt={conv.other_user_name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-500 ring-offset-4 ring-offset-slate-50 dark:ring-offset-slate-900"
                            unoptimized
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-800 dark:text-gray-200 font-semibold text-sm">
                            {conv.other_user_name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                        )}

                        {/* Online status dot */}
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
                            isOnline ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                          title={isOnline ? 'Online' : 'Offline'}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-xs truncate">{conv.other_user_name}</span>
                          <small className="text-[10px] text-gray-500 dark:text-gray-400">
                            {dayjs(conv.created_at).fromNow()}
                          </small>
                        </div>

                        {/* Last message preview */}
                        {(() => {
                          const urlPattern = /(https?:\/\/[^\s]+)/g;
                          const fileExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'mp4', 'mp3', 'mov'];
                          const match = conv.last_message?.match(urlPattern);
                          const isFileUrl = match && fileExtensions.some(ext => match[0].toLowerCase().endsWith(`.${ext}`));

                          if (!conv.last_message) {
                            return (
                              <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1">
                                Chat with {conv.other_user_name}
                              </p>
                            );
                          }

                          if (isFileUrl) {
                            return (
                              <div className="flex items-center space-x-1 text-[10px] text-gray-600 dark:text-gray-400 mt-1">
                                <Paperclip size={12} />
                                <span>Attachment</span>
                              </div>
                            );
                          }

                          return (
                            <p className="text-[10px] text-gray-600 dark:text-gray-400 truncate mt-1">
                              {conv.last_message.length > 50
                                ? conv.last_message.slice(0, 50) + '...'
                                : conv.last_message}
                            </p>
                          );
                        })()}
                      </div>
                    </div>
                  </li>
                );
              })}

            </ul>
          </aside>

        {/* Main chat panel */}
        <section className="flex flex-col flex-1 min-h-0 overflow-hidden relative">
          {/* Header */}
          <header className="shrink-0 px-4 py-2 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 z-10">
            {selectedConversation ? (
              <div className="w-full">
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  {selectedConversation.other_user_profile_picture ? (
                    <Image
                      src={selectedConversation.other_user_profile_picture}
                      alt={selectedConversation.other_user_name}
                      width={40}
                      height={40}
                      unoptimized
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-500 ring-offset-4 ring-offset-slate-50 dark:ring-offset-slate-900 "/>
                  ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-800 dark:text-gray-200 font-semibold text-sm">
                    {selectedConversation.other_user_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  )}
                  {/* Name and Typing/Last Seen */}
                  <div className="flex flex-col">
                    <h2 className="text-xs font-semibold leading-tight">
                      {selectedConversation.other_user_name}
                    </h2>
                    {typing === true ? (
                      <span className="text-[10px] text-sky-500 dark:text-sky-600">
                        Typing...
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">
                        Last message {dayjs(selectedConversation.created_at).fromNow()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Select a conversation</p>
            )}
          </header>
          {/* Messages area */}
            
            <div
            ref={messagesContainerRef}
             className="flex-1 min-h-0 overflow-y-auto px-4 py-2 bg-gray-50 dark:bg-gray-800 scrollbar-thin">
            {selectedConversation ? (
              messages.length > 0 ? (
                <>
                  {messages.map((msg) => {
                  const isMine = msg.sender_id === userId;
                  // const showAvatar = !isMine && selectedConversation?.other_user_profile_picture;

                  return (
                    <div
                      key={msg.id}
                      className={`flex px-2 mb-2 ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* Left Side: Avatar (only for other user) */}
                      {!isMine && (
                        <div className="mr-2">
                          <Image
                            src={selectedConversation.other_user_profile_picture || '/default-avatar.png'}
                            alt={selectedConversation.other_user_name || 'User'}
                            width={32}
                            height={32}
                            unoptimized
                            className="w-6 h-6 rounded-full object-cover shadow border border-gray-300 dark:border-gray-700"
                          />
                        </div>
                      )}

                      {/* Right Side: Message bubble and timestamp */}
                      <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[70%]`}>
                        {/* Message bubble */}
                        <div
                          className={`break-words whitespace-pre-wrap text-[12px] ${
                            msg.file_url && !msg.message
                              ? ''
                              : isMine
                              ? 'rounded-tl-lg rounded-bl-lg rounded-br-lg px-3 py-1 bg-sky-500 text-white dark:bg-sky-600'
                              : 'rounded-tr-lg rounded-br-lg rounded-bl-lg px-3 py-1 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                          }`}
                        >
                          {/* File/Image */}
                          {msg.file_url && (
                            <>
                              <Image
                                src={msg.file_url}
                                alt="attachment"
                                width={200}
                                height={200}
                                unoptimized
                                className="rounded mb-1 cursor-pointer"
                                onClick={() => {
                                  setSelectedImageUrl(msg.file_url!);
                                  setShowImageModal(true);
                                }}
                              />
                              {showImageModal && selectedImageUrl && (
                                <div
                                  className="fixed inset-0 bg-black bg-opacity-70 z-100 flex items-center justify-center"
                                  onClick={() => setShowImageModal(false)}
                                >
                                  <img
                                    src={selectedImageUrl}
                                    alt="Full Image"
                                    className="max-w-full max-h-full object-contain"
                                  />
                                </div>
                              )}
                            </>
                          )}

                          {/* Message Text */}
                          {msg.message && <p>{msg.message}</p>}
                        </div>

                        {/* Timestamp */}
                        <small
                          className={`text-[10px] mt-1 ${
                            isMine ? 'text-right text-gray-400' : 'text-left text-gray-500'
                          }`}
                        >
                          {msg.sent_at ? dayjs(msg.sent_at).fromNow() : ''}
                          <span className="text-green-500 ml-1">
                            {msg.read_at && isMine && <CheckCheck className="w-3 h-3 inline-block" />}
                          </span>
                        </small>
                      </div>
                    </div>
                  );
                })}


                  
                </>
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
          </div>
         


          {/* Input area */}
          {selectedConversation && (
          <div className="shrink-0 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 z-10">
            {/* Preview selected images */}
            {files.length > 0 && (
              <div className="flex flex-wrap gap-4 mb-4">
                {files.map((file, idx) => {
                  const fileUrl = URL.createObjectURL(file);
                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <Image
                        src={fileUrl}
                        alt={`selected-${idx}`}
                        width={120}
                        height={120}
                        className="rounded border border-gray-300 dark:border-gray-600 object-cover"
                      />
                      {uploading && (
                        <div className="w-full h-1 mt-1 bg-gray-200 dark:bg-gray-700 rounded">
                          <div
                            className="h-full bg-blue-500 rounded"
                            style={{
                              width: `${uploadProgress}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                    
                  );
                })}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center space-x-2"
            >
              {/* Attach File Button */}
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              title="Attach files"
            >
              <Paperclip size={20} className="text-gray-500 dark:text-gray-400 hover:text-sky-500 cursor-pointer" />
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              accept="image/*,application/pdf"
              onChange={(e) => {
                if (e.target.files) {
                  setFiles(Array.from(e.target.files));
                }
              }}
            />

           {/* Camera photo */}
          <button type="button" title="Open Camera"
            onClick={() => {
              setCameraMode('photo');
              setShowCameraModal(true);
            }}
          >
            <Camera size={20} className="text-gray-500 dark:text-gray-400 hover:text-sky-500 cursor-pointer" />
          </button>

          {/* Video camera
          <button type="button" title="Record Video"
            onClick={() => {
              setCameraMode('video');
              setShowCameraModal(true);
            }}
          >
            <Film size={20} className="text-gray-500 dark:text-gray-400 hover:text-sky-500 cursor-pointer"/> 
          </button>*/}
           {showCameraModal && (
            <CameraModal
              mode={cameraMode}
              onClose={() => setShowCameraModal(false)}
              onCapture={(file) => setFiles([file])}
            />
          )}


              <input
                type="text"
                placeholder="Type your message..."
                className="text-sm flex-1 rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  broadcastTyping();
                }}
              />
              <button
                type="submit"
                disabled={uploading || (!newMessage.trim() && files.length === 0)}
                className={`p-2 rounded-md text-xs ${
                  uploading
                    ? 'bg-sky-400 cursor-not-allowed'
                    : 'bg-sky-500 hover:bg-sky-600 text-white'
                }`}
                title="Send message"
              >
                {uploading ? 'Sending...' : <Send size={20} />}
              </button>
            </form>
          </div>
        )}
        </section>
      </div>
        {/* user profile */}
        <div className="hidden md:block md:flex-1 flex-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 rounded-md">
          {selectedConversation?.other_user_id ? (
            <UserDetails user={{ id: selectedConversation.other_user_id }} />
          ) : (
            <div className="text-center font-bold text-xl text-gray-500">
              <QrCode className="w-full h-40" />
              Get The App
            </div>
          )}

          
        </div>
      </div>
    </div>
  );
}
