import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: object;
}

export function SEO({
  title = 'YUCA Lifestyle - Luxury Handcrafted Home Decor & Artisanal Products',
  description = "Discover YUCA Lifestyle's exclusive collection of handcrafted artisanal home decor, sustainable luxury products, and eco-friendly lifestyle essentials. Shop premium coconut wood cutlery, enamel bowls, tea sets, and more.",
  keywords = 'luxury home decor, handcrafted products, artisanal lifestyle, sustainable luxury, eco-friendly home goods',
  image = 'https://yucalifestyle.com/src/assets/logo.jpg',
  url = 'https://yucalifestyle.com',
  type = 'website',
  schema
}: SEOProps) {
  const siteTitle = title.includes('YUCA') ? title : `${title} | YUCA Lifestyle`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

export default SEO;
