'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket(userId?: string) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || '', {
      path: '/api/socket',
      autoConnect: true,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      if (userId) {
        socket.emit('join-user', userId);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const joinConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('join-conversation', conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('leave-conversation', conversationId);
  }, []);

  const sendTyping = useCallback((conversationId: string, userId: string) => {
    socketRef.current?.emit('typing', { conversationId, userId });
  }, []);

  const stopTyping = useCallback((conversationId: string, userId: string) => {
    socketRef.current?.emit('stop-typing', { conversationId, userId });
  }, []);

  const markMessageSeen = useCallback((conversationId: string, messageId: string) => {
    socketRef.current?.emit('message-seen', { conversationId, messageId });
  }, []);

  const onNewMessage = useCallback((callback: (message: any) => void) => {
    socketRef.current?.on('new-message', callback);
    return () => {
      socketRef.current?.off('new-message', callback);
    };
  }, []);

  const onUserTyping = useCallback((callback: (data: { userId: string }) => void) => {
    socketRef.current?.on('user-typing', callback);
    return () => {
      socketRef.current?.off('user-typing', callback);
    };
  }, []);

  const onUserStopTyping = useCallback((callback: (data: { userId: string }) => void) => {
    socketRef.current?.on('user-stop-typing', callback);
    return () => {
      socketRef.current?.off('user-stop-typing', callback);
    };
  }, []);

  const onMessageSeen = useCallback((callback: (data: { messageId: string }) => void) => {
    socketRef.current?.on('message-seen', callback);
    return () => {
      socketRef.current?.off('message-seen', callback);
    };
  }, []);

  return {
    socket: socketRef.current,
    joinConversation,
    leaveConversation,
    sendTyping,
    stopTyping,
    markMessageSeen,
    onNewMessage,
    onUserTyping,
    onUserStopTyping,
    onMessageSeen,
  };
}
