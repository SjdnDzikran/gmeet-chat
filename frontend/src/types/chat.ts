export interface Message {
  id?: string; // Optional, client might not generate IDs if server does
  type: 'chat' | 'system' | 'info' | 'error';
  sender: string;
  text: string;
  timestamp: number;
  room?: string; // Optional on client-side received messages if context is clear
  repliedTo?: Message;
}
