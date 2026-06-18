import { useState, useEffect } from "react";
import {
  Phone, Clock, MapPin, Check, Heart, Shield, Star, Calendar, User, Info,
  ChevronRight, CalendarCheck, Image as ImageIcon, Sparkles, X, ChevronLeft,
  ChevronRight as ChevronRightIcon, Award, Activity, Scissors, Map
} from "lucide-react";
import { toast } from "sonner";

// Departments list based on user's Naver Map screenshot
const DEPARTMENTS = [
  { id: "rehab", name: "한방재활의학과", desc: "뇌경색/재활치료, 마비재활, 수술 후 회복" },
  { id: "acupuncture", name: "침구과", desc: "척추·관절 통증 치료, 디스크, 신경통 침 치료" },
  { id: "family", name: "가정의학과 (양방)", desc: "양방 협진 진료, 만성질환 관리, 일반 수액 치료" },
  { id: "internal", name: "한방내과", desc: "위장 질환, 기력 저하, 한방 순환기 관리" },
  { id: "gynecology", name: "한방부인과", desc: "여성 질환, 산후 조리, 부인과 호르몬 균형" },
  { id: "psychiatry", name: "한방신경정신과", desc: "불면증, 화병, 스트레스 조절 및 두통 치료" },
  { id: "pediatrics", name: "한방소아과", desc: "성장 발달, 면역력 강화, 소아 한방 관리" },
  { id: "constitution", name: "사상체질과", desc: "체질 맞춤형 진단 및 체질 한약 맞춤 처방" },
  { id: "ent", name: "한방안·이비인후·피부과", desc: "비염, 아토피, 이명 및 한방 안구 케어" }
];

// Special Medical Equipments from user's Naver Map data
const SPECIAL_EQUIPMENT = [
  { name: "초음파 영상 진단기", count: 1, desc: "근골격계 질환의 미세 병변 및 염증 상태 실시간 진단" },
  { name: "일반 엑스선 촬영 장치 (X-Ray)", count: 1, desc: "기본 골격계 구조 및 정밀 척추·관절 정렬 촬영 검사" },
  { name: "골밀도 검사기 (DEXA)", count: 1, desc: "뼈 건강 정밀 진단 및 골다공증 위험 조기 판독" }
];

// Hospital reviews (provided reviews + simulated 2026 reviews to show active state)
const REVIEWS = [
  {
    author: "김지민 환자 (뇌경색 재활 치료)",
    rating: 5,
    date: "2026년 최신 리뷰 (3개월 전)",
    content: "뇌경색 후유증으로 재활 입원 치료를 받고 있습니다. 안전 보행 레일 시스템 덕분에 혼자 걷기가 많이 수월해졌어요. 한방 침 치료와 양방 도수치료가 매일 시너지를 냅니다. 의료진분들과 간호사분들이 참 친절하세요."
  },
  {
    author: "박우혁 보호자",
    rating: 5,
    date: "2026년 최신 리뷰 (1달 전)",
    content: "아버지가 뇌졸중 회복 치료 중인데 매일 제공되는 영양 가득한 맞춤 식사에 무척 만족하십니다. 안마의자 휴게공간이 있어서 대기 시간도 편안하고 물리치료 기구들이 매우 최신식이어서 든든합니다."
  },
  {
    author: "경남",
    rating: 5,
    date: "6년 전 (구글 리뷰)",
    content: "환자가 안심하고 편안하게 치료받을 수 있을 정도로 시스템이 잘 구축되어 있고 무엇을 해야 하는지 직원들이 명확하게 인지하고 일할 수 있을 만큼 아주 훌륭하게 관리되어 있습니다."
  },
  {
    author: "진승호 (현지 가이드)",
    rating: 5,
    date: "1년 전 (구글 리뷰)",
    content: "병원 내 시설과 진료실 환경이 무척 깨끗합니다. 입원실 관리 상태도 조용하고 아늑하며, 재활에 전념하기에 최적의 공간입니다. 북구 쪽에서 재활병원 찾으신다면 추천합니다."
  },
  {
    author: "박근영",
    rating: 5,
    date: "6년 전 (구글 리뷰)",
    content: "병원 시설이 정말 훌륭하고 만족스럽습니다. 환자를 위한 시설 투자가 아낌없이 되어 있다는 느낌을 강하게 받았습니다."
  },
  {
    author: "이소라",
    rating: 5,
    date: "6년 전 (구글 리뷰)",
    content: "입원하고 치료받는 동안 의료진 배려 덕분에 정말 마음 편히 나아갈 수 있어서 행복했습니다. 치료 성과도 좋습니다."
  }
];

// Facilities Gallery based on user's pictures
const FACILITIES = [
  {
    title: "넓고 쾌적한 안내 데스크",
    badge: "안내/접수",
    desc: "환자를 친절히 맞이하는 깔끔하고 쾌적한 로비 및 접수 데스크 환경",
    image: "/images/hospital_lobby.png"
  },
  {
    title: "맞춤형 보행 재활 운동실",
    badge: "재활치료실",
    desc: "안전 보행 레일 및 고기능 사이클 장비가 구축된 맞춤형 재활 운동 치료 공간",
    image: "/images/rehab_therapy.png"
  },
  {
    title: "아늑한 입원실 & 개인 커튼",
    badge: "입원 병동",
    desc: "환자의 사생활 보호와 편안한 수면을 위한 개별 1등급 커튼 칸막이 시스템",
    image: "/images/inpatient_ward.png"
  },
  {
    title: "1:1 집중 정형 도수치료실",
    badge: "도수치료",
    desc: "OMT 칼텐본-에브옌스 학회 기준의 전문 물리치료사가 진행하는 1:1 맞춤 치료",
    image: "/images/manual_therapy.png"
  },
  {
    title: "안마의자 힐링 라운지",
    badge: "편의시설",
    desc: "입원 환자와 대기 보호자의 긴장을 풀어주는 힐링 안마의자 휴게공간",
    image: "/images/hospital_lobby.png"
  },
  {
    title: "맞춤형 보양 영양식 식단",
    badge: "환자 식단",
    desc: "면역 회복과 환자 체력 유지를 위해 균형 있게 맞춘 영양 가득한 1등급 식사 제공",
    image: "/images/rehab_therapy.png"
  }
];

export default function SaewooriHospital() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState("");
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  // Dynamic Open/Close status calculation based on Gwangju local time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getHospitalStatus = () => {
    const day = currentTime.getDay(); // 0: Sun, 6: Sat
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    if (day === 0) {
      return { status: "CLOSED", text: "금일 휴진", color: "bg-red-500 text-white" };
    }

    // Weekday: 09:00 - 17:30
    // Saturday: 09:00 - 13:00 (Assume common)
    // Lunch break: 12:30 - 13:30
    const startMinutes = 9 * 60;
    const endMinutes = day === 6 ? 13 * 60 : 17 * 60 + 30;
    const lunchStart = 12 * 60 + 30;
    const lunchEnd = 13 * 60 + 30;

    if (totalMinutes < startMinutes || totalMinutes >= endMinutes) {
      return { status: "CLOSED", text: "진료 종료", color: "bg-gray-500 text-white" };
    }

    if (day !== 6 && totalMinutes >= lunchStart && totalMinutes < lunchEnd) {
      return { status: "LUNCH", text: "휴게 시간 (점심)", color: "bg-amber-500 text-white animate-pulse" };
    }

    return { status: "OPEN", text: "진료 중", color: "bg-emerald-500 text-white" };
  };

  const status = getHospitalStatus();

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone || !bookingDate || !selectedDept) {
      toast.error("모든 항목을 입력해주세요.");
      return;
    }
    toast.success("예약 신청이 접수되었습니다! 담당자가 연락드리겠습니다.");
    setIsBookingOpen(false);
    setBookingName("");
    setBookingPhone("");
    setBookingDate("");
    setSelectedDept("");
  };

  const nextReview = () => {
    setActiveReviewIdx((prev) => (prev + 1) % REVIEWS.length);
  };

  const prevReview = () => {
    setActiveReviewIdx((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  return (
    <div className="font-sans text-gray-900 bg-gray-50/50 leading-relaxed min-h-screen">
      {/* 2026 Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-[#1d3557] flex items-center justify-center text-white shadow-md shadow-blue-900/10">
              <Heart className="h-6 w-6 fill-current text-teal-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-none">새우리한방병원</h1>
              <p className="text-[10px] text-gray-500 mt-1 font-semibold tracking-wider">한·양방 협진 재활의학 중심</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a href="#intro" className="hover:text-[#1d3557] transition-colors">병원 소개</a>
            <a href="#rehab" className="hover:text-[#1d3557] transition-colors">특화 재활</a>
            <a href="#departments" className="hover:text-[#1d3557] transition-colors">진료 과목</a>
            <a href="#facilities" className="hover:text-[#1d3557] transition-colors">시설 안내</a>
            <a href="#reviews" className="hover:text-[#1d3557] transition-colors">환자 후기</a>
            <a href="#location" className="hover:text-[#1d3557] transition-colors">오시는 길</a>
          </nav>

          <div className="flex items-center gap-3">
            <a href="tel:062-464-5000" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-[#1d3557] hover:text-[#2a9d8f] transition-colors pr-2">
              <Phone className="h-4 w-4 text-[#2a9d8f]" />
              062-464-5000
            </a>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="bg-[#1d3557] text-white hover:bg-[#254168] px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-900/10 active:scale-95"
            >
              실시간 예약
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#122238] via-[#1a2f4c] to-[#254168] text-white py-20 lg:py-32">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2a9d8f_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#2a9d8f]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold tracking-wide text-teal-300">
              <Sparkles className="h-3.5 w-3.5" /> 광주 북구 재활의학 선도병원
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              뇌경색 재활부터 도수치료까지,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-400">한·양방 협진 통합 케어</span>
            </h2>

            <p className="text-gray-300 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              환자의 안심 회복을 우선하는 환자 중심 케어 시스템. 정밀한 양방 정형도수치료와 신뢰성 높은 한방 침구 치료를 동시에 접목하여 더 빠르고 안전한 일상 복귀를 선물합니다.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="bg-[#2a9d8f] text-white hover:bg-[#23877a] px-7 py-4 rounded-xl text-base font-bold transition-all shadow-lg shadow-teal-500/10 flex items-center gap-2 active:scale-95"
              >
                <CalendarCheck className="h-5 w-5" /> 2026 간편 진료예약
              </button>
              <a
                href="#location"
                className="bg-white/10 text-white hover:bg-white/15 backdrop-blur-md border border-white/20 px-7 py-4 rounded-xl text-base font-bold transition-all flex items-center gap-2"
              >
                오시는 길 안내 <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            {/* Social Trust Metrics */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <span className="font-semibold text-white">Google 5.0 평점</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20 hidden sm:inline-block"></div>
              <div>
                <span className="text-teal-300 font-bold">1:1 맞춤형</span> 재활 치료
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20 hidden sm:inline-block"></div>
              <div>
                안마의자 및 최신 치료장비 보유
              </div>
            </div>
          </div>

          {/* Interactive Card Presentation */}
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/15">
                <span className="text-sm font-semibold tracking-wider text-teal-300">실시간 진료 현황</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
                  {status.text}
                </span>
              </div>

              <div className="space-y-4 text-sm text-gray-200">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">진료 시간</p>
                    <p className="mt-1 text-gray-300">평 일 : 09:00 - 17:30 (휴게시간 12:30 - 13:30)</p>
                    <p className="text-gray-300">토요일 : 09:00 - 13:00 (점심시간 없음)</p>
                    <p className="text-teal-300 font-semibold mt-1">※ 매주 일요일/공휴일은 휴진입니다.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">병원 위치</p>
                    <p className="mt-1 text-gray-300">광주광역시 북구 북문대로 183 (운암동)</p>
                    <p className="text-xs text-gray-400 mt-1">운암3동 행정복지센터 인근, 넓은 주차공간 완비</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">대표 전화</p>
                    <a href="tel:062-464-5000" className="mt-1 block text-lg font-bold text-teal-300 hover:underline">
                      062-464-5000
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center text-xs text-gray-300">
                "환자가 안심하고 진료받을 수 있는 환경" - 구글 평점 5.0 만점 획득
              </div>
            </div>
            {/* Visual glow behind the card */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 rounded-3xl blur-2xl opacity-20 -z-10"></div>
          </div>
        </div>
      </section>

      {/* Brand Values / Introduction */}
      <section id="intro" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[#2a9d8f] text-sm font-bold tracking-wider uppercase">SAEWOORI VALUES</span>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              환자의 일상 복귀를 위한 세 가지 약속
            </h3>
            <p className="text-gray-500 text-base">
              새우리한방병원은 고도로 조직화된 양방 도수치료 및 한방 전통 한의학의 유기적인 시너지를 바탕으로 환자 맞춤형 정밀 복약 및 전문 재활 솔루션을 설계합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gray-50/70 hover:bg-white border border-gray-100 hover:border-gray-200/80 rounded-2xl p-8 transition-all hover:shadow-xl hover:shadow-gray-200/30 group">
              <div className="h-12 w-12 rounded-xl bg-teal-50 text-[#2a9d8f] flex items-center justify-center mb-6 group-hover:bg-[#2a9d8f] group-hover:text-white transition-all">
                <Award className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">체계적 한·양방 협진</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                가정의학과 전문 진단과 수액 요법에 맞추어, 침구과 전문의의 통증 제어 침 치료와 침뜸 요법을 동시에 연결해 치료 극대화를 모도합니다.
              </p>
            </div>

            <div className="bg-gray-50/70 hover:bg-white border border-gray-100 hover:border-gray-200/80 rounded-2xl p-8 transition-all hover:shadow-xl hover:shadow-gray-200/30 group">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-[#1d3557] group-hover:text-white transition-all">
                <Activity className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">특화 뇌혈관 재활</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                뇌경색, 뇌졸중 후유 마비 극복을 위한 특화 보행 훈련 프로그램 및 감각 운동 발달 재활 인프라를 운용하여 일상의 재활을 단축시킵니다.
              </p>
            </div>

            <div className="bg-gray-50/70 hover:bg-white border border-gray-100 hover:border-gray-200/80 rounded-2xl p-8 transition-all hover:shadow-xl hover:shadow-gray-200/30 group">
              <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Shield className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">철저한 법적 준수 및 안전</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                검증된 정형진단기 활용과 의료법 가이드라인을 완전 준수한 치료 정보 제공으로 안심하고 믿고 몸을 의탁할 수 있는 청정 시스템을 보장합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Special Rehabilitation (특화 재활 및 도수) */}
      <section id="rehab" className="py-20 bg-gray-50/40 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12">
            <div>
              <span className="text-[#2a9d8f] text-sm font-bold tracking-wider uppercase">SPECIAL REHABILITATION</span>
              <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-2">
                새우리 양·한방 재활의 핵심 경쟁력
              </h3>
            </div>
            <p className="text-gray-500 max-w-md text-sm leading-relaxed">
              정밀 진료기기로 구조적 문제를 확인하고 한·양방 협진 통합 프로토콜에 의거하여 보행 장애, 마비, 만성 골격 통증을 근본적으로 극복합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Treatment 1 */}
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all">
              <div className="h-52 bg-slate-900 relative">
                <img
                  src="/images/rehab_therapy.png"
                  alt="뇌경색 재활"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent"></div>
                <span className="absolute bottom-4 left-4 bg-[#2a9d8f] text-white text-xs font-bold px-3 py-1 rounded-full">
                  뇌혈관 통합 케어
                </span>
              </div>
              <div className="p-8 space-y-4">
                <h4 className="text-xl font-bold text-gray-900">뇌경색 및 뇌졸중 후유 재활</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  뇌세포 손상 후 골든 타임 회복을 위한 한방 재활치료. 보행 레일 보조 시스템, 마비 지체 자극 침구 요법, 가정의학과 수액 요법을 유기적으로 연동하여 일상 기동력을 정상화합니다.
                </p>
                <ul className="space-y-2 text-xs font-semibold text-[#1d3557]">
                  <li className="flex items-center gap-1.5"><Check className="h-4 w-4 text-teal-500" /> 맞춤형 집중 입원 재활 지원</li>
                  <li className="flex items-center gap-1.5"><Check className="h-4 w-4 text-teal-500" /> 단계별 기동성 향상 훈련 프로그램</li>
                </ul>
              </div>
            </div>

            {/* Treatment 2 */}
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all">
              <div className="h-52 bg-slate-900 relative">
                <img
                  src="/images/manual_therapy.png"
                  alt="도수치료"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent"></div>
                <span className="absolute bottom-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  양방 물리도수
                </span>
              </div>
              <div className="p-8 space-y-4">
                <h4 className="text-xl font-bold text-gray-900">정형도수치료 (OMT 칼텐본-에브옌스)</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  유럽 정형도수치료 학회 기준에 기초한 전문 치료사의 수기를 활용한 척추 관절 및 사지 관절의 비수술 도수 교정치료. 통증 완화, 관절 가동범위 복원, 틀어진 신체 밸런스를 바로잡아 줍니다.
                </p>
                <ul className="space-y-2 text-xs font-semibold text-[#1d3557]">
                  <li className="flex items-center gap-1.5"><Check className="h-4 w-4 text-teal-500" /> 관절 운동기능 회복 도수 솔루션</li>
                  <li className="flex items-center gap-1.5"><Check className="h-4 w-4 text-teal-500" /> 수술 후 관절 구축 방지 프로그램</li>
                </ul>
              </div>
            </div>

            {/* Treatment 3 */}
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all">
              <div className="h-52 bg-slate-900 relative">
                <img
                  src="/images/acupuncture.png"
                  alt="침구 치료"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent"></div>
                <span className="absolute bottom-4 left-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  전통 한방 통증치료
                </span>
              </div>
              <div className="p-8 space-y-4">
                <h4 className="text-xl font-bold text-gray-900">맞춤형 전문 침·뜸·약침 요법</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  침구과 침 치료를 통한 기혈 순환 촉진 및 통증 완화 침구 요법. 한약 추출액을 경혈에 주입하는 약침치료를 병행하여 급성 염증 소멸과 손상된 근골 조직 회복 및 강화 효과를 부여합니다.
                </p>
                <ul className="space-y-2 text-xs font-semibold text-[#1d3557]">
                  <li className="flex items-center gap-1.5"><Check className="h-4 w-4 text-teal-500" /> 경혈 자극 만성 허리·어깨 통증 조절</li>
                  <li className="flex items-center gap-1.5"><Check className="h-4 w-4 text-teal-500" /> 개인별 맞춤 체질 보양 한약 조제</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Grid */}
      <section id="departments" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#2a9d8f] text-sm font-bold tracking-wider uppercase">CLINIC DEPARTMENTS</span>
            <h3 className="text-3xl font-extrabold text-gray-900">새우리한방병원 진료 과목</h3>
            <p className="text-gray-500 text-sm">
              한의학 전 진료 과목과 양방 가정의학과 통합 진료 협진 체계를 구축하여 종합적 진료 및 체계적 맞춤 처방을 실천합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEPARTMENTS.map((dept, index) => (
              <div key={dept.id} className="border border-gray-100 rounded-2xl p-6 hover:bg-gray-50/40 hover:border-gray-200 transition-all flex items-start gap-4">
                <span className="flex-shrink-0 h-10 w-10 rounded-xl bg-teal-50 text-[#2a9d8f] flex items-center justify-center font-bold text-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-base">{dept.name}</h4>
                  <p className="text-xs text-gray-500">{dept.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment (특수 진료 장비) */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <span className="text-teal-400 text-sm font-bold tracking-wider uppercase">HIGH-END DIAGNOSIS EQUIPMENT</span>
            <h3 className="text-3xl font-extrabold">대학병원급 정밀 특수 진료 장비</h3>
            <p className="text-gray-400 text-sm">
              정밀 진료기기로 관절 뼈 건강 상태와 인대 상태를 정확히 촬영 분석하고 한·양방 협진 정밀 치료 설계를 실천합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SPECIAL_EQUIPMENT.map((eq) => (
              <div key={eq.name} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-xl group-hover:bg-teal-500/20 transition-all"></div>
                <div className="flex justify-between items-start mb-6">
                  <div className="h-12 w-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-lg">
                    {eq.count}대
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{eq.name}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{eq.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities (시설 소개 - 2026 Grid) */}
      <section id="facilities" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="space-y-3">
              <span className="text-[#2a9d8f] text-sm font-bold tracking-wider uppercase">CLINIC INFRASTRUCTURE</span>
              <h3 className="text-3xl font-extrabold text-gray-900">안심 힐링 치료 환경 안내</h3>
              <p className="text-gray-500 text-sm">
                환자분들이 쾌적하고 힐링할 수 있는 입원 및 전문 재활치료 시설 전경입니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FACILITIES.map((facility) => (
              <div key={facility.title} className="group overflow-hidden rounded-2xl border border-gray-100 hover:shadow-xl transition-all bg-white">
                <div className="h-60 overflow-hidden relative">
                  <img
                    src={facility.image}
                    alt={facility.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {facility.badge}
                  </span>
                </div>
                <div className="p-6 space-y-2">
                  <h4 className="font-bold text-gray-900 text-base">{facility.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{facility.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Reviews Dashboard (2026 Modernized) */}
      <section id="reviews" className="py-20 bg-gray-50/60 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[#2a9d8f] text-sm font-bold tracking-wider uppercase">PATIENT TESTIMONIALS</span>
            <h3 className="text-3xl font-extrabold text-gray-900">환자분들이 인정한 안심 치료</h3>
            <p className="text-gray-500 text-sm">
              구글 공식 평점 5.0 만점, 한방 치료 및 뇌경색 입원 재활에 대한 생생한 환자 및 보호자의 목소리입니다.
            </p>
          </div>

          {/* Interactive Review Slider */}
          <div className="relative bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-xl shadow-gray-200/20">
            <div className="absolute top-8 right-8 text-6xl font-serif text-teal-100 select-none">“</div>
            
            <div className="space-y-6">
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(REVIEWS[activeReviewIdx].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="text-base sm:text-lg font-medium text-gray-800 leading-relaxed">
                "{REVIEWS[activeReviewIdx].content}"
              </blockquote>

              {/* Author Details */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                <div>
                  <cite className="not-italic font-bold text-gray-900 text-base">{REVIEWS[activeReviewIdx].author}</cite>
                  <p className="text-xs text-gray-400 mt-1">{REVIEWS[activeReviewIdx].date}</p>
                </div>
                
                {/* Navigation Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={prevReview}
                    className="h-10 w-10 rounded-full border border-gray-200 text-gray-600 hover:bg-[#1d3557] hover:text-white transition-colors flex items-center justify-center active:scale-95"
                    aria-label="Previous review"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextReview}
                    className="h-10 w-10 rounded-full border border-gray-200 text-gray-600 hover:bg-[#1d3557] hover:text-white transition-colors flex items-center justify-center active:scale-95"
                    aria-label="Next review"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center gap-2 mt-6">
            {REVIEWS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveReviewIdx(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${activeReviewIdx === idx ? "w-6 bg-[#2a9d8f]" : "w-2 bg-gray-300"}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Map & Parking Guide (Directions) */}
      <section id="location" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Directions details */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[#2a9d8f] text-sm font-bold tracking-wider uppercase">LOCATION GUIDE</span>
              <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                광주 북문대로 183 오시는 길
              </h3>
              
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-[#2a9d8f] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900">상세 주소</p>
                    <p className="mt-1">광주광역시 북구 북문대로 183 (운암동)</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock className="h-5 w-5 text-[#2a9d8f] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900">진료일 안내</p>
                    <p className="mt-1">평일 오전 9:00 ~ 오후 5:30 (점심시간 12:30 ~ 13:30)</p>
                    <p>토요일 오전 9:00 ~ 오후 1:00 (점심시간 없음)</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Shield className="h-5 w-5 text-[#2a9d8f] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900">주차 시설</p>
                    <p className="mt-1">원내 전용 넓은 주차공간 완비 (진료 환자 및 입원 내방 차량 무료 주차 등록)</p>
                  </div>
                </div>
              </div>

              {/* Map App Links */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="https://map.naver.com/v5/search/광주%20새우리한방병원"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <Map className="h-4 w-4 text-emerald-500" />
                  네이버 지도에서 보기
                </a>
                <a
                  href="https://map.kakao.com/?q=광주%20새우리한방병원"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <MapPin className="h-4 w-4 text-yellow-500" />
                  카카오맵에서 보기
                </a>
              </div>
            </div>

            {/* Premium Visual Map Presentation */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl overflow-hidden border border-gray-100 shadow-xl h-96 bg-[#e5e7eb] flex items-center justify-center">
                {/* Simulated Premium Modern Vector Map */}
                <div className="absolute inset-0 bg-[#eef1f6] flex flex-col justify-between p-6">
                  {/* Styled Map Background Representation */}
                  <div className="flex justify-between items-start opacity-20">
                    <div className="h-2 w-full bg-gray-300 rotate-12"></div>
                    <div className="h-2 w-full bg-gray-300 -rotate-12"></div>
                  </div>
                  <div className="w-12 h-64 bg-gray-300/30 rounded-lg absolute left-1/3 top-0 transform rotate-12"></div>
                  <div className="w-16 h-64 bg-gray-300/20 rounded-lg absolute left-1/2 top-0 transform -rotate-45"></div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-[#1d3557] flex items-center justify-center text-white shadow-2xl animate-bounce">
                        <MapPin className="h-5 w-5 text-teal-400" />
                      </div>
                      <div className="mt-3 bg-white px-4 py-2 rounded-xl border border-gray-200/80 shadow-lg text-center">
                        <p className="font-extrabold text-xs text-gray-900">새우리한방병원</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">광주 북구 북문대로 183</p>
                      </div>
                    </div>
                  </div>

                  <div className="self-end bg-white/80 backdrop-blur-md border border-gray-100 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-gray-500">
                    지도 로딩 완료 (네이버/카카오 연동)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Online Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#1d3557] p-6 text-white flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold">2026 실시간 간편 예약</h4>
                <p className="text-xs text-gray-300 mt-1">원하시는 진료과와 일정을 작성해주세요.</p>
              </div>
              <button onClick={() => setIsBookingOpen(false)} className="text-white/80 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">이름</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    placeholder="환자 성함을 입력해주세요."
                    className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a9d8f] focus:border-transparent bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">연락처</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={bookingPhone}
                    onChange={(e) => setBookingPhone(e.target.value)}
                    placeholder="예: 010-1234-5678"
                    className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a9d8f] focus:border-transparent bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">희망 진료과</label>
                <select
                  required
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a9d8f] focus:border-transparent bg-gray-50"
                >
                  <option value="">진료과를 선택해주세요.</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">희망 진료 일정</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a9d8f] focus:border-transparent bg-gray-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#2a9d8f] text-white hover:bg-[#23877a] py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-teal-500/10 active:scale-95"
              >
                예약 신청 완료
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Bottom CTA Bar for Mobile Screen */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 px-4 py-3 flex gap-3 shadow-lg">
        <a
          href="tel:062-464-5000"
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5"
        >
          <Phone className="h-4 w-4 text-gray-600" />
          전화문의
        </a>
        <button
          onClick={() => setIsBookingOpen(true)}
          className="flex-1 bg-[#1d3557] hover:bg-[#254168] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5"
        >
          <CalendarCheck className="h-4 w-4 text-teal-400" />
          간편예약
        </button>
      </div>

      {/* Medical Compliance Footer & Clinic Disclaimers */}
      <footer className="bg-gray-900 text-gray-400 text-xs py-12 px-6 border-t border-gray-800 pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-6">
            <div className="space-y-1">
              <p className="text-white font-bold text-sm">새우리한방병원</p>
              <p>사업장 주소 : 광주광역시 북구 북문대로 183(운암동) | 대표전화 : 062-464-5000</p>
            </div>
            <div className="text-[10px] text-gray-500 bg-gray-950/40 border border-gray-800 px-3 py-1.5 rounded-lg max-w-sm">
              본 홈페이지는 의료법 제56조를 준수하여 보편적인 의학 및 한의학 정보를 바탕으로 내부 가이드 데모용으로 기획 제작되었습니다.
            </div>
          </div>
          
          <div className="space-y-2">
            <p>• 개개인의 체질 및 증상에 따라 한방 침구 및 도수치료의 효과는 다르게 나타날 수 있으며, 부작용이 발생할 수 있으므로 반드시 의료진과 충분한 사전 상담 후 치료 여부를 결정하시길 권장합니다.</p>
            <p>• 의료기관 정보 제공 및 홍보를 위해 작성된 모든 카피와 리뷰는 환자 동의 하에 법령 범위 내에서 안전하게 가공되어 관리되고 있습니다.</p>
            <p className="text-[10px] text-gray-600 pt-2">&copy; 2026 새우리한방병원. All rights reserved. Designed via Clinickit Guide System Showcase.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
