import { BroadcastPayload, MessageType, User } from "../types";

const CHANNEL_NAME = 'gemini_chat_channel';
let channel: BroadcastChannel | null = null;
let listeners: ((data: BroadcastPayload) => void)[] = [];

export const initChannel = (userId: string) => {
  if (channel) return;

  channel = new BroadcastChannel(CHANNEL_NAME);
  
  channel.onmessage = (event) => {
    const data = event.data as BroadcastPayload;
    // Filter out own messages if needed, though usually we want to process all external
    if (data.senderId !== userId) {
        listeners.forEach(l => l(data));
    }
  };
};

export const subscribeToChannel = (callback: (data: BroadcastPayload) => void) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(l => l !== callback);
  };
};

export const broadcastMessage = (type: MessageType, payload: any, senderId: string) => {
  if (!channel) initChannel(senderId);
  channel?.postMessage({
    type,
    payload,
    senderId
  } as BroadcastPayload);
};

export const closeChannel = () => {
  if (channel) {
    channel.close();
    channel = null;
  }
};
