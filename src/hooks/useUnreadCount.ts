'use client';

import { useState, useEffect } from 'react';

export function useUnreadCount(userId?: string) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/chat/unread-count');
        const data = await response.json();
        if (data.success) {
          setUnreadCount(data.data.count);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [userId]);

  return { unreadCount, setUnreadCount };
}
