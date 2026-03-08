import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAdjacentPages } from "@/data/navigationConfig";

interface PageNavigationProps {
  currentPath: string;
}

export function PageNavigation({ currentPath }: PageNavigationProps) {
  const { prev, next } = getAdjacentPages(currentPath);

  if (!prev && !next) return null;

  return (
    <nav aria-label="페이지 탐색" className="flex items-center justify-between gap-4 pt-10 mt-10 border-t border-border">
      {prev ? (
        <Link
          to={prev.path}
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <div>
            <p className="text-[11px] text-muted-foreground">이전</p>
            <p className="font-medium text-card-foreground group-hover:text-foreground">{prev.label}</p>
          </div>
        </Link>
      ) : <div />}
      {next ? (
        <Link
          to={next.path}
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto"
        >
          <div className="text-right">
            <p className="text-[11px] text-muted-foreground">다음</p>
            <p className="font-medium text-card-foreground group-hover:text-foreground">{next.label}</p>
          </div>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : <div />}
    </nav>
  );
}
