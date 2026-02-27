import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const setTyping = mutation({
  args: { conversationId: v.id("conversations"), clerkId: v.string(), expiresAt: v.number() },
  handler: async (ctx, args) => {
    // upsert typing row for conversationId + clerkId
    const all = await ctx.db.query("typing").collect();
    const existing = all.find((t) => t.conversationId === args.conversationId && t.userId === args.clerkId);
    if (existing) {
      await ctx.db.patch(existing._id, { expiresAt: args.expiresAt });
      return existing._id;
    }
    return await ctx.db.insert("typing", { conversationId: args.conversationId, userId: args.clerkId, expiresAt: args.expiresAt });
  },
});

export const clearTyping = mutation({
  args: { conversationId: v.id("conversations"), clerkId: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("typing").collect();
    const existing = all.find((t) => t.conversationId === args.conversationId && t.userId === args.clerkId);
    if (existing) {
      await ctx.db.delete(existing._id);
    }
    return true;
  },
});

export const getTypingForConversation = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const now = Date.now();
    const all = await ctx.db.query("typing").withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId)).collect();
    return all.filter((t) => t.expiresAt > now);
  },
});
