import { Helmet } from "react-helmet-async";

export interface SEOSchemaProps {
  title: string;
  description: string;
  url: string;
  image?: string;
}

export function SEOSchema({ title, description, url, image }: SEOSchemaProps) {
  // Navigation links for JSON-LD schema
  const navigationElements = [
    { name: "How it works", url: `${url}#how-it-works` },
    { name: "Who it's for", url: `${url}#who-its-for` },
    { name: "Marketplace", url: `${url}#marketplace` },
    { name: "Learning", url: `${url}#learning` },
    { name: "Plans", url: `${url}#plans` },
    { name: "Login", url: `${window.location.origin}/login` },
    { name: "Get Started", url: `${window.location.origin}/register` },
  ];

  // WebSite schema for enhanced SERP display
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SMACOM Solutions",
    description: description,
    url: url,
    image: image,
    potentialAction: {
      "@type": "SearchAction",
      target: `${url}?s={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  // Organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SMACOM Solutions",
    description:
      "Waste-to-wealth platform connecting producers, processors and farmers with IoT, AI and marketplace",
    url: url,
    image: image,
    sameAs: [
      "https://www.linkedin.com/company/smacom",
      "https://twitter.com/smacom",
      "https://www.facebook.com/smacom",
    ],
  };

  // BreadcrumbList schema - main sections
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "How it works",
        item: `${url}#how-it-works`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Marketplace",
        item: `${url}#marketplace`,
      },
    ],
  };

  // SiteNavigationElement schema - for Google sitelinks
  const siteNavigationSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description: description,
    url: url,
    image: image,
    mainEntity: {
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      name: "Main Navigation",
      url: url,
      potentialAction: navigationElements.map((item, index) => ({
        "@type": "NavigateAction",
        target: item.url,
        name: item.name,
        position: index + 1,
      })),
    },
  };

  return (
    <Helmet>
      {/* Open Graph / Social Media */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* JSON-LD Schemas */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(siteNavigationSchema)}
      </script>
    </Helmet>
  );
}
