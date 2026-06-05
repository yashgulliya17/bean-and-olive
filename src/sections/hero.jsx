import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo-bean.png";
import { Helmet } from "react-helmet-async";

const NAV_LINKS = [
  { name: "HOME", path: "/" },
  { name: "MENU", path: "/menu" },
  { name: "GALLERY", path: "/gallery" },
  { name: "EVENTS", path: "/events" },
  { name: "CONTACT", path: "/contact" },
];

const MENU_HIGHLIGHTS = [
  {
    category: "STARTERS",
    items: [
      {
        name: "Whipped Feta & Honey",
        desc: "House-made pita, chili flakes, wildflower honey",
        price: "$14",
      },
      {
        name: "Burrata & Heirloom",
        desc: "Tomatoes, basil oil, flaked sea salt, crostini",
        price: "$16",
      },
      {
        name: "Marinated Olives",
        desc: "Castelvetrano, Kalamata, herbs, orange zest",
        price: "$11",
      },
    ],
  },
  {
    category: "MAINS",
    items: [
      {
        name: "Saffron Branzino",
        desc: "Lemon caper butter, roasted fennel, harissa aioli",
        price: "$38",
      },
      {
        name: "Lamb Ragù Pappardelle",
        desc: "Slow-braised lamb, fresh pasta, gremolata",
        price: "$34",
      },
      {
        name: "Charred Cauliflower",
        desc: "Chermoula, pomegranate, toasted pine nuts",
        price: "$26",
      },
    ],
  },
  {
    category: "DESSERTS",
    items: [
      {
        name: "Olive Oil Cake",
        desc: "Blood orange curd, crème fraîche, pistachios",
        price: "$12",
      },
      {
        name: "Baklava Tart",
        desc: "Walnut frangipane, rose water glaze, sea salt",
        price: "$13",
      },
      {
        name: "Affogato",
        desc: "Double espresso, house-made vanilla gelato",
        price: "$10",
      },
    ],
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Really impressed with the breakfast—nothing overcomplicated, just fresh, tasty food that hits the spot.",
    author: "Yash G.",
    stars: 5,
  },
  {
    quote:
      "What makes this place special is the atmosphere—warm lighting, calm music, and staff who make you feel genuinely welcome.",
    author: "Ava B.",
    stars: 5,
  },
  {
    quote:
      "Our private gathering was handled beautifully. Elegant ambience and smooth service made for a seamless evening.",
    author: "Layla L.",
    stars: 5,
  },
];

const FEATURES = [
  {
    icon: "☕",
    title: "Specialty Coffee",
    desc: "Single-origin espresso & handcrafted brews",
  },
  { icon: "🥐", title: "Artisan Snacks", desc: "Light bites & café treats" },
  {
    icon: "🔥",
    title: "Barista Experience",
    desc: "Live hand-crafted coffee brewing",
  },
  {
    icon: "🌿",
    title: "Cozy Atmosphere",
    desc: "Warm, relaxed café experience",
  },
];

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1l1.85 3.75L14 5.58l-3 2.93.71 4.12L8 10.5l-3.71 2.13.71-4.12-3-2.93 4.15-.83z" />
    </svg>
  );
}

function OliveBranchIcon({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 44 C24 44 10 30 10 18 C10 11 16 6 24 6"
        stroke="#C8A96E"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse
        cx="16"
        cy="14"
        rx="5"
        ry="3"
        transform="rotate(-30 16 14)"
        fill="#8B9E6E"
        opacity="0.9"
      />
      <ellipse
        cx="12"
        cy="22"
        rx="5"
        ry="3"
        transform="rotate(-20 12 22)"
        fill="#8B9E6E"
        opacity="0.9"
      />
      <ellipse
        cx="14"
        cy="30"
        rx="5"
        ry="3"
        transform="rotate(-10 14 30)"
        fill="#8B9E6E"
        opacity="0.85"
      />
      <circle cx="10" cy="19" r="2.5" fill="#3D5A3E" />
      <circle cx="13" cy="27" r="2.5" fill="#3D5A3E" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10zm-5 3.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm0 2A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5zM17.5 6a1 1 0 1 0 1 1 1 1 0 0 0-1-1z" />
    </svg>
  );
}

function FacebookIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.5 9.95v-7.05H8v-2.9h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.75-1.6 1.5v1.8H17l-.4 2.9h-2.3v7.05A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function TikTokIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2h3a5 5 0 0 0 5 5v3a8 8 0 0 1-5-1.7V15a6 6 0 1 1-6-6c.5 0 1 .05 1.5.15V12a3 3 0 1 0 2.5 3V2z" />
    </svg>
  );
}

export default function BeanAndOlive() {
  const [heroInView, setHeroInView] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false,
  );
  const heroLoaded = true;
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!heroRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroInView(entry.isIntersecting);
      },
      { threshold: 0.6 },
    );

    observer.observe(heroRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const t = TESTIMONIALS[testimonialIdx];

  return (
    <div style={styles.root}>
      <Helmet>
        <title>
          Bean & Olive | Coffee Bar & Evening Cocktails in Thunder Bay
        </title>
        <meta
          name="description"
          content="Bean & Olive is a modern coffee bar in Thunder Bay offering specialty coffee by day and craft cocktails by night. Visit us for a warm, cozy café experience."
        />
        <meta
          name="keywords"
          content="coffee shop Thunder Bay, café Thunder Bay, cocktail bar Thunder Bay, espresso Thunder Bay, brunch café Ontario, Bean and Olive"
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://beanandolive.com/" />
        <meta
          property="og:title"
          content="Bean & Olive | Coffee & Cocktail Bar"
        />
        <meta
          property="og:description"
          content="A cozy coffee bar by day and cocktail lounge by night in Thunder Bay."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://beanandolive.com/" />
        <meta
          property="og:image"
          content="https://beanandolive.com/logo-bean.png"
        />
        <meta property="og:site_name" content="Bean & Olive" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Bean & Olive | Coffee & Cocktail Bar in Thunder Bay"
        />
        <meta
          name="twitter:description"
          content="Bean & Olive is a modern coffee bar by day and cocktail lounge by night in Thunder Bay."
        />
        <meta
          name="twitter:image"
          content="https://beanandolive.com/logo-bean.png"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CafeOrCoffeeShop",
            name: "Bean & Olive",
            url: "https://beanandolive.com/",
            image: "https://beanandolive.com/logo-bean.png",
            description:
              "Bean & Olive is a modern coffee bar by day and cocktail lounge by night in Thunder Bay.",
            address: {
              "@type": "PostalAddress",
              streetAddress: "1725 Hwy 61",
              addressLocality: "Thunder Bay",
              addressRegion: "ON",
              postalCode: "P7J 1G3",
              addressCountry: "CA",
            },
            telephone: "+1 807-577-2326",
            sameAs: [
              "https://www.instagram.com/bean_andolive",
              "https://www.facebook.com/profile.php?id=100092549703670",
              "https://www.tiktok.com/@beanandolive1?_r=1&_t=ZS-96p0Hi2we5X",
            ],
          })}
        </script>
      </Helmet>

      {/* ── NAV ── */}
      <nav
        style={{
          ...styles.nav,
          ...(!heroInView ? styles.navScrolled : {}),
          padding: isMobile ? "1rem 1.2rem" : "1.25rem 3rem",
        }}
      >
        <div style={styles.navLogo}>
          <img src={logo} alt="Bean & Olive Logo" style={styles.navLogoImage} />
          <span
            style={{
              ...styles.navLogoText,
              color: !heroInView ? "#000000" : "#1f1a14",
            }}
          >
            Bean &amp; Olive
          </span>
        </div>
        <ul style={{ ...styles.navLinks, display: isMobile ? "none" : "flex" }}>
          {NAV_LINKS.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                style={{
                  ...styles.navLink,
                  color: !heroInView ? "#000000" : "rgba(20,16,12,0.72)",
                  textShadow: !heroInView
                    ? "none"
                    : "0 1px 8px rgba(255,255,255,0.35)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#000000";
                  e.currentTarget.style.letterSpacing = "3px";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(0,0,0,0.6)";
                  e.currentTarget.style.letterSpacing = "2px";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <button
          style={{ ...styles.mobileMenu, display: isMobile ? "flex" : "none" }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: "22px",
                height: "1.5px",
                background: "#000",
                transition: "transform 0.3s, opacity 0.3s",
                ...(menuOpen && i === 0
                  ? { transform: "translateY(7px) rotate(45deg)" }
                  : {}),
                ...(menuOpen && i === 1 ? { opacity: 0 } : {}),
                ...(menuOpen && i === 2
                  ? { transform: "translateY(-7px) rotate(-45deg)" }
                  : {}),
              }}
            />
          ))}
        </button>
      </nav>

      {/* Mobile Nav Drawer */}
      {menuOpen && (
        <div style={styles.mobileDrawer}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              style={styles.mobileNavLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}

      {/* ── HERO ── */}
      <motion.section
        style={{
          ...styles.hero,
          height: isMobile ? "100svh" : "100vh",
          minHeight: isMobile ? "600px" : "680px",
        }}
        ref={heroRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div style={styles.heroBg} />
        <div style={styles.heroOverlay} />

        {/* String lights */}
        <div style={styles.lightsRow}>
          {Array.from({ length: isMobile ? 8 : 14 }).map((_, i, arr) => (
            <div
              key={i}
              style={{
                ...styles.lightBulb,
                animationDelay: `${i * 0.3}s`,
                left: `${(i / (arr.length - 1)) * 96 + 2}%`,
              }}
            />
          ))}
        </div>

        <div
          style={{
            ...styles.heroContent,
            padding: isMobile ? "0 1.2rem" : "0 1.5rem",
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 1.1s ease 0.2s, transform 1.1s ease 0.2s",
          }}
        >
          <p style={styles.heroEyebrow}>EST. 2023 · COFFEE &amp; BAR</p>
          <h1 style={styles.heroHeadline}>
            <span style={styles.heroLine1}>Where Daytime Coffee</span>
            <span style={styles.heroLine2}>Meets Evening Martinis</span>
          </h1>
          <p
            style={{
              ...styles.heroSub,
              fontSize: isMobile ? "0.82rem" : "0.9rem",
            }}
          >
            Slow mornings with handcrafted coffee,
            <br />
            vibrant evenings with cocktails and conversation.
          </p>
          <div
            style={{
              ...styles.heroCtas,
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "0.85rem" : "1rem",
              width: isMobile ? "100%" : "auto",
            }}
          >
            <Link
              to="/menu"
              style={{
                ...styles.ctaPrimary,
                padding: isMobile ? "1rem 0" : "0.9rem 2.2rem",
                fontSize: isMobile ? "0.78rem" : "0.72rem",
                width: isMobile ? "100%" : "auto",
                textAlign: "center",
                textDecoration: "none",
                display: "block",
              }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.18)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              EXPLORE OUR MENU
            </Link>
            <Link
              to="/contact"
              style={{
                ...styles.ctaSecondary,
                padding: isMobile ? "1rem 0" : "0.9rem 2.2rem",
                fontSize: isMobile ? "0.78rem" : "0.72rem",
                width: isMobile ? "100%" : "auto",
                textAlign: "center",
                textDecoration: "none",
                display: "block",
              }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                e.currentTarget.style.boxShadow =
                  "0 0 10px rgba(255, 200, 60, 0.6), 0 0 22px rgba(255, 170, 0, 0.35)";
                e.currentTarget.style.borderColor = "rgba(255, 200, 60, 0.9)";
                e.currentTarget.style.transform =
                  "translateY(-2px) scale(1.02)";
                e.currentTarget.style.textShadow =
                  "0 0 8px rgba(255, 200, 60, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "#000000";
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.textShadow = "none";
              }}
            >
              MAKE A RESERVATION
            </Link>
          </div>
          <div
            style={{
              ...styles.heroInfo,
              marginTop: isMobile ? "1.2rem" : "1.5rem",
            }}
          >
            <p
              style={{
                ...styles.heroInfoText,
                fontSize: isMobile ? "0.72rem" : "0.78rem",
              }}
            >
              ✨ We regularly host curated events — check out our{" "}
              <Link
                to="/events"
                style={{ color: "#000", textDecoration: "underline" }}
              >
                Events
              </Link>{" "}
              page for more info.
            </p>
            <p
              style={{
                ...styles.heroInfoText,
                fontSize: isMobile ? "0.72rem" : "0.78rem",
              }}
            >
              🎉 We also do private parties.{" "}
              <Link
                to="/contact"
                style={{ color: "#000", textDecoration: "underline" }}
              >
                Contact us
              </Link>{" "}
              for bookings and details.
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={styles.scrollIndicator}>
          <div style={styles.scrollDot} />
        </div>
      </motion.section>

      {/* ── FEATURES STRIP ── */}
      <section
        style={{
          ...styles.featuresGrid,
          padding: isMobile ? "1.5rem 1rem" : "2rem 2rem",
          gap: isMobile ? "0.8rem" : "1.5rem",
        }}
      >
        {FEATURES.map((f) => (
          <div
            key={f.title}
            style={{
              ...styles.featureCard,
              flex: isMobile ? "1 1 calc(50% - 0.4rem)" : "1 1 240px",
              minWidth: isMobile ? "140px" : "240px",
              padding: isMobile ? "1rem" : "1.2rem 2rem",
              gap: isMobile ? "0.6rem" : "1rem",
            }}
          >
            <div
              style={{
                ...styles.featureIcon,
                fontSize: isMobile ? "1.2rem" : "1.4rem",
              }}
            >
              {f.icon}
            </div>
            <div>
              <h4
                style={{
                  ...styles.featureTitle,
                  fontSize: isMobile ? "0.72rem" : "0.8rem",
                }}
              >
                {f.title}
              </h4>
              <p
                style={{
                  ...styles.featureDesc,
                  fontSize: isMobile ? "0.65rem" : "0.72rem",
                }}
              >
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* ── ABOUT ── */}
      <motion.section
        style={{
          ...styles.about,
          padding: isMobile ? "3.5rem 1.4rem" : "6rem 3rem",
        }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div
          style={{
            ...styles.aboutInner,
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "2.5rem" : "5rem",
          }}
        >
          <div style={styles.aboutText}>
            <span style={styles.sectionEyebrow}>OUR STORY</span>
            <h2
              style={{
                ...styles.sectionHeading,
                fontSize: isMobile ? "1.9rem" : "clamp(2rem, 3.5vw, 3rem)",
              }}
            >
              From Morning Brews
              <br />
              To Evening Pours
            </h2>
            <p style={styles.bodyText}>
              Bean &amp; Olive is a locally family-owned coffee bar in Thunder
              Bay, opened in 2023. Our café is built around community, craft
              coffee, and warm hospitality.
            </p>
            <p style={styles.bodyText}>
              Every brew is crafted with intention. Every martini is mixed with
              care. Every night ends a little warmer than it began.
            </p>
            <Link
              to="/gallery#staff"
              style={styles.textLink}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setTimeout(() => {
                  document
                    .getElementById("staff")
                    ?.scrollIntoView({ behavior: "smooth" });
                }, 150);
              }}
            >
              MEET THE TEAM →
            </Link>
          </div>
          <div
            style={{
              ...styles.aboutVisual,
              flex: isMobile ? "none" : "1 1 300px",
              width: isMobile ? "100%" : "auto",
            }}
          >
            <div style={styles.aboutCard}>
              <div style={styles.aboutCardInner}>
                <OliveBranchIcon size={48} />
                <p style={styles.aboutCardQuote}>"Coffee is a hug in a mug."</p>
                <p style={styles.aboutCardAuthor}>— Mark McLoed</p>
              </div>
            </div>
            <div style={styles.aboutAccent} />
          </div>
        </div>
      </motion.section>

      {/* ── TESTIMONIALS ── */}
      <motion.section
        style={{
          ...styles.testimonials,
          padding: isMobile ? "3.5rem 1.4rem" : "5rem 3rem",
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span style={styles.sectionEyebrow}>GUEST VOICES</span>
        <div style={styles.testimonialBox}>
          <div style={styles.testimonialQuoteMark}>"</div>
          <p
            style={{
              ...styles.testimonialText,
              fontSize: isMobile ? "1.25rem" : "1.6rem",
            }}
          >
            {t.quote}
          </p>
          <div style={styles.testimonialStars}>
            {Array.from({ length: t.stars }).map((_, i) => (
              <StarIcon key={i} />
            ))}
          </div>
          <p style={styles.testimonialAuthor}>— {t.author}</p>
        </div>
        <div style={styles.testimonialDots}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              style={{
                ...styles.dot,
                ...(i === testimonialIdx ? styles.dotActive : {}),
              }}
              onClick={() => setTestimonialIdx(i)}
            />
          ))}
        </div>
      </motion.section>

      {/* ── LOCATION / MAP ── */}
      <motion.section
        style={{
          ...styles.resBanner,
          padding: isMobile ? "3rem 1.2rem" : "5rem 3rem",
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div style={styles.resBannerInner}>
          <div style={styles.resBannerLights}>
            {Array.from({ length: isMobile ? 8 : 12 }).map((_, i, arr) => (
              <div
                key={i}
                style={{
                  ...styles.resLightBulb,
                  animationDelay: `${i * 0.25}s`,
                  left: `${(i / (arr.length - 1)) * 96 + 2}%`,
                }}
              />
            ))}
          </div>
          <h2
            style={{
              ...styles.resBannerTitle,
              fontSize: isMobile ? "2rem" : "2.8rem",
            }}
          >
            Find Us Here
          </h2>
          <p style={styles.resBannerSub}>
            Visit us for coffee, cocktails, and curated dining experience
          </p>
          <div
            style={{
              width: "100%",
              marginTop: "1.5rem",
              padding: isMobile ? "0.6rem" : "1rem",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(0,0,0,0.12)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2652.5615748005844!2d-89.34322222351861!3d48.33051027126546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4d58e163744fb94f%3A0x36e801bc1640f501!2sBean%20and%20Olive!5e0!3m2!1sen!2sus!4v1779682689299!5m2!1sen!2sus"
              width="100%"
              height={isMobile ? "260px" : "400px"}
              style={{ border: 0, borderRadius: "14px", display: "block" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href="https://www.google.com/maps?q=48.33051027126546,-89.34322222351861"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: "1rem",
                padding: "0.8rem 1.6rem",
                border: "1px solid #000",
                borderRadius: "999px",
                fontSize: "0.75rem",
                letterSpacing: "2px",
                textDecoration: "none",
                color: "#000",
                fontFamily: "'Josefin Sans', sans-serif",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#000";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#000";
              }}
            >
              OPEN IN GOOGLE MAPS →
            </a>
          </div>
        </div>
      </motion.section>

      {/* ── CONTACT SECTION ── */}
      <motion.section
        id="contact"
        style={{
          ...styles.contact,
          padding: isMobile ? "3.5rem 1.4rem" : "5rem 3rem",
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div style={styles.contactInner}>
          <span style={styles.sectionEyebrow}>CONTACT</span>
          <h2
            style={{
              ...styles.sectionHeading,
              fontSize: isMobile ? "1.9rem" : "clamp(2rem, 3.5vw, 3rem)",
            }}
          >
            Get in Touch
          </h2>
          <p style={styles.contactText}>📧 beanandolive@hotmail.com</p>
          <p style={styles.contactText}>📞 +1 807-577-2326</p>
          <p style={styles.contactSub}>
            We also host private parties. Contact us for more info and bookings.
          </p>
        </div>
      </motion.section>

      {/* ── SOCIAL SECTION ── */}
      <motion.section
        style={{
          ...styles.socialSection,
          padding: isMobile ? "3.5rem 1.4rem" : "5rem 3rem",
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span style={styles.sectionEyebrow}>FOLLOW US</span>
        <h2
          style={{
            ...styles.sectionHeading,
            fontSize: isMobile ? "1.9rem" : "clamp(2rem, 3.5vw, 3rem)",
          }}
        >
          Stay Connected
        </h2>
        <p
          style={{
            ...styles.socialText,
            fontSize: isMobile ? "0.8rem" : "0.85rem",
          }}
        >
          Follow our journey for coffee creations, signature cocktails, special
          events, behind-the-scenes moments, and everything happening at Bean
          &amp; Olive.
        </p>
        <div
          style={{
            ...styles.socialLinks,
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
            gap: isMobile ? "0.75rem" : "1rem",
          }}
        >
          {[
            {
              href: "https://www.instagram.com/bean_andolive",
              icon: <InstagramIcon size={16} />,
              label: "INSTAGRAM",
            },
            {
              href: "https://www.facebook.com/profile.php?id=100092549703670",
              icon: <FacebookIcon size={16} />,
              label: "FACEBOOK",
            },
            {
              href: "https://www.tiktok.com/@beanandolive1?_r=1&_t=ZS-96p0Hi2we5X",
              icon: <TikTokIcon size={16} />,
              label: "TIKTOK",
            },
          ].map(({ href, icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...styles.socialButton,
                minWidth: isMobile ? "unset" : "180px",
                width: isMobile ? "100%" : "auto",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(0,0,0,0.12)";
                e.currentTarget.style.background = "#000000";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#000000";
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {icon}
                {label}
              </span>
            </a>
          ))}
        </div>
      </motion.section>

      {/* ── FOOTER ── */}
      <motion.footer
        style={{
          ...styles.footer,
          padding: isMobile ? "3rem 1.4rem 2rem" : "4rem 3rem 2rem",
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div
          style={{
            ...styles.footerTop,
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "2rem" : "4rem",
          }}
        >
          <div style={styles.footerBrand}>
            <img
              src={logo}
              alt="Bean & Olive Logo"
              style={{ height: "56px", width: "auto", objectFit: "contain" }}
            />
            <span style={styles.footerLogoText}>Bean &amp; Olive</span>
            <p style={styles.footerTagline}>Coffee &amp; Bar · Est. 2023</p>
          </div>
          <div style={styles.footerLinks}>
            <h4 style={styles.footerHeading}>Navigate</h4>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.name}
                to={l.path}
                style={styles.footerLink}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#000000";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.borderBottomColor = "#000000";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(0,0,0,0.6)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderBottomColor = "transparent";
                }}
              >
                {l.name}
              </Link>
            ))}
          </div>
          <div style={styles.footerContact}>
            <h4 style={styles.footerHeading}>Find Us</h4>
            <p style={styles.footerInfo}>
              1725 Hwy 61, Thunder Bay,
              <br />
              ON P7J 1G3, Canada
            </p>
            <p style={styles.footerInfo}>+1 807-577-2326</p>
            <p style={styles.footerInfo}>beanandolive@hotmail.com</p>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p style={styles.footerCopy}>© 2026 Bean &amp; Olive.</p>
        </div>
      </motion.footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Josefin+Sans:wght@300;400;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body, html, #root {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          background: #ffffff;
          overflow-x: hidden;
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 0.88; }
          94% { opacity: 1; }
          96% { opacity: 0.92; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(10px); opacity: 0.4; }
        }
        @keyframes neonPulse {
          0%, 100% { box-shadow: 0 0 10px rgba(255,200,60,0.25), 0 0 22px rgba(255,170,0,0.15); }
          50% { box-shadow: 0 0 16px rgba(255,200,60,0.4), 0 0 32px rgba(255,170,0,0.25); }
        }
        a, button { -webkit-tap-highlight-color: transparent; }
        * { -webkit-overflow-scrolling: touch; }
      `}</style>
    </div>
  );
}

/* ─── STYLES ────────────────────────────────────────────────────────────── */
const styles = {
  root: {
    fontFamily: "'Josefin Sans', sans-serif",
    background: "#ffffff",
    color: "#000000",
    overflowX: "hidden",
  },

  // NAV — only change: navScrolled now uses solid white like all other pages
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "all 0.4s ease",
    background:
      "linear-gradient(to bottom, rgba(111,78,55,0.22), rgba(111,78,55,0.05), transparent)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  navScrolled: {
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(0,0,0,0.15)",
    boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
  },
  navLogo: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    cursor: "pointer",
  },
  navLogoImage: {
    height: "34px",
    width: "auto",
    objectFit: "contain",
    display: "block",
  },
  navLogoText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#1f1a14",
    letterSpacing: "0.5px",
  },
  navLinks: {
    gap: "2.5rem",
    listStyle: "none",
  },
  navLink: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.72rem",
    letterSpacing: "2px",
    fontWeight: 600,
    color: "rgba(20,16,12,0.72)",
    textDecoration: "none",
    position: "relative",
    paddingBottom: "4px",
    textShadow: "0 1px 8px rgba(255,255,255,0.35)",
    transition:
      "color 0.3s ease, letter-spacing 0.3s ease, transform 0.3s ease",
  },
  mobileMenu: {
    flexDirection: "column",
    gap: "5px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px",
  },
  mobileDrawer: {
    position: "fixed",
    top: "60px",
    left: 0,
    right: 0,
    background: "rgba(10,7,2,0.97)",
    zIndex: 99,
    display: "flex",
    flexDirection: "column",
    padding: "1.5rem 2rem",
    gap: "1.4rem",
    borderBottom: "1px solid rgba(200,169,110,0.2)",
  },
  mobileNavLink: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.9rem",
    letterSpacing: "2.5px",
    color: "#F5ECD7",
    textDecoration: "none",
    padding: "0.3rem 0",
  },

  // HERO
  hero: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  heroBg: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse at 30% 40%, #c4a484 0%, #a47551 45%, #6f4e37 100%)",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.4) 100%)",
  },
  lightsRow: {
    position: "absolute",
    top: "8%",
    left: 0,
    right: 0,
    height: "40px",
  },
  lightBulb: {
    position: "absolute",
    width: "8px",
    height: "12px",
    background:
      "radial-gradient(circle, #FFE680 30%, #FFAA00 70%, transparent 100%)",
    borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
    boxShadow:
      "0 0 18px 6px rgba(255,200,60,0.35), 0 0 4px 1px rgba(255,220,100,0.7)",
    animation: "flicker 3s ease-in-out infinite",
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    maxWidth: "820px",
    width: "100%",
  },
  heroEyebrow: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.7rem",
    letterSpacing: "4px",
    color: "#000000",
    marginBottom: "1.5rem",
    opacity: 0.9,
  },
  heroHeadline: {
    display: "flex",
    flexDirection: "column",
    gap: "0.2rem",
    marginBottom: "1.4rem",
  },
  heroLine1: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(2rem, 8vw, 5rem)",
    fontWeight: 300,
    color: "#000000",
    letterSpacing: "1px",
    lineHeight: 1.1,
    fontStyle: "italic",
  },
  heroLine2: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(2rem, 8vw, 5rem)",
    fontWeight: 700,
    color: "#000000",
    letterSpacing: "-0.5px",
    lineHeight: 1.1,
  },
  heroSub: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontWeight: 300,
    letterSpacing: "0.5px",
    color: "rgba(0,0,0,0.7)",
    lineHeight: 1.8,
    marginBottom: "2rem",
  },
  heroCtas: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  heroInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
  },
  heroInfoText: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontWeight: 300,
    color: "rgba(0,0,0,0.75)",
    letterSpacing: "0.3px",
    lineHeight: 1.6,
  },
  ctaPrimary: {
    background: "transparent",
    border: "1.5px solid #000000",
    color: "#000000",
    fontFamily: "'Josefin Sans', sans-serif",
    letterSpacing: "2px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.3s",
  },
  ctaSecondary: {
    background: "transparent",
    border: "1.5px solid rgba(255, 200, 60, 0.9)",
    color: "#000000",
    fontFamily: "'Josefin Sans', sans-serif",
    letterSpacing: "2px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.35s ease",
    boxShadow:
      "0 0 10px rgba(255, 200, 60, 0.25), 0 0 22px rgba(255, 170, 0, 0.15)",
    textShadow: "0 0 6px rgba(255, 200, 60, 0.25)",
    animation: "neonPulse 3.2s ease-in-out infinite",
    backdropFilter: "blur(2px)",
  },
  scrollIndicator: {
    position: "absolute",
    bottom: "2.5rem",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 2,
  },
  scrollDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#000000",
    animation: "bounce 2s ease-in-out infinite",
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
  },

  // FEATURES STRIP
  featuresGrid: {
    background: "#ffffff",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  featureCard: {
    display: "flex",
    alignItems: "center",
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
  },
  featureIcon: {},
  featureTitle: {
    fontFamily: "'Josefin Sans', sans-serif",
    letterSpacing: "1.5px",
    fontWeight: 600,
    color: "#000000",
    marginBottom: "0.2rem",
  },
  featureDesc: {
    fontFamily: "'Josefin Sans', sans-serif",
    color: "rgba(0,0,0,0.6)",
    fontWeight: 300,
  },

  // ABOUT
  about: { background: "#ffffff" },
  aboutInner: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  aboutText: { flex: "1 1 400px" },
  sectionEyebrow: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.65rem",
    letterSpacing: "4px",
    color: "#000000",
    display: "block",
    marginBottom: "1rem",
  },
  sectionHeading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 700,
    color: "#000000",
    lineHeight: 1.2,
    marginBottom: "1.5rem",
  },
  bodyText: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.88rem",
    lineHeight: 1.9,
    color: "#000000",
    fontWeight: 300,
    marginBottom: "1rem",
    letterSpacing: "0.2px",
  },
  textLink: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.72rem",
    letterSpacing: "2px",
    fontWeight: 600,
    color: "#000000",
    textDecoration: "none",
    borderBottom: "1px solid #000000",
    paddingBottom: "2px",
  },
  aboutVisual: { position: "relative" },
  aboutCard: {
    background: "#f5f5f5",
    padding: "2.5rem",
    position: "relative",
    zIndex: 1,
  },
  aboutCardInner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "1.2rem",
  },
  aboutCardQuote: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "1.3rem",
    fontStyle: "italic",
    fontWeight: 300,
    color: "#000000",
    lineHeight: 1.6,
  },
  aboutCardAuthor: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.7rem",
    letterSpacing: "2px",
    color: "#000000",
  },
  aboutAccent: {
    position: "absolute",
    bottom: "-16px",
    right: "-16px",
    width: "100%",
    height: "100%",
    border: "2px solid #000000",
    zIndex: 0,
  },

  // TESTIMONIALS
  testimonials: {
    background: "#ffffff",
    textAlign: "center",
  },
  testimonialBox: {
    maxWidth: "680px",
    margin: "2rem auto",
    position: "relative",
    padding: "0 1rem",
  },
  testimonialQuoteMark: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "8rem",
    lineHeight: 0.8,
    color: "rgba(0,0,0,0.15)",
    position: "absolute",
    top: "-1rem",
    left: "-1rem",
  },
  testimonialText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: "italic",
    fontWeight: 300,
    color: "#000000",
    lineHeight: 1.6,
    marginBottom: "1.5rem",
    position: "relative",
    zIndex: 1,
  },
  testimonialStars: {
    display: "flex",
    justifyContent: "center",
    gap: "0.3rem",
    color: "#000000",
    marginBottom: "0.8rem",
  },
  testimonialAuthor: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.72rem",
    letterSpacing: "2px",
    color: "rgba(0,0,0,0.6)",
  },
  testimonialDots: {
    display: "flex",
    justifyContent: "center",
    gap: "0.6rem",
    marginTop: "2rem",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "rgba(0,0,0,0.2)",
    border: "none",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  dotActive: { background: "#000000" },

  // RESERVATION / MAP BANNER
  resBanner: {
    background: "#ffffff",
    borderTop: "1px solid rgba(0,0,0,0.15)",
    borderBottom: "1px solid rgba(0,0,0,0.15)",
  },
  resBannerInner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    maxWidth: "600px",
    margin: "0 auto",
    textAlign: "center",
  },
  resBannerTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 700,
    color: "#000000",
  },
  resBannerSub: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.8rem",
    letterSpacing: "1.5px",
    color: "rgba(0,0,0,0.6)",
    fontWeight: 300,
    marginBottom: "0.5rem",
  },
  resBannerLights: {
    position: "relative",
    width: "100%",
    height: "30px",
    marginBottom: "1rem",
  },
  resLightBulb: {
    position: "absolute",
    width: "6px",
    height: "10px",
    background:
      "radial-gradient(circle, #FFE680 30%, #FFAA00 70%, transparent 100%)",
    borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
    boxShadow:
      "0 0 14px 5px rgba(255,200,60,0.3), 0 0 3px 1px rgba(255,220,100,0.6)",
    animation: "flicker 3s ease-in-out infinite",
  },

  // CONTACT
  contact: {
    background: "#ffffff",
    textAlign: "center",
  },
  contactInner: {
    maxWidth: "700px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
  },
  contactText: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.9rem",
    letterSpacing: "0.5px",
    color: "#000000",
    fontWeight: 400,
  },
  contactSub: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.78rem",
    color: "rgba(0,0,0,0.6)",
    marginTop: "0.8rem",
    lineHeight: 1.6,
  },

  // SOCIAL
  socialSection: {
    background: "#ffffff",
    textAlign: "center",
    borderTop: "1px solid rgba(0,0,0,0.08)",
  },
  socialText: {
    maxWidth: "700px",
    margin: "1rem auto 2rem",
    fontFamily: "'Josefin Sans', sans-serif",
    lineHeight: 1.8,
    color: "rgba(0,0,0,0.65)",
  },
  socialLinks: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  socialButton: {
    padding: "0.9rem 1.8rem",
    border: "1px solid #000000",
    borderRadius: "999px",
    textDecoration: "none",
    color: "#000000",
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.72rem",
    letterSpacing: "2px",
    fontWeight: 600,
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: "translateY(0)",
    boxShadow: "none",
  },

  // FOOTER
  footer: { background: "#ffffff" },
  footerTop: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    flexWrap: "wrap",
    marginBottom: "3rem",
    paddingBottom: "3rem",
    borderBottom: "1px solid rgba(0,0,0,0.15)",
  },
  footerBrand: {
    flex: "1 1 200px",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  footerLogoText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "1.6rem",
    fontWeight: 600,
    color: "#000000",
  },
  footerTagline: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.7rem",
    letterSpacing: "2px",
    color: "rgba(0,0,0,0.5)",
    fontWeight: 300,
  },
  footerLinks: {
    flex: "1 1 160px",
    display: "flex",
    flexDirection: "column",
    gap: "0.7rem",
  },
  footerContact: {
    flex: "1 1 200px",
    display: "flex",
    flexDirection: "column",
    gap: "0.7rem",
  },
  footerHeading: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.65rem",
    letterSpacing: "3px",
    color: "#000000",
    marginBottom: "0.5rem",
  },
  footerLink: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.78rem",
    color: "rgba(0,0,0,0.6)",
    textDecoration: "none",
    letterSpacing: "0.5px",
    fontWeight: 300,
    display: "inline-block",
    paddingBottom: "3px",
    borderBottom: "1px solid transparent",
    transition:
      "color 0.25s ease, transform 0.25s ease, border-bottom-color 0.25s ease",
  },
  footerInfo: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.78rem",
    color: "rgba(0,0,0,0.6)",
    letterSpacing: "0.3px",
    fontWeight: 300,
    lineHeight: 1.7,
  },
  footerBottom: { maxWidth: "1100px", margin: "0 auto", textAlign: "center" },
  footerCopy: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.68rem",
    letterSpacing: "1px",
    color: "rgba(0,0,0,0.4)",
  },
};
