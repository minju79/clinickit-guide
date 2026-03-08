import {
  LayoutDashboard,
  Building2,
  Palette,
  Component,
  Route,
  FileText,
  PenTool,
  ShieldCheck,
  Search,
  CheckSquare,
  ClipboardList,
  Map,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  path: string;
  icon: LucideIcon;
  group: "guide" | "tool";
  /** Korean label for sidebar/breadcrumb display */
  label: string;
  /** Description shown in command search results */
  description: string;
  /** Search keywords for command palette */
  keywords: string[];
  /** Search intent phrases for better matching */
  searchIntent: string[];
}

export const navigationItems: NavItem[] = [
  {
    title: "Overview", path: "/", icon: LayoutDashboard, group: "guide",
    label: "홈", description: "가이드 시스템 메인 대시보드",
    keywords: ["홈", "메인", "개요", "시작", "overview", "대시보드"],
    searchIntent: ["처음부터 시작", "전체 구조 보기", "시작 페이지"],
  },
  {
    title: "Industry", path: "/industry-overview", icon: Building2, group: "guide",
    label: "업종 특성", description: "병원/의원 업종 특성과 사용자 행동 패턴",
    keywords: ["업종", "의원", "병원", "특성", "industry", "사용자", "행동"],
    searchIntent: ["병원 홈페이지가 다른 점", "환자 행동 패턴", "업종 차이"],
  },
  {
    title: "Design Guide", path: "/design-guide", icon: Palette, group: "guide",
    label: "디자인 가이드", description: "컬러, 타이포, 간격, 이미지 스타일 기준",
    keywords: ["디자인", "컬러", "타이포", "간격", "design", "색상", "폰트"],
    searchIntent: ["어떤 색상 쓸까", "타이포그래피 기준", "디자인 시스템"],
  },
  {
    title: "UI Guide", path: "/ui-guide", icon: Component, group: "guide",
    label: "UI 가이드", description: "헤더, 카드, CTA, 폼 등 핵심 UI 컴포넌트 패턴",
    keywords: ["UI", "컴포넌트", "카드", "버튼", "CTA", "헤더", "푸터"],
    searchIntent: ["CTA 버튼 패턴", "카드 디자인", "UI 구성"],
  },
  {
    title: "UX Guide", path: "/ux-guide", icon: Route, group: "guide",
    label: "UX 가이드", description: "사용자 여정, 정보 위계, 전환 흐름",
    keywords: ["UX", "사용자", "여정", "전환", "모바일", "흐름"],
    searchIntent: ["환자 여정", "전환율 높이기", "사용자 경험"],
  },
  {
    title: "Page Templates", path: "/page-templates", icon: FileText, group: "guide",
    label: "페이지 템플릿", description: "블록 기반 페이지 템플릿 시스템",
    keywords: ["페이지", "템플릿", "블록", "구조", "template", "홈페이지"],
    searchIntent: ["페이지 구조", "블록 순서", "템플릿 찾기"],
  },
  {
    title: "Content Guide", path: "/content-guide", icon: PenTool, group: "guide",
    label: "콘텐츠 가이드", description: "카피 톤, 문장 템플릿, CTA 문구, 금지 표현",
    keywords: ["콘텐츠", "카피", "문장", "톤", "content", "문구", "텍스트"],
    searchIntent: ["카피 쓰는 법", "금지 표현", "CTA 문구 예시"],
  },
  {
    title: "Compliance", path: "/compliance-guide", icon: ShieldCheck, group: "guide",
    label: "컴플라이언스", description: "법률/광고 검토 포인트와 체크리스트",
    keywords: ["컴플라이언스", "법률", "검토", "광고", "compliance", "의료법"],
    searchIntent: ["법적 검토 필요한 곳", "의료광고 규정", "검토 체크리스트"],
  },
  {
    title: "SEO/GEO", path: "/seo-geo", icon: Search, group: "guide",
    label: "SEO/GEO", description: "메타 데이터, 구조화 데이터, 로컬 SEO 전략",
    keywords: ["SEO", "GEO", "메타", "검색", "로컬", "JSON-LD", "구조화"],
    searchIntent: ["검색 최적화", "메타 태그", "JSON-LD 설정"],
  },
  {
    title: "Checklist", path: "/checklist", icon: CheckSquare, group: "guide",
    label: "체크리스트", description: "제작 전/후 실무 점검 체크리스트",
    keywords: ["체크리스트", "QA", "점검", "검수", "checklist", "확인"],
    searchIntent: ["출시 전 점검", "QA 항목", "놓친 거 없나"],
  },
  {
    title: "Client Brief", path: "/client-brief", icon: ClipboardList, group: "tool",
    label: "고객사 브리프", description: "고객사 정보 수집 및 브리프 정리 도구",
    keywords: ["브리프", "고객사", "입력", "수집", "brief", "정보"],
    searchIntent: ["고객 정보 입력", "프로젝트 시작", "브리프 작성"],
  },
  {
    title: "Site Blueprint", path: "/site-blueprint", icon: Map, group: "tool",
    label: "사이트 블루프린트", description: "브리프 기반 사이트 구조 자동 도출",
    keywords: ["블루프린트", "구조", "생성", "출력", "blueprint", "산출물"],
    searchIntent: ["사이트 구조 생성", "페이지 구조 확인", "프롬프트 복사"],
  },
  {
    title: "Implementation Rules", path: "/implementation-rules", icon: Settings, group: "tool",
    label: "구현 규칙", description: "조건별 템플릿 선택, CTA 분기, 축소 구조",
    keywords: ["구현", "규칙", "분기", "엔진", "rules", "조건"],
    searchIntent: ["어떤 레이아웃 쓸지", "CTA 우선순위", "규칙 확인"],
  },
];

export const guideItems = navigationItems.filter(i => i.group === "guide");
export const toolItems = navigationItems.filter(i => i.group === "tool");

export const allPages = navigationItems.map(i => ({ path: i.path, label: i.label, title: i.title }));

/** Get ordered index of a path for prev/next navigation */
export function getNavIndex(path: string): number {
  return navigationItems.findIndex(i => i.path === path);
}

/** Get prev/next pages for a given path */
export function getAdjacentPages(path: string) {
  const idx = getNavIndex(path);
  return {
    prev: idx > 0 ? navigationItems[idx - 1] : null,
    next: idx < navigationItems.length - 1 ? navigationItems[idx + 1] : null,
  };
}
