/**
 * @file Defines the shared TypeScript types and enums used across the application.
 */

/**
 * Enum to distinguish between the sender of a message.
 * This helps in styling chat bubbles differently for the user and the bot.
 */
export enum Sender {
  USER = 'user',
  BOT = 'bot',
}

/**
 * Interface representing a single chat message object.
 */
export interface Message {
  /** A unique identifier for the message, useful for React keys. */
  id: string;
  /** The text content of the message. */
  text: string;
  /** The sender of the message, using the Sender enum. */
  sender: Sender;
}