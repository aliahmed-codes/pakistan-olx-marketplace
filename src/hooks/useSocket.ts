'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

function getSocket(): Socket {
  if (!socket || socket.disconnected) {
    socket = io({
      path: '/api/socket',
      addTrailingSlash: false,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}

export function useSocket(userId?: string) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const s = getSocket();
    socketRef.current = s;
    if (userId) s.emit('join-user', userId);
  }, [userId]);

  const joinConversation = useCallback((id: string) => {
    socketRef.current?.emit('join-conversation', id);
  }, []);

  const leaveConversation = useCallback((id: string) => {
    socketRef.current?.emit('leave-conversation', id);
  }, []);

  const emitTyping = useCallback((conversationId: string, uid: string) => {
    socketRef.current?.emit('typing', { conversationId, userId: uid });
  }, []);

  const emitStopTyping = useCallback((conversationId: string, uid: string) => {
    socketRef.current?.emit('stop-typing', { conversationId, userId: uid });
  }, []);

  const emitMessageSeen = useCallback((conversationId: string, messageId: string) => {
    socketRef.current?.emit('message-seen', { conversationId, messageId });
  }, []);

  const on = useCallback(<T>(event: string, handler: (data: T) => void) => {
    socketRef.current?.on(event, handler);
    return () => { socketRef.current?.off(event, handler); };
  }, []);

  return { socket: socketRef, joinConversation, leaveConversation, emitTyping, emitStopTyping, emitMessageSeen, on };
}
