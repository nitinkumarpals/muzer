import { z } from "zod";
export const streamSchema = z.object({
  creatorId: z.string().min(1, { message: "Creator ID is required" }),
  url: z.string().regex(/youtube|spotify/, {
    message: "URL must contain either 'youtube' or 'spotify'",
  }),
});
