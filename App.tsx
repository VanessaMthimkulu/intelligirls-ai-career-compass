/**
 * @file The main application component.
 * This component orchestrates the entire chat application, managing state for messages,
 * user input, and loading status. It handles the chat initialization and message sending logic.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat } from '@google/genai';
import { Message, Sender } from './types';
import { createChatSession } from './services/geminiService';
import ChatBubble from './components/ChatBubble';
import TypingIndicator from './components/TypingIndicator';
import { SendIcon } from './components/Icon';

const App: React.FC = () => {
  // State to hold the active chat session instance.
  const [chat, setChat] = useState<Chat | null>(null);
  // State to store the array of chat messages.
  const [messages, setMessages] = useState<Message[]>([]);
  // State for the user's current input in the text field.
  const [userInput, setUserInput] = useState('');
  // State to manage the loading status (e.g., when the bot is typing).
  const [isLoading, setIsLoading] = useState(true);

  // A ref to the chat container div to control scrolling.
  const chatContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Scrolls the chat container to the bottom to show the latest message.
   */
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  // This effect triggers scrolling whenever messages are added or loading state changes.
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  /**
   * Initializes the chat session when the component mounts.
   * It creates a chat session and fetches the initial welcome message from the bot.
   */
  const initializeChat = useCallback(async () => {
    try {
      setIsLoading(true);
      const chatSession = createChatSession();
      setChat(chatSession);

      // Create a placeholder message object that will be populated by the stream.
      const initialBotMessage: Message = {
        id: `bot-init-${Date.now()}`,
        sender: Sender.BOT,
        text: '',
      };
      setMessages([initialBotMessage]);
      
      // Send an initial "Hello!" to kickstart the conversation defined in the system prompt.
      const stream = await chatSession.sendMessageStream({ message: "Hello!" });
      
      // Process the streaming response from the bot.
      let text = '';
      for await (const chunk of stream) {
        text += chunk.text;
        // Update the initial message text as chunks arrive.
        setMessages([
          { ...initialBotMessage, text: text },
        ]);
      }
    } catch (error) {
      console.error('Initialization failed:', error);
      setMessages([{
        id: 'error-init',
        sender: Sender.BOT,
        text: 'Sorry, something went wrong while starting our session. Please refresh the page.'
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [setChat, setIsLoading, setMessages]);

  // This effect runs once on component mount to initialize the chat.
  useEffect(() => {
    initializeChat();
  }, [initializeChat]);
  
  /**
   * Handles the submission of the user's message.
   * It sends the user's input to the AI and processes the streaming response.
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || !chat) return;

    // Create a new message object for the user's input.
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: Sender.USER,
      text: userInput,
    };
    
    // Add the user's message to the state and clear the input field.
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);
    
    try {
      // Send the user's message to the Gemini API and get a streaming response.
      const stream = await chat.sendMessageStream({ message: userInput });
      
      let text = '';
      const botMessageId = `bot-${Date.now()}`;

      // Add a placeholder for the bot's response to be updated by the stream.
      setMessages(prev => [...prev, { id: botMessageId, sender: Sender.BOT, text: '' }]);
      
      // Process the stream, appending text chunks to the bot's message.
      for await (const chunk of stream) {
          text += chunk.text;
          setMessages(prev => prev.map(msg => 
              msg.id === botMessageId ? { ...msg, text: text } : msg
          ));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        sender: Sender.BOT,
        text: 'I seem to be having trouble connecting. Please try again in a moment.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col h-screen bg-gray-900 text-white font-sans overflow-hidden">
      {/* Background Watermark: A decorative element for branding. */}
      <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none" aria-hidden="true">
        <span className="text-[9rem] sm:text-[14rem] md:text-[18rem] lg:text-[22rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500/30 via-indigo-500/30 to-blue-500/30 select-none transform -rotate-12">
          INTELLIGIRLS
        </span>
      </div>
      
      {/* App Header */}
      <header className="p-4 sm:p-6 border-b border-gray-700/50 shadow-lg bg-gray-900/80 backdrop-blur-sm z-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">
          💡 Intelligirls AI Career Compass 🚀
        </h1>
        <p className="text-center text-sm text-gray-400 mt-1">Guiding the next generation of tech leaders.</p>
      </header>
      
      {/* Chat Messages Area */}
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 z-10">
        <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {/* Show typing indicator when the bot is generating a response. */}
          {isLoading && messages.length > 0 && <TypingIndicator />}
        </div>
      </main>
      
      {/* Message Input Form */}
      <footer className="p-4 sm:p-6 border-t border-gray-700/50 bg-gray-900/80 backdrop-blur-sm z-10">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center space-x-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={isLoading ? "Thinking..." : "Type your message..."}
            className="flex-1 w-full bg-gray-800 border border-gray-600 rounded-full px-5 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200 disabled:opacity-50"
            disabled={isLoading}
            aria-label="Your message"
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="bg-indigo-600 text-white rounded-full p-3 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
            aria-label="Send message"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default App;