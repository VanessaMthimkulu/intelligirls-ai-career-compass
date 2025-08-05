/**
 * @file A React component for rendering an SVG icon.
 * This is used for the "send" button in the chat input form.
 */
import React from 'react';

/**
 * A simple, reusable SVG send icon component.
 * @param {object} props - The component props.
 * @param {string} [props.className] - Optional CSS classes to apply to the SVG element.
 */
export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true" // Hide from screen readers as it's a decorative icon inside a button.
  >
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);