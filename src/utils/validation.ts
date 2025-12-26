import { z } from "zod";

export const requiredString = (message: string) =>
  z.string(message).trim().min(1, message);
