import { ArrowRight, Star, Eye, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { branding } from "@/config/branding";
import { useAuth } from "@/contexts/AuthContext";
import { useLandingConfig } from "@/lib/useLandingConfig";
import { BuyInviteModal } from "@/components/invites/BuyInviteModal";
import { usePolicyContext } from "@/lib/usePolicyContext";

// Landing v2: "midnight signal".
// - Static glow + grid (no animated blobs, no backdrop-blur on large areas)
// - Headline uses text-gradient-static: zero per-frame cost
// - Browser-chrome profile mock reads as product screenshot, not decoration
// - Platform ticker is one compositor-only translateX loop (cheap)
// - Social proof row replaces the old stats block
const TICKER = [];

const STACK = [
  { initial: "K", bg: "from-violet-500 to-purple-700" },
  { initial: "M", bg: "from-cyan-500 to-sky-700" },
  { initial: "J", bg: "from-emerald-500 to-teal-700" },
  { initial: "A", bg: "from-amber-500 to-orange-700" },
  { initial: "R", bg: "from-rose-500 to-pink-700" },
];


export function Hero() {
  const { user } = useAuth();
  const landingConfig = useLandingConfig();
  const ctx = usePolicyContext();
  const storeOpen = ctx?.invites?.purchaseEnabled === true;
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid bg-grid-fade" />
      {/* Single static glow: painted once, cached as a layer, never animated */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[420px] bg-violet-600/[0.09] rounded-full blur-[120px]" />

      <Container className="relative z-10 pt-32 sm:pt-40 pb-14" size="narrow">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#101014] px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Now in Early Access
            </span>
          </div>

          <h1 className="mt-7 font-display text-5xl font-bold tracking-[-0.03em] sm:text-7xl leading-[1.02] animate-reveal">
            <span className="text-white block">{branding.tagline.split(",")[0]},</span>
            <span className="text-gradient-static block mt-1">{branding.tagline.split(",")[1]?.trim()}</span>
          </h1>

          <p
            className="mt-6 text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed animate-reveal opacity-0-initial"
            style={{ animationDelay: "150ms" }}
          >
            {branding.description}. Links, themes, and analytics — all in one page.
          </p>

          <div
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-reveal opacity-0-initial"
            style={{ animationDelay: "250ms" }}
          >
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 text-[15px] rounded-full font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors group w-full sm:w-auto"
              >
                <LayoutDashboard className="h-4 w-4" />
                Go to Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 text-[15px] rounded-full font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors group w-full sm:w-auto"
              >
                Get Early Access
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
            {/*
              Invite-only means the register button dead-ends for anyone without a
              code, so the store gets a first-class CTA next to it. Only rendered
              when the instance is actually selling credits.
            */}
            {storeOpen ? (
              <BuyInviteModal
                className="h-12 px-8 text-[15px] rounded-full"
                label="Buy an invite"
              />
            ) : null}
            <a
              href="#showcase"
              className="inline-flex items-center justify-center gap-2 h-12 px-8 text-[15px] rounded-full font-medium border border-white/10 bg-white/[0.04] text-zinc-200 hover:bg-white/[0.08] transition-colors w-full sm:w-auto"
            >
              View Showcase
            </a>
            {landingConfig?.featuredProfileUsername && (
              <Link
                to={`/${landingConfig.featuredProfileUsername}`}
                className="inline-flex items-center justify-center gap-2 h-12 px-8 text-[15px] rounded-full font-medium border border-white/10 bg-white/[0.04] text-zinc-200 hover:bg-white/[0.08] transition-colors w-full sm:w-auto"
              >
                <Eye className="h-4 w-4" />
                Live profile
              </Link>
            )}
          </div>

          {/* Social proof: avatar stack + stars + mono count */}
        </div>
      </Container>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
