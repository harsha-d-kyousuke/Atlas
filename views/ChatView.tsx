
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { streamChatResponse } from '../services/geminiService';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { SendIcon, AtlasLogo } from '../components/icons';
import { Card } from '../components/ui/Card';

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiMessageId = `ai-${Date.now()}`;
    const aiMessage: ChatMessage = {
      id: aiMessageId,
      text: '',
      sender: 'ai',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, aiMessage]);

    await streamChatResponse(messages, input, (chunk) => {
        setMessages(prev =>
            prev.map(msg =>
                msg.id === aiMessageId ? { ...msg, text: msg.text + chunk } : msg
            )
        );
    });

    setIsLoading(false);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };


  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto pr-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center">
                  <AtlasLogo className="w-5 h-5 text-primary-foreground"/>
              </div>
            )}
            <div className={`max-w-xl p-3 rounded-lg ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              {msg.sender === 'ai' && isLoading && index === messages.length - 1 && (
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse ml-2 inline-block"></div>
              )}
            </div>
             {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center font-bold">
                  A
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4">
        <Card className="flex items-center p-2 rounded-lg">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask ATLAS about insights, data, or actions..."
            className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon" variant="ghost">
            <SendIcon className="h-5 w-5" />
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default ChatView;
