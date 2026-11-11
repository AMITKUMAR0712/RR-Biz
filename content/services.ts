import {
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  FileText,
  Globe2,
  Landmark,
  Laptop,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export type ServiceGroup =
  | "Establish & Operate"
  | "Visas & Mobility"
  | "Finance & People"
  | "Digital Growth";

export type Service = {
  slug: string;
  name: string;
  group: ServiceGroup;
  icon: LucideIcon;
  image: string;
  shortDescription: string;
  benefit: string;
  headline: string;
  introduction: string;
  audience: string[];
  help: { title: string; description: string }[];
  process: string[];
  checklist: string[];
  related: string[];
};

export const serviceGroups: { name: ServiceGroup; tagline: string; icon: LucideIcon; image: string }[] = [
  { name: "Establish & Operate", tagline: "Set up and keep business moving", icon: Building2, image: "/services/start-a-business.webp" },
  { name: "Visas & Mobility", tagline: "Guidance for your next move", icon: Globe2, image: "/services/visa-processing-support.webp" },
  { name: "Finance & People", tagline: "Support for your team and numbers", icon: ChartNoAxesCombined, image: "/services/accounting-bookkeeping.webp" },
  { name: "Digital Growth", tagline: "Build your presence and systems", icon: Laptop, image: "/services/digital-marketing.webp" },
];

export const services: Service[] = [
  {
    slug: "business-setup",
    name: "Business Setup",
    group: "Establish & Operate",
    icon: Building2,
    image: "/services/business-setup.webp",
    shortDescription: "Mainland and free zone formation, renewals, and amendments.",
    benefit: "A clear path through setup requirements.",
    headline: "Plan your UAE business setup with clarity",
    introduction: "Get practical support with formation options, licensing steps, renewals, and amendments based on your business plans.",
    audience: ["Founders planning a UAE business", "Existing companies reviewing their licence", "Business owners considering an amendment"],
    help: [{ title: "Mainland formation", description: "Coordinate the formation steps and information relevant to a mainland setup." }, { title: "Free zone formation", description: "Discuss free zone setup options and the requirements for your situation." }, { title: "Licence support", description: "Get assistance with renewals and amendments to existing business licences." }],
    process: ["Discuss your planned activities and requirements.", "Review the relevant setup options and information.", "Prepare and coordinate the required application steps.", "Follow up on the application and next actions."],
    checklist: ["Planned business activities", "Shareholder and contact details", "Preferred setup location, if known", "Any existing company or licence details"],
    related: ["pro-services", "bank-account-assistance", "visa-processing-support"],
  },
  {
    slug: "pro-services",
    name: "PRO Services",
    group: "Establish & Operate",
    icon: BriefcaseBusiness,
    image: "/services/pro-services.webp",
    shortDescription: "Government documentation, submissions, renewals, and follow-up.",
    benefit: "Practical support with document workflows.",
    headline: "Keep government documentation moving",
    introduction: "Coordinate government documentation, submissions, renewals, and follow-up with practical support through each step.",
    audience: ["Companies handling recurring government paperwork", "Business owners who need submission support", "Individuals seeking help coordinating documents"],
    help: [{ title: "Document preparation", description: "Organise information and supporting paperwork for the relevant process." }, { title: "Submission coordination", description: "Receive support coordinating document submissions and follow-up." }, { title: "Renewal support", description: "Plan upcoming renewal steps and keep track of required information." }],
    process: ["Tell us which document or service you need help with.", "Review the applicable requirements for your request.", "Coordinate preparation and submission support.", "Follow up and share updates on next steps."],
    checklist: ["Type of document or service", "Relevant reference details, if available", "Preferred contact method", "Any known deadline"],
    related: ["business-setup", "document-services", "visa-processing-support"],
  },
  {
    slug: "bank-account-assistance",
    name: "Bank Account Assistance",
    group: "Establish & Operate",
    icon: Landmark,
    image: "/services/bank-account-assistance.webp",
    shortDescription: "Documentation and application support for company and personal accounts.",
    benefit: "Know what to prepare for your application.",
    headline: "Prepare for a bank account application",
    introduction: "Get help organising documentation and understanding application steps for company and personal bank accounts. Account decisions remain with the financial institution.",
    audience: ["Newly formed businesses", "Existing companies reviewing banking needs", "Individuals seeking application guidance"],
    help: [{ title: "Document organisation", description: "Understand the information commonly requested for your application." }, { title: "Application support", description: "Get assistance preparing and coordinating application materials." }, { title: "Follow-up guidance", description: "Discuss how to follow up with the relevant financial institution." }],
    process: ["Discuss whether your enquiry is for a company or personal account.", "Review the institution-specific information available to you.", "Organise application documentation with our guidance.", "Follow up directly with the financial institution as appropriate."],
    checklist: ["Company or personal account enquiry", "Basic business or employment context", "Preferred financial institution, if known", "Contact details for follow-up"],
    related: ["business-setup", "accounting-bookkeeping", "document-services"],
  },
  {
    slug: "document-services",
    name: "Document Services",
    group: "Establish & Operate",
    icon: FileText,
    image: "/services/document-services.webp",
    shortDescription: "Typing, document clearing, and attestation or translation coordination.",
    benefit: "Keep paperwork organized and moving.",
    headline: "Get practical help with document services",
    introduction: "Coordinate typing, document clearing, attestation, and translation requests with support for the paperwork involved.",
    audience: ["Individuals preparing documents for a process", "Businesses managing recurring paperwork", "People coordinating translation or attestation"],
    help: [{ title: "Typing support", description: "Coordinate typing services for relevant forms and documentation." }, { title: "Document clearing", description: "Get assistance understanding and coordinating document clearing steps." }, { title: "Attestation and translation", description: "Coordinate attestation or translation support where applicable." }],
    process: ["Describe the document service you need.", "Confirm the relevant document details and destination.", "Coordinate the requested support.", "Follow up on collection or subsequent steps."],
    checklist: ["Document type and purpose", "Issuing country or destination, where relevant", "Language or service requested", "Any known submission date"],
    related: ["pro-services", "visa-processing-support", "international-visa-support"],
  },
  {
    slug: "visa-processing-support",
    name: "Visa Processing Support",
    group: "Visas & Mobility",
    icon: Globe2,
    image: "/services/visa-processing-support.webp",
    shortDescription: "Guidance for golden, freelance, visit, investor, employment, and family visas.",
    benefit: "Understand the documentation steps involved.",
    headline: "Understand the steps for visa processing support",
    introduction: "Discuss documentation and coordination support for golden, freelance, visit, investor or partner, employment, and family visa enquiries.",
    audience: ["Individuals exploring visa support", "Employers coordinating employee enquiries", "Families coordinating related enquiries"],
    help: [{ title: "Visa enquiry", description: "Discuss the visa category and context for your enquiry." }, { title: "Document guidance", description: "Review an indicative document checklist relevant to your request." }, { title: "Process coordination", description: "Get support coordinating application steps and follow-up." }],
    process: ["Share the visa category and a brief overview.", "Review the appropriate requirements to verify for your case.", "Prepare the relevant information and application materials.", "Coordinate follow-up with the relevant parties."],
    checklist: ["Visa category", "Applicant nationality and current location", "Sponsor or employer context, if relevant", "Any known application reference"],
    related: ["pro-services", "document-services", "international-visa-support"],
  },
  {
    slug: "international-visa-support",
    name: "International Visa Support",
    group: "Visas & Mobility",
    icon: Globe2,
    image: "/services/international-visa-support.webp",
    shortDescription: "Documentation guidance for selected destination countries.",
    benefit: "Get help preparing for your next destination.",
    headline: "Get guidance for an international visa enquiry",
    introduction: "Receive documentation guidance for selected destination countries. Requirements and decisions depend on the destination authority and your individual circumstances.",
    audience: ["Travellers preparing an international visa enquiry", "Professionals planning a trip abroad", "People seeking document coordination support"],
    help: [{ title: "Destination enquiry", description: "Tell us the destination country and purpose of travel." }, { title: "Document guidance", description: "Discuss an indicative list of documents for your enquiry." }, { title: "Application coordination", description: "Get help organising information and coordinating next steps." }],
    process: ["Share your destination, travel purpose, and timing.", "Confirm whether support is available for your destination.", "Review the relevant document guidance.", "Coordinate your preparation and next steps."],
    checklist: ["Destination country", "Purpose of travel", "Approximate travel dates", "Applicant nationality"],
    related: ["visa-processing-support", "document-services", "pro-services"],
  },
  {
    slug: "accounting-bookkeeping",
    name: "Accounting & Bookkeeping",
    group: "Finance & People",
    icon: ChartNoAxesCombined,
    image: "/services/accounting-bookkeeping.webp",
    shortDescription: "Transaction records, reconciliation, reports, and payroll support.",
    benefit: "Bring more structure to financial records.",
    headline: "Bring structure to your bookkeeping",
    introduction: "Get support with transaction recording, reconciliation, reports, and payroll coordination to organise your business records.",
    audience: ["Small and growing businesses", "Founders setting up record-keeping routines", "Teams seeking bookkeeping and payroll support"],
    help: [{ title: "Transaction recording", description: "Organise business transactions and supporting records." }, { title: "Reconciliation and reports", description: "Coordinate routine reconciliations and financial reporting." }, { title: "Payroll support", description: "Discuss payroll-related record-keeping support for your team." }],
    process: ["Discuss your current bookkeeping workflow.", "Identify the records and reporting support needed.", "Agree on a practical coordination approach.", "Review outputs and outstanding information."],
    checklist: ["Business activity and entity context", "Current bookkeeping tools, if any", "Approximate transaction volume", "Reporting or payroll needs"],
    related: ["business-setup", "recruitment", "bank-account-assistance"],
  },
  {
    slug: "recruitment",
    name: "Recruitment",
    group: "Finance & People",
    icon: UsersRound,
    image: "/services/recruitment.webp",
    shortDescription: "Sourcing, screening, interview coordination, and placement support.",
    benefit: "Support for each step of your hiring process.",
    headline: "Coordinate the next step in your recruitment",
    introduction: "Get support with candidate sourcing, screening, interview coordination, and placement. We can discuss hiring or job-seeking enquiries.",
    audience: ["Employers planning a hire", "Teams coordinating candidate interviews", "Job seekers enquiring about recruitment support"],
    help: [{ title: "Candidate sourcing", description: "Discuss role requirements and sourcing support." }, { title: "Screening coordination", description: "Coordinate candidate screening and interview steps." }, { title: "Placement support", description: "Get support through placement coordination." }],
    process: ["Tell us whether you are hiring or seeking work.", "Discuss the role, skills, or experience involved.", "Coordinate relevant sourcing or screening steps.", "Follow up on interviews and placement discussions."],
    checklist: ["Hiring or job-seeking enquiry", "Role title or target role", "Relevant skills and experience", "Preferred contact method"],
    related: ["accounting-bookkeeping", "business-setup", "it-services"],
  },
  {
    slug: "it-services",
    name: "IT Services",
    group: "Digital Growth",
    icon: Laptop,
    image: "/services/it-services.webp",
    shortDescription: "Website and software development, IT support, and automation.",
    benefit: "Technology help shaped around your needs.",
    headline: "Find practical IT support for your business",
    introduction: "Discuss website and software development, IT support, and automation based on your organisation's needs.",
    audience: ["Businesses planning a website or software project", "Teams looking for IT support", "Companies exploring workflow automation"],
    help: [{ title: "Web and software development", description: "Discuss a website or software need and its intended audience." }, { title: "IT support", description: "Describe your support requirements and current setup." }, { title: "Automation", description: "Identify repetitive workflows that may benefit from automation." }],
    process: ["Share your goal and current technology context.", "Clarify scope, users, and relevant constraints.", "Discuss a suitable approach and next steps.", "Coordinate delivery and follow-up as agreed."],
    checklist: ["Project or support goal", "Existing platform or technology, if relevant", "Target users and key requirements", "Preferred timeframe for discussion"],
    related: ["digital-marketing", "business-setup", "recruitment"],
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    group: "Digital Growth",
    icon: ChartNoAxesCombined,
    image: "/services/digital-marketing.webp",
    shortDescription: "Social media, advertising, SEO, branding, and content.",
    benefit: "Build a consistent digital presence.",
    headline: "Build a consistent digital presence",
    introduction: "Plan support across social media, advertising, SEO, branding, and content around your audience and business goals.",
    audience: ["Businesses improving their online presence", "Teams planning content or campaigns", "Founders setting up a brand and website"],
    help: [{ title: "Social media and content", description: "Plan content support for your channels and audience." }, { title: "SEO and advertising", description: "Discuss search visibility and advertising needs." }, { title: "Branding", description: "Coordinate branding and creative support for your business." }],
    process: ["Discuss your audience, channels, and goals.", "Review your current digital presence and priorities.", "Agree on a practical scope of marketing support.", "Review activity and coordinate next steps."],
    checklist: ["Business website or social profile, if available", "Audience and service area", "Marketing goals", "Existing brand or content materials"],
    related: ["it-services", "business-setup", "recruitment"],
  },
];
