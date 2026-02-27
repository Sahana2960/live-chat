import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Find a conversation that exactly matches the sorted participantIds array
export const getConversationByParticipants = query({
  args: { participantIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    const sorted = [...args.participantIds].sort();
    const all = await ctx.db.query("conversations").collect();

    for (const convo of all) {
      const p = [...(convo.participantIds || [])].sort();
      if (p.length === sorted.length && p.every((v, i) => v === sorted[i])) {
        return convo;
      }
    }
    return null;
  },
});

export const createConversation = mutation({
  args: { participantIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("conversations", {
      participantIds: args.participantIds,
      createdAt: now,
    });
  },
});

export const getOrCreateConversation = mutation({
  args: { participantIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    const sorted = [...args.participantIds].sort();
    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_participants", (q) => q.eq("participantIds", sorted))
      .first();

    // If we found one via index, use it
    if (existing) return existing._id;

    // Fallback: scan all conversations and compare sorted participantIds
    const all = await ctx.db.query("conversations").collect();
    for (const convo of all) {
      const p = [...(convo.participantIds || [])].sort();
      if (p.length === sorted.length && p.every((v, i) => v === sorted[i])) {
        return convo._id;
      }
    }

    // Otherwise create a new conversation
    return await ctx.db.insert("conversations", {
      participantIds: args.participantIds,
      createdAt: Date.now(),
    });
  },
});
