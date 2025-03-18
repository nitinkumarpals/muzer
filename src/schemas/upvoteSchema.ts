import { z } from "zod";
export const upvoteSchema = z.object({
  streamId: z.string().min(1, { message: "Stream ID is required" }),
});
