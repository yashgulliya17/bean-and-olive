import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo-bean.png";

const NAV_LINKS = [
  { name: "HOME", path: "/" },
  { name: "MENU", path: "/menu" },
  { name: "GALLERY", path: "/gallery" },
  { name: "EVENTS", path: "/events" },
  { name: "CONTACT", path: "/contact" },
];

export default function ContactPage() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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

  return (
    <div style={s.root}>
      {/* ── NAV ── */}
      <nav
        style={{
          ...s.nav,
          ...(scrolled ? s.navScrolled : {}),
          padding: isMobile ? "0.9rem 1.2rem" : "1.25rem 3rem",
        }}
      >
        <div style={s.navLogo}>
          <img
            src={logo}
            alt="Bean & Olive Logo"
            style={{ ...s.navLogoImage, height: isMobile ? "28px" : "34px" }}
          />
          <span
            style={{
              ...s.navLogoText,
              fontSize: isMobile ? "1.25rem" : "1.5rem",
            }}
          >
            Bean &amp; Olive
          </span>
        </div>

        {/* Desktop nav */}
        <ul style={{ ...s.navLinks, display: isMobile ? "none" : "flex" }}>
          {NAV_LINKS.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                style={{
                  ...s.navLink,
                  ...(link.name === "CONTACT" ? { color: "#000000" } : {}),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#000";
                  e.currentTarget.style.letterSpacing = "3px";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    link.name === "CONTACT" ? "#000" : "rgba(0,0,0,0.6)";
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
          style={{ ...s.hamburger, display: isMobile ? "flex" : "none" }}
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
        <div style={s.mobileDrawer}>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.name}
              to={l.path}
              style={s.mobileNavLink}
              onClick={() => setMobileNavOpen(false)}
            >
              {l.name}
            </Link>
          ))}
        </div>
      )}

      {/* Background layers */}
      <div style={s.bg} />
      <div style={s.overlay} />

      {/* String lights */}
      <div style={s.lightsRow}>
        {Array.from({ length: isMobile ? 8 : 12 }).map((_, i, arr) => (
          <div
            key={i}
            style={{
              ...s.lightBulb,
              left: `${(i / (arr.length - 1)) * 95 + 2}%`,
              animationDelay: `${i * 0.25}s`,
            }}
          />
        ))}
      </div>

      <motion.div
        style={{
          ...s.card,
          padding: isMobile ? "2rem 1.4rem" : "2.5rem 2rem",
          marginTop: isMobile ? "54px" : "0",
        }}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <p style={s.kicker}>CONTACT</p>
        <h1
          style={{
            ...s.title,
            fontSize: isMobile ? "2.2rem" : "2.8rem",
          }}
        >
          Get in Touch
        </h1>

        <div style={s.infoBlock}>
          <a href="mailto:beanandolive@hotmail.com" style={s.link}>
            📧 beanandolive@hotmail.com
          </a>
          <a href="tel:+18075772326" style={s.link}>
            📞 +1 807-577-2326
          </a>
        </div>

        <p
          style={{
            ...s.note,
            fontSize: isMobile ? "0.78rem" : "0.85rem",
          }}
        >
          We also host private parties. Contact us for more info and bookings.
        </p>
      </motion.div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Josefin+Sans:wght@300;400;600&display=swap');
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 0.88; }
          94% { opacity: 1; }
          96% { opacity: 0.92; }
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #root { background: #ffffff !important; width: 100%; margin: 0; }
        a, button { -webkit-tap-highlight-color: transparent; }
        * { -webkit-overflow-scrolling: touch; }
      `}</style>
    </div>
  );
}

const s = {
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Josefin Sans', sans-serif",
    background: "#ffffff",
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

  // BACKGROUND
  bg: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse at 30% 40%, #c4a484 0%, #a47551 60%, #8b6a4a 100%)",
    zIndex: 0,
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(255,255,255,0.25), rgba(255,255,255,0.75))",
    zIndex: 1,
  },

  // LIGHTS
  lightsRow: {
    position: "absolute",
    top: "8%",
    left: 0,
    right: 0,
    height: "40px",
    zIndex: 1,
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

  // CARD
  card: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    maxWidth: "560px",
    width: "100%",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.65)",
    backdropFilter: "blur(14px)",
    border: "1px solid rgba(0,0,0,0.12)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
  },

  kicker: {
    fontSize: "0.7rem",
    letterSpacing: "4px",
    color: "rgba(0,0,0,0.6)",
    marginBottom: "0.8rem",
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    marginBottom: "1.5rem",
    fontWeight: 600,
    color: "#000",
  },
  infoBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
    marginBottom: "1.5rem",
  },
  link: {
    fontSize: "1rem",
    color: "#000",
    textDecoration: "none",
    letterSpacing: "0.3px",
    transition: "opacity 0.2s ease",
  },
  note: {
    color: "rgba(0,0,0,0.65)",
    lineHeight: 1.6,
  },
};
