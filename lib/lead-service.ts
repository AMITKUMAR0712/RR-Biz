import { sendLeadEmails } from "@/lib/mail";
import type { EnquiryInput } from "@/lib/validators";

export interface LeadService {
  submit(enquiry: EnquiryInput): Promise<void>;
}

export const emailLeadService: LeadService = {
  async submit(enquiry) {
    await sendLeadEmails(enquiry);
  },
};
