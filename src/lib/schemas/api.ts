import { z } from "zod";

export const ChatInputSchema = z.object({
  eventId: z.string().uuid("Invalid event ID"),
  message: z.string().min(1, "Message cannot be empty").max(2000, "Message too long"),
});

export const CreateEventSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  type: z.enum(["wedding", "birthday", "housewarming", "festival", "community"]),
  date: z.string().optional(),
  guests: z.number().int().positive().optional(),
  budget: z.number().positive().optional(),
  city: z.string().optional(),
});

export const CreateExpenseSchema = z.object({
  eventId: z.string().uuid(),
  category: z.string().min(1, "Category is required"),
  amount: z.number().positive("Amount must be positive"),
  note: z.string().optional().default(""),
  spentOn: z.string().optional(), // YYYY-MM-DD
});

export const UpdateTaskSchema = z.object({
  id: z.string().uuid(),
  done: z.boolean().optional(),
  assignee: z.string().optional(),
  reminder: z.boolean().optional(),
  title: z.string().optional(),
  dueDate: z.string().optional(),
});

export const CreateTaskSchema = z.object({
  eventId: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  dueDate: z.string().optional(),
  assignee: z.string().optional().default(""),
  reminder: z.boolean().optional().default(false),
});

export const UpdateVendorSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["to_contact", "quoted", "booked", "paid"]).optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  quote: z.number().min(0).nullable().optional(),
  notes: z.string().optional(),
});

export const CreateVendorSchema = z.object({
  eventId: z.string().uuid(),
  type: z.string().min(1, "Vendor type is required"),
  name: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  status: z.enum(["to_contact", "quoted", "booked", "paid"]).optional().default("to_contact"),
  quote: z.number().min(0).nullable().optional(),
  notes: z.string().optional().default(""),
});

export type ChatInput = z.infer<typeof ChatInputSchema>;
export type CreateEvent = z.infer<typeof CreateEventSchema>;
export type CreateExpense = z.infer<typeof CreateExpenseSchema>;
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;
export type CreateTask = z.infer<typeof CreateTaskSchema>;
export type UpdateVendor = z.infer<typeof UpdateVendorSchema>;
export type CreateVendor = z.infer<typeof CreateVendorSchema>;
