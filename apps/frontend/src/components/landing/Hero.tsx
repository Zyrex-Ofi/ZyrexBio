import { ArrowRight, Star, Eye, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { branding } from "@/config/branding";
import { useAuth } from "@/contexts/AuthContext";
import { useLandingConfig } from "@/lib/useLandingConfig";
import { useInstanceConfig } from "@/lib/useInstanceConfig";
import { BuyInviteModal } from "@/components/invites/BuyInviteModal";
import { usePolicyContext } from "@/lib/usePolicyContext";

// Landing v2: "midnight signal".
// - Static glow + grid (no animated blobs, no backdrop-blur on large areas)
// - Headline uses text-gradient-static: zero per-frame cost
// - Browser-chrome profile mock reads as product screenshot, not decoration
// - Platform ticker is one compositor-only translateX loop (cheap)
// - Social proof row replaces the old stats block
const TICKER = [
  "Spotify", "YouTube", "Discord", "GitHub", "Twitch",
  "TikTok", "Instagram", "X", "SoundCloud", "Steam",
];

const STACK = [
  { initial: "K", bg: "from-violet-500 to-purple-700" },
  { initial: "M", bg: "from-cyan-500 to-sky-700" },
  { initial: "J", bg: "from-emerald-500 to-teal-700" },
  { initial: "A", bg: "from-amber-500 to-orange-700" },
  { initial: "R", bg: "from-rose-500 to-pink-700" },
];

function Ticker() {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {TICKER.map((name) => (
        <span key={name} className="flex items-center">
          <span className="px-6 font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
            {name}
          </span>
          <span className="h-1 w-1 rounded-full bg-zinc-700" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative mt-16 sm:mt-20 border-y border-white/[0.06] py-4 overflow-hidden marquee-mask">
      <div className="flex w-max animate-marquee">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}


export function Hero() {
  const { user } = useAuth();
  const landingConfig = useLandingConfig();
  const instance = useInstanceConfig();
  const ctx = usePolicyContext();
  const storeOpen = ctx?.invites?.purchaseEnabled === true;
  // config.yml landing copy wins; the branding values remain the zero-config
  // fallback (empty strings are exactly what an absent config.yml yields).
  const heroHeading = instance?.landing.hero.heading.trim() || "";
  const heroSubheading = instance?.landing.hero.subheading.trim() || "";
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
            {heroHeading ? (
              <span className="text-white block">{heroHeading}</span>
            ) : (
              <>
                <span className="text-white block">{branding.tagline.split(",")[0]},</span>
                <span className="text-gradient-static block mt-1">{branding.tagline.split(",")[1]?.trim()}</span>
              </>
            )}
          </h1>

          <p
            className="mt-6 text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed animate-reveal opacity-0-initial"
            style={{ animationDelay: "150ms" }}
          >
            {heroSubheading ||
              `${branding.description}. Links, themes, and analytics — all in one page.`}
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
          <div
            className="mt-9 flex items-center justify-center gap-3 animate-reveal opacity-0-initial"
            style={{ animationDelay: "350ms" }}
          >
            <div className="flex -space-x-2.5">
              {STACK.map((s) => (
                <span
                  key={s.initial}
                  className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${s.bg} text-xs font-bold text-white ring-2 ring-[#08080a]`}
                >
                  {s.initial}
                </span>
              ))}
            </div>
            <div className="text-left">
              <span className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </span>
              <p className="mt-1 font-mono text-[11px] text-zinc-500">
                Loved by 2,400+ early creators
              </p>
            </div>
          </div>

          {/* Product mock: browser chrome + guns.lol profile. Solid bg, no blur. */}
          <div
            className="mx-auto mt-12 max-w-sm text-left animate-reveal opacity-0-initial"
            style={{ animationDelay: "450ms" }}
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d10] shadow-2xl shadow-black/60">
              <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-3 flex-1 truncate rounded-full bg-white/[0.05] px-3 py-1 font-mono text-[10px] text-zinc-500">
                  {branding.name.toLowerCase().replace(/\s+/g, "")}.gg/you
                </span>
              </div>
              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-xl font-bold text-white avatar-ring">
                    {branding.name.charAt(0)}
                  </div>
                  <p className="mt-3 font-display text-lg font-bold tracking-tight text-white">
                    {branding.name}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-zinc-500">
                    @{branding.name.toLowerCase().replace(/\s+/g, "")} · online
                  </p>
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  {["Latest drop", "Tour dates", "Discord server"].map((label) => (
                    <div key={label} className="gun-link flex items-center justify-between px-4 py-2.5">
                      <span className="text-[13px] font-medium text-zinc-200">{label}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-zinc-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Ticker />

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
