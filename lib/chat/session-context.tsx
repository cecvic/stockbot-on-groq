'use client'

import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  ChatSession, 
  ChatMessage, 
  ChatSessionContextType 
} from '../types';

const ChatSessionContext = createContext<ChatSessionContextType | undefined>(undefined);

export const ChatSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    if (typeof window !== 'undefined') {
      const storedSessions = localStorage.getItem('chatSessions');
      return storedSessions ? JSON.parse(storedSessions) : [];
    }
    return [];
  });
  
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('currentSessionId');
    }
    return null;
  });

  // Persist sessions to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatSessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Update current session in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentSessionId) {
        localStorage.setItem('currentSessionId', currentSessionId);
      } else {
        localStorage.removeItem('currentSessionId');
      }
    }
  }, [currentSessionId]);

  const createSession = (name?: string) => {
    const newSession: ChatSession = {
      id: uuidv4(),
      name: name || `Chat ${sessions.length + 1}`,
      createdAt: Date.now(),
      messages: []
    };
    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newSession.id);
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    
    // If deleting the current session, switch to another or create a new one
    if (sessionId === currentSessionId) {
      const remainingSessions = sessions.filter(session => session.id !== sessionId);
      setCurrentSessionId(remainingSessions.length > 0 ? remainingSessions[0].id : null);
    }
  };

  const switchSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  const updateSessionName = (sessionId: string, newName: string) => {
    setSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, name: newName } 
          : session
      )
    );
  };

  const addMessageToSession = (sessionId: string, message: ChatMessage) => {
    setSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { 
              ...session, 
              messages: [...session.messages, message],
              lastMessage: message.content
            } 
          : session
      )
    );
  };

  return (
    <ChatSessionContext.Provider 
      value={{
        sessions,
        currentSessionId,
        createSession,
        deleteSession,
        switchSession,
        updateSessionName,
        addMessageToSession
      }}
    >
      {children}
    </ChatSessionContext.Provider>
  );
};

// Custom hook to use the ChatSession context
export const useChatSessions = () => {
  const context = useContext(ChatSessionContext);
  if (context === undefined) {
    throw new Error('useChatSessions must be used within a ChatSessionProvider');
  }
  return context;
};
