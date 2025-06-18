"use client";
import { Send } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "This is a bot response.", sender: "bot" },
      ]);
    }, 1000);

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="w-full max-w-3xl mx-auto px-2 sm:px-4 py-4 sm:py-6 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-800 transition-colors duration-300 flex flex-col h-[75dvh] min-h-[400px] max-h-[95dvh]"
      style={{
        height: "75vh",
        minHeight: "400px",
        maxHeight: "95vh",
      }}
    >
      {/* Header */}
      <div className="flex items-center mb-3 sm:mb-4">
        <span className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white rounded-full font-bold text-lg sm:text-xl border-2 border-sky-400">
          P
        </span>
        <div className="ml-2 sm:ml-3">
          <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-white">
            Professional
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            House Cleaner
          </p>
        </div>
        <span className="ml-2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
      </div>

      {/* Scrollable messages */}
      <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-3 mb-3 sm:mb-4 px-1 sm:px-2 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700 rounded max-h-full scrollbar-thin scrollbar-thumb-sky-400 scrollbar-track-gray-200 dark:scrollbar-thumb-sky-600 dark:scrollbar-track-gray-800">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end gap-1 sm:gap-2 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && (
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold">
                P
              </div>
            )}
            <div
              className={`w-fit max-w-[85vw] sm:max-w-[75%] px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm break-words ${
                msg.sender === "user"
                  ? "bg-sky-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === "user" && (
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-sky-600 text-white rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold">
                C
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-1 sm:gap-2 mt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs sm:text-sm"
        />
        <button
          onClick={handleSend}
          className="text-gray-600 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-400 transition p-2 rounded"
          aria-label="Send"
        >
          <Send className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;