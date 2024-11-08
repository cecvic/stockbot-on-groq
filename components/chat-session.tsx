"use client"; // Marking this component as a Client Component

import React from 'react';
import Link from 'next/link';

interface ChatSessionProps {
  title: string;
  id: number; // Adding id prop to uniquely identify each chat session
}

const ChatSession: React.FC<ChatSessionProps> = ({ title, id }) => {
  return (
    <Link href={`/chat/${id}`} passHref>
      <div
        className="chat-session p-2 hover:bg-gray-200 cursor-pointer"
        tabIndex={0}
        aria-label={`Chat session titled ${title}`}
      >
        {title}
      </div>
    </Link>
  );
};

export default ChatSession;
