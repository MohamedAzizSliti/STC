"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
}

const quickActions = [
  "Application Status",
  "Document Requirements",
  "Payment Questions",
  "Technical Support",
];

const botResponses: Record<string, string> = {
  "application status": "You can check your application status by logging into your STC dashboard. Navigate to 'My Applications' to see real-time updates. If you need further assistance, please provide your application ID.",
  "document requirements": "Required documents vary by country, but typically include: academic transcripts, passport/ID, language certificates, recommendation letters, personal statement, CV/Resume, and financial proof. Visit the Studies section for country-specific requirements.",
  "payment questions": "We accept Credit/Debit Cards (Visa, Mastercard), PayPal, and bank transfers. All payments are securely processed. Application fees typically range from 75-225 EUR depending on the service package.",
  "technical support": "For technical issues, please try clearing your browser cache first. If the issue persists, describe the problem in detail and our support team will respond within 24 hours.",
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(botResponses)) {
    if (lower.includes(key)) return response;
  }
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return "Hello! Welcome to STC support. How can I help you today? You can ask about application status, document requirements, payments, or technical issues.";
  }
  if (lower.includes("study") || lower.includes("university") || lower.includes("country")) {
    return "We offer study opportunities in 9+ countries including Portugal, Spain, France, Germany, Poland, Ireland, Italy, Romania, and the USA. Visit our Studies section for detailed information about each destination.";
  }
  if (lower.includes("job") || lower.includes("work") || lower.includes("career")) {
    return "Our Job Seekers platform connects you with international employers. Create your profile to get discovered by leading companies. Visit the Job Seekers section to get started.";
  }
  if (lower.includes("enterprise") || lower.includes("company") || lower.includes("hire")) {
    return "Our Enterprise portal helps you find top international talent. Register your company, post positions, and search our candidate database. Visit the Enterprise section to learn more.";
  }
  return "Thank you for your message. I can help with application status, document requirements, payment questions, and technical support. For more specific inquiries, please contact us at support@steamconsulting.com.";
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "bot", text: "Hello! I'm your STC assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now(), role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getBotResponse(text);
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "bot", text: response }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-105",
          open ? "bg-foreground text-background" : "bg-stc-orange text-white"
        )}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl border border-border bg-background shadow-2xl overflow-hidden flex flex-col" style={{ height: "480px" }}>
          {/* Header */}
          <div className="bg-stc-orange px-4 py-3 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">STC Assistant</p>
              <p className="text-xs text-white/70">Powered by AI</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2",
                  msg.role === "user" ? "flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  msg.role === "bot" ? "bg-stc-orange/10 text-stc-orange" : "bg-foreground/10 text-foreground"
                )}>
                  {msg.role === "bot" ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                </div>
                <div className={cn(
                  "max-w-[75%] rounded-2xl px-3 py-2 text-xs leading-relaxed",
                  msg.role === "bot"
                    ? "bg-secondary text-foreground rounded-tl-sm"
                    : "bg-stc-orange text-white rounded-tr-sm"
                )}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stc-orange/10 text-stc-orange">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="bg-secondary rounded-2xl rounded-tl-sm px-3 py-2 text-xs text-muted-foreground">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => sendMessage(action)}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground hover:bg-secondary transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border p-3 flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage(input); }}
              placeholder="Type your message..."
              className="text-xs h-9"
            />
            <Button
              size="icon"
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="h-9 w-9 shrink-0 bg-stc-orange text-white hover:bg-stc-orange/90"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
