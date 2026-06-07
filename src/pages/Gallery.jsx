import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo-bean.png";
import { Helmet } from "react-helmet-async";

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRbYniwuLxIhcpOQoSIDT5X4DFTLvl1KUQp9qTCdelLyngiaiRTAjfBnxYwOrco7_9v-DWVuYrIJ393/pub?gid=0&single=true&output=csv";

const CATEGORIES = [
  "All",
  "Coffee",
  "Food",
  "Cocktails",
  "Ambience",
  "Events",
  "Staff",
];

const NAV_LINKS = [
  { name: "HOME", path: "/" },
  { name: "MENU", path: "/menu" },
  { name: "GALLERY", path: "/gallery" },
  { name: "EVENTS", path: "/events" },
  { name: "CONTACT", path: "/contact" },
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

function getSpan(aspect, isMobile) {
  if (isMobile) return {}; // no spanning on mobile — single column
  if (aspect === "tall") return { gridRow: "span 2" };
  if (aspect === "wide") return { gridColumn: "span 2" };
  return {};
}

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const lightboxRef = useRef(null);
  // Touch swipe state for lightbox
  const touchStartX = useRef(null);

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

  const filtered =
    activeCategory === "All"
      ? images
      : images.filter((img) => img.category === activeCategory);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (lightbox === null) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i + 1) % filtered.length);
      if (e.key === "ArrowLeft")
        setLightbox((i) => (i - 1 + filtered.length) % filtered.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, filtered.length]);

  // Lock body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  useEffect(() => {
    async function fetchImages() {
      if (SHEET_CSV_URL.includes("YOUR_SHEET_ID_HERE")) {
        setImages([]);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(SHEET_CSV_URL);
        if (!res.ok) throw new Error();
        const text = await res.text();
        const parsed = parseCSV(text).filter((r) => r.url && r.url.trim());
        setImages(parsed);
      } catch {
        setImages([]);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, []);

  const openLightbox = useCallback((idx) => setLightbox(idx), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const currentImg = lightbox !== null ? filtered[lightbox] : null;

  // Touch swipe handlers for lightbox
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setLightbox((i) => (i + 1) % filtered.length);
      else setLightbox((i) => (i - 1 + filtered.length) % filtered.length);
    }
    touchStartX.current = null;
  };

  return (
    <>
      <Helmet>
        <title>Gallery | Bean & Olive</title>
        <meta
          name="description"
          content="Explore Bean & Olive gallery — coffee moments, food, cocktails, events, and ambience in Thunder Bay."
        />
        <meta
          name="keywords"
          content="Bean and Olive, Thunder Bay cafe, coffee gallery, restaurant photos"
        />
        <link rel="canonical" href="https://beanandolive.com/gallery" />
        <meta property="og:title" content="Gallery | Bean & Olive" />
        <meta
          property="og:description"
          content="Coffee, food, cocktails, and moments from Bean & Olive."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://beanandolive.com/gallery" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gallery | Bean & Olive" />
        <meta
          name="twitter:description"
          content="Coffee, food, cocktails, and moments from Bean & Olive."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <div style={styles.root}>
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
          <ul
            style={{ ...styles.navLinks, display: isMobile ? "none" : "flex" }}
          >
            {NAV_LINKS.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  style={{
                    ...styles.navLink,
                    ...(link.name === "GALLERY" ? { color: "#000000" } : {}),
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#000";
                    e.currentTarget.style.letterSpacing = "3px";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color =
                      link.name === "GALLERY" ? "#000" : "rgba(0,0,0,0.6)";
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
            minHeight: isMobile ? "220px" : "400px",
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
                Moments From
              </span>
              <span
                style={{
                  ...styles.headerLine2,
                  fontSize: isMobile
                    ? "clamp(1.9rem, 9vw, 2.8rem)"
                    : "clamp(2.4rem, 5vw, 4.2rem)",
                }}
              >
                Our Tables.
              </span>
            </h1>
            {!isMobile && (
              <p style={styles.headerSub}>
                Coffee mornings, cocktail evenings, and everything in between.
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
              paddingBottom: isMobile ? "2px" : 0, // avoid clipping on scroll
            }}
          >
            {CATEGORIES.map((cat) => (
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

        {/* ── GALLERY GRID ── */}
        <main
          style={{
            ...styles.main,
            padding: isMobile ? "1.2rem 0.75rem 1rem" : "3rem 2rem 1rem",
          }}
        >
          {loading ? (
            <div style={styles.loadingState}>
              <div style={styles.loadingSpinner} />
              <p style={styles.loadingText}>Loading gallery…</p>
            </div>
          ) : (
            <motion.div
              style={isMobile ? styles.mobileGrid : styles.masonryGrid}
              layout
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((img, idx) => (
                  <motion.div
                    key={img.id || img.url}
                    style={{
                      ...(isMobile ? styles.mobileTile : styles.tile),
                      ...getSpan(img.aspect, isMobile),
                    }}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.35, delay: idx * 0.03 }}
                    onClick={() => openLightbox(idx)}
                    whileHover={isMobile ? undefined : "hover"}
                  >
                    <motion.img
                      src={img.url}
                      alt={img.caption || "Bean & Olive"}
                      style={isMobile ? styles.mobileTileImg : styles.tileImg}
                      variants={
                        isMobile ? undefined : { hover: { scale: 1.06 } }
                      }
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      loading="lazy"
                    />
                    {/* Caption overlay — always visible on mobile, hover on desktop */}
                    {(img.caption || img.category) &&
                      (isMobile ? (
                        <div style={styles.mobileTileOverlay}>
                          {img.caption && (
                            <p style={styles.mobileTileCaption}>
                              {img.caption}
                            </p>
                          )}
                          {img.category && (
                            <span style={styles.mobileTileCat}>
                              {img.category.toUpperCase()}
                            </span>
                          )}
                        </div>
                      ) : (
                        <motion.div
                          style={styles.tileOverlay}
                          variants={{ hover: { opacity: 1 } }}
                          initial={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {img.caption && (
                            <p style={styles.tileCaption}>{img.caption}</p>
                          )}
                          {img.category && (
                            <span style={styles.tileCat}>
                              {img.category.toUpperCase()}
                            </span>
                          )}
                          <div style={styles.tileZoomIcon}>+</div>
                        </motion.div>
                      ))}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={styles.emptyState}>
              <p style={styles.emptyTitle}>No photos yet.</p>
              <p style={styles.emptyDesc}>Check back soon!</p>
            </div>
          )}

          {/* Instagram CTA */}
          <motion.div
            style={{
              ...styles.igStrip,
              margin: isMobile ? "2.5rem auto 0.5rem" : "4rem auto 1rem",
              padding: isMobile ? "2rem 1.2rem" : "3rem 2rem",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span style={styles.igLabel}>FOLLOW OUR STORY</span>
            <p
              style={{
                ...styles.igHandle,
                fontSize: isMobile ? "1.6rem" : "2rem",
              }}
            >
              @bean_andolive
            </p>
            <p
              style={{
                ...styles.igDesc,
                fontSize: isMobile ? "0.72rem" : "0.75rem",
              }}
            >
              Tag us in your photos for a chance to be featured here.
            </p>
          </motion.div>
        </main>

        {/* ── LIGHTBOX ── */}
        <AnimatePresence>
          {lightbox !== null && currentImg && (
            <motion.div
              style={styles.lightboxBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeLightbox}
              ref={lightboxRef}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Close */}
              <button
                style={{
                  ...styles.lbClose,
                  top: isMobile ? "1rem" : "1.5rem",
                  right: isMobile ? "1rem" : "1.5rem",
                  width: isMobile ? "40px" : "44px",
                  height: isMobile ? "40px" : "44px",
                }}
                onClick={closeLightbox}
              >
                ×
              </button>

              {/* Prev/Next — hidden on mobile (use swipe) */}
              {!isMobile && (
                <>
                  <button
                    style={{ ...styles.lbArrow, left: "1.5rem" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightbox(
                        (i) => (i - 1 + filtered.length) % filtered.length,
                      );
                    }}
                  >
                    ‹
                  </button>
                  <button
                    style={{ ...styles.lbArrow, right: "1.5rem" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightbox((i) => (i + 1) % filtered.length);
                    }}
                  >
                    ›
                  </button>
                </>
              )}

              {/* Image */}
              <motion.div
                style={{
                  ...styles.lbImgWrap,
                  maxWidth: isMobile ? "96vw" : "88vw",
                  maxHeight: isMobile ? "82svh" : "86vh",
                }}
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={currentImg.url}
                  alt={currentImg.caption || ""}
                  style={{
                    ...styles.lbImg,
                    maxWidth: isMobile ? "96vw" : "88vw",
                    maxHeight: isMobile ? "72svh" : "78vh",
                  }}
                />
                {(currentImg.caption || currentImg.category) && (
                  <div style={styles.lbInfo}>
                    {currentImg.caption && (
                      <p
                        style={{
                          ...styles.lbCaption,
                          fontSize: isMobile ? "0.9rem" : "1rem",
                        }}
                      >
                        {currentImg.caption}
                      </p>
                    )}
                    {currentImg.category && (
                      <span style={styles.lbCat}>
                        {currentImg.category.toUpperCase()}
                      </span>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Counter */}
              <div style={styles.lbCounter}>
                {lightbox + 1} / {filtered.length}
                {isMobile && (
                  <span style={{ marginLeft: "0.75rem", opacity: 0.5 }}>
                    · swipe to navigate
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                  <br />
                  <br />
                  Opening Hours
                  <br />
                  Monday: 8 AM – 2 PM
                  <br />
                  Tuesday: 8 AM – 7 PM
                  <br />
                  Wednesday: 8 AM – 10 PM
                  <br />
                  Thursday: 8 AM – 10 PM
                  <br />
                  Friday: 8 AM – 11 PM
                  <br />
                  Saturday: 9 AM – 11 PM
                  <br />
                  Sunday: 9 AM – 2 PM
                </>
              ) : (
                <>
                  1725 Hwy 61, Thunder Bay, ON · beanandolive@hotmail.com · +1
                  807-577-2326
                  <br />
                  <br />
                  Opening Hours: Monday 8 AM–2 PM · Tuesday 8 AM–7 PM ·
                  Wednesday 8 AM–10 PM · Thursday 8 AM–10 PM · Friday 8 AM–11 PM
                  · Saturday 9 AM–11 PM · Sunday 9 AM–2 PM
                </>
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

          /* Hide filter scrollbar */
          .filter-scroll { scrollbar-width: none; }
          .filter-scroll::-webkit-scrollbar { display: none; }

          @keyframes flicker {
            0%, 100% { opacity: 1; }
            92% { opacity: 0.88; }
            94% { opacity: 1; }
            96% { opacity: 0.92; }
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </>
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
      "radial-gradient(ellipse at 65% 40%, #c4a484 0%, #a47551 45%, #6f4e37 100%)",
  },
  headerOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.55) 100%)",
  },
  lightsRow: {
    position: "absolute",
    top: "12%",
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
    color: "rgba(0,0,0,0.62)",
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
    maxWidth: "1200px",
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
  main: {
    maxWidth: "1400px",
    margin: "0 auto",
  },

  // DESKTOP masonry grid
  masonryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gridAutoRows: "260px",
    gap: "12px",
  },
  tile: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "14px",
    cursor: "zoom-in",
    background: "#f0ede8",
  },
  tileImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  tileOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    padding: "1.2rem",
    gap: "0.3rem",
  },
  tileCaption: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "1.05rem",
    fontStyle: "italic",
    fontWeight: 400,
    color: "#ffffff",
    lineHeight: 1.3,
  },
  tileCat: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.55rem",
    letterSpacing: "2px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.65)",
  },
  tileZoomIcon: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "1.2rem",
    color: "#fff",
    fontWeight: 300,
  },

  // MOBILE 2-column grid
  mobileGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "6px",
  },
  mobileTile: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "10px",
    cursor: "pointer",
    background: "#f0ede8",
    aspectRatio: "1 / 1",
  },
  mobileTileImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  mobileTileOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)",
    padding: "0.6rem 0.7rem 0.55rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.15rem",
  },
  mobileTileCaption: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "0.85rem",
    fontStyle: "italic",
    fontWeight: 400,
    color: "#ffffff",
    lineHeight: 1.2,
  },
  mobileTileCat: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.5rem",
    letterSpacing: "1.5px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.6)",
  },

  // LOADING / EMPTY
  loadingState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    padding: "8rem 0",
  },
  loadingSpinner: {
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
  emptyState: { textAlign: "center", padding: "6rem 0" },
  emptyTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "1.8rem",
    fontStyle: "italic",
    fontWeight: 300,
    color: "#000",
    marginBottom: "0.5rem",
  },
  emptyDesc: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.75rem",
    color: "rgba(0,0,0,0.4)",
  },

  // IG STRIP
  igStrip: {
    maxWidth: "500px",
    textAlign: "center",
    borderTop: "1px solid rgba(0,0,0,0.1)",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
    alignItems: "center",
  },
  igLabel: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.6rem",
    letterSpacing: "4px",
    color: "rgba(0,0,0,0.4)",
  },
  igHandle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 600,
    color: "#000000",
  },
  igDesc: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontWeight: 300,
    color: "rgba(0,0,0,0.55)",
    lineHeight: 1.7,
  },

  // LIGHTBOX
  lightboxBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 999,
    background: "rgba(10, 7, 4, 0.94)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(6px)",
  },
  lbImgWrap: {
    display: "flex",
    flexDirection: "column",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
  },
  lbImg: {
    objectFit: "contain",
    display: "block",
    background: "#111",
  },
  lbInfo: {
    background: "rgba(10,7,4,0.85)",
    padding: "0.8rem 1.2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
  },
  lbCaption: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: "italic",
    fontWeight: 300,
    color: "#F5ECD7",
  },
  lbCat: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.58rem",
    letterSpacing: "2px",
    color: "#C8A96E",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  lbArrow: {
    position: "fixed",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 1001,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    fontSize: "1.6rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
    transition: "background 0.2s",
    backdropFilter: "blur(4px)",
  },
  lbClose: {
    position: "fixed",
    zIndex: 1001,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    borderRadius: "50%",
    fontSize: "1.4rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    transition: "background 0.2s",
  },
  lbCounter: {
    position: "fixed",
    bottom: "1.5rem",
    left: "50%",
    transform: "translateX(-50%)",
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.65rem",
    letterSpacing: "2px",
    color: "rgba(255,255,255,0.4)",
    whiteSpace: "nowrap",
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
 📸 GOOGLE SHEETS SETUP FOR GALLERY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COLUMN HEADERS (Row 1 — type exactly as shown):
  id | url | caption | category | aspect

COLUMN GUIDE:
  id        → Any unique number (1, 2, 3…)
  url       → Direct link to the photo (Google Drive, Imgur, Cloudinary, etc.)
  caption   → Short title shown on hover  e.g. "Morning pour"
  category  → Must be one of: Coffee | Food | Cocktails | Ambience | Events
  aspect    → Controls grid size (desktop only): square | wide | tall
               square = normal tile  |  wide = 2 columns wide  |  tall = 2 rows tall

HOW TO GET IMAGE URLS:
  Option A — Google Drive:
    1. Upload photo to Google Drive
    2. Right-click → Share → Anyone with the link can view
    3. Copy the link, get the file ID from the URL
       e.g. https://drive.google.com/file/d/FILE_ID/view
    4. Use: https://drive.google.com/uc?export=view&id=FILE_ID

  Option B — Imgur (free, easiest):
    1. Go to imgur.com → upload your photo
    2. Right-click the uploaded image → "Copy image address"
    3. Paste that .jpg/.png URL directly into the sheet

HOW TO PUBLISH THE SHEET:
  1. File → Share → Publish to web
  2. Sheet1 + CSV → Publish → Copy URL
  3. Paste into SHEET_CSV_URL at the top of this file

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
