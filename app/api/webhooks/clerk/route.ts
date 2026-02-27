import { api } from "@/convex/_generated/api";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!
);

export async function POST(req: Request) {
  const headerPayload = await headers();

  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  const body = await req.text();

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Missing webhook secret", { status: 500 });
  }

  const wh = new Webhook(webhookSecret);

  let evt: any;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Unauthorized", { status: 401 });
  }

  const eventType = evt.type;
  const { id, email_addresses, first_name, last_name, image_url } = evt.data;

  try {
    if (eventType === "user.created" || eventType === "user.updated") {
      const email = email_addresses?.[0]?.email_address || "";
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      await convex.mutation(api.users.createOrUpdateUser, {
        clerkId: id,
        email,
        name,
        avatar: image_url || "",
      });

      console.log(`User ${id} synced to Convex`);
    }

    if (eventType === "user.deleted") {
      await convex.mutation(api.users.deleteUser, {
        clerkId: id,
      });

      console.log(`User ${id} deleted from Convex`);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}