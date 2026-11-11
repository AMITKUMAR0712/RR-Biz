import HomePage from "@/components/home-page";
import { faqs } from "@/content/faqs";
import { demoTestimonials } from "@/content/demo-testimonials";
import { getPublicBlogs, getPublicFeedback, getPublicReviews, getPublicServices, getPublicSite } from "@/lib/public-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rrbiztech.example";

export default async function Page() {
  const publicServices = await getPublicServices();
  const [blogs, publishedReviews, customerFeedback, siteInfo] = await Promise.all([
    getPublicBlogs(publicServices),
    getPublicReviews(),
    getPublicFeedback(),
    getPublicSite(),
  ]);
  const reviews = publishedReviews.length > 0
    ? publishedReviews
    : process.env.NODE_ENV === "development"
      ? demoTestimonials
      : [];
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: siteInfo.name,
      description: siteInfo.description,
      url: siteUrl,
      areaServed: "United Arab Emirates",
      serviceType: publicServices.map((service) => service.name),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <HomePage serviceList={publicServices} blogList={blogs} reviews={reviews} customerFeedback={customerFeedback} siteInfo={siteInfo} />
    </>
  );
}
