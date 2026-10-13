import { Link } from "react-router-dom";
import { VersionBadge } from "@/components/updates/VersionBadge";
import { branding } from "@/config/branding";

// Minimal centered footer: mono microcopy, hairline top border, no heavy panels.
export function AppFooter() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="font-mono text-[11px] text-zinc-600">
          &copy; {new Date().getFullYear()} {branding.name} · uid:0
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <VersionBadge />
          <Link to="/privacy" className="font-mono text-[11px] text-zinc-500 hover:text-white transition-colors">
            Privacy
          </Link>
          <Link to="/terms" className="font-mono text-[11px] text-zinc-500 hover:text-white transition-colors">
            Terms
          </Link>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("bio:open-cookie-settings"))}
            className="font-mono text-[11px] text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            Cookies
          </button>
          <Link to="/api-docs" className="font-mono text-[11px] text-zinc-500 hover:text-white transition-colors">
            API
          </Link>
          <a
            href={branding.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] text-zinc-500 hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
