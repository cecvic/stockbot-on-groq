import React from 'react';
import { useRouter } from 'next/router';

const ChatPage = () => {
  const router = useRouter();
  const { id } = router.query; // Get the chat session ID from the URL

  return (
    <div className="chat-page">
      <h1 className="text-2xl">Chat Session: {id}</h1>
      {/* Here you can implement the chat functionality for the specific session */}
    </div>
  );
};

export default ChatPage;
