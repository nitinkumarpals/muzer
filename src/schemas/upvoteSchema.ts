import { z } from "zod";
z.object({ streamId: z.string().min(1, { message: "Stream ID is required" }) });
