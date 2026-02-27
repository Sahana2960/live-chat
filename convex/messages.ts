import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getMessagesByConversation = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    // Return messages for a conversation sorted ascending by createdAt
    return await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
      .order("asc")
      .collect();
  },
});

export const createMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderClerkId: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      // store sender as clerkId string to keep simple schema
      senderId: args.senderClerkId,
      text: args.text,
      createdAt: now,
    });

    // Update conversation lastMessageAt for previews
    try {
      await ctx.db.patch(args.conversationId, {
        lastMessageAt: now,
      });
    } catch (e) {
      // noop
    }

    // Increment unread counts for all participants except sender
    try {
      const convo = await ctx.db.get(args.conversationId);
      const participants = convo?.participantIds || [];
      for (const p of participants) {
        if (p === args.senderClerkId) continue;
        // upsert unread rows
        const all = await ctx.db.query("unreads").collect();
        const existing = all.find((u) => u.conversationId === args.conversationId && u.clerkId === p);
        if (existing) {
          await ctx.db.patch(existing._id, { count: (existing.count || 0) + 1 });
        } else {
          await ctx.db.insert("unreads", { conversationId: args.conversationId, clerkId: p, count: 1 });
        }
      }
    } catch (e) {
      // noop
    }

    return messageId;
  },
});

export const getConversationsForUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    // Simple scan: find all conversations where participantIds includes clerkId
    const all = await ctx.db.query("conversations").collect();
    const filtered = all.filter((c) => (c.participantIds || []).includes(args.clerkId));
    // Sort by lastMessageAt desc, fallback to createdAt
    filtered.sort((a, b) => (b.lastMessageAt || b.createdAt) - (a.lastMessageAt || a.createdAt));
    return filtered;
  },
});
