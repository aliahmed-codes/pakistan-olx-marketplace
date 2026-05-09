'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Send, ArrowLeft, Search, CheckCheck, Check, Loader2, MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useSocket } from '@/hooks/useSocket';
import Navbar from '@/components/layout/Navbar';
import { formatRelativeTime, getInitials, formatPrice } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';

interface Conversation {
  id: string;
  updatedAt: string;
  ad: { id: string; title: string; images: string[]; price: number; userId: string };
  user: { id: string; name: string; profileImage: string | null };
  lastMessage?: { content: string; createdAt: string; senderId: string };
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  isSeen: boolean;
  createdAt: string;
  sender: { id: string; name: string; profileImage: string | null };
}

function groupByDate(msgs: Message[]) {
  const groups: { label: string; messages: Message[] }[] = [];
  msgs.forEach((msg) => {
    const d = new Date(msg.createdAt);
    const label = isToday(d) ? 'Today' : isYesterday(d) ? 'Yesterday' : format(d, 'MMMM d, yyyy');
    const last = groups[groups.length - 1];
    if (last?.label === label) last.messages.push(msg);
    else groups.push({ label, messages: [msg] });
  });
  return groups;
}

export default function ChatPage() {
  const router  = useRouter();
  const params  = useSearchParams();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const bottomRef    = useRef<HTMLDivElement>(null);
  const messagesRef  = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected]           = useState<Conversation | null>(null);
  const [messages, setMessages]           = useState<Message[]>([]);
  const [input, setInput]                 = useState('');
  const [isSending, setIsSending]         = useState(false);
  const [isLoading, setIsLoading]         = useState(true);
  const [isTyping, setIsTyping]           = useState(false);
  const [search, setSearch]               = useState('');

  const { joinConversation, leaveConversation, emitTyping, emitStopTyping, emitMessageSeen, on } =
    useSocket(session?.user?.id);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/chat');
  }, [status, router]);

  const fetchConversations = useCallback(async () => {
    try {
      const res  = await fetch('/api/chat/conversations');
      const data = await res.json();
      if (data.success) setConversations(data.data);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => {
    if (session?.user) fetchConversations();
  }, [session, fetchConversations]);

  const convId = params.get('conversation');
  useEffect(() => {
    if (convId && conversations.length > 0) {
      const conv = conversations.find((c) => c.id === convId);
      if (conv && conv.id !== selected?.id) openConversation(conv);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convId, conversations]);

  // Real-time: incoming message
  useEffect(() => {
    const off = on<Message>('new-message', (msg) => {
      setMessages((prev) => prev.find((m) => m.id === msg.id) ? prev : [...prev, msg]);
      fetchConversations();
      if (selected?.id) emitMessageSeen(selected.id, msg.id);
    });
    return off;
  }, [on, selected, emitMessageSeen, fetchConversations]);

  // Typing indicator
  useEffect(() => {
    const a = on('user-typing', () => setIsTyping(true));
    const b = on('user-stop-typing', () => setIsTyping(false));
    return () => { a(); b(); };
  }, [on]);

  // Seen receipts
  useEffect(() => {
    const off = on<{ messageId: string }>('message-seen', ({ messageId }) => {
      setMessages((prev) => prev.map((m) => m.id === messageId ? { ...m, isSeen: true } : m));
    });
    return off;
  }, [on]);

  // Scroll messages container to bottom (NOT the page)
  useEffect(() => {
    const container = messagesRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);

  const openConversation = useCallback(async (conv: Conversation) => {
    if (selected?.id) leaveConversation(selected.id);
    setSelected(conv);
    setMessages([]);
    setIsTyping(false);
    router.push(`/chat?conversation=${conv.id}`, { scroll: false });
    joinConversation(conv.id);
    try {
      const res  = await fetch(`/api/chat/messages?conversationId=${conv.id}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
        data.data
          .filter((m: Message) => !m.isSeen && m.receiverId === session?.user?.id)
          .forEach((m: Message) => emitMessageSeen(conv.id, m.id));
      }
    } catch (e) { console.error(e); }
    fetchConversations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, leaveConversation, joinConversation, router, session, emitMessageSeen]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selected || isSending) return;
    setIsSending(true);
    const content = input.trim();
    setInput('');
    if (selected?.id) emitStopTyping(selected.id, session!.user!.id);
    try {
      const res  = await fetch('/api/chat/messages', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: selected.id, content }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.data]);
        fetchConversations();
      } else {
        toast({ title: 'Failed to send', variant: 'destructive' });
        setInput(content);
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' });
      setInput(content);
    } finally { setIsSending(false); }
  };

  const handleTyping = (val: string) => {
    setInput(val);
    if (!selected?.id || !session?.user?.id) return;
    emitTyping(selected.id, session.user.id);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => emitStopTyping(selected.id!, session!.user!.id), 2000);
  };

  // The "other" participant in a conversation
  const getOther = (conv: Conversation) => conv.user;

  const filtered = conversations.filter((c) => {
    const other = getOther(c);
    return other.name.toLowerCase().includes(search.toLowerCase()) ||
           c.ad.title.toLowerCase().includes(search.toLowerCase());
  });

  if (status === 'loading') return (
    <><Navbar /><main className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-pm" /></main></>
  );

  return (
    <>
      <Navbar />
      <main className="h-[calc(100vh-64px)] bg-gray-50 overflow-hidden">
        <div className="h-full px-2 md:px-4 py-4 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex h-full">

            {/* Sidebar */}
            <div className={`${selected ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 lg:w-96 border-r border-gray-100 shrink-0`}>
              <div className="p-4 border-b border-gray-100">
                <h1 className="text-lg font-extrabold text-gray-900 mb-3">Messages</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input value={search} onChange={(e) => setSearch(e.target.value)}
                         placeholder="Search…" className="pl-9 rounded-xl bg-gray-50 border-0 text-sm" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="space-y-3 p-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex gap-3 items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-100 animate-pulse shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-gray-100 animate-pulse rounded w-3/4" />
                          <div className="h-3 bg-gray-100 animate-pulse rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <MessageSquare className="h-12 w-12 text-gray-200 mb-3" />
                    <p className="font-medium text-gray-500">No conversations</p>
                    <p className="text-sm text-gray-400 mt-1">{search ? 'Try a different search' : 'Start by messaging a seller'}</p>
                  </div>
                ) : (
                  filtered.map((conv) => {
                    const other    = getOther(conv);
                    const isActive = selected?.id === conv.id;
                    return (
                      <button key={conv.id} onClick={() => openConversation(conv)}
                              className={`w-full p-4 flex gap-3 items-start text-left hover:bg-gray-50 transition-colors border-b border-gray-50 relative
                                ${isActive ? 'bg-pm/5 border-l-[3px] border-l-pm' : ''}`}>
                        <Avatar className="h-11 w-11 shrink-0 ring-2 ring-white shadow-sm">
                          <AvatarImage src={other.profileImage || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-pm to-pm-light text-white text-xs font-bold">
                            {getInitials(other.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className={`text-sm font-semibold truncate ${conv.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>{other.name}</p>
                            {conv.lastMessage && <span className="text-[10px] text-gray-400 shrink-0">{formatRelativeTime(conv.lastMessage.createdAt)}</span>}
                          </div>
                          <p className="text-xs text-gray-400 truncate mt-0.5">{conv.ad.title}</p>
                          {conv.lastMessage && (
                            <p className={`text-xs truncate mt-0.5 ${conv.unreadCount > 0 ? 'font-semibold text-gray-800' : 'text-gray-400'}`}>
                              {conv.lastMessage.senderId === session?.user?.id ? 'You: ' : ''}{conv.lastMessage.content}
                            </p>
                          )}
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-pm text-white text-[10px] font-bold h-5 min-w-[20px] rounded-full flex items-center justify-center px-1">
                            {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat area */}
            <div className={`${selected ? 'flex' : 'hidden md:flex'} flex-col flex-1 min-w-0`}>
              {selected ? (
                <>
                  {/* Header */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
                    <Button variant="ghost" size="icon" className="md:hidden text-gray-500 shrink-0"
                            onClick={() => { leaveConversation(selected.id); setSelected(null); router.push('/chat'); }}>
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={getOther(selected).profileImage || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-pm to-pm-light text-white text-xs font-bold">
                        {getInitials(getOther(selected).name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{getOther(selected).name}</p>
                      <Link href={`/ad/${selected.ad.id}`} className="text-xs text-pm hover:underline truncate block">
                        {formatPrice(selected.ad.price)} · {selected.ad.title.slice(0, 40)}{selected.ad.title.length > 40 ? '…' : ''}
                      </Link>
                    </div>
                    <Link href={`/ad/${selected.ad.id}`} className="shrink-0">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-100">
                        <Image src={selected.ad.images[0] || '/placeholder.jpg'} alt={selected.ad.title} fill className="object-cover" />
                      </div>
                    </Link>
                  </div>

                  {/* Messages */}
                  <div ref={messagesRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#f5f6fa]">
                    {groupByDate(messages).map((group) => (
                      <div key={group.label}>
                        <div className="flex items-center gap-3 my-3">
                          <div className="flex-1 h-px bg-gray-200" />
                          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{group.label}</span>
                          <div className="flex-1 h-px bg-gray-200" />
                        </div>
                        <div className="space-y-1.5">
                          {group.messages.map((msg) => {
                            const isMe = msg.senderId === session?.user?.id;
                            return (
                              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2`}>
                                {!isMe && (
                                  <Avatar className="h-6 w-6 shrink-0 self-end mb-4">
                                    <AvatarImage src={msg.sender.profileImage || undefined} />
                                    <AvatarFallback className="bg-pm text-white text-[9px] font-bold">{getInitials(msg.sender.name)}</AvatarFallback>
                                  </Avatar>
                                )}
                                <div className="max-w-[72%]">
                                  <div className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    isMe ? 'bg-pm text-white rounded-br-sm' : 'bg-white text-gray-900 rounded-bl-sm border border-gray-100'
                                  }`}>
                                    {msg.content}
                                  </div>
                                  <div className={`flex items-center gap-1 mt-0.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <span className="text-[10px] text-gray-400">{format(new Date(msg.createdAt), 'HH:mm')}</span>
                                    {isMe && (msg.isSeen ? <CheckCheck className="h-3 w-3 text-pm" /> : <Check className="h-3 w-3 text-gray-300" />)}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                      <div className="flex justify-start gap-2">
                        <Avatar className="h-6 w-6 shrink-0 self-end mb-1">
                          <AvatarFallback className="bg-pm text-white text-[9px]">{getInitials(getOther(selected).name)}</AvatarFallback>
                        </Avatar>
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm">
                          <div className="flex gap-1 items-center h-4">
                            {[0, 1, 2].map((i) => (
                              <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={bottomRef} />
                  </div>

                  {/* Input */}
                  <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100">
                    <div className="flex gap-2 items-end">
                      <Input value={input} onChange={(e) => handleTyping(e.target.value)}
                             onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e as any); } }}
                             placeholder="Type a message…"
                             className="flex-1 rounded-2xl bg-gray-50 border-0 min-h-[42px] text-sm" />
                      <Button type="submit" disabled={!input.trim() || isSending}
                              className="h-[42px] w-[42px] rounded-2xl bg-pm hover:bg-pm-light shrink-0 p-0">
                        {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pm to-pm-light flex items-center justify-center mb-5 shadow-lg shadow-pm/20">
                    <MessageSquare className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Your Messages</h3>
                  <p className="text-gray-500 text-sm max-w-xs">Select a conversation, or start one by contacting a seller on any ad.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
