import { useState, useEffect } from "react";
import { X, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Card } from "../ui/card";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: string;
  className?: string;
}

// Local stub — answers with a placeholder rather than calling an edge function.
export const AIChatPanel = ({ isOpen, onClose, initialQuestion, className }: AIChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (initialQuestion && isOpen && messages.length === 0) {
      setMessages([
        { role: "user", content: initialQuestion },
        {
          role: "assistant",
          content:
            "Thanks — VIDA chat isn't connected in this preview. Use the AI Report Summary on each report for now.",
        },
      ]);
    }
  }, [initialQuestion, isOpen, messages.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
      {
        role: "assistant",
        content:
          "VIDA chat isn't wired up in this preview. Try the AI summary at the top of any report.",
      },
    ]);
    setInput("");
  };

  if (!isOpen) return null;

  return (
    <div className={`h-screen bg-card border-l flex flex-col ${className || ""}`}>
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-lg">VIDA</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <Card className="p-6 bg-muted/50">
              <p className="text-sm text-muted-foreground text-center">
                Ask about the Sweets household portfolio, performance, or Schwab account positions.
              </p>
            </Card>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`p-3 max-w-[85%] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </Card>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question about the Sweets portfolio..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" size="icon" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
