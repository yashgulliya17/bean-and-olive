import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo-bean.png";
import { Helmet } from "react-helmet-async";

// ─────────────────────────────────────────────────────────────────────────────
// 🔧 SETUP: Replace this URL with your Google Sheet's published CSV link.
//    See README at bottom of file for exact steps.
// ─────────────────────────────────────────────────────────────────────────────
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRzDJS0eHlK9dtrBK66qeeHyT4_ccGwAi6W4dE5-FWz4deT2ruGhh2jRxuVXtQbsHqDQlsO8b5TnZmu/pub?gid=0&single=true&output=csv";

// Fallback demo events — shown if the sheet hasn't been set up yet
const DEMO_EVENTS = [
  {
    id: "1",
    title: "Jazz & Martini Night",
    date: "2025-06-06",
    time: "7:00 PM",
    category: "Weekly",
    description:
      "Every Friday evening, join us for live jazz with our signature martini menu. Reservations recommended.",
    tag: "LIVE MUSIC",
    spots: "Limited spots",
  },
  {
    id: "2",
    title: "Latte Art Workshop",
    date: "2025-06-10",
    time: "11:00 AM",
    category: "This Month",
    description:
      "Learn the craft of espresso pouring from our head barista. Take home your own latte art skills.",
    tag: "WORKSHOP",
    spots: "8 spots left",
  },
  {
    id: "3",
    title: "Sunset Cocktail Hour",
    date: "2025-06-14",
    time: "5:30 PM",
    category: "Weekly",
    description:
      "Saturday happy hour — half-price cocktails, charcuterie boards, and the best patio in Thunder Bay.",
    tag: "HAPPY HOUR",
    spots: "Walk-ins welcome",
  },
  {
    id: "4",
    title: "Bean & Olive Summer Market",
    date: "2025-07-05",
    time: "10:00 AM",
    category: "Upcoming",
    description:
      "Local vendors, artisan coffee, live music, and brunch specials. A full day of community and good food.",
    tag: "SPECIAL EVENT",
    spots: "Free entry",
  },
  {
    id: "5",
    title: "Private Wine Tasting",
    date: "2025-07-19",
    time: "6:00 PM",
    category: "Upcoming",
    description:
      "A curated evening of natural wines, paired with small plates from our kitchen. Tickets required.",
    tag: "TASTING",
    spots: "20 spots",
  },
  {
    id: "6",
    title: "Sunday Coffee Ritual",
    date: "2025-06-08",
    time: "9:00 AM",
    category: "Weekly",
    description:
      "Slow Sundays with pour-over flights, pastries, and good conversation. No rush, no noise — just coffee.",
    tag: "WEEKLY",
    spots: "Drop in",
  },
];

function parseCSV(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
  return lines.slice(1).map((line) => {
    const cols = [];
    let cur = "";
    let inQuote = false;
    for (const ch of line) {
      if (ch === '"') {
        inQuote = !inQuote;
      } else if (ch === "," && !inQuote) {
        cols.push(cur.trim());
        cur = "";
      } else {
        cur += ch;
      }
    }
    cols.push(cur.trim());
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = (cols[i] || "").replace(/"/g, "");
    });
    return obj;
  });
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("en-CA", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

const CATEGORY_ORDER = ["Weekly", "This Month", "Upcoming"];

const TAG_COLORS = {
  "LIVE MUSIC": "#C8A96E",
  WORKSHOP: "#8B9E6E",
  "HAPPY HOUR": "#a47551",
  "SPECIAL EVENT": "#6f4e37",
  TASTING: "#9e8b6e",
  WEEKLY: "#6e8b9e",
};

const NAV_LINKS = [
  { name: "HOME", path: "/" },
  { name: "MENU", path: "/menu" },
  { name: "GALLERY", path: "/gallery" },
  { name: "EVENTS", path: "/events" },
  { name: "CONTACT", path: "/contact" },
];

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [scrolled, setScrolled] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // ── Responsive check (mirrors gallery) ──────────────────────────────────
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      if (SHEET_CSV_URL.includes("YOUR_SHEET_ID_HERE")) {
        setEvents(DEMO_EVENTS);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(SHEET_CSV_URL);
        if (!res.ok) throw new Error("Could not load events");
        const text = await res.text();
        const parsed = parseCSV(text);
        const valid = parsed.filter((e) => e.title && e.title.trim() !== "");
        setEvents(valid);
      } catch (err) {
        console.error(err);
        setError("Could not load events. Showing demo events.");
        setEvents(DEMO_EVENTS);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const categories = ["All", ...CATEGORY_ORDER];
  const filtered =
    activeCategory === "All"
      ? events
      : events.filter((e) => e.category === activeCategory);

  const grouped = {};
  CATEGORY_ORDER.forEach((cat) => {
    const items = filtered.filter((e) => e.category === cat);
    if (items.length > 0) grouped[cat] = items;
  });

  return (
    <div style={styles.root}>
      <Helmet>
        <title>Events | Bean &amp; Olive Thunder Bay</title>
        <meta
          name="description"
          content="Discover weekly rituals, workshops, live music, and special events at Bean & Olive in Thunder Bay. Reserve your spot for upcoming experiences."
        />
        <meta
          name="keywords"
          content="Bean and Olive events, Thunder Bay cafe events, live music Thunder Bay, coffee workshops, latte art class, cocktail events"
        />
        <link rel="canonical" href="/events" />
        <meta property="og:title" content="Events | Bean & Olive Thunder Bay" />
        <meta
          property="og:description"
          content="Weekly rituals, workshops, live music, and special events at Bean & Olive."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/events" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      {/* ── NAV ── */}
      <nav
        style={{
          ...styles.nav,
          ...(scrolled ? styles.navScrolled : {}),
          padding: isMobile ? "0.9rem 1.2rem" : "1.25rem 3rem",
        }}
      >
        <div style={styles.navLogo}>
          <img
            src={logo}
            alt="Bean & Olive Logo"
            style={{
              ...styles.navLogoImage,
              height: isMobile ? "28px" : "34px",
            }}
          />
          <span
            style={{
              ...styles.navLogoText,
              fontSize: isMobile ? "1.25rem" : "1.5rem",
            }}
          >
            Bean &amp; Olive
          </span>
        </div>

        {/* Desktop nav */}
        <ul style={{ ...styles.navLinks, display: isMobile ? "none" : "flex" }}>
          {NAV_LINKS.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                style={{
                  ...styles.navLink,
                  ...(link.name === "EVENTS" ? styles.navLinkActive : {}),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#000000";
                  e.currentTarget.style.letterSpacing = "3px";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    link.name === "EVENTS" ? "#000000" : "rgba(0,0,0,0.6)";
                  e.currentTarget.style.letterSpacing = "2px";
                }}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          style={{ ...styles.hamburger, display: isMobile ? "flex" : "none" }}
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
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
                ...(mobileNavOpen && i === 0
                  ? { transform: "translateY(7px) rotate(45deg)" }
                  : {}),
                ...(mobileNavOpen && i === 1 ? { opacity: 0 } : {}),
                ...(mobileNavOpen && i === 2
                  ? { transform: "translateY(-7px) rotate(-45deg)" }
                  : {}),
              }}
            />
          ))}
        </button>
      </nav>

      {/* Mobile Nav Drawer */}
      {mobileNavOpen && (
        <div style={styles.mobileDrawer}>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.name}
              to={l.path}
              style={styles.mobileNavLink}
              onClick={() => setMobileNavOpen(false)}
            >
              {l.name}
            </Link>
          ))}
        </div>
      )}

      {/* ── HERO HEADER ── */}
      <motion.section
        style={{
          ...styles.header,
          height: isMobile ? "38svh" : "52vh",
          minHeight: isMobile ? "220px" : "420px",
          paddingTop: isMobile ? "54px" : "80px",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div style={styles.headerBg} />
        <div style={styles.headerOverlay} />

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
            ...styles.headerContent,
            padding: isMobile ? "0 1.2rem" : "0 1.5rem",
          }}
        >
          <p
            style={{
              ...styles.headerEyebrow,
              fontSize: isMobile ? "0.58rem" : "0.65rem",
              marginBottom: isMobile ? "0.75rem" : "1.2rem",
            }}
          >
            BEAN &amp; OLIVE · THUNDER BAY
          </p>
          <h1
            style={{
              ...styles.headerTitle,
              marginBottom: isMobile ? "0.6rem" : "1rem",
            }}
          >
            <span
              style={{
                ...styles.headerLine1,
                fontSize: isMobile
                  ? "clamp(1.9rem, 9vw, 2.8rem)"
                  : "clamp(2.4rem, 5vw, 4.2rem)",
              }}
            >
              What's On
            </span>
            <span
              style={{
                ...styles.headerLine2,
                fontSize: isMobile
                  ? "clamp(1.9rem, 9vw, 2.8rem)"
                  : "clamp(2.4rem, 5vw, 4.2rem)",
              }}
            >
              This Season.
            </span>
          </h1>
          {!isMobile && (
            <p style={styles.headerSub}>
              Weekly rituals, special evenings, and moments worth remembering.
            </p>
          )}
        </div>
      </motion.section>

      {/* ── FILTER TABS ── */}
      <section
        style={{
          ...styles.filterSection,
          padding: isMobile ? "0.9rem 0.8rem" : "1.5rem 3rem",
          top: isMobile ? "54px" : "64px",
        }}
      >
        <div
          style={{
            ...styles.filterInner,
            gap: isMobile ? "0.5rem" : "0.8rem",
            flexWrap: isMobile ? "nowrap" : "wrap",
            overflowX: isMobile ? "auto" : "visible",
            paddingBottom: isMobile ? "2px" : 0,
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              style={{
                ...styles.filterBtn,
                ...(activeCategory === cat ? styles.filterBtnActive : {}),
                padding: isMobile ? "0.45rem 1rem" : "0.55rem 1.4rem",
                fontSize: isMobile ? "0.6rem" : "0.65rem",
                flexShrink: 0,
              }}
              onClick={() => setActiveCategory(cat)}
              onMouseEnter={(e) => {
                if (activeCategory !== cat) {
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.4)";
                  e.currentTarget.style.color = "#000";
                }
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== cat) {
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)";
                  e.currentTarget.style.color = "rgba(0,0,0,0.5)";
                }
              }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      {/* ── EVENTS CONTENT ── */}
      <main
        style={{
          ...styles.main,
          padding: isMobile ? "1.8rem 0.9rem 1rem" : "4rem 3rem 2rem",
        }}
      >
        {loading ? (
          <div style={styles.loadingState}>
            <div style={styles.loadingDot} />
            <p style={styles.loadingText}>Loading events…</p>
          </div>
        ) : (
          <>
            {error && (
              <div style={styles.errorBanner}>
                <p style={styles.errorText}>⚠️ {error}</p>
              </div>
            )}

            {Object.keys(grouped).length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyTitle}>No events found.</p>
                <p style={styles.emptyDesc}>
                  Check back soon for upcoming events!
                </p>
              </div>
            ) : (
              Object.entries(grouped).map(([category, items]) => (
                <motion.div
                  key={category}
                  style={{
                    ...styles.categoryBlock,
                    marginBottom: isMobile ? "2.5rem" : "4rem",
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div
                    style={{
                      ...styles.categoryHeader,
                      marginBottom: isMobile ? "1.2rem" : "2rem",
                    }}
                  >
                    <span style={styles.categoryLabel}>
                      {category.toUpperCase()}
                    </span>
                    <div style={styles.categoryDivider} />
                  </div>

                  <div
                    style={{
                      ...styles.eventsGrid,
                      gridTemplateColumns: isMobile
                        ? "1fr"
                        : "repeat(auto-fill, minmax(320px, 1fr))",
                      gap: isMobile ? "0.9rem" : "1.5rem",
                    }}
                  >
                    {items.map((event, idx) => {
                      const isExpanded = expandedId === event.id;
                      const tagColor = TAG_COLORS[event.tag] || "#6f4e37";
                      return (
                        <motion.div
                          key={event.id || idx}
                          style={{
                            ...styles.eventCard,
                            ...(isExpanded ? styles.eventCardExpanded : {}),
                            padding: isMobile ? "1.4rem 1.2rem" : "2rem",
                            borderRadius: isMobile ? "14px" : "18px",
                            gap: isMobile ? "0.65rem" : "0.8rem",
                          }}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.1 }}
                          transition={{ duration: 0.5, delay: idx * 0.08 }}
                        >
                          {/* Tag */}
                          <span
                            style={{
                              ...styles.eventTag,
                              background: tagColor + "18",
                              color: tagColor,
                              borderColor: tagColor + "40",
                              fontSize: isMobile ? "0.55rem" : "0.58rem",
                            }}
                          >
                            {event.tag || "EVENT"}
                          </span>

                          {/* Date + Time row */}
                          <div style={styles.eventMeta}>
                            <span
                              style={{
                                ...styles.eventDate,
                                fontSize: isMobile ? "0.65rem" : "0.7rem",
                              }}
                            >
                              {formatDate(event.date)}
                            </span>
                            {event.time && (
                              <>
                                <span style={styles.metaDot}>·</span>
                                <span
                                  style={{
                                    ...styles.eventTime,
                                    fontSize: isMobile ? "0.65rem" : "0.7rem",
                                  }}
                                >
                                  {event.time}
                                </span>
                              </>
                            )}
                          </div>

                          {/* Title */}
                          <h3
                            style={{
                              ...styles.eventTitle,
                              fontSize: isMobile ? "1.25rem" : "1.4rem",
                            }}
                          >
                            {event.title}
                          </h3>

                          {/* Description */}
                          <p
                            style={{
                              ...styles.eventDesc,
                              fontSize: isMobile ? "0.75rem" : "0.78rem",
                            }}
                          >
                            {event.description}
                          </p>

                          {/* Spots */}
                          {event.spots && (
                            <div style={styles.spotsRow}>
                              <span style={styles.spotsIcon}>○</span>
                              <span
                                style={{
                                  ...styles.spotsText,
                                  fontSize: isMobile ? "0.63rem" : "0.68rem",
                                }}
                              >
                                {event.spots}
                              </span>
                            </div>
                          )}

                          {/* Booking link */}
                          {event.link && (
                            <a
                              href={event.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                ...styles.eventLink,
                                fontSize: isMobile ? "0.58rem" : "0.62rem",
                                padding: isMobile
                                  ? "0.55rem 1rem"
                                  : "0.6rem 1.2rem",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#000";
                                e.currentTarget.style.color = "#fff";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                  "transparent";
                                e.currentTarget.style.color = "#000";
                              }}
                            >
                              BOOK / LEARN MORE →
                            </a>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))
            )}
          </>
        )}

        {/* Private events CTA */}
        <motion.div
          style={{
            ...styles.privateCta,
            margin: isMobile ? "2rem auto 0.5rem" : "2rem auto",
            padding: isMobile ? "2rem 1.4rem" : "4rem 3rem",
            borderRadius: isMobile ? "18px" : "24px",
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <span style={styles.privateEyebrow}>PRIVATE BOOKINGS</span>
          <h2
            style={{
              ...styles.privateTitle,
              fontSize: isMobile
                ? "clamp(1.5rem, 6vw, 2rem)"
                : "clamp(1.8rem, 3vw, 2.6rem)",
            }}
          >
            Planning Something Special?
          </h2>
          <p
            style={{
              ...styles.privateDesc,
              fontSize: isMobile ? "0.75rem" : "0.82rem",
            }}
          >
            We host private parties, corporate events, and intimate
            celebrations. Get in touch to start planning.
          </p>
          <Link
            to="/contact"
            style={{
              ...styles.privateBtn,
              fontSize: isMobile ? "0.65rem" : "0.72rem",
              padding: isMobile ? "0.75rem 1.8rem" : "0.9rem 2.2rem",
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
            CONTACT US →
          </Link>
        </motion.div>
      </main>

      {/* ── FOOTER ── */}
      <footer
        style={{
          ...styles.footer,
          padding: isMobile ? "2rem 1.2rem" : "2.5rem 3rem",
        }}
      >
        <div style={styles.footerInner}>
          <span style={styles.footerLogo}>Bean &amp; Olive</span>
          <p
            style={{
              ...styles.footerInfo,
              fontSize: isMobile ? "0.68rem" : "0.72rem",
              lineHeight: isMobile ? 1.8 : 1.5,
            }}
          >
            {isMobile ? (
              <>
                1725 Hwy 61, Thunder Bay, ON
                <br />
                beanandolive@hotmail.com
                <br />
                +1 807-577-2326
              </>
            ) : (
              "1725 Hwy 61, Thunder Bay, ON · beanandolive@hotmail.com · +1 807-577-2326"
            )}
          </p>
          <p style={styles.footerCopy}>© 2026 Bean &amp; Olive.</p>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Josefin+Sans:wght@300;400;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        html, body, #root { background: #ffffff !important; }
        a, button { -webkit-tap-highlight-color: transparent; }
        * { -webkit-overflow-scrolling: touch; }

        @keyframes flicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 0.88; }
          94% { opacity: 1; }
          96% { opacity: 0.92; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

/* ─── STYLES ─────────────────────────────────────────────────────────────── */
const styles = {
  root: {
    fontFamily: "'Josefin Sans', sans-serif",
    background: "#ffffff",
    color: "#000000",
    overflowX: "hidden",
  },

  // NAV
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "background 0.4s, padding 0.4s",
    background: "transparent",
  },
  navScrolled: {
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(0,0,0,0.15)",
  },
  navLogo: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    cursor: "pointer",
  },
  navLogoImage: { width: "auto", objectFit: "contain" },
  navLogoText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 600,
    color: "#000000",
  },
  navLinks: { display: "flex", gap: "2.5rem", listStyle: "none" },
  navLink: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.72rem",
    letterSpacing: "2px",
    fontWeight: 600,
    color: "rgba(0,0,0,0.6)",
    textDecoration: "none",
    transition: "color 0.3s ease, letter-spacing 0.3s ease",
  },
  navLinkActive: { color: "#000000" },
  hamburger: {
    flexDirection: "column",
    gap: "5px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px",
  },
  mobileDrawer: {
    position: "fixed",
    top: "54px",
    left: 0,
    right: 0,
    zIndex: 99,
    background: "rgba(10,7,2,0.97)",
    display: "flex",
    flexDirection: "column",
    padding: "1.5rem 1.8rem",
    gap: "1.2rem",
    borderBottom: "1px solid rgba(200,169,110,0.2)",
  },
  mobileNavLink: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.85rem",
    letterSpacing: "2.5px",
    color: "#F5ECD7",
    textDecoration: "none",
    padding: "0.25rem 0",
  },

  // HEADER
  header: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  headerBg: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse at 30% 40%, #c4a484 0%, #a47551 45%, #6f4e37 100%)",
  },
  headerOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.5) 100%)",
  },
  lightsRow: {
    position: "absolute",
    top: "14%",
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
  headerContent: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    maxWidth: "680px",
    width: "100%",
  },
  headerEyebrow: {
    fontFamily: "'Josefin Sans', sans-serif",
    letterSpacing: "4px",
    color: "rgba(0,0,0,0.65)",
  },
  headerTitle: {
    display: "flex",
    flexDirection: "column",
    gap: "0.1rem",
  },
  headerLine1: {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 300,
    fontStyle: "italic",
    color: "#000000",
    lineHeight: 1.1,
  },
  headerLine2: {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 700,
    color: "#000000",
    lineHeight: 1.1,
  },
  headerSub: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.82rem",
    fontWeight: 300,
    color: "rgba(0,0,0,0.65)",
    letterSpacing: "0.5px",
    lineHeight: 1.8,
  },

  // FILTERS
  filterSection: {
    background: "rgba(255,255,255,0.96)",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    position: "sticky",
    zIndex: 50,
    backdropFilter: "blur(12px)",
  },
  filterInner: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
  },
  filterBtn: {
    background: "transparent",
    border: "1px solid rgba(0,0,0,0.15)",
    borderRadius: "999px",
    fontFamily: "'Josefin Sans', sans-serif",
    letterSpacing: "2px",
    fontWeight: 600,
    color: "rgba(0,0,0,0.5)",
    cursor: "pointer",
    transition: "all 0.25s ease",
    whiteSpace: "nowrap",
  },
  filterBtnActive: {
    background: "#000000",
    color: "#ffffff",
    borderColor: "#000000",
  },

  // MAIN
  main: { maxWidth: "1200px", margin: "0 auto" },

  // LOADING
  loadingState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    padding: "6rem 0",
  },
  loadingDot: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "2px solid rgba(0,0,0,0.12)",
    borderTopColor: "#6f4e37",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.72rem",
    letterSpacing: "2px",
    color: "rgba(0,0,0,0.35)",
  },

  // ERROR
  errorBanner: {
    background: "rgba(200,169,110,0.12)",
    border: "1px solid rgba(200,169,110,0.4)",
    borderRadius: "10px",
    padding: "0.8rem 1.2rem",
    marginBottom: "2rem",
  },
  errorText: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.78rem",
    color: "#a47551",
  },

  // EMPTY
  emptyState: { textAlign: "center", padding: "5rem 0" },
  emptyTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "1.8rem",
    fontWeight: 300,
    fontStyle: "italic",
    color: "#000",
    marginBottom: "0.5rem",
  },
  emptyDesc: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.78rem",
    color: "rgba(0,0,0,0.5)",
  },

  // CATEGORY BLOCK
  categoryBlock: {},
  categoryHeader: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  categoryLabel: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.62rem",
    letterSpacing: "4px",
    fontWeight: 600,
    color: "#000000",
    whiteSpace: "nowrap",
  },
  categoryDivider: {
    flex: 1,
    height: "1px",
    background: "rgba(0,0,0,0.15)",
  },

  // EVENTS GRID
  eventsGrid: {
    display: "grid",
  },

  // EVENT CARD
  eventCard: {
    background: "#ffffff",
    border: "1px solid rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    transition: "box-shadow 0.3s, transform 0.3s",
    cursor: "default",
  },
  eventCardExpanded: {
    boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
    transform: "translateY(-2px)",
  },

  eventTag: {
    display: "inline-block",
    padding: "0.3rem 0.8rem",
    borderRadius: "999px",
    border: "1px solid",
    fontFamily: "'Josefin Sans', sans-serif",
    letterSpacing: "2px",
    fontWeight: 600,
    alignSelf: "flex-start",
  },

  eventMeta: { display: "flex", alignItems: "center", gap: "0.5rem" },
  eventDate: {
    fontFamily: "'Josefin Sans', sans-serif",
    letterSpacing: "1px",
    fontWeight: 600,
    color: "rgba(0,0,0,0.55)",
  },
  metaDot: { color: "rgba(0,0,0,0.3)", fontSize: "0.8rem" },
  eventTime: {
    fontFamily: "'Josefin Sans', sans-serif",
    letterSpacing: "0.5px",
    color: "rgba(0,0,0,0.55)",
  },

  eventTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 700,
    color: "#000000",
    lineHeight: 1.2,
  },

  eventDesc: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontWeight: 300,
    color: "rgba(0,0,0,0.65)",
    lineHeight: 1.8,
  },

  spotsRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginTop: "0.3rem",
  },
  spotsIcon: { fontSize: "0.6rem", color: "#C8A96E" },
  spotsText: {
    fontFamily: "'Josefin Sans', sans-serif",
    letterSpacing: "1px",
    color: "#C8A96E",
    fontWeight: 600,
  },

  eventLink: {
    display: "inline-block",
    marginTop: "0.5rem",
    border: "1px solid #000",
    borderRadius: "999px",
    fontFamily: "'Josefin Sans', sans-serif",
    letterSpacing: "2px",
    fontWeight: 600,
    color: "#000",
    textDecoration: "none",
    alignSelf: "flex-start",
    transition: "all 0.3s ease",
  },

  // PRIVATE CTA
  privateCta: {
    background: "#f5f5f5",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  privateEyebrow: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.62rem",
    letterSpacing: "4px",
    color: "rgba(0,0,0,0.5)",
  },
  privateTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 700,
    color: "#000000",
  },
  privateDesc: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontWeight: 300,
    color: "rgba(0,0,0,0.6)",
    lineHeight: 1.8,
    maxWidth: "480px",
  },
  privateBtn: {
    display: "inline-block",
    marginTop: "0.5rem",
    border: "1.5px solid #000",
    borderRadius: "999px",
    fontFamily: "'Josefin Sans', sans-serif",
    letterSpacing: "2px",
    fontWeight: 600,
    color: "#000",
    textDecoration: "none",
    transition: "all 0.3s ease",
  },

  // FOOTER
  footer: {
    borderTop: "1px solid rgba(0,0,0,0.1)",
    background: "#ffffff",
    marginTop: "2rem",
  },
  footerInner: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    textAlign: "center",
  },
  footerLogo: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "1.4rem",
    fontWeight: 600,
    color: "#000000",
  },
  footerInfo: {
    fontFamily: "'Josefin Sans', sans-serif",
    color: "rgba(0,0,0,0.5)",
  },
  footerCopy: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.65rem",
    color: "rgba(0,0,0,0.3)",
    letterSpacing: "0.5px",
  },
};

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 📋 GOOGLE SHEETS SETUP — READ THIS BEFORE GOING LIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COLUMN HEADERS (Row 1 of your sheet — type exactly as shown):
  id | title | date | time | category | description | tag | spots | link

COLUMN GUIDE:
  id          → Any unique number (1, 2, 3…)
  title       → Event name
  date        → Format: YYYY-MM-DD  e.g. 2025-06-14
  time        → e.g. 7:00 PM
  category    → Must be exactly one of: Weekly | This Month | Upcoming
  description → One or two sentences about the event
  tag         → e.g. LIVE MUSIC, WORKSHOP, HAPPY HOUR, SPECIAL EVENT, TASTING
  spots       → e.g. "8 spots left", "Walk-ins welcome", "Free entry"
  link        → Optional booking URL (leave blank if none)

HOW TO PUBLISH THE SHEET:
  1. Open your Google Sheet
  2. Click File → Share → Publish to web
  3. Choose "Sheet1" and "Comma-separated values (.csv)"
  4. Click Publish → Copy the URL
  5. Paste that URL into SHEET_CSV_URL at the top of this file

TO ADD/EDIT/REMOVE EVENTS:
  → Just edit the Google Sheet — changes appear on the website within ~5 mins
  → To hide an event, simply delete its row
  → To add an event, add a new row at the bottom

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
