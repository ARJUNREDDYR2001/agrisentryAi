'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, X, LoaderCircle } from 'lucide-react';
import { useLocale } from '@/context/locale-context';
import { runChat } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';

type Message = {
    role: 'user' | 'model';
    content: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t, locale } = useLocale();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const languageMap = {
    en: 'English',
    hi: 'Hindi',
    mr: 'Marathi',
    ta: 'Tamil',
    te: 'Telugu',
    kn: 'Kannada',
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        // Super hacky way to get the viewport
        const viewport = scrollAreaRef.current.children[0] as HTMLDivElement;
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const { data, error } = await runChat({
      question: input,
      history: newMessages,
      language: languageMap[locale],
    });

    if (data) {
      setMessages([...newMessages, { role: 'model', content: data }]);
    } else if (error) {
      setMessages([...newMessages, { role: 'model', content: `Error: ${error}` }]);
    }
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50"
        aria-label={t('openChat')}
      >
        <Bot className="h-8 w-8" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-80 h-[500px] shadow-2xl flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-primary flex items-center gap-2">
                    <Bot /> {t('chatbotTitle') || 'AgriSentry Assistant'}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
                <ScrollArea ref={scrollAreaRef} className="h-full">
                    <div className="p-4 space-y-4">
                        {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                            className={`max-w-xs rounded-lg px-4 py-2 ${
                                msg.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                            >
                            {msg.content}
                            </div>
                        </div>
                        ))}
                         {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-xs rounded-lg px-4 py-2 bg-muted flex items-center gap-2">
                                    <LoaderCircle className="animate-spin h-4 w-4" />
                                    <span>{t('chatbotThinking') || 'Thinking...'}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter>
                 <div className="relative w-full">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={t('chatbotPlaceholder') || 'Ask a question...'}
                        className="pr-12"
                        disabled={isLoading}
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSend}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                        disabled={isLoading || !input.trim()}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    </div>
  );
}

