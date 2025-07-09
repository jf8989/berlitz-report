/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/AIChatInterface.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card } from "./ui/Card";
import { db, ChatMessage } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { Sparkles, BookUser, MessageSquareQuote, Star } from "lucide-react";
import ReactMarkdown from "react-markdown";
// --- FIX: Import the Next.js Image component ---
import Image from "next/image";

interface AIChatInterfaceProps {
  selectedGroup: string;
}

const ConversationStarters = ({
  onPromptClick,
}: {
  onPromptClick: (prompt: string) => void;
}) => {
  const starters = [
    {
      icon: <BookUser className="w-4 h-4 mr-2" />,
      text: "What was Juanfra's teaching style?",
    },
    {
      icon: <MessageSquareQuote className="w-4 h-4 mr-2" />,
      text: "Tell me about a specific student's personality.",
    },
    {
      icon: <Star className="w-4 h-4 mr-2" />,
      text: "Show me a memorable moment from a class.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 mt-4">
      {starters.map((starter, index) => (
        <button
          key={index}
          onClick={() => onPromptClick(starter.text)}
          className="button button-outline text-sm flex items-center justify-center text-left p-2"
        >
          {starter.icon}
          <span>{starter.text}</span>
        </button>
      ))}
    </div>
  );
};

const ChatWelcomeMessage = ({
  groupName,
  onPromptClick,
}: {
  groupName: string;
  onPromptClick: (prompt: string) => void;
}) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-4">
    <div className="p-4 bg-primary/10 rounded-full mb-4">
      <Sparkles className="w-8 h-8 text-primary" />
    </div>
    <h2 className="text-2xl font-bold text-foreground mb-2">
      Chat with Max, your AI Assistant
    </h2>
    <p className="text-muted-foreground max-w-lg">
      I can answer questions about attendance for the{" "}
      <span className="font-bold text-foreground">{groupName}</span> group, or
      you can ask about Juanfra&#39;s personal notes on any student or his
      teaching style. Try one of the prompts below!
    </p>
    <ConversationStarters onPromptClick={onPromptClick} />
  </div>
);

const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ selectedGroup }) => {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockMessage, setBlockMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const chatHistory = useLiveQuery(
    () => db.chatMessages.where({ groupId: selectedGroup }).sortBy("timestamp"),
    [selectedGroup]
  );

  const addMessage = async (message: Omit<ChatMessage, "id" | "timestamp">) => {
    await db.chatMessages.add({ ...message, timestamp: new Date() });
  };

  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  useEffect(() => {
    const blockInfoJSON = localStorage.getItem(`blockInfo_${selectedGroup}`);
    if (blockInfoJSON) {
      const blockInfo = JSON.parse(blockInfoJSON);
      const blockEndTime =
        new Date(blockInfo.timestamp).getTime() + 3 * 60 * 60 * 1000; // 3 hours
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

  const handleSubmit = async (e?: React.FormEvent, promptText?: string) => {
    if (e) e.preventDefault();
    const userMessageContent = promptText || question;
    if (!userMessageContent.trim() || !selectedGroup || isLoading || isBlocked)
      return;

    setQuestion("");
    setIsLoading(true);

    const currentChatHistory = chatHistory || [];

    await addMessage({
      groupId: selectedGroup,
      role: "user",
      content: userMessageContent,
    });

    const historyForAPI = currentChatHistory.slice(-6).map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMessageContent,
          groupId: selectedGroup,
          history: historyForAPI,
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
      inputRef.current?.focus();
    }
  };

  return (
    <Card className="p-4 md:p-6 flex flex-col h-[70vh]">
      <div className="flex-1 overflow-y-auto pr-4 space-y-4">
        {chatHistory && chatHistory.length === 0 && !isLoading ? (
          <ChatWelcomeMessage
            groupName={selectedGroup}
            onPromptClick={(prompt) => handleSubmit(undefined, prompt)}
          />
        ) : (
          chatHistory?.map((msg) => {
            let displayContent = msg.content;
            if (displayContent.includes("%%DISPLAY_IMAGE_BASF7%%")) {
              displayContent = displayContent.replace(
                "%%DISPLAY_IMAGE_BASF7%%",
                "![BASF Group Surprise](/images/basf7.jpg)"
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-2xl rounded-lg px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <div className="prose dark:prose-invert">
                    <ReactMarkdown
                      components={{
                        // --- FIX: Replace the default `img` renderer with the Next.js `Image` component ---
                        img: ({ node, src, alt, width, height, ...props }) => {
                          // The `src` prop must be a string for Next.js Image.
                          if (!src || typeof src !== "string") return null;
                          // Ensure width and height are numbers for Next.js Image
                          const parsedWidth = width ? Number(width) : 300;
                          const parsedHeight = height ? Number(height) : 200;
                          return (
                            <Image
                              src={src as string}
                              alt={alt || "Image from chat"}
                              width={parsedWidth}
                              height={parsedHeight}
                              className="max-w-full rounded-md border"
                              {...props}
                            />
                          );
                        },
                      }}
                    >
                      {displayContent}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            );
          })
        )}

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
              ref={inputRef}
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
