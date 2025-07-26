import React from "react";
import { Helmet } from "react-helmet-async";

// Schema.org structured data for restaurants
interface RestaurantSchemaProps {
  name: string;
  description: string;
  telephone: string;
  email: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  cuisine: string[];
  priceRange: string;
  rating?: {
    ratingValue: number;
    reviewCount: number;
  };
  openingHours: string[];
  menuUrl?: string;
}

export const RestaurantSchema = ({ 
  name, 
  description, 
  telephone, 
  email, 
  address, 
  cuisine, 
  priceRange, 
  rating, 
  openingHours,
  menuUrl 
}: RestaurantSchemaProps) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": name,
    "description": description,
    "telephone": telephone,
    "email": email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.streetAddress,
      "addressLocality": address.addressLocality,
      "postalCode": address.postalCode,
      "addressCountry": address.addressCountry
    },
    "servesCuisine": cuisine,
    "priceRange": priceRange,
    "openingHours": openingHours,
    ...(rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": rating.ratingValue,
        "reviewCount": rating.reviewCount
      }
    }),
    ...(menuUrl && { "hasMenu": menuUrl })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

// Menu item schema for individual dishes
interface MenuItemSchemaProps {
  name: string;
  description: string;
  price: number;
  currency: string;
  image?: string;
  nutrition?: {
    calories: number;
    dietaryRestrictions?: string[];
  };
}

export const MenuItemSchema = ({ 
  name, 
  description, 
  price, 
  currency, 
  image, 
  nutrition 
}: MenuItemSchemaProps) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    "name": name,
    "description": description,
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": currency
    },
    ...(image && { "image": image }),
    ...(nutrition && {
      "nutrition": {
        "@type": "NutritionInformation",
        "calories": nutrition.calories,
        ...(nutrition.dietaryRestrictions && {
          "suitableForDiet": nutrition.dietaryRestrictions.map(diet => 
            `https://schema.org/${diet.replace('-', '')}`
          )
        })
      }
    })
  };

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

// Enhanced SEO Head component
interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  locale?: string;
  noIndex?: boolean;
}

export const SEOHead = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = "website",
  locale = "nl_NL",
  noIndex = false
}: SEOHeadProps) => {
  const fullTitle = title.includes("Wesley's Ambacht") 
    ? title 
    : `${title} | Wesley's Ambacht - Catering Stellendam`;

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords.join(", ")} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content="Wesley's Ambacht" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {canonical && <meta property="og:url" content={canonical} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Additional meta tags for food businesses */}
      <meta name="geo.region" content="NL-ZH" />
      <meta name="geo.placename" content="Stellendam" />
      <meta name="geo.position" content="51.8167;4.0333" />
      <meta name="ICBM" content="51.8167, 4.0333" />

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  );
};

// Local business schema specifically for catering
export const CateringBusinessSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    "name": "Wesley's Ambacht",
    "alternateName": "Ambacht bij Wesley",
    "description": "Premium catering service in Stellendam, gespecialiseerd in zakelijke evenementen, bruiloften en sociale gelegenheden. Verse, lokale ingrediënten en professionele service.",
    "telephone": "+31621222658",
    "email": "info@ambachtbijwesley.nl",
    "url": "https://ambachtbijwesley.nl",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Nieuweweg 79",
      "addressLocality": "Stellendam",
      "postalCode": "3251 LJ",
      "addressCountry": "NL"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.8167,
      "longitude": 4.0333
    },
    "servesCuisine": [
      "Nederlandse keuken",
      "Moderne Europese keuken",
      "Catering",
      "BBQ"
    ],
    "priceRange": "€€-€€€",
    "openingHours": [
      "Mo-Fr 09:00-18:00"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    },
    "potentialAction": {
      "@type": "ReserveAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://ambachtbijwesley.nl/contact",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      },
      "result": {
        "@type": "Reservation",
        "name": "Catering reservering"
      }
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 51.8167,
        "longitude": 4.0333
      },
      "geoRadius": "50000"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};