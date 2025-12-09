"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MessageSquare, X, Loader2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        // Predefined responses (JSON-like structure)
        const RESPONSES: Record<string, string> = {
            "hi": "Hello! I am your Habitual assistant. Ready to crush your goals?",
            "hello": "Hi there! How can I help you with your fitness journey today?",
            "diet": "A balanced diet is key! Focus on whole foods, protein, and hydration. Try tracking your meals!",
            "workout": "Consistency is king! Whether it's a walk or lifting, just showing up matters. What's your plan?",
            "health": "Health is wealth. Sleep 7-9 hours, drink water, and move daily.",
            "tips": "Here are 3 tips:\n1. Drink water first thing.\n2. Prep gym clothes.\n3. Focus on progress, not perfection.",
            "motivation": "You didn't come this far to only come this far. Keep going!",
            "protein": "Protein builds muscle! specialized sources: chicken, fish, tofu, beans, greek yogurt.",
            "cardio": "Cardio loves your heart! Run, swim, cycle, or walk for 150 mins/week.",
            "default": "I'm a simple demo bot! Ask me about 'diet', 'workout', 'tips', or 'motivation'."
        };

        // Simulate network delay / typing animation
        setTimeout(() => {
            const lowerInput = userMessage.content.toLowerCase();
            let responseText = RESPONSES["default"];

            // Simple keyword matching
            for (const key in RESPONSES) {
                if (lowerInput.includes(key) && key !== "default") {
                    responseText = RESPONSES[key];
                    break;
                }
            }

            const assistantMessage: Message = { role: "assistant", content: responseText };
            setMessages((prev) => [...prev, assistantMessage]);
            setIsLoading(false);
        }, 1500); // 1.5s delay for "typing" effect
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 w-[350px] sm:w-[400px] shadow-xl"
                    >
                        <Card className="border-primary/20 shadow-2xl overflow-hidden backdrop-blur-sm bg-background/95">
                            <CardHeader className="p-4 border-b bg-muted/30 flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-2">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <MessageSquare className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-sm font-medium">Habit Assistant</CardTitle>
                                        <p className="text-xs text-muted-foreground">Ask for diet & health tips</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                                    <Minimize2 className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
                                    <div className="flex flex-col gap-4">
                                        {messages.length === 0 && (
                                            <div className="text-center text-muted-foreground py-8 px-4">
                                                <p className="text-sm">Hi! I'm your personal health assistant.</p>
                                                <p className="text-xs mt-2">Ask me about diet, exercise, or building better habits!</p>
                                            </div>
                                        )}
                                        {messages.map((msg, index) => (
                                            <div
                                                key={index}
                                                className={cn(
                                                    "flex w-fit max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm break-words whitespace-pre-wrap",
                                                    msg.role === "user"
                                                        ? "ml-auto bg-primary text-primary-foreground"
                                                        : "bg-muted"
                                                )}
                                            >
                                                {msg.content}
                                            </div>
                                        ))}
                                        {isLoading && (
                                            <div className="flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted">
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                    <span>Thinking...</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                            <CardFooter className="p-3 border-t bg-muted/10">
                                <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                                    <Input
                                        ref={inputRef}
                                        placeholder="Type your message..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                                        <Send className="h-4 w-4" />
                                        <span className="sr-only">Send</span>
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    size="icon"
                    className="h-12 w-12 rounded-full shadow-lg"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
                </Button>
            </motion.div>
        </div>
    );
}
