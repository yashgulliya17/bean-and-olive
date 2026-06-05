import { Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Hero from "./sections/Hero.jsx";
import Menu from "./pages/Menu.jsx";
import Contact from "./pages/Contact.jsx";
import Events from "./pages/Events.jsx";
import Gallery from "./pages/Gallery.jsx";

export default function App() {
  return (
    <div className="bg-white text-black min-h-screen">
      <Helmet>
        <title>Bean & Olive | Café in Thunder Bay</title>
        <meta
          name="description"
          content="Bean & Olive is a modern café in Thunder Bay serving specialty coffee, brunch, and curated events."
        />
        <meta
          name="keywords"
          content="Thunder Bay café, coffee shop Thunder Bay, brunch, events café, Bean and Olive"
        />
        {/* SEO Enhancements */}
        <meta property="og:title" content="Bean & Olive | Coffee, Brunch & Cocktail Bar in Thunder Bay" />
        <meta property="og:description" content="Bean & Olive is a modern café in Thunder Bay serving specialty coffee, brunch, cocktails, and curated events." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://beanandolive.com/" />
        <meta property="og:image" content="https://beanandolive.com/logo-bean.png" />
        <meta property="og:site_name" content="Bean & Olive" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bean & Olive | Coffee, Brunch & Cocktail Bar in Thunder Bay" />
        <meta name="twitter:description" content="Modern café in Thunder Bay serving specialty coffee, brunch, cocktails, and events." />
        <meta name="twitter:image" content="https://beanandolive.com/logo-bean.png" />
        {/* Structured Data JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CafeOrCoffeeShop",
            "name": "Bean & Olive",
            "url": "https://beanandolive.com/",
            "image": "https://beanandolive.com/logo-bean.png",
            "description":
              "Bean & Olive is a modern café in Thunder Bay serving specialty coffee, brunch, cocktails, and curated events.",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "1725 Hwy 61",
              "addressLocality": "Thunder Bay",
              "addressRegion": "ON",
              "postalCode": "P7J 1G3",
              "addressCountry": "CA"
            },
            "telephone": "+1 807-577-2326",
            "sameAs": [
              "https://www.instagram.com/bean_andolive",
              "https://www.facebook.com/profile.php?id=100092549703670",
              "https://www.tiktok.com/@beanandolive1?_r=1&_t=ZS-96p0Hi2we5X"
            ]
          })}
        </script>
      </Helmet>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}
