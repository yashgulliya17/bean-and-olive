import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";

import logo from "../assets/logo-bean.png";

const NAV_LINKS = [
  { name: "HOME", path: "/" },
  { name: "MENU", path: "/menu" },
  { name: "GALLERY", path: "/gallery" },
  { name: "EVENTS", path: "/events" },
  { name: "CONTACT", path: "/contact" },
];

const MENUS = [
  {
    id: "breakfast",
    label: "BREAKFAST",
    short: "BFAST",
    hours: "Saturday & Sunday · 10:00am – 1:00pm",
    tagline: "Slow mornings, bright flavours.",
    sections: [
      {
        title: "EGGS & MORE",
        items: [
          {
            name: "Classic Breakfast",
            desc: "2 eggs any style, your choice of sausage or bacon, home fries and rye toast",
            price: "$16.50",
          },
          {
            name: "Meats Omelette",
            desc: "3 eggs, bacon, sausage, ham and cheese. Served with rye toast",
            price: "$17.50",
          },
          {
            name: "Cheese Omelette",
            desc: "3 eggs and blended cheese. Served with rye toast",
            price: "$15.50",
          },
          {
            name: "Veggie Omelette",
            desc: "3 eggs, tomatoes, green peppers, onion and cheese. Served with rye toast",
            price: "$17.50",
          },
          {
            name: "Breakfast Wraps",
            desc: "Scrambled egg, bacon and cheese wrapped in a soft flour tortilla. 2 wraps",
            price: "$12.00",
          },
          {
            name: "Breakfast Sandwich",
            desc: "Fried egg, bacon or sausage, cheese melted between an English muffin",
            price: "$7.50",
          },
        ],
      },
      {
        title: "SPECIALS",
        items: [
          {
            name: "Egg Benedict",
            desc: "Canadian back bacon, 2 poached eggs on an English muffin topped with creamy hollandaise. Served with home fries",
            price: "$18.00",
          },
          {
            name: "BELT",
            desc: "Your choice of bagel, toasted between bacon, fried egg, lettuce, tomato, cheese and mayonnaise",
            price: "$9.50",
          },
          {
            name: "Avocado Toast",
            desc: "Toasted Rye bread topped with avocado, sunny side up egg. Sprinkled with crushed red pepper and olive oil drizzle",
            price: "$16.50",
            tag: "Chef's Pick",
          },
          {
            name: "Finnish Pancakes",
            desc: "2 cakes or 2 cakes. Served with maple syrup & berries",
            price: "$14.00 / $12.00",
          },
        ],
      },
      {
        title: "ADD ONS",
        items: [
          { name: "Bacon", desc: "3 strips", price: "$4.00" },
          { name: "Sausage", desc: "3 links", price: "$4.00" },
          { name: "Extra Egg", desc: "Fried or scrambled", price: "$3.00" },
          { name: "Toast", desc: "Rye or white", price: "$3.00" },
          { name: "Home Fries", desc: "House seasoned", price: "$4.00" },
          {
            name: "Berries Bowl",
            desc: "Seasonal fresh berries",
            price: "$6.00",
          },
          {
            name: "Veggie Bowl",
            desc: "Sautéed seasonal vegetables",
            price: "$6.00",
          },
        ],
      },
      {
        title: "COFFEE & TEA · 12 OZ",
        items: [
          {
            name: "Drip Coffee",
            desc: "House blend, freshly brewed",
            price: "$2.95",
          },
          { name: "Tea", desc: "Selection of hot teas", price: "$2.95" },
          { name: "Espresso", desc: "Double shot", price: "$3.50" },
          { name: "Americano", desc: "Espresso & hot water", price: "$3.90" },
        ],
      },
      {
        title: "FROM THE BAR",
        items: [
          {
            name: "Mimosa",
            desc: "1/2 price · Prosecco & orange juice",
            price: "$5.50",
          },
          {
            name: "Bailey's with Coffee",
            desc: "House coffee with Bailey's Irish Cream",
            price: "$8.50",
          },
          { name: "Caesar", desc: "Classic Canadian cocktail", price: "$9.50" },
          { name: "Prosecco", desc: "Glass · chilled", price: "$12.00" },
        ],
      },
    ],
  },
  {
    id: "hotlunch",
    label: "HOT LUNCH",
    short: "LUNCH",
    hours: "Tuesday – Sunday · 11:00am – 2:00pm · $15",
    tagline: "Hearty midday plates, all at one price.",
    sections: [
      {
        title: "HOT LUNCH SPECIALS · ALL $15",
        items: [
          {
            name: "Savory Chicken BLT Burger",
            desc: "Crispy chicken in BBQ sauce, bacon, lettuce, tomato, cheese. Served with kettle chips",
            price: "$15",
            tag: "Fan Favourite",
          },
          {
            name: "Crispy Chicken Bacon Ranch Wrap",
            desc: "Crispy chicken strips, bacon, lettuce, shredded cheese, ranch dressing. Served with kettle chips",
            price: "$15",
          },
          {
            name: "Loaded Nacho Poutine",
            desc: "Fries, gravy, cheese curds, bacon, peppers, tomato, onion",
            price: "$15",
            tag: "Must Try",
          },
          {
            name: "Cheesy Flatbread Pizza",
            desc: "House flatbread with melted cheese blend and your choice of toppings",
            price: "$15",
          },
        ],
      },
    ],
  },
  {
    id: "dinner",
    label: "DINNER",
    short: "DINNER",
    hours: "Tuesday – Sunday · 4:00pm – Close",
    tagline: "An evening of unhurried pleasure.",
    sections: [
      {
        title: "STARTERS & SHARING",
        items: [
          {
            name: "Pico De Gallo & Chips",
            desc: "Fresh salsa made with tomato, onion, cilantro, jalapeño & lime juice. Paired with GF tortilla chips",
            price: "$14.50",
          },
          {
            name: "Guacamole & Chips",
            desc: "Fresh guacamole paired with GF tortilla chips",
            price: "$15.50",
          },
          {
            name: "Loaded Hummus Plate",
            desc: "Roasted garlic hummus topped with tomato, cucumber, onion, lettuce, olives. Paired with naan bread or veggies",
            price: "$16.95",
            tag: "Chef's Pick",
          },
          {
            name: "Spinach Dip",
            desc: "A creamy mixture of cream cheese, spinach, onion, peppers & spices. Served with tortilla chips & veggies",
            price: "$16.50",
          },
          {
            name: "Charcuterie Board",
            desc: "Perfect for sharing! A mix of meats, cheeses, crackers & savory bites",
            price: "$21.95",
            tag: "Signature",
          },
          {
            name: "Antojitos",
            desc: "Baked flour tortilla wrap filled with cream cheese, shredded cheeses, jalapeño, red & yellow pepper. Served with sour cream. *2 rolls served",
            price: "$16.95",
          },
        ],
      },
      {
        title: "MAINS",
        items: [
          {
            name: "Flatbread Pizza",
            desc: "Deluxe, Meat Lovers, Hawaiian, Veggie, & Alfredo",
            price: "$17.95",
          },
          {
            name: "Caesar Salad",
            desc: "Romaine lettuce, bacon, Parmesan cheese, croutons. Mixed with creamy Caesar dressing",
            price: "$15.95",
          },
          {
            name: "Loaded Nachos",
            desc: "GF tortilla chips, cheese, peppers, tomato, bacon, onion. Served with salsa & sour cream",
            price: "$21.95",
            tag: "Fan Favourite",
          },
          {
            name: "Chicken Strips",
            desc: "Tender chicken breast strips served with side fries and dipping sauce. *3 strips served",
            price: "$15.95",
          },
          {
            name: "Poutine",
            desc: "Classic poutine made with fries topped with gravy & cheese curds",
            price: "$15.50",
          },
          {
            name: "Pizza Rolls",
            desc: "Baked egg roll wrap filled with pepperoni, ham & mozzarella cheese. Served with marinara sauce. *4 rolls served",
            price: "$15.95",
          },
        ],
      },
    ],
  },
  {
    id: "drinks",
    label: "DRINKS & COCKTAILS",
    short: "DRINKS",
    hours: "Full service during all dining hours",
    tagline: "Crafted with the same care as the kitchen.",
    sections: [
      {
        title: "MARTINIS",
        items: [
          {
            name: "B&O Dirty Martini",
            desc: "2.5 oz Vodka or Gin, olive juice",
            price: "$14",
            tag: "House Special",
          },
          {
            name: "Classic Martini",
            desc: "2.5 oz Vodka or Gin, dry vermouth, olive juice",
            price: "$14",
          },
          {
            name: "Espresso Martini",
            desc: "1 oz Vodka, 1 oz Kahlua, Espresso, simple syrup",
            price: "$14",
          },
          {
            name: "Chocolate Martini",
            desc: "1.5 oz Vodka, 1.5 oz Crème de cacao, cream, syrup",
            price: "$14",
          },
          {
            name: "Cosmopolitan",
            desc: "1.5 oz Vodka, .75 oz Cointreau, lime & cranberry juices",
            price: "$14",
          },
          {
            name: "Lemon Drop",
            desc: "1.5 oz Citron vodka, .5 oz Cointreau, lime juice, simple syrup",
            price: "$14",
          },
          {
            name: "Appletini",
            desc: "1.5 oz Vodka, 1 oz Sour Apple, apple juice",
            price: "$14",
          },
          {
            name: "Elderflower Martini",
            desc: "1 oz St. Germain, 1 oz Gin, lemon juice",
            price: "$14",
          },
        ],
      },
      {
        title: "COCKTAILS",
        items: [
          {
            name: "Margarita",
            desc: "2 oz Tequila, lime juice, simple syrup",
            price: "$14",
          },
          {
            name: "Old Fashioned",
            desc: "1.5 oz Whiskey, 2 dashes bitters, simple syrup",
            price: "$14",
          },
          {
            name: "Negroni",
            desc: "1 oz Campari, 1 oz Gin, .5 oz vermouth, carbonated water",
            price: "$14",
          },
          {
            name: "Paloma",
            desc: "2 oz Tequila, lime & grapefruit juices, soda water",
            price: "$13",
          },
          {
            name: "Tom Collins",
            desc: "2 oz Gin, lemon juice, simple syrup, club soda",
            price: "$13",
          },
          {
            name: "Moscow Mule",
            desc: "1.5 oz Vodka, lime juice, ginger beer",
            price: "$14",
          },
          {
            name: "Whiskey Sour",
            desc: "1.5 oz Whiskey, lemon juice, simple syrup",
            price: "$12",
          },
          {
            name: "Long Island",
            desc: "5 oz Vodka, .5 oz Rum, 5 oz Gin, .5 oz Cointreau, coke & lime juice",
            price: "$13",
          },
        ],
      },
      {
        title: "SPARKLING & SPRITZ",
        items: [
          {
            name: "Aperol Spritz",
            desc: "3 oz Prosecco, 2 oz Aperol, soda water",
            price: "$12",
          },
          {
            name: "Hugo",
            desc: "3 oz Prosecco, 1 oz St. Germain, soda water",
            price: "$14",
          },
          {
            name: "Limoncello Spritz",
            desc: "3 oz Prosecco, 1 oz Limoncello, sparkling water",
            price: "$14",
          },
          { name: "Mimosa", desc: "4 oz Prosecco, 3 oz OJ", price: "$11" },
          {
            name: "French 75",
            desc: "1 oz Gin, 2 oz Prosecco, .5 oz lemon juice, simple syrup",
            price: "$14",
          },
          {
            name: "Ranch Water",
            desc: "1.5 oz Silver Tequila, lime juice, sparkling water",
            price: "$12",
          },
          { name: "Prosecco", desc: "7 oz flute", price: "$12" },
          {
            name: "Bellini",
            desc: "4 oz Prosecco & peach purée",
            price: "$12",
          },
        ],
      },
    ],
  },
  {
    id: "wednesday",
    label: "AROUND THE WORLD WED.",
    short: "WED.",
    hours: "Every Wednesday · 6:00pm – 10:00pm",
    tagline: "Global flavours, one legendary night.",
    sections: [
      {
        title: "SIGNATURE COCKTAILS",
        items: [
          {
            name: "Classic Margarita",
            desc: "2 oz Tequila, 1 oz Cointreau, lime juice, shaken on ice, with salt rim glass & lime",
            price: "$10",
            tag: "Fan Favourite",
          },
          {
            name: "Spicy Margarita",
            desc: "2 oz Tequila, 1 oz Cointreau, lime juice, simple syrup & sliced jalapeño pepper. Shaken on ice, salt rim glass & lime",
            price: "$10",
            tag: "Must Try",
          },
          {
            name: "Michelada (Chelada)",
            desc: "1 Mexican beer (Corona), Clamato juice, Tobasco, Worcestershire, with tajin spiced rim glass & lime",
            price: "$8",
          },
          {
            name: "Bucket of Corona Cerveza",
            desc: "5 Mexican beer (Corona) served in an iced bucket with lime wedges",
            price: "$35",
            tag: "Bestseller",
          },
        ],
      },
      {
        title: "APPETIZERS",
        items: [
          {
            name: "Pico De Gallo & Chips",
            desc: "Fresh Mexican salsa made with tomato, onion, cilantro, jalapeño pepper, lime juice & salt. Served with corn tortilla chips",
            price: "$12",
          },
          {
            name: "Loaded Nachos",
            desc: "Tortilla chips, cheese, peppers, tomato, bacon, onion. Served with salsa & sour cream",
            price: "$16",
          },
        ],
      },
    ],
  },
];

export default function MenuPage() {
  const [activeMenu, setActiveMenu] = useState("breakfast");
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const tabsRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  const current = MENUS.find((m) => m.id === activeMenu);

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
    if (!tabsRef.current) return;
    const activeBtn = tabsRef.current.querySelector(
      `[data-id="${activeMenu}"]`,
    );
    if (!activeBtn) return;
    const { offsetLeft, offsetWidth } = activeBtn;
    setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    activeBtn.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeMenu]);

  return (
    <div style={s.root}>
      <Helmet>
        <title>Bean & Olive | Menu - Thunder Bay Café & Bar</title>
        <meta
          name="description"
          content="Explore the Bean & Olive menu in Thunder Bay. Breakfast, lunch, dinner, cocktails, and weekly specials made with fresh, locally inspired ingredients."
        />
        <meta
          name="keywords"
          content="Bean & Olive menu, Thunder Bay cafe, restaurant menu, breakfast Thunder Bay, cocktails Thunder Bay, lunch dinner menu"
        />
        <meta property="og:title" content="Bean & Olive | Menu" />
        <meta
          property="og:description"
          content="Discover our full menu: breakfast, lunch, dinner, drinks, and weekly specials in Thunder Bay."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bean & Olive | Menu" />
        <meta
          name="twitter:description"
          content="Breakfast, lunch, dinner & cocktails at Bean & Olive, Thunder Bay."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      {/* ── NAV ── */}
      <nav
        style={{
          ...s.nav,
          ...(scrolled ? s.navScrolled : {}),
          padding: isMobile ? "0.9rem 1.2rem" : "1.25rem 3rem",
        }}
      >
        <div style={s.navLogo}>
          <img src={logo} alt="Bean & Olive Logo" style={s.navLogoImage} />
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
                  ...(link.path === "/menu" ? s.navLinkActive : {}),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#000";
                  e.currentTarget.style.letterSpacing = "3px";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    link.path === "/menu" ? "#000" : "rgba(0,0,0,0.5)";
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

      {/* ── PAGE HERO ── */}
      <motion.div
        style={{
          ...s.pageHero,
          height: isMobile ? "38svh" : "42vh",
          minHeight: isMobile ? "220px" : "320px",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div style={s.pageHeroBg} />
        <div style={s.pageHeroOverlay} />

        {/* String lights */}
        <div style={s.lightsRow}>
          {Array.from({ length: isMobile ? 8 : 14 }).map((_, i, arr) => (
            <div
              key={i}
              style={{
                ...s.lightBulb,
                animationDelay: `${i * 0.3}s`,
                left: `${(i / (arr.length - 1)) * 96 + 2}%`,
              }}
            />
          ))}
        </div>

        <div
          style={{
            ...s.pageHeroContent,
            padding: isMobile ? "0 1.2rem" : "0 2rem",
          }}
        >
          <motion.p
            style={{
              ...s.heroEyebrow,
              fontSize: isMobile ? "0.58rem" : "0.65rem",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            BEAN &amp; OLIVE · THUNDER BAY
          </motion.p>
          <motion.h1
            style={{
              ...s.heroHeadline,
              fontSize: isMobile
                ? "clamp(2.2rem, 10vw, 3rem)"
                : "clamp(3rem, 6vw, 5.5rem)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
          >
            Our Menus
          </motion.h1>
          <motion.div
            style={s.heroDivider}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          />
          {!isMobile && (
            <motion.p
              style={s.heroSub}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              Seasonally inspired. Thoughtfully sourced. Lovingly made.
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* ── STICKY TABS ── */}
      <div
        style={{
          ...s.tabsWrapper,
          top: isMobile ? "54px" : "61px",
        }}
      >
        <div style={s.tabsInner} ref={tabsRef}>
          {MENUS.map((menu) => (
            <button
              key={menu.id}
              data-id={menu.id}
              style={{
                ...s.tab,
                ...(activeMenu === menu.id ? s.tabActive : {}),
                padding: isMobile ? "1rem 1rem" : "1.3rem 1.4rem",
                fontSize: isMobile ? "0.6rem" : "0.66rem",
              }}
              onClick={() => setActiveMenu(menu.id)}
              onMouseEnter={(e) => {
                if (activeMenu !== menu.id)
                  e.currentTarget.style.color = "#000";
              }}
              onMouseLeave={(e) => {
                if (activeMenu !== menu.id)
                  e.currentTarget.style.color = "rgba(0,0,0,0.45)";
              }}
            >
              {/* Always show short label on mobile, long on desktop */}
              <span style={{ display: isMobile ? "none" : "inline" }}>
                {menu.label}
              </span>
              <span style={{ display: isMobile ? "inline" : "none" }}>
                {menu.short}
              </span>
            </button>
          ))}
          <div
            style={{
              ...s.tabIndicator,
              ...indicatorStyle,
              transition:
                "left 0.35s cubic-bezier(.4,0,.2,1), width 0.35s cubic-bezier(.4,0,.2,1)",
            }}
          />
        </div>
      </div>

      {/* ── MENU CONTENT ── */}
      <div
        style={{
          ...s.menuBody,
          padding: isMobile ? "1.8rem 1rem 4rem" : "3.5rem 2rem 4rem",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMenu}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {/* Special badges */}
            {activeMenu === "wednesday" && (
              <div style={s.specialBadge}>
                <span
                  style={{
                    ...s.specialBadgeText,
                    fontSize: isMobile ? "0.58rem" : "0.65rem",
                  }}
                >
                  ✦ EVERY WEDNESDAY · APPETIZERS &amp; DRINKS · 6PM – 10PM ✦
                </span>
              </div>
            )}
            {activeMenu === "hotlunch" && (
              <div style={{ ...s.specialBadge, background: "#1a1208" }}>
                <span
                  style={{
                    ...s.specialBadgeText,
                    fontSize: isMobile ? "0.58rem" : "0.65rem",
                  }}
                >
                  ✦ ALL ITEMS $15 · 11:00AM – 2:00PM ✦
                </span>
              </div>
            )}

            {/* Menu header */}
            <div
              style={{
                ...s.menuMeta,
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "flex-end",
                gap: isMobile ? "0.5rem" : "1rem",
                marginBottom: isMobile ? "1rem" : "2rem",
              }}
            >
              <div>
                <h2
                  style={{
                    ...s.menuTitle,
                    fontSize: isMobile
                      ? "1.5rem"
                      : "clamp(1.8rem, 3vw, 2.8rem)",
                  }}
                >
                  {current.label}
                </h2>
                <p
                  style={{
                    ...s.menuTagline,
                    fontSize: isMobile ? "0.9rem" : "1.05rem",
                  }}
                >
                  {current.tagline}
                </p>
              </div>
              <div style={s.menuMetaRight}>
                <span style={s.clockIcon}>◷</span>
                <span
                  style={{
                    ...s.menuHours,
                    fontSize: isMobile ? "0.62rem" : "0.7rem",
                  }}
                >
                  {current.hours}
                </span>
              </div>
            </div>

            <div style={s.menuDividerFull} />

            {/* Sections */}
            {current.sections.map((section, si) => (
              <motion.div
                key={section.title}
                style={{
                  ...s.section,
                  marginBottom: isMobile ? "2.5rem" : "3.5rem",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: si * 0.08, duration: 0.5 }}
              >
                <div
                  style={{
                    ...s.sectionHeader,
                    marginBottom: isMobile ? "1.2rem" : "1.8rem",
                  }}
                >
                  <h3
                    style={{
                      ...s.sectionTitle,
                      fontSize: isMobile ? "0.58rem" : "0.62rem",
                    }}
                  >
                    {section.title}
                  </h3>
                  <div style={s.sectionLine} />
                </div>

                {/* Mobile: single-column list. Desktop: grid */}
                <div style={isMobile ? s.itemsListMobile : s.itemsGrid}>
                  {section.items.map((item, ii) => (
                    <motion.div
                      key={item.name}
                      style={isMobile ? s.itemRowMobile : s.itemCard}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: si * 0.08 + ii * 0.04,
                        duration: 0.35,
                      }}
                      onMouseEnter={
                        !isMobile
                          ? (e) => {
                              e.currentTarget.style.borderColor =
                                "rgba(0,0,0,0.2)";
                              e.currentTarget.style.background = "#fafafa";
                            }
                          : undefined
                      }
                      onMouseLeave={
                        !isMobile
                          ? (e) => {
                              e.currentTarget.style.borderColor =
                                "rgba(0,0,0,0.07)";
                              e.currentTarget.style.background = "#fff";
                            }
                          : undefined
                      }
                    >
                      {isMobile ? (
                        // ── MOBILE: horizontal row layout ──
                        <>
                          <div style={s.itemRowTop}>
                            <span style={s.itemNameMobile}>{item.name}</span>
                            <span style={s.itemPriceMobile}>{item.price}</span>
                          </div>
                          {item.desc && (
                            <p style={s.itemDescMobile}>{item.desc}</p>
                          )}
                          {item.tag && (
                            <span style={s.itemTagMobile}>{item.tag}</span>
                          )}
                        </>
                      ) : (
                        // ── DESKTOP: card layout ──
                        <>
                          <div style={s.itemTop}>
                            <div style={s.itemNameRow}>
                              <span style={s.itemName}>{item.name}</span>
                            </div>
                            <span style={s.itemPrice}>{item.price}</span>
                          </div>
                          <p style={s.itemDesc}>{item.desc}</p>
                          {item.tag && (
                            <span style={s.itemTag}>{item.tag}</span>
                          )}
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={s.footerDivider} />

      {/* ── FOOTER ── */}
      <footer
        style={{
          ...s.footer,
          padding: isMobile ? "2.5rem 1.2rem 2rem" : "4rem 3rem 2rem",
        }}
      >
        <div
          style={{
            ...s.footerInner,
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "1.5rem" : "4rem",
          }}
        >
          <div style={s.footerBrand}>
            <span style={s.footerLogo}>Bean &amp; Olive</span>
            <p style={s.footerTagline}>Coffee &amp; Bar · Est. 2023</p>
          </div>
          <div style={s.footerLinks}>
            <p style={s.footerHeading}>Navigate</p>
            {NAV_LINKS.map((l) => (
              <Link key={l.name} to={l.path} style={s.footerLink}>
                {l.name}
              </Link>
            ))}
          </div>
          <div style={s.footerContact}>
            <p style={s.footerHeading}>Find Us</p>
            <p style={s.footerInfo}>
              1725 Hwy 61
              <br />
              Thunder Bay, ON
            </p>
            <p style={s.footerInfo}>+1 807-577-2326</p>
            <p style={s.footerInfo}>beanandolive@hotmail.com</p>

            <p style={{ ...s.footerHeading, marginTop: "1rem" }}>
              Opening Hours
            </p>
            <p style={s.footerInfo}>Monday: 8 AM – 2 PM</p>
            <p style={s.footerInfo}>Tuesday: 8 AM – 7 PM</p>
            <p style={s.footerInfo}>Wednesday: 8 AM – 10 PM</p>
            <p style={s.footerInfo}>Thursday: 8 AM – 10 PM</p>
            <p style={s.footerInfo}>Friday: 8 AM – 11 PM</p>
            <p style={s.footerInfo}>Saturday: 9 AM – 11 PM</p>
            <p style={s.footerInfo}>Sunday: 9 AM – 2 PM</p>
          </div>
        </div>
        <div style={s.footerBottom}>
          <p style={s.footerCopy}>© 2026 Bean &amp; Olive.</p>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Josefin+Sans:wght@300;400;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body, html, #root { background: #fff; overflow-x: hidden; }
        a, button { -webkit-tap-highlight-color: transparent; }
        * { -webkit-overflow-scrolling: touch; }

        /* Hide scrollbar on tabs */
        .tabs-scroll { scrollbar-width: none; }
        .tabs-scroll::-webkit-scrollbar { display: none; }

        @keyframes flicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 0.88; }
          94% { opacity: 1; }
          96% { opacity: 0.92; }
        }
      `}</style>
    </div>
  );
}

/* ─── STYLES ─────────────────────────────────────────────────────────────── */
const s = {
  root: {
    fontFamily: "'Josefin Sans', sans-serif",
    background: "#fff",
    color: "#000",
    overflowX: "hidden",
    minHeight: "100vh",
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
    transition: "all 0.4s ease",
    background:
      "linear-gradient(to bottom, rgba(111,78,55,0.22), rgba(111,78,55,0.05), transparent)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  navScrolled: {
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(245,236,215,0.92))",
    borderBottom: "1px solid rgba(200,169,110,0.22)",
    boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
  },
  navLogo: { display: "flex", alignItems: "center", gap: "0.6rem" },
  navLogoImage: {
    height: "34px",
    width: "auto",
    objectFit: "contain",
    display: "block",
  },
  navLogoText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 600,
    color: "#000000",
    letterSpacing: "0.5px",
  },
  navLinks: { display: "flex", gap: "2.5rem", listStyle: "none" },
  navLink: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.72rem",
    letterSpacing: "2px",
    fontWeight: 600,
    color: "rgba(20,16,12,0.72)",
    textShadow: "0 1px 8px rgba(255,255,255,0.35)",
    textDecoration: "none",
    transition: "color 0.25s, letter-spacing 0.25s",
  },
  navLinkActive: { color: "#000" },
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

  // HERO
  pageHero: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  pageHeroBg: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse at 30% 50%, #c4a484 0%, #a47551 50%, #6f4e37 100%)",
  },
  pageHeroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.35) 100%)",
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
  pageHeroContent: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
  },
  heroEyebrow: {
    fontFamily: "'Josefin Sans', sans-serif",
    letterSpacing: "4px",
    color: "rgba(0,0,0,0.7)",
    marginBottom: "0.75rem",
  },
  heroHeadline: {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 300,
    fontStyle: "italic",
    color: "#000",
    lineHeight: 1,
    marginBottom: "1rem",
  },
  heroDivider: {
    width: "40px",
    height: "1px",
    background: "#000",
    margin: "0 auto 1rem",
    transformOrigin: "left",
  },
  heroSub: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.8rem",
    letterSpacing: "1.5px",
    color: "rgba(0,0,0,0.78)",
    fontWeight: 300,
  },

  // TABS
  tabsWrapper: {
    position: "sticky",
    zIndex: 90,
    background: "#fff",
    borderBottom: "1px solid rgba(0,0,0,0.12)",
  },
  tabsInner: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    alignItems: "stretch",
    position: "relative",
    overflowX: "auto",
    scrollbarWidth: "none",
    padding: "0 0.5rem",
  },
  tab: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Josefin Sans', sans-serif",
    letterSpacing: "2px",
    fontWeight: 600,
    color: "rgba(0,0,0,0.45)",
    whiteSpace: "nowrap",
    transition: "color 0.25s",
    position: "relative",
    flexShrink: 0,
  },
  tabActive: { color: "#000" },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    height: "2px",
    background: "#000",
  },

  // SPECIAL BADGES
  specialBadge: {
    background: "#000",
    padding: "0.65rem 1.2rem",
    marginBottom: "1.5rem",
    textAlign: "center",
    borderRadius: "4px",
  },
  specialBadgeText: {
    fontFamily: "'Josefin Sans', sans-serif",
    letterSpacing: "3px",
    color: "#fff",
    fontWeight: 600,
  },

  // MENU BODY
  menuBody: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  menuMeta: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  menuTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 600,
    color: "#000",
    letterSpacing: "0.5px",
    marginBottom: "0.3rem",
  },
  menuTagline: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: "italic",
    fontWeight: 300,
    color: "rgba(0,0,0,0.72)",
  },
  menuMetaRight: { display: "flex", alignItems: "center", gap: "0.4rem" },
  clockIcon: { fontSize: "0.9rem", color: "rgba(0,0,0,0.35)" },
  menuHours: {
    fontFamily: "'Josefin Sans', sans-serif",
    letterSpacing: "1px",
    color: "rgba(0,0,0,0.7)",
    fontWeight: 300,
    lineHeight: 1.5,
  },
  menuDividerFull: {
    height: "1px",
    background: "rgba(0,0,0,0.12)",
    marginBottom: "2rem",
  },

  // SECTIONS
  section: {},
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  sectionTitle: {
    fontFamily: "'Josefin Sans', sans-serif",
    letterSpacing: "3.5px",
    fontWeight: 600,
    color: "#000",
    whiteSpace: "nowrap",
  },
  sectionLine: { flex: 1, height: "1px", background: "rgba(0,0,0,0.1)" },

  // DESKTOP GRID
  itemsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1rem",
  },
  itemCard: {
    padding: "1.4rem 1.5rem",
    border: "1px solid rgba(0,0,0,0.07)",
    background: "#fff",
    transition: "border-color 0.25s, background 0.25s",
    cursor: "default",
  },
  itemTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "0.5rem",
    gap: "0.8rem",
  },
  itemNameRow: { display: "flex", flexDirection: "column", gap: "0.35rem" },
  itemName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "1.45rem",
    fontWeight: 700,
    color: "#000",
    lineHeight: 1.2,
  },
  itemPrice: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.82rem",
    fontWeight: 300,
    color: "#000",
    whiteSpace: "nowrap",
    paddingTop: "2px",
  },
  itemDesc: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.82rem",
    fontWeight: 300,
    color: "rgba(0,0,0,0.75)",
    lineHeight: 1.7,
    letterSpacing: "0.2px",
  },
  itemTag: {
    display: "inline-block",
    marginTop: "0.6rem",
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.6rem",
    letterSpacing: "2px",
    color: "rgba(0,0,0,0.5)",
    border: "1px solid rgba(0,0,0,0.2)",
    padding: "2px 8px",
    borderRadius: "999px",
  },

  // MOBILE LIST
  itemsListMobile: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },
  itemRowMobile: {
    padding: "0.95rem 0",
    borderBottom: "1px solid rgba(0,0,0,0.07)",
  },
  itemRowTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: "0.75rem",
    marginBottom: "0.3rem",
  },
  itemNameMobile: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#000",
    lineHeight: 1.2,
    flex: 1,
  },
  itemPriceMobile: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.8rem",
    fontWeight: 400,
    color: "#000",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  itemDescMobile: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.75rem",
    fontWeight: 300,
    color: "rgba(0,0,0,0.62)",
    lineHeight: 1.65,
    letterSpacing: "0.1px",
  },
  itemTagMobile: {
    display: "inline-block",
    marginTop: "0.4rem",
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.55rem",
    letterSpacing: "1.5px",
    color: "rgba(0,0,0,0.45)",
    border: "1px solid rgba(0,0,0,0.18)",
    padding: "2px 7px",
    borderRadius: "999px",
  },

  // FOOTER
  footerDivider: {
    height: "1px",
    background: "rgba(0,0,0,0.12)",
    maxWidth: "1100px",
    margin: "0 auto 2rem",
  },
  footer: { background: "#fff" },
  footerInner: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    flexWrap: "wrap",
    paddingBottom: "2rem",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    marginBottom: "1.5rem",
  },
  footerBrand: {
    flex: "1 1 200px",
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  footerLogo: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "1.6rem",
    fontWeight: 600,
    color: "#000",
  },
  footerTagline: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.68rem",
    letterSpacing: "2px",
    color: "rgba(0,0,0,0.6)",
    fontWeight: 300,
  },
  footerLinks: {
    flex: "1 1 160px",
    display: "flex",
    flexDirection: "column",
    gap: "0.65rem",
  },
  footerContact: {
    flex: "1 1 200px",
    display: "flex",
    flexDirection: "column",
    gap: "0.65rem",
  },
  footerHeading: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.62rem",
    letterSpacing: "3px",
    color: "#000",
    marginBottom: "0.3rem",
    fontWeight: 600,
  },
  footerLink: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.76rem",
    color: "rgba(0,0,0,0.7)",
    textDecoration: "none",
    letterSpacing: "0.5px",
    fontWeight: 300,
  },
  footerInfo: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.76rem",
    color: "rgba(0,0,0,0.7)",
    letterSpacing: "0.3px",
    fontWeight: 300,
    lineHeight: 1.7,
  },
  footerBottom: { maxWidth: "1100px", margin: "0 auto", textAlign: "center" },
  footerCopy: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "0.66rem",
    letterSpacing: "1px",
    color: "rgba(0,0,0,0.35)",
  },
};
