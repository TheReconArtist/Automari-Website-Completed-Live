// components/chat/useChatOpen.ts
'use client';

import { useState, useCallback } from 'react';

// A simple custom hook to manage the chat open/close state.
export function useChatOpen() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return { isOpen, toggleChat, setIsOpen };
}
