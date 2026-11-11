import { services } from "@/content/services";

export type BlogGuide = {
  slug: string;
  category: string;
  title: string;
  introduction: string;
  prompts: string[];
  serviceSlug: string;
};

export const blogGuides: BlogGuide[] = [
  {
    slug: "uae-business-setup",
    category: "Starting a business",
    title: "A clearer start to your UAE business setup",
    introduction:
      "A little preparation makes it easier to compare setup routes and understand which questions need answers before you begin.",
    prompts: [
      "Write down your planned activities and who your customers will be.",
      "Consider where you expect to work and whether you will need visas or a team.",
      "Ask which requirements, fees, and timelines apply to your specific situation.",
    ],
    serviceSlug: "business-setup",
  },
  {
    slug: "bookkeeping-routine",
    category: "Finance & people",
    title: "Build a simple bookkeeping routine",
    introduction:
      "Keeping records up to date throughout the month can make financial reviews less stressful and help you spot missing information sooner.",
    prompts: [
      "Keep invoices, receipts, and business expense records together.",
      "Reconcile transactions regularly and follow up on unpaid invoices.",
      "Review reports with a qualified professional when you need advice.",
    ],
    serviceSlug: "accounting-bookkeeping",
  },
  {
    slug: "business-website-checklist",
    category: "Digital growth",
    title: "A practical checklist for your business website",
    introduction:
      "A useful website makes it easy for the right people to understand your offer and take the next step.",
    prompts: [
      "Describe your audience, services, and service area in plain language.",
      "Make contact details and enquiry actions easy to find on mobile.",
      "Use clear page titles, compressed images, and helpful original content.",
    ],
    serviceSlug: "it-services",
  },
  {
    slug: "choosing-visa-support",
    category: "Visas & mobility",
    title: "Preparing for a visa-support conversation",
    introduction:
      "Starting with your purpose, current circumstances, and destination can help make a visa-support discussion more focused.",
    prompts: [
      "Note the type of travel or residency support you want to discuss.",
      "Gather basic context about your current location and intended destination.",
      "Confirm current requirements with the relevant authority before making plans.",
    ],
    serviceSlug: "visa-processing-support",
  },
  {
    slug: "organising-business-documents",
    category: "Business operations",
    title: "A simple way to organise business documents",
    introduction:
      "A consistent filing routine can make it easier to find business records when a renewal, application, or internal review comes up.",
    prompts: [
      "Use clear folders for company, finance, people, and correspondence records.",
      "Keep filenames descriptive and note when documents need review.",
      "Share sensitive records only through a verified and appropriate channel.",
    ],
    serviceSlug: "document-services",
  },
  {
    slug: "planning-your-first-hire",
    category: "Finance & people",
    title: "Questions to consider before your next hire",
    introduction:
      "A clear role brief and hiring process help you explain what the team needs before beginning a search.",
    prompts: [
      "Describe the outcomes and responsibilities expected in the role.",
      "Agree who will review applications and coordinate interviews.",
      "Confirm employment requirements with qualified advisers where needed.",
    ],
    serviceSlug: "recruitment",
  },
  {
    slug: "bank-application-preparation",
    category: "Business operations",
    title: "Getting organised for a bank application",
    introduction:
      "Preparing a clear overview of your account needs can help you understand which information a financial institution may request.",
    prompts: [
      "Clarify whether the enquiry relates to a company or personal account.",
      "Ask the selected institution for its current application requirements.",
      "Never share account credentials or sensitive documents through an unsecured enquiry form.",
    ],
    serviceSlug: "bank-account-assistance",
  },
  {
    slug: "digital-marketing-priorities",
    category: "Digital growth",
    title: "Set useful priorities for digital marketing",
    introduction:
      "A few practical priorities can help keep digital marketing focused on the audience and outcomes that matter to your business.",
    prompts: [
      "Choose the audience and service you want to communicate about first.",
      "Review your current website and social profiles for clarity and consistency.",
      "Set a regular time to review activity and adjust your approach.",
    ],
    serviceSlug: "digital-marketing",
  },
  {
    slug: "small-business-it-basics",
    category: "Digital growth",
    title: "IT basics to review as your business grows",
    introduction:
      "A periodic review of tools, access, and support needs can help a growing team understand where its systems may need attention.",
    prompts: [
      "List the software and online services your team relies on.",
      "Review account access when team responsibilities change.",
      "Identify recurring manual tasks that may benefit from careful automation.",
    ],
    serviceSlug: "it-services",
  },
];

export const blogGuidesWithServices = blogGuides.map((guide) => {
  const service = services.find((item) => item.slug === guide.serviceSlug);
  if (!service) {
    throw new Error(`Blog guide references an unknown service: ${guide.serviceSlug}`);
  }

  return { ...guide, service };
});
