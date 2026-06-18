import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";
import { GuideSidebar } from "@/components/GuideSidebar";
import { CommandSearch } from "@/components/CommandSearch";
import { currentConfig } from "@/data/industryConfig";

interface GuideLayoutProps {
  children: ReactNode;
}

export function GuideLayout({ children }: GuideLayoutProps) {
  const { pathname } = useLocation();
  const isShowcase = pathname.startsWith("/showcase");

  if (isShowcase) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="bg-[#1a2e40] text-[#f1f5f9] px-4 py-2 text-center text-xs flex justify-between items-center z-50 relative border-b border-[#2d465e]/20">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            제작 가이드 적용 사례: <strong>새우리한방병원 데모 (2026 Premium)</strong>
          </span>
          <a href="/" className="underline hover:text-white font-semibold transition-colors">
            가이드 시스템으로 돌아가기 &rarr;
          </a>
        </div>
        <main id="main-content" role="main" className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <GuideSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Skip Link */}
           <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
          >
            본문으로 건너뛰기
          </a>
          <header role="banner" className="h-12 flex items-center border-b border-border bg-card sticky top-0 z-30">
            <SidebarTrigger className="ml-3" />
            <span className="ml-3 text-sm font-medium text-muted-foreground hidden sm:inline">
              {currentConfig.name} {currentConfig.brandSubtitle} {currentConfig.version}
            </span>
            <div className="ml-auto mr-3">
              <CommandSearch />
            </div>
          </header>
          <main id="main-content" role="main" className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
              {children}
            </div>
          </main>
          <footer role="contentinfo" className="border-t border-border bg-card py-4 px-6 text-xs text-muted-foreground text-center">
            {currentConfig.footerText}
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
