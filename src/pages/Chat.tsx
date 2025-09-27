import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import AnimatedBackground from '@/components/AnimatedBackground';
import { FiSend, FiSmile, FiUsers, FiMessageSquare } from 'react-icons/fi';

interface Message {
  id: string;
  sender: string;
  senderId: string;
  text: string;
  timestamp: Date;
  type?: 'system' | 'user';
}

const Chat = () => {
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved).map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    })) : [
      {
        id: '1',
        sender: 'System',
        senderId: 'system',
        text: 'Welcome to IPX Hub Chat! Connect with fellow participants.',
        timestamp: new Date(),
        type: 'system',
      }
    ];
  });
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers] = useState(42); // Mock online users

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to send messages",
        variant: "destructive",
      });
      return;
    }

    const message: Message = {
      id: Date.now().toString(),
      sender: user.name,
      senderId: user.id,
      text: newMessage,
      timestamp: new Date(),
      type: 'user',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate typing indicator
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Simulate bot response
        if (newMessage.toLowerCase().includes('help')) {
          const botMessage: Message = {
            id: Date.now().toString() + '_bot',
            sender: 'IPX Assistant',
            senderId: 'bot',
            text: "I'm here to help! You can ask about sessions, networking, or event details.",
            timestamp: new Date(),
            type: 'system',
          };
          setMessages(prev => [...prev, botMessage]);
        }
      }, 1500);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="glass h-[calc(100vh-12rem)]">
            <CardHeader className="border-b border-border/40">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <FiMessageSquare className="h-6 w-6 text-primary" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                  <CardTitle>Group Chat</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <FiUsers className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{onlineUsers} online</span>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                    Live
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 flex flex-col h-[calc(100%-5rem)]">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => {
                      const isCurrentUser = user && message.senderId === user.id;
                      const isSystem = message.type === 'system';

                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] ${
                              isSystem
                                ? 'w-full'
                                : isCurrentUser
                                ? 'order-2'
                                : ''
                            }`}
                          >
                            {isSystem ? (
                              <div className="text-center">
                                <Badge variant="outline" className="bg-primary/10">
                                  {message.text}
                                </Badge>
                              </div>
                            ) : (
                              <div
                                className={`rounded-lg p-3 ${
                                  isCurrentUser
                                    ? 'bg-primary text-primary-foreground ml-2'
                                    : 'bg-muted mr-2'
                                }`}
                              >
                                {!isCurrentUser && (
                                  <p className="text-xs font-medium mb-1 opacity-70">
                                    {message.sender}
                                  </p>
                                )}
                                <p className="text-sm break-words">{message.text}</p>
                                <p className="text-xs opacity-60 mt-1">
                                  {formatTime(message.timestamp)}
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <div className="bg-muted rounded-lg px-3 py-2">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce delay-100" />
                          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={scrollRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-border/40">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover-lift"
                  >
                    <FiSmile className="h-5 w-5" />
                  </Button>
                  <Input
                    placeholder={user ? "Type a message..." : "Login to send messages"}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={!user}
                    className="flex-1"
                  />
                  <Button
                    variant="gradient"
                    size="icon"
                    onClick={sendMessage}
                    disabled={!user || !newMessage.trim()}
                    className="hover-lift"
                  >
                    <FiSend className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Chat;