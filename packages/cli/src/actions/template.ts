import { defineAction } from "@/lib";

export default defineAction(async () => {
  await new Promise((res) => setTimeout(res, 1000));
}, "template");
