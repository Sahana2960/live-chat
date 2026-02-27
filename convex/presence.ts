import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const setPresenceOnline = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    // upsert by clerkId: find existing presence row
    const all = await ctx.db.query("presence").collect();
    const existing = all.find((p) => p.clerkId === args.clerkId);
    if (existing) {
      await ctx.db.patch(existing._id, { isOnline: true, lastSeen: now });
      return existing._id;
    }
    return await ctx.db.insert("presence", { clerkId: args.clerkId, isOnline: true, lastSeen: now });
  },
});

export const setPresenceOffline = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("presence").collect();
    const existing = all.find((p) => p.clerkId === args.clerkId);
    if (existing) {
      await ctx.db.patch(existing._id, { isOnline: false, lastSeen: Date.now() });
    }
    return true;
  },
});

export const touchPresence = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    const all = await ctx.db.query("presence").collect();
    const existing = all.find((p) => p.clerkId === args.clerkId);
    if (existing) {
      await ctx.db.patch(existing._id, { lastSeen: now, isOnline: true });
      return existing._id;
    }
    return await ctx.db.insert("presence", { clerkId: args.clerkId, isOnline: true, lastSeen: now });
  },
});

export const getAllPresence = query({
  handler: async (ctx) => {
    return await ctx.db.query("presence").collect();
  },
});
