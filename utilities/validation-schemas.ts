import { z } from "zod";

export const loginFormSchema = z.object({
  national_identifier: z.string().min(8, "Please enter your id.").max(20),
  password: z.string().min(4, "Please enter a valid password.").max(20),
});
