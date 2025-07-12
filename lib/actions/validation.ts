import { z } from "zod";

export const authFormSchema = (type: "signin" | "signup") =>
  z.object({
    name: type === "signup" ? z.string().min(2, "Name is required") : z.string().optional(),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
