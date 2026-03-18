import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatGptApi } from "@/lib/api";
import { Send, Bot, User } from "lucide-react";

interface Message {
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load chat history when component mounts
    const loadHistory = async () => {
      try {
        const history = await chatGptApi.getHistory();
        setMessages(
          history.map((msg: any) => ({
            role: "user" === msg.type ? "user" : "assistant",
            content: msg.message,
            timestamp: new Date(msg.createdAt),
          }))
        );
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user" as const,
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await chatGptApi.sendMessage(input);
      const assistantMessage = {
        role: "assistant" as const,
        content: response.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to get response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] p-4">
      <Card className="flex-1 mb-4">
        <ScrollArea className="h-full p-4" ref={scrollRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 mb-4 ${
                message.role === "assistant" ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div
                className={`p-2 rounded-lg max-w-[80%] ${
                  message.role === "assistant"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.role === "assistant" ? (
                    <Bot className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span className="text-sm opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Bot className="w-4 h-4 animate-pulse" />
              <span>AI is thinking...</span>
            </div>
          )}
        </ScrollArea>
      </Card>
      <div className="flex gap-2">
        <Input
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
