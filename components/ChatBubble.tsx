/**
 * @file A React component for displaying a single chat message bubble.
 * It styles the bubble differently based on whether the sender is the user or the bot.
 */
import React from 'react';
import { Sender, Message } from '../types';

/**
 * Props for the ChatBubble component.
 */
interface ChatBubbleProps {
  /** The message object to be displayed. */
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  // Determine if the message is from the current user to apply specific styles.
  const isUser = message.sender === Sender.USER;

  // Dynamically set CSS classes for styling the chat bubble.
  const bubbleClasses = isUser
    ? 'bg-indigo-600 text-white self-end' // User's messages are blue and aligned to the right.
    : 'bg-gray-700 text-gray-200 self-start'; // Bot's messages are gray and aligned to the left.

  // Dynamically set CSS classes for the container to align the bubble.
  const containerClasses = isUser ? 'justify-end' : 'justify-start';

  /**
   * A simple utility to convert basic markdown (bold) to HTML.
   * Also converts newlines to <br> tags for proper line breaks.
   * @param text The string to format.
   * @returns A string with HTML tags.
   */
  const formatText = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>').replace(/\n/g, '<br />');
  };

  return (
    <div className={`flex w-full ${containerClasses}`}>
      <div
        className={`max-w-xl lg:max-w-2xl rounded-2xl px-5 py-3 shadow-md ${bubbleClasses}`}
      >
        {/* Use dangerouslySetInnerHTML to render the formatted HTML string. */}
        <p className="text-base" dangerouslySetInnerHTML={{ __html: formatText(message.text) }} />
      </div>
    </div>
  );
};

export default ChatBubble;