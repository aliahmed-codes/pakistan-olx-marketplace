'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Send, Phone, ArrowLeft, MoreVertical, Image as ImageIcon, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { formatRelativeTime, getInitials, formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface Conversation {
  id: string;
  ad: {
    id: string;
    title: string;
    images: string[];
    price: number;
    userId: string;
  };
  user: {
    id: string;
    name: string;
    profileImage: string | null;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
    senderId: string;
  };
  unreadCount: number;
  updatedAt: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  isSeen: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    profileImage: string | null;
  };
}

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const conversationId = searchParams.get('conversation');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/chat');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchConversations();
    }
  }, [session]);

  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const conv = conversations.find((c) => c.id === conversationId);
      if (conv) {
        setSelectedConversation(conv);
        fetchMessages(conversationId);
      }
    }
  }, [conversationId, conversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/chat/conversations');
      const data = await response.json();
      if (data.success) {
        setConversations(data.data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      const response = await fetch(`/api/chat/messages?conversationId=${convId}`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setIsSending(true);

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          content: newMessage,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.data]);
        setNewMessage('');
        fetchConversations();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    router.push(`/chat?conversation=${conv.id}`);
    fetchMessages(conv.id);
  };

  if (status === 'loading') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olx" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
              {/* Conversations List */}
              <div className={`${selectedConversation ? 'hidden lg:block' : ''} lg:border-r border-gray-200`}>
                <div className="p-4 border-b border-gray-200">
                  <h1 className="text-xl font-bold">Messages</h1>
                </div>
                <ScrollArea className="h-[calc(100%-65px)]">
                  {isLoading ? (
                    <div className="space-y-4 p-4">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16" />
                      ))}
                    </div>
                  ) : conversations.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {conversations.map((conv) => (
                        <button
                          key={conv.id}
                          onClick={() => selectConversation(conv)}
                          className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                            selectedConversation?.id === conv.id ? 'bg-olx/5 border-l-4 border-l-olx' : ''
                          }`}
                        >
                          <Avatar className="h-12 w-12 flex-shrink-0">
                            <AvatarImage src={conv.user.profileImage || undefined} />
                            <AvatarFallback className="bg-olx text-white">
                              {getInitials(conv.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{conv.user.name}</p>
                              {conv.lastMessage && (
                                <span className="text-xs text-gray-400">
                                  {formatRelativeTime(conv.lastMessage.createdAt)}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                              {conv.ad.title}
                            </p>
                            {conv.lastMessage && (
                              <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                                {conv.lastMessage.content}
                              </p>
                            )}
                          </div>
                          {conv.unreadCount > 0 && (
                            <span className="bg-olx text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {conv.unreadCount}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No conversations yet</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Start chatting by contacting a seller
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </div>

              {/* Chat Area */}
              <div className={`${selectedConversation ? '' : 'hidden lg:block'} lg:col-span-2 flex flex-col h-full`}>
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="lg:hidden"
                          onClick={() => {
                            setSelectedConversation(null);
                            router.push('/chat');
                          }}
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedConversation.user.profileImage || undefined} />
                          <AvatarFallback className="bg-olx text-white">
                            {getInitials(selectedConversation.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedConversation.user.name}</p>
                          <Link href={`/ad/${selectedConversation.ad.id}`} className="text-sm text-gray-500 hover:text-olx">
                            {formatPrice(selectedConversation.ad.price)} • {selectedConversation.ad.title.slice(0, 30)}...
                          </Link>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Phone className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.map((message) => {
                          const isMe = message.senderId === session?.user?.id;
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                  isMe
                                    ? 'bg-olx text-white rounded-br-none'
                                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                                }`}
                              >
                                <p>{message.content}</p>
                                <p className={`text-xs mt-1 ${isMe ? 'text-white/70' : 'text-gray-500'}`}>
                                  {formatRelativeTime(message.createdAt)}
                                  {isMe && message.isSeen && ' • Seen'}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Message Input */}
                    <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <Button type="button" variant="ghost" size="icon">
                          <ImageIcon className="h-5 w-5" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon">
                          <Smile className="h-5 w-5" />
                        </Button>
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1"
                        />
                        <Button
                          type="submit"
                          className="bg-olx hover:bg-olx-light"
                          disabled={isSending || !newMessage.trim()}
                        >
                          <Send className="h-5 w-5" />
                        </Button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
                    <p className="text-gray-500 max-w-sm">
                      Select a conversation from the list or start a new one by contacting a seller
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
