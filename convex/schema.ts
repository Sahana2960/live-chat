import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    avatar: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  conversations: defineTable({
    participantIds: v.array(v.string()), // Array of user IDs
    createdAt: v.number(),
    lastMessageAt: v.optional(v.number()),
  })
    .index("by_participants", ["participantIds"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.string(), // Clerk ID for simpler lookups
    text: v.string(),
    createdAt: v.number(),
  })
    .index("by_conversationId", ["conversationId"])
    .index("by_senderId", ["senderId"]),

  presence: defineTable({
    clerkId: v.string(),
    isOnline: v.boolean(),
    lastSeen: v.number(),
  })
    .index("by_clerkId", ["clerkId"]),

  typing: defineTable({
    conversationId: v.id("conversations"),
    userId: v.string(), // Clerk ID
    expiresAt: v.number(),
  })
    .index("by_conversationId", ["conversationId"]),

  unreads: defineTable({
    conversationId: v.id("conversations"),
    clerkId: v.string(),
    count: v.number(),
  })
    .index("by_clerkId", ["clerkId"]),
});
