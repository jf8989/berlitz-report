// src/components/AIChatInterface.tsx
"use client";

import React, { useState } from "react";
import { Card } from "./ui/Card";

interface AIChatInterfaceProps {
  selectedGroup: string;
}

const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ selectedGroup }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(
    "Ask me anything about the Berlitz class data!"
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !selectedGroup) {
      setAnswer("Please select a group and enter a question.");
      return;
    }

    setIsLoading(true);
    setAnswer("Thinking...");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, groupId: selectedGroup }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setAnswer(data.answer || "No answer received.");
    } catch (error: unknown) {
      // CHANGED: from 'any' to 'unknown'
      console.error("Error fetching AI response:", error);
      // Now we must check the type of error before using it
      if (error instanceof Error) {
        setAnswer(
          `Sorry, I encountered an error: ${error.message}. Please try again.`
        );
      } else {
        setAnswer("An unknown error occurred. Please check the console.");
      }
    } finally {
      setIsLoading(false);
      setQuestion("");
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none bg-background text-foreground"
          rows={3}
          placeholder={`Ask about ${selectedGroup || "the selected group"}...`}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="button button-primary self-end"
          disabled={isLoading}
        >
          {isLoading ? "Asking..." : "Ask AI"}
        </button>
      </form>
      <div className="mt-6 p-4 bg-muted rounded-md text-muted-foreground whitespace-pre-wrap">
        {answer}
      </div>
    </Card>
  );
};

export default AIChatInterface;
