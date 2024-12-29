import { ClientConfigSchema } from "./ClientConfigSchema";
import { ServerConfigSchema } from "./ServerConfigSchema";
import { env } from "./env";

// Since client config is also available in the server, merge these schemas
const ServerSchema = ServerConfigSchema.merge(ClientConfigSchema);

const parsedServerEnv = ServerSchema.safeParse(env);

if (!parsedServerEnv.success) {
  console.error(
    "❌ Invalid server environment variables:",
    parsedServerEnv.error.flatten().fieldErrors,
  );

  throw new Error("Invalid server environment variables");
}

const config = parsedServerEnv.data;

export { config };
