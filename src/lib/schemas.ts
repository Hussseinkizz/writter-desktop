import { z } from "zod";

// define the form validation schemas, what should be what!

export const BailiffSchema = z.object({
  bailiff_name: z.string().min(3, "The name can't be empty!"),
  // email: z.string().email("Invalid email!"),
  password: z.string().min(8, "Password must be at least 8 characters!"),
  phone_number: z
    .string()
    .min(1, "Phone number missing!")
    .refine((value) => {
      return value.length >= 10 && value.length <= 13;
    }, "Phone length is invalid!"),
  tin_number: z.string().refine((value) => {
    const parsedValue = Number(value);
    return !isNaN(parsedValue) && String(parsedValue).length < 14;
  }, "Invalid tin number!"),
});

export default BailiffSchema;
