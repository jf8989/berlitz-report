// src/components/WelcomeMessage.tsx
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "./ui/Card";
import { LayoutGrid, BookText, MessageSquare } from "lucide-react";

export function WelcomeMessage() {
  const features = [
    {
      icon: <LayoutGrid className="h-8 w-8 text-primary" />,
      title: "Select a Group",
      description:
        "Use the dropdown to dive into the data for any class group.",
    },
    {
      icon: <BookText className="h-8 w-8 text-primary" />,
      title: "View My Report",
      description:
        "Read my detailed handover notes on students and teaching style.",
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "Chat with Max",
      description: "Ask my AI assistant any question you have about the data.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="p-6 md:p-8 bg-muted/50">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <Image
            src="/images/jf-profile-picture.jpg"
            alt="Juan Francisco Marcenaro Arellano"
            width={80}
            height={80}
            className="rounded-full object-cover shadow-lg border-2 border-primary/50"
          />
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Welcome to the Dashboard!
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              I built this tool to bring my class reports to life. You can
              select a group to see all the details, check out my full handover
              report, or even better, chat with my personal AI assistant, Max,
              at the bottom of the page if you have any questions. I hope this
              is useful!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="mt-1">{feature.icon}</div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
