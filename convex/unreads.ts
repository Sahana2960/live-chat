import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const incrementUnread = mutation({
  args: { conversationId: v.id("conversations"), clerkId: v.string() },
  handler: async (ctx, args) => {
    // find existing unread row
    const all = await ctx.db.query("unreads").collect();
    const existing = all.find((u) => u.conversationId === args.conversationId && u.clerkId === args.clerkId);
    if (existing) {
      await ctx.db.patch(existing._id, { count: (existing.count || 0) + 1 });
      return existing._id;
    }
    return await ctx.db.insert("unreads", { conversationId: args.conversationId, clerkId: args.clerkId, count: 1 });
  },
});

export const resetUnread = mutation({
  args: { conversationId: v.id("conversations"), clerkId: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("unreads").collect();
    const existing = all.find((u) => u.conversationId === args.conversationId && u.clerkId === args.clerkId);
    if (existing) {
      await ctx.db.patch(existing._id, { count: 0 });
    }
    return true;
  },
});

export const getUnreadCountsForUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("unreads").collect();
    return all.filter((u) => u.clerkId === args.clerkId).map((u) => ({ conversationId: u.conversationId, count: u.count || 0 }));
  },
});
