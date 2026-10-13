import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { branding } from "@/config/branding";
import { useAuth } from "@/contexts/AuthContext";

// Floating pill navbar (guns.lol style): centered, glass, hairline border.
// Sits 12px from top instead of full-bleed bar; blurs on scroll.
const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Showcase", href: "#showcase" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-3 inset-x-0 z-50 px-3 sm:px-4">
      <div
        className={cn(
          "mx-auto max-w-3xl rounded-full border transition-all duration-300",
          scrolled || isOpen
            ? "glass-strong shadow-xl shadow-black/40"
            : "border-white/[0.06] bg-black/30 backdrop-blur-md"
        )}
      >
        <nav className="flex items-center justify-between h-13 px-3 sm:px-4 py-2">
          <Link to="/" className="flex items-center gap-2.5 group pl-1">
            <div className="relative h-8 w-8 rounded-full bg-white flex items-center justify-center text-sm font-bold text-zinc-950 transition-transform group-hover:scale-105">
              {branding.name.charAt(0)}
            </div>
            <span className="text-[15px] font-semibold text-white tracking-tight font-display">
              {branding.name}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 text-[13px] font-medium text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/api-docs"
              className="px-3 py-1.5 text-[13px] font-medium text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
              API
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 h-9 px-4 text-[13px] rounded-full font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-all"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center h-9 px-4 text-[13px] rounded-full font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center h-9 px-4 text-[13px] rounded-full font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 -mr-1 text-zinc-400 hover:text-white transition-colors rounded-full"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile dropdown lives inside the pill so it stays one surface */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="px-3 pb-3 pt-1 flex flex-col gap-1 border-t border-white/[0.06] mt-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-xl hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/api-docs"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-xl hover:bg-white/5"
            >
              API Docs
            </Link>
            <div className="mt-2 pt-2 border-t border-white/[0.06] flex flex-col gap-2">
              {user ? (
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center gap-2 h-10 px-4 text-sm rounded-full font-semibold bg-white text-zinc-950"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center justify-center h-10 px-4 text-sm rounded-full font-medium text-zinc-300 hover:bg-white/5"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center justify-center h-10 px-4 text-sm rounded-full font-semibold bg-white text-zinc-950"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
