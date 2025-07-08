// src/components/AIChatInterface.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card } from "./ui/Card";
import { db, ChatMessage } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { Sparkles } from "lucide-react"; // Using an icon for the welcome message

interface AIChatInterfaceProps {
  selectedGroup: string;
}

// --- NEW: A stylish welcome message component ---
const ChatWelcomeMessage = ({ groupName }: { groupName: string }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-4">
    <div className="p-4 bg-primary/10 rounded-full mb-4">
      <Sparkles className="w-8 h-8 text-primary" />
    </div>
    <h2 className="text-2xl font-bold text-foreground mb-2">
      Chat with Max, your AI Assistant
    </h2>
    <p className="text-muted-foreground max-w-md">
      I have access to the full report for the{" "}
      <span className="font-bold text-foreground">{groupName}</span> group. Ask
      me anything about attendance, progress, or student performance!
    </p>
  </div>
);
// --- END OF NEW COMPONENT ---

const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ selectedGroup }) => {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [isBlocked, setIsBlocked] = useState(false);
  const [blockMessage, setBlockMessage] = useState("");

  const chatHistory = useLiveQuery(
    () => db.chatMessages.where({ groupId: selectedGroup }).sortBy("timestamp"),
    [selectedGroup]
  );

  const addMessage = async (message: Omit<ChatMessage, "id" | "timestamp">) => {
    await db.chatMessages.add({
      ...message,
      timestamp: new Date(),
    });
  };

  useEffect(() => {
    // Only scroll if there are messages
    if (chatHistory && chatHistory.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatHistory?.length]);

  useEffect(() => {
    const blockInfoJSON = localStorage.getItem(`blockInfo_${selectedGroup}`);
    if (blockInfoJSON) {
      const blockInfo = JSON.parse(blockInfoJSON);
      const blockEndTime =
        new Date(blockInfo.timestamp).getTime() + 24 * 60 * 60 * 1000;
      if (Date.now() < blockEndTime) {
        setIsBlocked(true);
        setBlockMessage(blockInfo.message);
      } else {
        localStorage.removeItem(`blockInfo_${selectedGroup}`);
      }
    } else {
      setIsBlocked(false);
      setBlockMessage("");
    }
  }, [selectedGroup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !selectedGroup || isLoading || isBlocked) return;

    const userMessageContent = question;
    setQuestion("");
    setIsLoading(true);

    await addMessage({
      groupId: selectedGroup,
      role: "user",
      content: userMessageContent,
    });

    let recap = "";
    if (chatHistory && chatHistory.length > 0) {
      recap = chatHistory
        .slice(-4)
        .map((msg) => `<${msg.role}>${msg.content}</${msg.role}>`)
        .join("\n");
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMessageContent,
          groupId: selectedGroup,
          recap,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (data.blocked) {
        const finalMessage =
          data.message || "This conversation has been ended.";
        await addMessage({
          groupId: selectedGroup,
          role: "model",
          content: finalMessage,
        });
        localStorage.setItem(
          `blockInfo_${selectedGroup}`,
          JSON.stringify({ message: finalMessage, timestamp: new Date() })
        );
        setIsBlocked(true);
        setBlockMessage(finalMessage);
      } else {
        await addMessage({
          groupId: selectedGroup,
          role: "model",
          content: data.answer || "No answer received.",
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      await addMessage({
        groupId: selectedGroup,
        role: "model",
        content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4 md:p-6 flex flex-col h-[70vh]">
      <div className="flex-1 overflow-y-auto pr-4 space-y-4">
        {/* --- FIX: Logic to show Welcome Message or Chat History --- */}
        {chatHistory && chatHistory.length === 0 && !isLoading ? (
          <ChatWelcomeMessage groupName={selectedGroup} />
        ) : (
          chatHistory?.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                // --- FIX: text-white is now applied conditionally ---
                className={`max-w-xs md:max-w-md lg:max-w-2xl rounded-lg px-4 py-2 ${
                  msg.role === "user"
                    ? "bg-primary text-white" // User bubble: blue background, white text
                    : "bg-muted text-muted-foreground" // AI bubble: gray background, gray text (works in both themes)
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {/* --- END OF FIX --- */}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs md:max-w-md lg:max-w-2xl rounded-lg px-4 py-2 bg-muted text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        {isBlocked ? (
          <div className="text-center p-4 bg-destructive/10 text-destructive rounded-md">
            <p className="font-bold">Chat Disabled</p>
            <p className="text-sm">{blockMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <textarea
              className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none bg-background text-foreground resize-none"
              rows={1}
              placeholder={`Ask about ${
                selectedGroup || "the selected group"
              }...`}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="button button-primary"
              disabled={isLoading || !question.trim()}
            >
              Send
            </button>
          </form>
        )}
      </div>
    </Card>
  );
};

export default AIChatInterface;
