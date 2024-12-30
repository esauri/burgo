import { z } from "zod";

/**
 * Specify your client-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const ClientConfigSchema = z.object({
  SITE_URL: z.string().url(),
});
