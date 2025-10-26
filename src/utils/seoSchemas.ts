// Product Schema Generator
export const generateProductSchema = (product: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images || [product.image],
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "YUCA Lifestyle"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://yucalifestyle.com/product/${product.id}`,
      "priceCurrency": "INR",
      "price": product.price,
      "availability": product.countInStock > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "YUCA Lifestyle"
      }
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.numReviews || 0
    } : undefined
  };
};

// Breadcrumb Schema Generator
export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

// FAQ Schema Generator
export const generateFAQSchema = (faqs: { question: string; answer: string }[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

// Collection/Category Schema Generator
export const generateCollectionSchema = (category: string, products: any[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category} Collection - YUCA Lifestyle`,
    "description": `Browse our curated collection of ${category} products`,
    "url": `https://yucalifestyle.com/category/${category.toLowerCase()}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": products.length,
      "itemListElement": products.slice(0, 10).map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name,
          "url": `https://yucalifestyle.com/product/${product.id}`,
          "image": product.image,
          "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "INR"
          }
        }
      }))
    }
  };
};

// Review Schema Generator
export const generateReviewSchema = (product: any, reviews: any[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.userName
      },
      "datePublished": review.createdAt,
      "reviewBody": review.comment,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": 5
      }
    }))
  };
};

// Article/Blog Schema Generator
export const generateArticleSchema = (article: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": article.image,
    "datePublished": article.datePublished,
    "dateModified": article.dateModified || article.datePublished,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "YUCA Lifestyle",
      "logo": {
        "@type": "ImageObject",
        "url": "https://yucalifestyle.com/src/assets/logo.jpg"
      }
    }
  };
};

// Local Business Schema (for contact/about pages)
export const generateLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "YUCA Lifestyle",
    "image": "https://yucalifestyle.com/src/assets/logo.jpg",
    "url": "https://yucalifestyle.com",
    "telephone": "+91-XXXXXXXXXX",
    "priceRange": "₹₹₹",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "28.6139",
      "longitude": "77.2090"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  };
};
