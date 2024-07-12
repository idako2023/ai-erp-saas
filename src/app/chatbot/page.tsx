'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { FaArrowUp } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showSignout, setShowSignout] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const handleSignout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('expirationDate');
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    const checkLoginStatus = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expirationDate');

        if (!token || !expirationDate || new Date(expirationDate) <= new Date()) {
          router.push('/login');
        }
      }
    };

    checkLoginStatus();
    scrollToBottom();
  }, [messages, router]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const newMessage: Message = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post(
          '/api/chatbot',
          { message: input },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const botMessage: Message = { sender: 'bot', text: response.data.message };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          handleSignout();
        } else {
          console.error(error);
        }
      }
    }

    scrollToBottom();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  const username = typeof window !== 'undefined' ? localStorage.getItem('username') || 'User' : 'User';
  const userInitial = username.charAt(0).toUpperCase();

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-pink-500 text-white">
      <div className="absolute top-4 right-4">
        <div
          className="relative flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full cursor-pointer"
          onMouseEnter={() => setShowSignout(true)}
          onMouseLeave={() => setShowSignout(false)}
        >
          <span className="text-xl">{userInitial}</span>
          {showSignout && (
            <button
              onClick={handleSignout}
              className="absolute top-0 right-0 w-24 p-2 mt-12 bg-gray-800 rounded text-white focus:outline-none"
            >
              Sign out
            </button>
          )}
        </div>
      </div>
      <div className="w-1/2 h-screen bg-opacity-20 rounded-2xl p-4 flex flex-col">
        <div ref={chatContainerRef} className="flex-1 mb-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={msg.sender === 'user' ? 'text-right' : 'text-left'}>
              <div className={`inline-block p-2 mb-2 rounded-lg ${msg.sender === 'user' ? 'bg-gray-700 text-white' : 'bg-gray-700 text-white'} max-w-full break-words`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center">
          <div className="flex-grow flex items-center bg-gray-200 text-black rounded-full p-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyPress}
              className="flex-grow p-3 bg-transparent focus:outline-none rounded-l-full resize-none max-h-24 overflow-y-auto"
              rows={1}
              style={{ height: 'auto', maxHeight: '6rem' }}
            />
            <button onClick={sendMessage} className="p-3 bg-gray-700 text-white rounded-full ml-2 focus:outline-none">
              <FaArrowUp className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
