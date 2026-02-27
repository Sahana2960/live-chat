import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get conversation by participants (safe scan version)
export const getConversationByParticipants = query({
  args: { participantIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    const sorted = [...args.participantIds].sort();

    const all = await ctx.db.query("conversations").collect();

    for (const convo of all) {
      const p = [...(convo.participantIds || [])].sort();

      if (
        p.length === sorted.length &&
        p.every((val, index) => val === sorted[index])
      ) {
        return convo;
      }
    }

    return null;
  },
});

// Create conversation
export const createConversation = mutation({
  args: { participantIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    return await ctx.db.insert("conversations", {
      participantIds: args.participantIds,
      createdAt: Date.now(),
    });
  },
});

// Get or create conversation (clean version without runQuery)
export const getOrCreateConversation = mutation({
  args: { participantIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    const sorted = [...args.participantIds].sort();

    const all = await ctx.db.query("conversations").collect();

    for (const convo of all) {
      const p = [...(convo.participantIds || [])].sort();

      if (
        p.length === sorted.length &&
        p.every((val, index) => val === sorted[index])
      ) {
        return convo._id;
      }
    }

    return await ctx.db.insert("conversations", {
      participantIds: sorted,
      createdAt: Date.now(),
    });
  },
});