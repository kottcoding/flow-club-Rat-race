import handler from "vinext/server/fetch-handler";
import { cleanupExpiredRooms } from "../lib/room-retention.mjs";
export default {
  fetch: handler.fetch,
  async scheduled(_event: ScheduledController, env: Cloudflare.Env) {
    await cleanupExpiredRooms(env.DB);
  },
};
