// src/components/AIChatInterface.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card } from "./ui/Card";
import { db, ChatMessage } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";

interface AIChatInterfaceProps {
  selectedGroup: string;
}

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

  // --- FIX: This useEffect dependency is changed to prevent unwanted scrolling ---
  // It now only runs when the NUMBER of messages changes, not when the chatHistory object itself is replaced.
  // This stops the scroll from happening when you just switch groups.
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory?.length]); // The fix is changing [chatHistory] to [chatHistory?.length]
  // --- END OF FIX ---

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
        {chatHistory?.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-2xl rounded-lg px-4 py-2 text-white ${
                msg.role === "user"
                  ? "bg-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
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
