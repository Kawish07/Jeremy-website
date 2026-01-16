import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getLenis } from "./lib/lenis";
import { resolveImage, ensureProtocol, API } from "./lib/image";
import PageLoader from "./components/PageLoader";
import TransitionSplash from "./components/TransitionSplash";
import FloatingCTA from "./components/FloatingCTA";

export default function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupSubmitted, setPopupSubmitted] = useState(false);
  const [showLeftPopup, setShowLeftPopup] = useState(false);
  const [leftSubmitted, setLeftSubmitted] = useState(false);
  const [leftAnimating, setLeftAnimating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    interest: "",
    message: "",
    bestTime: "",
  });
  const [leftLoading, setLeftLoading] = useState(false);
  const [leftError, setLeftError] = useState(null);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const hasShownPopup = useRef(false);
  const [showHeader, setShowHeader] = useState(true);
  const isInitialMount = useRef(true); // Track if this is the first mount

  const location = useLocation();

  // Scroll handling for popup and header
  useEffect(() => {
    lastScrollY.current = typeof window !== "undefined" ? window.scrollY : 0;

    const handleScroll = (currentScrollY) => {
      // Show popup after scrolling past hero section
      if (!hasShownPopup.current && currentScrollY > 600) {
        setShowPopup(true);
        hasShownPopup.current = true;
      }

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const delta = currentScrollY - lastScrollY.current;
          if (delta > 10) {
            setShowHeader(false);
          } else if (delta < -10) {
            setShowHeader(true);
          }
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    const _nativeHandler = () => handleScroll(window.scrollY);
    window.addEventListener("scroll", _nativeHandler, { passive: true });
    return () => {
      try {
        window.removeEventListener("scroll", _nativeHandler);
      } catch (e) {
        /* noop */
      }
    };
  }, []);

  // Handle scroll to anchor from navigation state
  useEffect(() => {
    try {
      const target = location && location.state && location.state.scrollTo;
      if (target && typeof target === "string" && target.startsWith("#")) {
        const doScroll = () => {
          const el = document.querySelector(target);
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY;
            const lenis = getLenis();
            if (lenis && typeof lenis.scrollTo === "function") {
              lenis.scrollTo(top, { immediate: false });
            } else {
              window.scrollTo({ top, behavior: "smooth" });
            }
          }
          window.history.replaceState({}, "", target);
        };
        setTimeout(doScroll, 120);
      }
    } catch (e) {
      // noop
    }
  }, [location]);

  // INITIAL PAGE LOAD - Only runs once when app first mounts
  useEffect(() => {
    const onLoad = () => {
      setTimeout(() => setGlobalLoading(false), 1000);
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  // ROUTE CHANGES - Only runs on subsequent route changes, NOT initial mount
  useEffect(() => {
    // Skip the effect on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Show loader for route changes
    setGlobalLoading(true);
    const t = setTimeout(() => setGlobalLoading(false), 1100);
    return () => clearTimeout(t);
  }, [location.pathname]);

  // LINK CLICKS - Show loader immediately when clicking internal links
  useEffect(() => {
    const onDocClick = (e) => {
      try {
        const el = e.target && e.target.closest && e.target.closest("a");
        if (!el) return;
        const href = el.getAttribute("href");
        if (!href) return;
        // resolve relative URLs and ignore clicks that point to the current page
        try {
          const targetUrl = new URL(href, window.location.href);
          const currentUrl = new URL(window.location.href);
          const samePath =
            targetUrl.pathname === currentUrl.pathname &&
            targetUrl.search === currentUrl.search;
          if (samePath) return; // clicking a link to the same page (e.g., logo) — don't show loader
        } catch (e) {
          // ignore URL parse errors and continue
        }
        if (href.startsWith("#")) return;
        if (el.target === "_blank" || el.hasAttribute("download")) return;
        if (href.startsWith("http") && !href.startsWith(window.location.origin))
          return;

        // Internal navigation — show loader immediately
        setGlobalLoading(true);
      } catch (err) {
        // noop
      }
    };

    document.addEventListener("click", onDocClick, true);
    return () => document.removeEventListener("click", onDocClick, true);
  }, []);

  // BROWSER BACK/FORWARD - Show loader on popstate
  useEffect(() => {
    const onPop = () => {
      setGlobalLoading(true);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Listen for explicit startPageLoad events (from Header)
  useEffect(() => {
    const onStart = () => setGlobalLoading(true);
    window.addEventListener("startPageLoad", onStart);
    return () => window.removeEventListener("startPageLoad", onStart);
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // basic validation
    if (!formData.name || !formData.email)
      return alert("Please provide name and email");
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        consent: !!formData.consent,
        message: formData.message || "",
        source: "homepage-popup",
      };

      const response = await fetch(`${API}/api/popup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit. Please try again later.");
      }

      setPopupSubmitted(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        interest: "",
        message: "",
        bestTime: "",
        consent: false,
      });
    } catch (err) {
      console.error("Popup submit failed", err);
      alert("Failed to submit. Please try again later.");
    }
  };

  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const [featuredListing, setFeaturedListing] = useState(null);

  // Fetch latest listing for featured section
  useEffect(() => {
    let mounted = true;
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API}/api/listings`);
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        // server returns sorted by createdAt desc, so first is latest
        if (Array.isArray(data) && data.length > 0) {
          setFeaturedListing(data[0]);
        }
      } catch (e) {
        // noop
      }
    };
    fetchFeatured();
    return () => {
      mounted = false;
    };
  }, [API]);
  const handleLeftSubmit = async (e) => {
    e.preventDefault();
    setLeftError(null);
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.interest ||
      !formData.bestTime
    ) {
      setLeftError(
        "Please complete all required fields and select a preferred date/time."
      );
      return;
    }
    setLeftLoading(true);
    try {
      // Prepare payload
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bestTime: formData.bestTime,
        timezone: "ET",
        interest: formData.interest,
      };

      const response = await fetch(`${API}/api/letsconnect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Failed to submit");
        throw new Error(
          errorText || "Failed to submit. Please try again later."
        );
      }

      setLeftSubmitted(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        interest: "",
        bestTime: "",
      });
    } catch (err) {
      console.error("LetsConnect submit failed", err);
      setLeftError("Failed to submit. Please try again.");
    } finally {
      setLeftLoading(false);
    }
  };

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.pause();
        setVideoPlaying(false);
      } else {
        videoRef.current.play();
        setVideoPlaying(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f1e5]">
      <PageLoader open={globalLoading} />
      <TransitionSplash />
      <Header />

      {/* Hero Section */}
      <section id="hero" className="relative">
        <div className="grid md:grid-cols-2 h-[90vh]">
          <div className="relative h-full overflow-hidden">
            <img
              src="images/jemey7 enhanced.jpg"
              alt="Jeremy Denham"
              className="hero-image w-full h-full object-cover object-center transform translate-y-8"
            />
          </div>
          <div className="hero-right flex flex-col justify-start mt-20 md:mt-28 pt-16 md:pt-20 pb-6 px-12 md:px-20 bg-[#f7f1e5] h-full relative overflow-hidden">
            <div className="absolute right-8 md:right-20 bottom-6 text-[#d8a24a] text-8xl md:text-9xl font-serif font-bold opacity-15 pointer-events-none z-0">
              Denham
            </div>

            <div className="relative z-10">
              <h1 className="text-5xl md:text-6xl font-serif mb-3 text-[#0f1f2e]">
                <span className="relative inline-block">
                  Jeremy
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-[#d8a24a] opacity-40 -z-10"></span>
                </span>
                Denham
              </h1>
              <div className="mb-8 relative">
                <h2 className="text-2xl md:text-3xl font-light text-[#2f3d4c] tracking-[0.3em] uppercase">
                  Real Estate Agent
                </h2>
                <div className="w-24 h-1 bg-[#d8a24a] mt-3"></div>
              </div>
              <p className="text-base leading-relaxed mb-5 text-[#2f3d4c] max-w-lg">
                Buying or selling a home is more than a transaction; it’s a
                major life milestone. Jeremy Denham is committed to guiding you
                through the process with clarity, integrity, and results you can
                trust. With a client-first mindset and a passion for real
                estate, Jeremy helps turn goals into successful outcomes. Your
                next move starts with confidence.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("openContactModal"))
                  }
                  className="px-8 py-3 rounded-full font-semibold bg-[#d8a24a] text-[#0f1f2e] border-2 border-[#d8a24a] hover:bg-[#f5c15c] transition-all duration-200 shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Black Bar */}
        <div className="bg-[#0f1f2e] text-[#f7f1e5] py-6 md:py-8 px-8 -mt-4 md:-mt-6 z-10 relative">
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            <div className="flex items-center space-x-2 text-xs md:text-sm">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-center font-bold">
                We are committed to upholding the principles of all applicable
              </span>
              <a
                href="https://www.nar.realtor/fair-housing/what-everyone-should-know-about-equal-opportunity-housing"
                className="underline hover:opacity-80 transition-opacity font-medium whitespace-nowrap text-[#d8a24a]"
              >
                fair housing laws
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Philip Scheinfeld Team Section */}
      <section
        id="team"
        className="relative py-20 px-6 bg-gradient-to-br from-[#f7f1e5] via-[#e6d7bd] to-[#d8a24a33] overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none"></div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] mb-6 text-[#d8a24a] font-light">
            UNPARALLELED MARKETING. WHITE GLOVE SERVICE.
          </p>
          <div className="w-16 h-px bg-[#d8a24a] mx-auto mb-6"></div>
          <h2 className="text-5xl md:text-6xl font-light mb-3 tracking-[0.4em] text-[#0f1f2e]">
            Jeremy Denham
          </h2>
          <div className="mb-8 relative">
            <h2 className="text-2xl md:text-3xl font-light text-[#2f3d4c] tracking-[0.3em] uppercase">
              Real Estate Agent
            </h2>
          </div>
          <p className="text-base leading-relaxed mb-16 max-w-5xl mx-auto text-[#2f3d4c]">
            Driven by a commitment to excellence, Jeremy Denham serves a
            steadily growing network of buyers, sellers, investors, and
            relocating families across Ottawa and the surrounding markets.
            Jeremy is known for delivering clear, data-backed real estate
            insight paired with an unwavering dedication to client success. His
            approach blends strategic marketing, sharp market intelligence, and
            a concierge level service experience, making it easy to see why
            clients consistently choose Jeremy Denham to lead their most
            important real estate decisions.
          </p>
          <div className="grid md:grid-cols-3 gap-12 mt-16">
            <div>
              <h3 className="text-3xl font-light mb-4 tracking-wider text-[#0f1f2e]">
                Top-Tier Local Expertise
              </h3>
              <p className="text-sm text-[#2f3d4c] leading-relaxed">
                Recognized for deep market knowledge and exceptional negotiation
                skills.
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-light mb-4 tracking-wider text-[#0f1f2e]">
                Hundreds of Successful Client Relationships
              </h3>
              <p className="text-sm text-[#2f3d4c] leading-relaxed">
                Built on trust, transparency, and a client-first philosophy.
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-light mb-4 tracking-wider text-[#0f1f2e]">
                Record-Level Client Satisfaction
              </h3>
              <p className="text-sm text-[#2f3d4c] leading-relaxed">
                A reputation defined by results, professionalism, and consistent
                performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listing Section (shows latest listing dynamically) */}
      <section id="listings" className="py-20 px-6 bg-[#0f1f2e] text-[#f7f1e5]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-0">
          <div className="relative">
            <img
              src={
                featuredListing &&
                featuredListing.images &&
                featuredListing.images.length
                  ? ensureProtocol(resolveImage(featuredListing.images[0]))
                  : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=800&fit=crop"
              }
              alt={
                featuredListing
                  ? featuredListing.title ||
                    featuredListing.address ||
                    "Featured Property"
                  : "Featured Property"
              }
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center px-12 py-16">
            <p className="text-sm tracking-widest mb-4">Featured Listing</p>
            <h2 className="text-4xl font-serif mb-6">
              {featuredListing
                ? featuredListing.address || featuredListing.title
                : "2440 64th Ave SE, Mercer Island 98040"}
            </h2>
            <p className="text-3xl mb-6">
              {featuredListing
                ? `$${Number(featuredListing.price || 0).toLocaleString()}`
                : "$1,650,000"}
            </p>
            <div className="flex space-x-6 text-sm mb-8">
              <span>
                {featuredListing
                  ? `${featuredListing.beds || 0} Beds`
                  : "3 Beds"}
              </span>
              <span>|</span>
              <span>
                {featuredListing
                  ? `${featuredListing.baths || 0} Baths`
                  : "2 Baths"}
              </span>
              <span>|</span>
              <span>
                {featuredListing
                  ? `${
                      featuredListing.livingArea ||
                      featuredListing.sqft ||
                      "N/A"
                    } Sq.Ft.`
                  : "1,770 Sq.Ft."}
              </span>
            </div>
            <div className="flex space-x-4">
              {featuredListing ? (
                <Link
                  to={`/listing/${featuredListing._id}`}
                  className="px-8 py-3 rounded-full font-semibold bg-[#d8a24a] text-[#0f1f2e] border-2 border-[#d8a24a] hover:bg-[#f5c15c] transition-all duration-200 shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
                >
                  View Listing
                </Link>
              ) : (
                <button className="px-8 py-3 rounded-full font-semibold bg-[#d8a24a] text-[#0f1f2e] border-2 border-[#d8a24a] hover:bg-[#f5c15c] transition-all duration-200 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
                  View Listing
                </button>
              )}
              <Link
                to="/all-listings"
                className="px-8 py-3 rounded-full font-semibold border-2 border-[#f7f1e5] text-[#f7f1e5] hover:bg-[#d8a24a] hover:border-[#d8a24a] hover:text-[#0f1f2e] transition-all duration-200 inline-flex items-center justify-center shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
              >
                View All
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Video / About Section */}
      <section id="video" className="py-20 px-6 bg-[#f7f1e5]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif mb-4 text-[#0f1f2e]">About Me</h2>
            <div className="w-16 h-1 bg-[#d8a24a] mb-6" />
            <p className="text-base leading-relaxed mb-8 text-[#2f3d4c]">
              I’m Jeremy Denham, a real estate professional who believes success
              starts with trust and clear communication. I work closely with
              buyers and sellers to understand their goals and create strategies
              that deliver real results. Every transaction is handled with
              professionalism, transparency, and care from start to finish. I
              take pride in making the process simple, informed, and
              stress-free. Whether you’re buying your first home or selling your
              next one, I’m here to guide you every step of the way.
            </p>
          </div>
          <div className="relative w-full flex justify-center md:justify-end">
            <div className="relative w-10/12 md:w-9/12 lg:w-8/12 max-w-md">
              <img
                src="/images/jemey2 enhanced.jpg"
                alt="Jeremy Denham"
                className="w-full h-auto object-cover rounded-3xl border border-[#e5d8c4] shadow-[0_18px_45px_rgba(15,31,46,0.12)] hover:shadow-[0_26px_60px_rgba(15,31,46,0.18)] transition-shadow duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Floating Bottom CTA (portal-mounted) */}
      <FloatingCTA
        onClick={() => {
          setShowLeftPopup(true);
          setTimeout(() => setLeftAnimating(true), 10);
        }}
      />

      {/* Left anchored modal triggered by CTA (portal-mounted to avoid stacking context issues) */}
      {showLeftPopup &&
        createPortal(
          <div className="fixed inset-0 z-[110002]">
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => {
                setLeftAnimating(false);
                setTimeout(() => {
                  setShowLeftPopup(false);
                  setLeftSubmitted(false);
                }, 300);
              }}
            />

            <div
              className={`fixed left-4 right-4 bottom-20 sm:left-8 sm:right-auto sm:bottom-24 w-auto sm:w-[320px] md:w-[420px] max-w-[95vw] bg-gradient-to-b from-[#0f1f2e] to-[#1c3b57] text-[#f7f1e5] rounded-2xl shadow-[0_20px_50px_rgba(15,31,46,0.4)] overflow-hidden transform transition-all duration-300 z-[110003] border border-[#d8a24a]/20 ${
                leftAnimating
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }`}
            >
              <div className="flex items-start justify-between px-4 sm:px-6 pt-4 sm:pt-6">
                <h3 className="text-xl sm:text-2xl font-serif text-[#f7f1e5]">
                  Let's Connect
                </h3>
                <button
                  onClick={() => {
                    setLeftAnimating(false);
                    setTimeout(() => {
                      setShowLeftPopup(false);
                      setLeftSubmitted(false);
                    }, 300);
                  }}
                  className="bg-white/10 hover:bg-white/20 p-1 rounded transition"
                >
                  <X className="w-5 h-5 text-[#f7f1e5]" />
                </button>
              </div>

              <div className="px-4 sm:px-6 py-3 sm:py-4">
                {!leftSubmitted ? (
                  <form
                    onSubmit={handleLeftSubmit}
                    className="space-y-3 sm:space-y-4"
                  >
                    <div>
                      <label className="block text-xs text-[#d8a24a] mb-2 tracking-wide font-medium">
                        Full Name *
                      </label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder=""
                        className="w-full px-3 py-2 sm:py-3 bg-white/5 border border-[#d8a24a]/40 rounded text-[#f7f1e5] text-sm sm:text-base placeholder-[#9c8a6b] focus:outline-none focus:border-[#d8a24a] focus:ring-2 focus:ring-[#d8a24a]/30 transition-colors duration-200 hover:border-[#d8a24a]/60"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#d8a24a] mb-2 tracking-wide font-medium">
                        Email *
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder=""
                        className="w-full px-3 py-2 sm:py-3 bg-white/5 border border-[#d8a24a]/40 rounded text-[#f7f1e5] text-sm sm:text-base placeholder-[#9c8a6b] focus:outline-none focus:border-[#d8a24a] focus:ring-2 focus:ring-[#d8a24a]/30 transition-colors duration-200 hover:border-[#d8a24a]/60"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#d8a24a] mb-2 tracking-wide font-medium">
                        Phone *
                      </label>
                      <input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder=""
                        className="w-full px-3 py-2 sm:py-3 bg-white/5 border border-[#d8a24a]/40 rounded text-[#f7f1e5] text-sm sm:text-base placeholder-[#9c8a6b] focus:outline-none focus:border-[#d8a24a] focus:ring-2 focus:ring-[#d8a24a]/30 transition-colors duration-200 hover:border-[#d8a24a]/60"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-xs text-[#d8a24a] mb-2 tracking-wide font-medium">
                        Interested in... *
                      </label>
                      <select
                        name="interest"
                        value={formData.interest}
                        onChange={handleInputChange}
                        required
                        className="appearance-none w-full px-3 py-2 sm:py-3 bg-white/5 border border-[#d8a24a]/40 rounded text-[#f7f1e5] text-sm sm:text-base placeholder-[#9c8a6b] focus:outline-none focus:border-[#d8a24a] focus:ring-2 focus:ring-[#d8a24a]/30 transition-colors duration-200 hover:border-[#d8a24a]/60"
                      >
                        <option value="" disabled className="bg-[#0f1f2e]">
                          Select an option
                        </option>
                        <option value="buying" className="bg-[#0f1f2e]">Buying</option>
                        <option value="selling" className="bg-[#0f1f2e]">Selling</option>
                        <option value="renting" className="bg-[#0f1f2e]">Renting</option>
                        <option value="other" className="bg-[#0f1f2e]">Other</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center mt-6">
                        <svg
                          className="w-4 h-4 text-[#d8a24a]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-[#d8a24a] mb-2 tracking-wide font-medium">
                        Best time to connect (ET) *
                      </label>
                      <input
                        name="bestTime"
                        type="datetime-local"
                        value={formData.bestTime}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 sm:py-3 bg-white/5 border border-[#d8a24a]/40 rounded text-[#f7f1e5] text-sm sm:text-base placeholder-[#9c8a6b] focus:outline-none focus:border-[#d8a24a] focus:ring-2 focus:ring-[#d8a24a]/30 transition-colors duration-200 hover:border-[#d8a24a]/60"
                      />
                    </div>

                    {leftError && (
                      <p className="text-[#f5a962] text-sm">{leftError}</p>
                    )}

                    <div className="flex items-start space-x-3">
                      <input
                        id="left-consent"
                        required
                        type="checkbox"
                        className="w-4 h-4 mt-1 accent-[#d8a24a] bg-white/5 border border-[#d8a24a]/40"
                      />
                      <label
                        htmlFor="left-consent"
                        className="text-xs text-[#e8dfcf] leading-relaxed"
                      >
                        I agree to receive marketing communications and acknowledge the{" "}
                        <a href="#" className="text-[#d8a24a] underline hover:text-[#f5c15c]">
                          Privacy Policy
                        </a>
                      </label>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={leftLoading}
                        className="w-full bg-[#d8a24a] text-[#0f1f2e] py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-[#f5c15c] transition-all duration-200 transform hover:shadow-lg disabled:opacity-50 shadow-[0_12px_30px_rgba(216,162,74,0.3)]"
                      >
                        {leftLoading ? "SENDING..." : "Submit"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-[#d8a24a] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-6 h-6 text-[#0f1f2e]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-[#f7f1e5] mb-4 text-sm sm:text-base">Thanks — we'll be in touch shortly.</p>
                    <button
                      onClick={() => {
                        setLeftAnimating(false);
                        setTimeout(() => {
                          setShowLeftPopup(false);
                          setLeftSubmitted(false);
                        }, 300);
                      }}
                      className="px-6 py-2 border border-[#d8a24a] text-[#d8a24a] rounded-full hover:bg-[#d8a24a] hover:text-[#0f1f2e] transition-all duration-200"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Popup Modal */}
      {showPopup && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
            showPopup ? "animate-fadeIn" : ""
          }`}
        >
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-500 ${
              showPopup ? "bg-opacity-60" : "bg-opacity-0"
            }`}
            onClick={() => setShowPopup(false)}
          />
          <div
            className={`relative max-w-6xl w-full mx-4 shadow-2xl rounded-lg overflow-hidden transform transition-all duration-700 ease-out ${
              showPopup
                ? "scale-100 opacity-100 translate-y-0"
                : "scale-90 opacity-0 translate-y-8"
            } ${popupSubmitted ? "bg-[#f7f1e5]" : ""}`}
            style={{
              backgroundColor: popupSubmitted ? "#f7f1e5" : "#0f1f2e",
              maxHeight: "90vh",
            }}
          >
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-[#d8a24a] bg-opacity-80 hover:bg-opacity-100 transition-all duration-300 hover:rotate-90"
            >
              <X className="w-5 h-5 text-[#0f1f2e]" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-5 max-h-[90vh] overflow-y-auto">
              {/* Left Side - Image */}
              <div className="relative h-48 sm:h-64 md:h-auto overflow-hidden md:col-span-2">
                <img
                  src={
                    popupSubmitted
                      ? "/images/REALESTATEHEROSECTIONIMAGE.jpg"
                      : "/images/REALESTATEHEROSECTIONIMAGE.jpg"
                  }
                  alt="Luxury Property"
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    popupSubmitted ? "scale-110" : "scale-100"
                  }`}
                />
                <div
                    className={`absolute inset-0 bg-gradient-to-t from-[#0f1f2e] via-transparent to-transparent transition-opacity duration-700 ${
                    popupSubmitted ? "opacity-30" : "opacity-60"
                  }`}
                />
              </div>

              {/* Right Side - Scrollable Content */}
              <div
                className={`p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col transition-all duration-700 md:col-span-3 overflow-y-auto bg-[#f7f1e5]`}
              >
                {!popupSubmitted ? (
                  <div className="animate-slideInRight">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-light mb-2 text-[#0f1f2e] tracking-wide">
                      NOT READY TO START YOUR
                    </h2>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-light mb-2 text-[#d8a24a] tracking-wide">
                      SEARCH YET?
                    </h2>
                    <p className="text-[#2f3d4c] mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base leading-relaxed">
                      No worries! We can keep you up to date on the market and
                      add you to a curated Collection.
                    </p>

                    <form
                      onSubmit={handleFormSubmit}
                      className="space-y-3 sm:space-y-4 md:space-y-5 mb-4 sm:mb-6"
                    >
                      <div>
                        <label className="block text-xs text-[#0f1f2e] mb-2 tracking-wide font-medium">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-[#d8a24a]/30 text-[#0f1f2e] placeholder-[#9c8a6b] focus:outline-none focus:border-[#d8a24a] focus:ring-2 focus:ring-[#d8a24a]/20 transition-all text-sm sm:text-base"
                          placeholder=""
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#0f1f2e] mb-2 tracking-wide font-medium">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-[#d8a24a]/30 text-[#0f1f2e] placeholder-[#9c8a6b] focus:outline-none focus:border-[#d8a24a] focus:ring-2 focus:ring-[#d8a24a]/20 transition-all text-sm sm:text-base"
                          placeholder=""
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#0f1f2e] mb-2 tracking-wide font-medium">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-[#d8a24a]/30 text-[#0f1f2e] placeholder-[#9c8a6b] focus:outline-none focus:border-[#d8a24a] focus:ring-2 focus:ring-[#d8a24a]/20 transition-all text-sm sm:text-base"
                          placeholder=""
                        />
                      </div>

                      <div className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          id="consent"
                          required
                          className="mt-1 w-4 h-4 border-[#d8a24a] accent-[#d8a24a]"
                        />
                        <label
                          htmlFor="consent"
                          className="text-xs text-[#2f3d4c] leading-relaxed"
                        >
                          By providing your contact
                          information, you acknowledge and agree to our{" "}
                          <a href="#" className="underline hover:text-[#0f1f2e] text-[#d8a24a]">
                            Privacy Policy
                          </a>{" "}
                          and consent to receiving marketing communications,
                          including through automated calls, texts, and emails,
                          some of which may use artificial or prerecorded
                          voices. This consent isn't necessary for purchasing
                          any products or services and you may opt out at any
                          time.
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 sm:py-4 bg-[#d8a24a] text-[#0f1f2e] font-semibold tracking-widest hover:bg-[#f5c15c] transition-all duration-300 transform hover:scale-105 shadow-[0_12px_30px_rgba(216,162,74,0.3)] text-xs sm:text-sm rounded-full"
                      >
                        SUBSCRIBE NOW
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="text-center animate-fadeInUp flex flex-col justify-center h-full py-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#d8a24a] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-scaleIn">
                      <svg
                        className="w-6 h-6 sm:w-8 sm:h-8 text-[#0f1f2e]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif mb-3 sm:mb-4 text-[#0f1f2e]">
                      Thank You!
                    </h2>
                    <p className="text-sm sm:text-base text-[#2f3d4c] mb-4 sm:mb-6 px-4">
                      We've received your information and will be in touch
                      shortly with exclusive property updates.
                    </p>
                    <button
                      onClick={() => setShowPopup(false)}
                      className="px-6 sm:px-8 py-2 sm:py-3 bg-[#d8a24a] text-[#0f1f2e] hover:bg-[#f5c15c] transition-all duration-200 font-medium mx-auto text-sm sm:text-base rounded-full shadow-[0_12px_30px_rgba(216,162,74,0.3)]"
                    >
                      Continue Exploring
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
