'use client';

import { useEffect, useState } from 'react';
import { getConversations, getMessages, sendMessage } from '@/actions/message/conversation';
import { createClient } from '@/utils/supabase/client';
import { Inbox, Send, Paperclip } from 'lucide-react';
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
  const supabase = createClient();

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

    if (uploadedUrls.length === 0) {
      await sendMessage(selectedConversation.id, userId, newMessage);
    } else {
      for (const url of uploadedUrls) {
        await sendMessage(selectedConversation.id, userId, newMessage, url);
        setNewMessage('');
      }
    }
    setNewMessage('');
    const updatedMessages = await getMessages(selectedConversation.id);
    setMessages(updatedMessages);
  };

  return (
    <div className="flex flex-col md:flex-row h-[80vh] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Inbox panel */}
      <div className="md:w-1/4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <Inbox className="text-gray-600 dark:text-gray-300 w-5 h-5" />
          Inbox
        </h2>
        {conversations.map((c) => (
          <div
            key={c.id}
            className={`p-3 mb-2 cursor-pointer border rounded-md ${
              selectedConversation?.id === c.id
                ? 'bg-sky-200 dark:bg-sky-800 border-sky-500'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            onClick={() => setSelectedConversation(c)}
          >
            <p className="font-semibold">{c.other_user_name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 truncate">
              {c.last_message?.match(/\.(jpg|jpeg|png|gif|pdf|docx|mp4|webm)$/i) ? (
                <>
                  <Paperclip className="w-3 h-3" />
                  <span className="italic">Attachment</span>
                </>
              ) : (
                c.last_message || ''
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Chat panel */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-800">
        <div className="flex-1 p-4 overflow-y-auto">
          {!selectedConversation && (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-20">
              Select a conversation to start chatting
            </p>
          )}

          {selectedConversation && (
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 mb-4">
              Conversation started {dayjs(selectedConversation.created_at).fromNow()}
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`mb-2 flex ${m.sender_id === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div>
                <div
                  className={`inline-block ${m.file_url ? '' : 'px-4 py-2'} rounded-xl text-sm ${
                    m.sender_id === userId
                      ? 'bg-sky-400 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {m.file_url ? (
                    m.file_url.match(/\.(jpeg|jpg|png|gif)$/) ? (
                      <Image
                        src={m.file_url}
                        alt="shared media"
                        width={200}
                        height={200}
                        className="rounded-md"
                      />
                    ) : (
                      <a
                        href={m.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-sm block"
                      >
                        Download File
                      </a>
                    )
                  ) : (
                    <span>{m.message}</span>
                  )}
                </div>

                <div className="text-[8px] text-gray-500 dark:text-gray-400 ml-1">
                  {m.sent_at ? dayjs(m.sent_at).fromNow() : ''}
                  {m.sender_id === userId && m.read_at && <> • Seen {dayjs(m.read_at).fromNow()}</>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input bar */}
        {selectedConversation && (
          <div className="border-t border-gray-300 dark:border-gray-700 p-2 flex flex-col bg-white dark:bg-gray-900">
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2">
                {files.map((f, i) =>
                  f.type.startsWith('image/') ? (
                    <div key={i} className="relative">
                      <img
                        src={URL.createObjectURL(f)}
                        alt="preview"
                        className="h-15 rounded object-cover"
                      />
                      <button
                        className="text-xs absolute top-0 right-0 bg-white/70 hover:text-red-500 hover:bg-white shadow text-black px-1 rounded"
                        onClick={() => setFiles(files.filter((_, index) => index !== i))}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div key={i} className="text-sm bg-gray-200 dark:bg-gray-700 p-2 rounded">
                      📎 {f.name}
                    </div>
                  )
                )}
              </div>
            )}

            <div className="flex items-center mt-2">
              <input
                type="file"
                multiple
                onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-gray-500 mr-2 flex items-center hover:text-sky-500"
                title="Attach files"
              >
                <Paperclip className="w-4 h-4" />
              </label>

              <input
                className="flex-1 border border-gray-300 dark:border-gray-700 p-2 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button
                onClick={handleSend}
                className="ml-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded flex items-center gap-1 transition-colors"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>

            {uploading && (
              <div className="w-full mt-2 h-2 bg-gray-300 rounded overflow-hidden">
                <div
                  className="h-full bg-sky-600 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
