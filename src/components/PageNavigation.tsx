import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const allPages = [
  { path: "/", label: "Overview" },
  { path: "/industry-overview", label: "Industry" },
  { path: "/design-guide", label: "Design Guide" },
  { path: "/ui-guide", label: "UI Guide" },
  { path: "/ux-guide", label: "UX Guide" },
  { path: "/page-templates", label: "Page Templates" },
  { path: "/content-guide", label: "Content Guide" },
  { path: "/compliance-guide", label: "Compliance" },
  { path: "/seo-geo", label: "SEO/GEO" },
  { path: "/checklist", label: "Checklist" },
  { path: "/client-brief", label: "Client Brief" },
  { path: "/site-blueprint", label: "Site Blueprint" },
  { path: "/implementation-rules", label: "Implementation Rules" },
];

export function PageNavigation({ currentPath }: { currentPath: string }) {
  const idx = allPages.findIndex(p => p.path === currentPath);
  const prev = idx > 0 ? allPages[idx - 1] : null;
  const next = idx < allPages.length - 1 ? allPages[idx + 1] : null;

  return (
    <nav aria-label="페이지 탐색" className="flex items-center justify-between pt-10 mt-10 border-t border-border">
      {prev ? (
        <Link to={prev.path} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" /> {prev.label}
        </Link>
      ) : <span />}
      {next ? (
        <Link to={next.path} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          {next.label} <ChevronRight className="h-4 w-4" />
        </Link>
      ) : <span />}
    </nav>
  );
}
