'use client'

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  MessageCircle, 
  Trash2, 
  Search 
} from 'lucide-react';
import { useChatSessions } from '@/lib/chat/session-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';

export const ChatSessionsSidebar: React.FC = () => {
  const { 
    sessions, 
    currentSessionId, 
    createSession, 
    deleteSession, 
    switchSession 
  } = useChatSessions();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSessions = sessions.filter(session => 
    session.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNewSession = () => {
    createSession();
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent session switch when deleting
    deleteSession(sessionId);
  };

  return (
    <div 
      className={`
        fixed left-0 top-0 bottom-0 bg-background border-r 
        transition-all duration-300 ease-in-out z-50
        ${isCollapsed ? 'w-16' : 'w-80'}
        flex flex-col
      `}
    >
      {/* Collapse/Expand Toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 z-60"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </Button>

      {/* New Chat Button */}
      <div className={`p-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <Button 
          onClick={handleCreateNewSession}
          className={`
            ${isCollapsed ? 'p-2' : 'w-full'}
            flex items-center gap-2
          `}
        >
          <Plus className="h-4 w-4" />
          {!isCollapsed && <span>New Chat</span>}
        </Button>
      </div>

      {/* Search Input */}
      {!isCollapsed && (
        <div className="px-4 mb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Chat Sessions List */}
      <div className="flex-1 overflow-y-auto">
        {filteredSessions.map(session => (
          <div 
            key={session.id}
            onClick={() => switchSession(session.id)}
            className={`
              cursor-pointer p-3 hover:bg-accent/10 flex items-center
              ${currentSessionId === session.id ? 'bg-accent/20' : ''}
            `}
          >
            {!isCollapsed ? (
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <div className="font-medium">{session.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(session.createdAt, { addSuffix: true })}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => handleDeleteSession(session.id, e)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <MessageCircle 
                className={`
                  h-6 w-6 
                  ${currentSessionId === session.id ? 'text-primary' : 'text-muted-foreground'}
                `} 
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
