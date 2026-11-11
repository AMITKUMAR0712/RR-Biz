import { z } from "zod";
export const enquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.union([z.string().trim().email().max(190), z.literal("")]).optional(),
  phone: z.union([z.string().trim().regex(/^\+[1-9]\d{6,14}$/), z.literal("")]).optional(),
  service: z.string().trim().min(1, "Select a service.").max(120),
  message: z.string().trim().min(4).max(3000),
  contactMethod: z.enum(["WhatsApp", "Phone", "Email"]),
  preferredTime: z.string().max(80).optional(),
  nationality: z.string().max(80).optional(),
  serviceDetail: z.string().max(120).optional(),
  consent: z.literal(true),
  source: z.string().trim().min(1).max(80),
  pagePath: z.string().max(190).optional(),
  honeypot: z.string().max(200).optional(),
  startedAt: z.coerce.number().int().positive(),
}).strict().superRefine((value, context) => {
  if (!value.email && !value.phone) context.addIssue({ code: "custom", message: "Provide an email address or phone number.", path: ["email"] });
  if (value.contactMethod === "Email" && !value.email) context.addIssue({ code: "custom", message: "Provide an email address to use email as your preferred contact method.", path: ["email"] });
  if (value.contactMethod !== "Email" && !value.phone) context.addIssue({ code: "custom", message: "Provide a phone number for WhatsApp or phone contact.", path: ["phone"] });
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
