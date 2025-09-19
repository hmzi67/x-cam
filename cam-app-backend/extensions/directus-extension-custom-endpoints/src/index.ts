import { defineEndpoint } from "@directus/extensions-sdk";
import { AccessToken } from "livekit-server-sdk";

export default defineEndpoint({
  id: "livekit",
  handler: (router, { services, env }) => {
    const LIVEKIT_API_KEY = env.LIVEKIT_API_KEY;
    const LIVEKIT_API_SECRET = env.LIVEKIT_API_SECRET;
    const LIVEKIT_URL = env.LIVEKIT_URL;
    console.log(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL);

    // Public/Private chat & stream join token
    router.get("/token/:room", async (req: any, res: any) => {
      try {
        const { room } = req.params;
        const { role } = req.query;
        console.log("Room", room);
        console.log("Role", role);
        const user = req.accountability?.user;
        console.log("User: ", user);

        if (!user) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
          identity: String(user),
          name: req.accountability?.user,
        });

        at.addGrant({
          roomJoin: true,
          room: room,
          canPublish: true,
          canSubscribe: true,
          canPublishData: true,
        });

        const token = await at.toJwt();
        return res.json({ token, url: LIVEKIT_URL });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Token generation failed" });
      }
    });

    // Creator invites viewer to private room
    router.post("/private-room", async (req: any, res: any) => {
      const { streamId, viewerId } = req.body;
      const creatorId = req.accountability?.user;

      if (!creatorId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const privateRoomName = `private_${streamId}_${creatorId}_${viewerId}`;
      // Here you can also persist to `private_rooms` collection if needed

      return res.json({ room: privateRoomName });
    });
  },
});
