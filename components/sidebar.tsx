"use client"; // Marking this component as a Client Component

import React, { useState } from 'react';
import ChatSession from './chat-session';

const Sidebar = () => {
  const [chatSessions, setChatSessions] = useState<{ id: number; title: string }[]>([]);
  const [nextId, setNextId] = useState(1);

  const handleNewChat = () => {
    const newChat = { id: nextId, title: `Chat ${nextId}` };
    setChatSessions([...chatSessions, newChat]);
    setNextId(nextId + 1);
  };

  return (
    <div className="sidebar">
      <button
        onClick={handleNewChat}
        className="bg-blue-500 text-white p-2 rounded"
        aria-label="Start new chat"
      >
        Start New Chat
      </button>
      <ul className="chat-sessions">
        {chatSessions.map((session) => (
          <li key={session.id}>
            <ChatSession title={session.title} id={session.id} /> {/* Passing id prop */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
