import { Webhook } from "svix";
import { headers } from "next/headers";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL || ""
);

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id") || "";
  const svix_timestamp = headerPayload.get("svix-timestamp") || "";
  const svix_signature = headerPayload.get("svix-signature") || "";

  const body = await req.text();

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt: any;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as any;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const eventType = evt.type;
  const { id, email_addresses, first_name, last_name, image_url } = evt.data;

  try {
    if (eventType === "user.created" || eventType === "user.updated") {
      const email = email_addresses?.[0]?.email_address || "";
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      await convex.mutation("users:createOrUpdateUser", {
        clerkId: id,
        email,
        name,
        avatar: image_url,
      });

      console.log(`User ${id} synced to Convex`);
    } else if (eventType === "user.deleted") {
      await convex.mutation("users:deleteUser", {
        clerkId: id,
      });

      console.log(`User ${id} deleted from Convex`);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
