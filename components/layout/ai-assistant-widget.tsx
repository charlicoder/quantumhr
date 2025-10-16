'use client';

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export function AiAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <>
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-80 shadow-lg md:w-96">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">HR Assistant</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-64 pr-4">
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm">
                    Hi! I'm your HR Assistant. I can help you with leave
                    requests, payslips, company policies, and more. How can I
                    assist you today?
                  </p>
                </div>
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setMessage('');
                  }
                }}
              />
              <Button size="icon" onClick={() => setMessage('')}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              AI Assistant is in preview mode
            </p>
          </CardContent>
        </Card>
      )}

      <Button
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </>
  );
}
