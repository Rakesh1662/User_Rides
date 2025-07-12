
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Bot, Send, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Namma Rides AI assistant powered by Gemini AI. I can help you with:\n\n• Finding vehicles based on your preferences\n• Booking information and pricing\n• Location and pickup details\n• Travel recommendations for Hyderabad\n• Any questions about our services\n\nHow can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call the Gemini API through our edge function
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: inputValue,
          context: 'User is browsing Namma Rides website for vehicle rentals in Hyderabad'
        }
      });

      if (error) {
        throw error;
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'Sorry, I could not generate a response at the moment.',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Fallback response if API fails
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble connecting to my AI service right now. However, I can still help you! Try browsing our vehicles or contact our support team at seshaallamraju08@gmail.com for immediate assistance.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
      toast.error('AI service temporarily unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  const quickSuggestions = [
    "Find me a car under ₹3000 near Mumbai",
    "Show me bikes in Hyderabad",
    "What are electric vehicle options?",
    "How does booking work?",
    "Tell me about pickup locations"
  ];

  return (
    <>
      {/* Floating AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="rounded-full h-14 w-14 bg-accent hover:bg-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
            >
              <Bot className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] p-0">
            <Card className="h-full border-0 rounded-none">
              <CardHeader className="border-b bg-accent text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Bot className="h-5 w-5 mr-2" />
                    Namma Rides AI Assistant
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-white/90">Powered by Gemini AI</p>
              </CardHeader>
              <CardContent className="flex flex-col h-[calc(100vh-140px)] p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-lg whitespace-pre-line ${
                            message.isUser
                              ? 'bg-accent text-white ml-4'
                              : 'bg-secondary text-navy mr-4'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-secondary text-navy p-3 rounded-lg mr-4 flex items-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="border-t p-4">
                  <div className="flex space-x-2 mb-3">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask me anything about vehicle rentals..."
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      size="sm" 
                      className="bg-accent hover:bg-accent/90"
                      disabled={isLoading || !inputValue.trim()}
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {/* Quick Suggestions */}
                  <div className="space-y-2">
                    <p className="text-xs text-steel">Quick suggestions:</p>
                    <div className="flex flex-wrap gap-1">
                      {quickSuggestions.slice(0, 3).map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-6 px-2"
                          onClick={() => setInputValue(suggestion)}
                          disabled={isLoading}
                        >
                          {suggestion.length > 25 ? suggestion.slice(0, 25) + '...' : suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default AIAssistant;
