export const site = {
  name: "RRBizTech",
  legalName: "[Company legal name]",
  description:
    "Practical business guidance and proposed digital services for entrepreneurs and businesses in the UAE.",
  phone: "055 919 2309",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "971559192309",
  email: "info@rrbiztech.com",
  address: "[Office address if verified]",
  url: process.env.NEXT_PUBLIC_SITE_URL || "[Domain]",
  stats: [] as { value: string; label: string; detail: string }[],
  testimonials: [] as { quote: string; name: string; role: string; approved: boolean }[],
  social: [] as { label: string; url: string }[],
  meetingUrl: "",
  analytics: { ga4Id: process.env.NEXT_PUBLIC_GA4_ID || "" },
} as const;

export const homeContent = {
  hero: {
    eyebrow: "BUSINESS & DIGITAL SOLUTIONS · UAE",
    title: "Your complete business partner",
    accent: "in the UAE.",
    description: "From getting started to growing online, find practical business and digital support in one place.",
    reassurance: ["Free initial consultation", "Clear process", "WhatsApp support"],
  },
  process: {
    eyebrow: "SIMPLE, CLEAR STEPS",
    title: "A process that keeps you informed.",
    description: "We’ll help you understand what comes next, with practical guidance at every stage.",
    steps: [
      { title: "Enquire", description: "Tell us what you are looking to achieve." },
      { title: "Free consultation", description: "Discuss your goals and the support you need." },
      { title: "Requirements & checklist", description: "Review the relevant information and documents." },
      { title: "Processing support", description: "Get help coordinating the agreed next steps." },
      { title: "Follow-up", description: "Stay updated as your request progresses." },
    ],
  },
  approach: {
    eyebrow: "THE RRBIZTECH APPROACH",
    title: "Good support starts with clear answers.",
    description: "Every business has different priorities. We listen first, explain your options, and help coordinate the services you need.",
    features: [
      { title: "Clear process", description: "Understand the next steps before moving forward.", icon: "process" },
      { title: "One team, many services", description: "Discuss connected business needs in one place.", icon: "team" },
      { title: "Transparent communication", description: "Get practical updates and clear explanations.", icon: "communication" },
      { title: "Document guidance", description: "Know what information may be relevant to your enquiry.", icon: "documents" },
      { title: "Responsive support", description: "Reach out through the contact method that suits you.", icon: "support" },
    ],
  },
  audiences: ["Startups", "SMEs", "Freelancers", "Investors", "Professionals", "Growing companies"],
  serviceFinder: {
    eyebrow: "SERVICE FINDER",
    title: "Not sure where to start?",
    description: "Answer two quick questions to explore relevant services. Recommendations are a starting point, not eligibility or outcome advice.",
    firstQuestion: "What do you want to do?",
    secondQuestion: "Which area feels closest?",
    goals: ["Start a business", "Explore visa support", "Hire for my team", "Improve my digital presence", "Organise finance and operations"],
  },
  faqSection: {
    eyebrow: "A FEW QUICK ANSWERS",
    title: "Questions, answered.",
    description: "Can’t find what you need? Get in touch and tell us what you’re trying to do.",
  },
  enquiry: {
    eyebrow: "LET’S TALK ABOUT WHAT’S NEXT",
    title: "Ready to take the next step?",
    description: "Tell us a little about your plans. We’ll help you work out where to begin.",
  },
} as const;

export const aboutContent = {
  hero: {
    eyebrow: "ABOUT RRBIZTECH",
    title: "Your ambition. Your next move. Our focus.",
    description: "Building a business takes more than a great idea. It takes clear information, the right decisions and a strong digital presence.",
    introduction: "At RRBizTech, we help entrepreneurs and businesses move forward with clarity. From understanding the UAE business landscape to building a professional website and reaching the right customers online, our goal is to make your next step easier and more confident.",
    focus: "Our proposed focus areas include website and software development, IT consultancy, digital marketing, advertising and social media management, subject to final licence approvals. We also share practical information on topics such as business setup, residency and banking so you can prepare informed questions for the relevant authorities and providers.",
  },
  mission: "To help businesses turn ambition into action through practical guidance, technology and effective digital communication.",
  vision: "To become a trusted name for entrepreneurs and growing businesses seeking clarity, meaningful connections and digital growth in the UAE.",
  values: [
    { title: "Clear communication", description: "We explain the next step in straightforward language." },
    { title: "Business-first thinking", description: "We focus on what matters to your goals and customers." },
    { title: "Digital growth", description: "We bring together technology, websites and marketing." },
    { title: "A long-term approach", description: "We aim to build relationships that grow with your business." },
  ],
  cta: {
    eyebrow: "ABOUT RRBIZTECH",
    title: "Let’s talk about your next move.",
    description: "Tell us about your business and goals. We’ll discuss the scope and the appropriate next steps.",
  },
} as const;
