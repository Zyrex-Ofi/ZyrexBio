import {
  Music,
  Palette,
  BarChart3,
  Lock,
  Server,
  Layers,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

// Landing v2 features: 6-card bento instead of 11 uniform cards.
// Fewer nodes, fewer observers, stronger hierarchy: 2 wide + 4 standard.
// Icons stay monochrome zinc; numbers carry the mono guns.lol accent.
const features = [
  {
    icon: Layers,
    num: "01",
    title: "Multiple Profiles",
    description: "Run several link pages from one account — each with its own slug, theme, links, and music. Alias slugs give every page extra short URLs.",
    span: "sm:col-span-2",
  },
  {
    icon: Palette,
    num: "02",
    title: "Themes that feel like you",
    description: "Ten hand-tuned presets plus a full theme editor: backgrounds, layouts, fonts, and animated FX per profile.",
    span: "sm:col-span-2",
  },
  {
    icon: Music,
    num: "03",
    title: "Music Player",
    description: "Spotify, YouTube, or your own uploads — visitors listen without leaving your page.",
    span: "",
  },
  {
    icon: BarChart3,
    num: "04",
    title: "Analytics",
    description: "Views, clicks, referrers, and platform breakdowns. No third-party tracker.",
    span: "",
  },
  {
    icon: Lock,
    num: "05",
    title: "Invite-Only",
    description: "Gated registration keeps bots out and the community sharp.",
    span: "",
  },
  {
    icon: Server,
    num: "06",
    title: "Self-Hostable",
    description: "Open source, Docker Compose, running on your server in minutes. Your data stays yours.",
    span: "",
  },
];

export function Features() {
  return (
    <section id="features" className="cv-auto py-24 sm:py-32 relative">
      <Container className="relative z-10" size="narrow">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500 mb-4">
              {"// features"}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.02em] text-white leading-tight">
              Everything you need,
              <br />
              nothing you don&apos;t.
            </h2>
            <p className="mt-4 text-base text-zinc-400 max-w-xl mx-auto">
              A complete toolkit for your online presence, designed for creators who care about quality.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {features.map((feature) => (
            <ScrollReveal key={feature.title} className={feature.span}>
              <div className="group relative rounded-2xl glass p-6 h-full transition-colors duration-200 hover:bg-white/[0.06] hover:border-white/[0.14]">
                <div className="flex items-start justify-between mb-8">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04]">
                    <feature.icon className="h-4.5 w-4.5 text-zinc-300" />
                  </span>
                  <span className="font-mono text-xs text-zinc-600">{feature.num}</span>
                </div>
                <h3 className="font-display text-base font-bold tracking-tight text-white mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
