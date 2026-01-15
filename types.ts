export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  type: 'text' | 'system';
}

export interface ChatState {
  users: User[];
  messages: Message[];
  currentUser: User | null;
  activeRoom: string;
}

export enum MessageType {
  JOIN = 'JOIN',
  LEAVE = 'LEAVE',
  CHAT = 'CHAT',
  HEARTBEAT = 'HEARTBEAT',
  SYNC_REQUEST = 'SYNC_REQUEST',
  SYNC_RESPONSE = 'SYNC_RESPONSE'
}

export interface BroadcastPayload {
  type: MessageType;
  payload: any;
  senderId?: string;
}