// src/lib/db.ts
import Dexie, { Table } from "dexie";

export interface ChatMessage {
  id?: number; // Primary key, auto-incrementing
  groupId: string; // To keep chats for different groups separate
  role: "user" | "model"; // Who sent the message
  content: string; // The message text
  timestamp: Date; // When the message was sent
}

export class BerlitzReportDB extends Dexie {
  chatMessages!: Table<ChatMessage>;

  constructor() {
    super("BerlitzReportDB");
    this.version(1).stores({
      // The '++id' auto-increments the primary key.
      // 'groupId' is an index to allow for efficient querying of messages by group.
      chatMessages: "++id, groupId",
    });
  }
}

export const db = new BerlitzReportDB();
