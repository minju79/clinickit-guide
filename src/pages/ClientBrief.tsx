import { useState, useEffect, useCallback, useMemo } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { briefFields, briefGroups } from "@/data/clientBriefFields";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, Upload, RotateCcw, Sparkles, Save, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";

type BriefData = Record<string, string | string[]>;

const STORAGE_KEY = "clientBrief";
const SCHEMA_VERSION = "1.0";

interface StoredBrief {
  version: string;
  updatedAt: string;
  data: BriefData;
}

const exampleData: BriefData = {
  hospitalName: "서울좋은내과의원",
  institutionType: "의원",
  departments: ["내과", "가정의학과"],
  coreTreatment: "만성질환 관리(고혈압, 당뇨), 건강검진, 예방접종",
  region: "서울 강남구 역삼동",
  address: "역삼동 123-45 메디컬빌딩 3층",
  phone: "02-1234-5678",
  parking: "가능 (유료/부분 무료)",
  transit: "역삼역 3번 출구 도보 3분, 강남역 7번 출구 도보 8분",
  weekdayHours: "09:00-18:00",
  saturdayHours: "09:00-13:00",
  lunchHours: "13:00-14:00",
  closedDays: "일요일, 공휴일",
  bookingMethod: ["전화 예약", "네이버 예약"],
  doctorCount: "2",
  doctorInfoReady: "사진+경력 모두 보유",
  firstVisitGuide: "필요",
  nonCoveredInfo: "필요",
  noticeBoard: "운영",
  blogColumn: "미운영",
  ctaPriority: ["전화 문의", "오시는 길", "진료시간 확인"],
  brandTone: ["차분하고 신뢰감 있는", "지역 밀착형"],
  photoTypes: ["의료진 프로필", "진료실/시설", "외관/건물"],
  targetPatients: "30~60대 직장인, 지역 주민, 만성질환 관리 필요 환자",
  multilingual: "불필요",
  requiredPages: ["홈", "진료과목", "의료진", "진료시간/방문안내", "오시는 길", "예약/문의", "FAQ"],
  complianceSensitive: ["의료진 경력/수상", "비급여 가격"],
  restrictions: "타 병원 비교 금지, 치료 성공률 수치 표기 금지",
};

function inferSiteType(data: BriefData): string {
  const type = (data.institutionType as string) || "";
  const depts = (data.departments as string[]) || [];
  const doctors = parseInt((data.doctorCount as string) || "1");
  const booking = (data.bookingMethod as string[]) || [];
  const hasOnlineBooking = booking.some(b => b.includes("온라인") || b.includes("네이버") || b.includes("카카오"));
  if (type === "검진센터") return "검진센터형";
  if (doctors >= 3 && depts.length >= 3) return "정보 제공형";
  if (doctors >= 2) return "전문의 신뢰형";
  if (hasOnlineBooking) return "예약 유도형";
  return "지역 의원형";
}

export default function ClientBrief() {
  const [data, setData] = useState<BriefData>({});
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StoredBrief;
        if (parsed.version === SCHEMA_VERSION) {
          setData(parsed.data);
          setLastSaved(parsed.updatedAt);
        } else {
          // Migration: old format (plain object)
          setData(parsed.data || (parsed as unknown as BriefData));
        }
      }
    } catch { /* ignore */ }
  }, []);

  const updateField = (id: string, value: string | string[]) => {
    setData(prev => ({ ...prev, [id]: value }));
  };

  const toggleMulti = (id: string, option: string) => {
    const current = (data[id] as string[]) || [];
    const next = current.includes(option) ? current.filter(v => v !== option) : [...current, option];
    updateField(id, next);
  };

  const handleSave = useCallback(() => {
    try {
      const stored: StoredBrief = { version: SCHEMA_VERSION, updatedAt: new Date().toISOString(), data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      setLastSaved(stored.updatedAt);
      toast({ title: "저장 완료", description: "브리프가 저장되었습니다." });
    } catch {
      toast({ title: "저장 실패", description: "브라우저 저장소에 저장할 수 없습니다.", variant: "destructive" });
    }
  }, [data, toast]);

  const handleReset = () => {
    if (confirm("모든 입력을 초기화하시겠습니까?")) {
      setData({});
      setLastSaved(null);
      localStorage.removeItem(STORAGE_KEY);
      toast({ title: "초기화 완료" });
    }
  };

  const handleFillExample = () => {
    setData(exampleData);
    toast({ title: "예시 데이터 채움", description: "예시 데이터가 입력되었습니다. 저장하려면 '저장' 버튼을 누르세요." });
  };

  const handleExportJSON = () => {
    const stored: StoredBrief = { version: SCHEMA_VERSION, updatedAt: new Date().toISOString(), data };
    const blob = new Blob([JSON.stringify(stored, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `client-brief-${(data.hospitalName as string) || "unnamed"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "내보내기 완료" });
  };

  const handleImportJSON = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target?.result as string) as StoredBrief;
          if (parsed.data && typeof parsed.data === "object") {
            setData(parsed.data);
            toast({ title: "불러오기 완료", description: `${file.name}에서 브리프를 불러왔습니다.` });
          }
        } catch {
          toast({ title: "불러오기 실패", description: "유효한 JSON 파일이 아닙니다.", variant: "destructive" });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const requiredFields = briefFields.filter(f => f.required);
  const filledCount = briefFields.filter(f => {
    const v = data[f.id];
    if (Array.isArray(v)) return v.length > 0;
    return v && String(v).trim() !== "";
  }).length;
  const requiredFilled = requiredFields.filter(f => {
    const v = data[f.id];
    if (Array.isArray(v)) return v.length > 0;
    return v && String(v).trim() !== "";
  }).length;
  const missingRequired = requiredFields.filter(f => {
    const v = data[f.id];
    if (Array.isArray(v)) return v.length === 0;
    return !v || String(v).trim() === "";
  });

  const siteTypePreview = useMemo(() => inferSiteType(data), [data]);
  const hasBrief = filledCount > 0;

  return (
    <div>
      <SectionHeading
        tag="h1"
        sub="병원/의원 고객사의 정보를 체계적으로 수집하고 정리합니다. 입력된 정보는 사이트 블루프린트와 구현 규칙에 자동 반영됩니다."
      >
        고객사 브리프
      </SectionHeading>

      {/* 액션 바 */}
      <div className="guide-card mb-6">
        <div className="flex flex-col gap-4">
          {/* 진행률 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-card-foreground">전체 진행률</span>
                <span className="text-xs text-muted-foreground">{filledCount}/{briefFields.length}</span>
              </div>
              <div className="flex items-center gap-2">
                {requiredFilled === requiredFields.length ? (
                  <span className="guide-badge-success text-[11px]"><CheckCircle2 className="h-3 w-3" /> 필수 항목 완료</span>
                ) : (
                  <span className="guide-badge-warning text-[11px]"><AlertTriangle className="h-3 w-3" /> 필수 {requiredFields.length - requiredFilled}개 미입력</span>
                )}
              </div>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="h-2 rounded-full transition-all" style={{ width: `${(filledCount / briefFields.length) * 100}%`, background: "hsl(var(--accent))" }} />
            </div>
            {lastSaved && (
              <p className="text-[11px] text-muted-foreground mt-1">마지막 저장: {new Date(lastSaved).toLocaleString("ko-KR")}</p>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex flex-wrap gap-2">
            <button onClick={handleFillExample} className="inline-flex items-center gap-1.5 text-xs border border-border rounded-lg px-3 py-1.5 text-muted-foreground hover:bg-secondary transition-colors">
              <Sparkles className="h-3.5 w-3.5" /> 예시 채우기
            </button>
            <button onClick={handleReset} className="inline-flex items-center gap-1.5 text-xs border border-border rounded-lg px-3 py-1.5 text-muted-foreground hover:bg-secondary transition-colors">
              <RotateCcw className="h-3.5 w-3.5" /> 초기화
            </button>
            <button onClick={handleImportJSON} className="inline-flex items-center gap-1.5 text-xs border border-border rounded-lg px-3 py-1.5 text-muted-foreground hover:bg-secondary transition-colors">
              <Upload className="h-3.5 w-3.5" /> JSON 불러오기
            </button>
            <button onClick={handleExportJSON} className="inline-flex items-center gap-1.5 text-xs border border-border rounded-lg px-3 py-1.5 text-muted-foreground hover:bg-secondary transition-colors">
              <Download className="h-3.5 w-3.5" /> JSON 내보내기
            </button>
            <button onClick={handleSave} className="inline-flex items-center gap-1.5 text-xs bg-primary text-primary-foreground rounded-lg px-3 py-1.5 hover:opacity-90 transition-opacity ml-auto">
              <Save className="h-3.5 w-3.5" /> 저장
            </button>
          </div>
        </div>
      </div>

      {/* 누락 필수 항목 경고 */}
      {missingRequired.length > 0 && missingRequired.length < requiredFields.length && (
        <div className="guide-notice-warning mb-6">
          <p className="text-sm font-semibold mb-1"><AlertTriangle className="h-3.5 w-3.5 inline" /> 필수 항목 누락</p>
          <div className="flex flex-wrap gap-1.5">
            {missingRequired.map(f => (
              <span key={f.id} className="text-[11px] border border-warning/30 rounded px-1.5 py-0.5">{f.label}</span>
            ))}
          </div>
        </div>
      )}

      {/* 필드 그룹 */}
      {briefGroups.map(group => (
        <section key={group} className="guide-section">
          <SectionHeading tag="h2">{group}</SectionHeading>
          <div className="space-y-5">
            {briefFields.filter(f => f.group === group).map(field => (
              <div key={field.id} className="guide-card">
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  {field.label}
                  {field.required && <span className="text-emergency ml-1">*</span>}
                </label>

                {field.type === "text" && (
                  <input
                    type="text"
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                    placeholder={field.placeholder}
                    value={(data[field.id] as string) || ""}
                    onChange={e => updateField(field.id, e.target.value)}
                    aria-required={field.required}
                  />
                )}

                {field.type === "textarea" && (
                  <textarea
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background min-h-[80px] focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                    placeholder={field.placeholder}
                    value={(data[field.id] as string) || ""}
                    onChange={e => updateField(field.id, e.target.value)}
                    aria-required={field.required}
                  />
                )}

                {field.type === "number" && (
                  <input
                    type="number"
                    className="w-32 border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                    placeholder={field.placeholder}
                    value={(data[field.id] as string) || ""}
                    onChange={e => updateField(field.id, e.target.value)}
                    aria-required={field.required}
                  />
                )}

                {field.type === "select" && field.options && (
                  <select
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                    value={(data[field.id] as string) || ""}
                    onChange={e => updateField(field.id, e.target.value)}
                    aria-required={field.required}
                  >
                    <option value="">선택하세요</option>
                    {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                )}

                {field.type === "radio" && field.options && (
                  <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={field.label}>
                    {field.options.map(opt => (
                      <label key={opt} className={`inline-flex items-center gap-1.5 border rounded-lg px-3 py-1.5 text-sm cursor-pointer transition-colors ${(data[field.id] as string) === opt ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:bg-secondary"}`}>
                        <input type="radio" name={field.id} value={opt} checked={(data[field.id] as string) === opt} onChange={() => updateField(field.id, opt)} className="sr-only" />
                        {opt}
                      </label>
                    ))}
                  </div>
                )}

                {field.type === "multiselect" && field.options && (
                  <div className="flex flex-wrap gap-2" role="group" aria-label={field.label}>
                    {field.options.map(opt => {
                      const selected = ((data[field.id] as string[]) || []).includes(opt);
                      return (
                        <button key={opt} type="button" onClick={() => toggleMulti(field.id, opt)} aria-pressed={selected}
                          className={`border rounded-lg px-3 py-1.5 text-sm transition-colors ${selected ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:bg-secondary"}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {field.helpText && <p className="text-xs text-muted-foreground mt-1">{field.helpText}</p>}
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* 브리프 요약 카드 */}
      {hasBrief && (
        <section className="guide-section">
          <SectionHeading tag="h2">브리프 요약</SectionHeading>
          <div className="guide-card-accent">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs mb-1">병원명</p>
                <p className="font-medium text-card-foreground">{(data.hospitalName as string) || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">기관 유형</p>
                <p className="font-medium text-card-foreground">{(data.institutionType as string) || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">진료과목</p>
                <p className="font-medium text-card-foreground">{((data.departments as string[]) || []).join(", ") || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">지역</p>
                <p className="font-medium text-card-foreground">{(data.region as string) || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">의료진 수</p>
                <p className="font-medium text-card-foreground">{(data.doctorCount as string) || "—"}명</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">예약 방식</p>
                <p className="font-medium text-card-foreground">{((data.bookingMethod as string[]) || []).join(", ") || "—"}</p>
              </div>
            </div>

            {/* 예상 사이트 유형 */}
            <div className="mt-4 pt-4 border-t border-border/40">
              <p className="text-xs text-muted-foreground mb-1">예상 사이트 유형</p>
              <span className="guide-badge-info text-sm">{siteTypePreview}</span>
            </div>
          </div>
        </section>
      )}

      {/* 하단 CTA */}
      <div className="guide-section text-center">
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={handleSave} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Save className="h-4 w-4" /> 브리프 저장
          </button>
          <Link to="/site-blueprint" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            블루프린트 생성 <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
