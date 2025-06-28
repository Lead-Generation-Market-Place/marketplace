'use client';
import { useEffect, useState } from 'react';
import { getConversations, getMessages, sendMessage } from '@/actions/message/conversation';
import { createClient } from '@/utils/supabase/client';
import { Inbox, Send } from 'lucide-react';

// Define types for conversation and message objects
interface Conversation {
  id: string;
  customer_id: string;
  professional_id: string;
  other_user_name: string;
  last_message?: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  sent_at?: string;
}

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    })();
  }, []);

  useEffect(() => {
    if (!userId) return;
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
    })();
  }, [selectedConversation]);

  const handleSend = async () => {
    if (!selectedConversation || !userId || newMessage.trim() === '') return;

    await sendMessage(selectedConversation.id, userId, newMessage);
    setNewMessage('');

    const updatedMessages = await getMessages(selectedConversation.id);
    setMessages(updatedMessages);
  };

  if (userId === null) return <p className="p-4">Loading...</p>;

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
            className={`p-3 mb-2 cursor-pointer border rounded-md
              ${
                selectedConversation?.id === c.id
                  ? 'bg-sky-200 dark:bg-sky-800 border-sky-500'
                  : 'bg-gray-100 dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
            onClick={() => setSelectedConversation(c)}
          >
            <p className="font-semibold">{c.other_user_name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{c.last_message || ''}</p>
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
          {messages.map((m) => (
            <div
              key={m.id}
              className={`mb-2 flex ${m.sender_id === userId ? 'justify-end' : 'justify-start'}`}
            >
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm max-w-[70%] break-words
                  ${m.sender_id === userId ? 'bg-sky-400 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100'}
                `}
              >
                {m.message}
              </span>
            </div>
          ))}
        </div>

        {selectedConversation && (
          <div className="border-t border-gray-300 dark:border-gray-700 p-2 flex bg-white dark:bg-gray-900">
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
        )}
      </div>
    </div>
  );
}
