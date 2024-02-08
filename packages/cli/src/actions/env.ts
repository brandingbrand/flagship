import { defineAction } from "@/lib";

export default defineAction(async () => {
  await new Promise((res) => setTimeout(res, 1000));

  return "bundled 3 envs: env.dev.ts, env.staging.ts and env.prod.ts - all have been successfully linked to @brandingbrand/fsapp";
}, "env");
