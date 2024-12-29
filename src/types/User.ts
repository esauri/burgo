import { z } from "zod";

const UserMetadataSchema = z.object({
  displayName: z.string(),
  email: z.string().email(),
});

export const UserSchema = z.object({
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  id: z.string(),
  user_metadata: UserMetadataSchema,
});

export type User = z.infer<typeof UserSchema>;
