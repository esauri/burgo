import { z } from "zod";

/**
 * Specify your server-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
export const ServerConfigSchema = z.object({
  PRODUCTS_API_URL: z.string(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_URL: z.string(),
});
