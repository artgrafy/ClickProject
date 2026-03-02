'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Zap,
  FileText,
  Calculator,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Cpu,
  BarChart3
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center overflow-x-hidden">
      {/* 🚀 Hero Section */}
      <section className="relative w-full py-20 px-6 min-h-[85vh] flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4" />
            <span>R&D AI Planner SaaS v1.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
            아이디어 한 줄이면 충분합니다<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">클릭 한번에 사업계획서</span>가 완성됩니다
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            최소한의 아이디어만 입력하세요. 복잡한 사업계획서의 목차 구성, <br className="hidden md:block" />
            논리적 본문 작성, 정교한 예산 계산까지 AI가 실시간으로 완성합니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/login" className="btn btn-primary btn-lg rounded-2xl px-12 text-white bg-cyan-600 hover:bg-cyan-500 border-none shadow-xl shadow-cyan-900/20 group">
              지금 바로 시작하기 <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="btn btn-outline btn-lg rounded-2xl px-12 border-white/10 text-white hover:bg-white/5">
              기능 미리보기
            </button>
          </div>
        </div>

        {/* Hero Mockup Image */}
        <div className="relative z-10 mt-16 w-full max-w-5xl aspect-[16/10] rounded-[32px] border border-white/10 shadow-2xl shadow-cyan-500/5 overflow-hidden group bg-slate-950/50 p-2 md:p-4">
          <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/5 bg-slate-900">
            <img
              src="/clickproject/hero-user.png"
              alt="ClickProject Dashboard Preview"
              className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-700"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none"></div>
        </div>
      </section>

      {/* 💎 Key Features */}
      <section className="w-full py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">압도적인 사업계획 효율성</h2>
          <p className="text-slate-400">단순한 글쓰기 AI를 넘어 정책과 예산을 이해하는 전문가 수준의 솔루션입니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: FileText,
              title: "양식 커스터마이징",
              desc: "공고별 제각각인 hwp 목차를 즉시 반영하여 최적화된 문서 구조를 설계합니다."
            },
            {
              icon: Cpu,
              title: "AI 본문 생성 엔진",
              desc: "기술성, 사업성, 시장성 분석 등 논리적 타당성이 필요한 전문 영역을 완벽하게 작성합니다."
            },
            {
              icon: Calculator,
              title: "예산 자동 계산기",
              desc: "정부 지원 비율과 민간 매칭 룰을 적용하여 자동으로 비목별 예산을 산출합니다."
            },
            {
              icon: Zap,
              title: "실시간 협업 및 저장",
              desc: "모든 버전이 실시간으로 저장되어 언제 어디서든 스마트하게 수정이 가능합니다."
            },
            {
              icon: ShieldCheck,
              title: "보안 기반 데이터 관리",
              desc: "사용자의 핵심 아이디어를 안전하게 보호하며 외부에 유출되지 않는 독립적인 환경을 제공합니다."
            },
            {
              icon: BarChart3,
              title: "전문가 검토 지원",
              desc: "작성된 계획서의 논리적 결함을 AI가 사전 점검하여 승인 확률을 높입니다."
            }
          ].map((item, idx) => (
            <div key={idx} className="p-10 rounded-[40px] bg-white/5 border border-white/5 hover:bg-white/[0.08] hover:border-cyan-500/20 transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-cyan-600/10 flex items-center justify-center text-cyan-400 mb-8 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 💰 Pricing Section (PG Requirement) */}
      <section id="pricing" className="w-full py-32 px-6 bg-slate-900/50 flex flex-col items-center">
        <div className="text-center mb-20 max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">합리적인 플랜</h2>
          <p className="text-slate-400">수백만 원의 컨설팅 비용 대신, ClickProject로 스마트하게 시작하세요.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Credit Option */}
          <div className="p-12 rounded-[48px] border border-white/5 bg-slate-950 flex flex-col h-full hover:border-white/10 transition-colors">
            <h3 className="text-xl font-bold text-white mb-2 italic">Essential</h3>
            <div className="text-4xl font-black text-white mb-8">10,000 <span className="text-lg font-medium text-slate-500">원 / 크레딧</span></div>
            <ul className="space-y-4 mb-12 flex-grow">
              {['1개 프로젝트 생성 시 1크레딧', '영구 보관 및 언제든 수정', '표준 양식 3종 제공', '가이드라인 무제한 조회'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500" /> {f}
                </li>
              ))}
            </ul>
            <button className="btn btn-outline rounded-2xl w-full text-white border-white/20 hover:bg-white/5">크레딧 충전하기</button>
          </div>

          {/* Subscription (Most Popular) */}
          <div className="p-12 rounded-[48px] border-2 border-cyan-500 bg-slate-950 relative overflow-hidden group">
            <div className="absolute top-0 right-0 px-6 py-2 bg-cyan-500 text-white text-xs font-black rounded-bl-3xl tracking-widest uppercase">Best Value</div>
            <h3 className="text-xl font-bold text-white mb-2 italic">Unlimited Pro</h3>
            <div className="text-4xl font-black text-white mb-8">79,000 <span className="text-lg font-medium text-slate-500">원 / 월</span></div>
            <ul className="space-y-4 mb-12">
              {['프로젝트 생성 무제한', '모든 연구과제 양식 AI 학습 반영', '연차별 예산 자동 계산 무제한', 'PDF/Docx 전문 다운로드', '최우선 고객 지원'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/login" className="btn btn-primary rounded-2xl w-full text-white bg-cyan-600 hover:bg-cyan-500 border-none shadow-xl shadow-cyan-900/20">
              구독 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* 📞 Call to Action */}
      <section className="w-full py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-cyan-600 opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-3xl md:text-6xl font-black text-white leading-tight">
            완벽한 R&D 계획서,<br />
            지금 바로 Click하세요.
          </h2>
          <p className="text-lg text-slate-400 font-medium italic animate-pulse">
            * 중소벤처기업부, 과기정통부, 산자부 등 주요 부처 양식 완벽 지원
          </p>
          <div className="pt-4">
            <Link href="/login" className="btn btn-lg btn-ghost text-white underline underline-offset-8 decoration-cyan-500 decoration-2 hover:bg-transparent text-xl font-bold">
              무료로 시작해보기 <ChevronRight className="w-6 h-6 ml-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
