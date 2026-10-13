import { useCallback, useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api, type OrderConfig } from "@/lib/api";
import { Container } from "@/components/layout/Container";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { branding } from "@/config/branding";

function money(cents: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(cents / 100);
  } catch {
    return `$${(cents / 100).toFixed(2)}`;
  }
}

const plans = [
  {
    key: "FREE" as const,
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with your first profile.",
    features: [
      "1 profile page",
      "Basic themes",
      "Up to 2 music tracks",
      "Social sign-in (Google, GitHub, Discord)",
      "Community support",
    ],
    cta: "Get Started",
    ctaTo: "/register",
    highlighted: false,
  },
  {
    key: "PRO" as const,
    name: "Premium",
    price: "$5",
    period: "/month",
    description: "For creators who want the full experience.",
    badge: "Most Popular",
    inherits: "Everything in Free, plus:",
    features: [
      "3 profiles & 5 aliases",
      "Up to 5 music tracks",
      "Premium themes",
      "Analytics",
      "Discord presence",
      "Priority support",
    ],
    cta: "Upgrade to Premium",
    ctaTo: "/dashboard?tab=billing",
    highlighted: true,
  },
  {
    key: "ENTERPRISE" as const,
    name: "Enterprise",
    price: "$29",
    period: "/month",
    description: "For teams and organizations at scale.",
    inherits: "Everything in Premium, plus:",
    features: [
      "10 profiles & 25 aliases",
      "Up to 10 music tracks",
      "Badges",
      "Team management",
      "API access",
      "Business SSO (OIDC)",
      "Dedicated support",
      "Custom limits on request",
    ],
    cta: "Contact Sales",
    ctaTo: branding.contactUrl,
    highlighted: false,
  },
];

function PricingButton({ plan }: { plan: (typeof plans)[number] }) {
  const { user } = useAuth();
  const btnClasses = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-colors duration-200 w-full h-11 text-sm ${
    plan.highlighted
      ? "bg-white text-zinc-950 hover:bg-zinc-200"
      : "border border-white/10 bg-white/[0.04] text-zinc-100 hover:bg-white/[0.08]"
  }`;
  const ctaTo = user && plan.key !== "FREE" ? "/dashboard?tab=billing" : plan.ctaTo;
  const ctaLabel = user && plan.key !== "FREE" ? (user?.tier === plan.key ? "Current plan" : plan.cta) : plan.cta;
  const isExternal = !ctaTo.startsWith("/");
  if (isExternal) {
    return (
      <a href={ctaTo} target="_blank" rel="noopener noreferrer" className={btnClasses}>
        {ctaLabel}
      </a>
    );
  }
  return (
    <Link to={ctaTo} className={btnClasses}>
      {ctaLabel}
    </Link>
  );
}

export function Pricing() {
  const [config, setConfig] = useState<OrderConfig | null>(null);

  const loadConfig = useCallback(async () => {
    try {
      const res = await api.getOrderConfig();
      if (res.success && res.data) setConfig(res.data);
    } catch {
      // fall back to static prices
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const priced = plans.map((plan) => {
    const envPlan = config?.plans.find((p) => p.plan === plan.key);
    const priceCents = envPlan?.priceCents ?? (plan.key === "PRO" ? 500 : plan.key === "ENTERPRISE" ? 2900 : 0);
const currency = config?.currency ?? "USD";
  const mode = config?.billingMode ?? "one-time";
  const periodLabel = mode === "one-time" ? "one-time" : mode === "fixed-term" ? "per term" : "/month";
  const modeLabel = mode === "one-time" ? "Pay once, keep the plan" : mode === "subscription" ? "Billed monthly, cancel anytime" : "Billed per term";
  return { ...plan, priceCents, currency, periodLabel, modeLabel };
  });

  return (
    <section id="pricing" className="cv-auto py-24 sm:py-32 relative">
      <Container size="narrow">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500 mb-4">
              {"// pricing"}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.02em] text-white leading-tight">
              Simple, transparent pricing.
            </h2>
            <p className="mt-4 text-base text-zinc-400 max-w-xl mx-auto">
              No hidden fees. No surprises. Start free, upgrade when you&apos;re ready.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-4xl mx-auto items-stretch">
          {priced.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 100}>
              <div
                className={`relative rounded-2xl transition-colors duration-200 h-full ${
                  plan.highlighted
                    ? "pricing-highlighted px-7 pt-8 pb-7 sm:px-8 sm:pt-10 sm:pb-8"
                    : "glass hover:bg-white/[0.06] p-7 sm:p-8"
                }`}
              >
                <div className="mb-7">
                  <h3 className="font-display text-lg font-bold tracking-tight text-white">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl sm:text-3xl font-bold text-white tracking-tight">
                      {plan.priceCents > 0 ? money(plan.priceCents, plan.currency) : plan.price}
                    </span>
                  </div>

                  {plan.priceCents > 0 ? <span className="text-sm text-zinc-500 font-medium">{plan.periodLabel}</span> : <span className="text-sm text-zinc-500 font-medium">{plan.period}</span>}
                  <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                    {plan.description}
                  </p>
                  {plan.priceCents > 0 && (
                    <p className="mt-2 text-xs text-zinc-500">{plan.modeLabel}</p>
                  )}
                </div>

                {plan.badge && (
                  <div className="mb-6 -mt-3">
                    <span className="inline-flex items-center rounded-full glass px-3.5 py-1 text-xs font-semibold text-white whitespace-nowrap">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="h-px bg-white/[0.08] mb-7" />

                {plan.inherits && (
                  <p className="font-mono text-[11px] text-zinc-500 mb-4 uppercase tracking-[0.14em]">
                    {plan.inherits}
                  </p>
                )}

                <ul className="space-y-3.5 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
                      <div
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10"
                      >
                        <Check
                          className="h-3 w-3 text-white"
                        />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <PricingButton plan={plan} />
              </div>
            </ScrollReveal>
          ))}
        </div>

        <p className="text-center text-sm text-zinc-500 mt-8">
          Higher limits negotiable for Enterprise.{" "}
          <a href={branding.contactUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-200 underline decoration-white/20 underline-offset-4 hover:decoration-white/50 transition-colors">
            Contact us
          </a>{" "}
          for custom plans.
        </p>
      </Container>
    </section>
  );
}
