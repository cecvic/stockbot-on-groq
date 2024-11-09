export interface ChatSession {
  id: string;
  name: string;
  createdAt: number;
  lastMessage?: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export interface ChatSessionContextType {
  sessions: ChatSession[];
  currentSessionId: string | null;
  createSession: (name?: string) => void;
  deleteSession: (sessionId: string) => void;
  switchSession: (sessionId: string) => void;
  updateSessionName: (sessionId: string, newName: string) => void;
  addMessageToSession: (sessionId: string, message: ChatMessage) => void;
}
