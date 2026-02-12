'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Target, BarChart3, Globe, Sparkles, ShieldCheck, Mail } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 px-6 bg-gradient-to-b from-primary/5 to-base-100 flex flex-col items-center text-center">
        <div className="badge badge-primary badge-outline gap-2 p-4 mb-6 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>No-Code AI 블로그 빌더</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
          아이디어만 던지세요.<br />
          <span className="text-primary italic">수익형 블로그</span>는 AI가 만듭니다.
        </h1>
        <p className="text-lg md:text-xl text-base-content/60 max-w-2xl mb-12">
          키워드 선정부터 콘텐츠 작성, 배포, SEO 최적화까지.<br className="hidden md:block" />
          ClickBlog이 당신의 잠자는 인프라를 깨워 수익을 창출합니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md px-4">
          <Link href="/login" className="btn btn-primary btn-lg flex-1 text-white shadow-xl shadow-primary/20">
            시작하기 <ArrowRight className="w-5 h-5 ml-1" />
          </Link>
          <button className="btn btn-outline btn-lg flex-1">
            둘러보기
          </button>
        </div>

        {/* Mockup Preview */}
        <div className="mt-20 w-full max-w-5xl rounded-3xl border border-base-300 shadow-2xl overflow-hidden bg-base-200">
          <div className="bg-base-300 px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-error/40"></div>
              <div className="w-3 h-3 rounded-full bg-warning/40"></div>
              <div className="w-3 h-3 rounded-full bg-success/40"></div>
            </div>
            <div className="flex-1 text-center font-mono text-xs opacity-40">clickblog.app/dashboard</div>
          </div>
          <div className="p-4 md:p-8 bg-base-100 min-h-[400px] flex flex-col gap-6">
            <div className="flex flex-col md:row items-center justify-between gap-4">
              <div className="skeleton h-8 w-40"></div>
              <div className="skeleton h-8 w-24"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="skeleton h-32 w-full rounded-2xl"></div>
              <div className="skeleton h-32 w-full rounded-2xl"></div>
              <div className="skeleton h-32 w-full rounded-2xl"></div>
            </div>
            <div className="skeleton h-60 w-full rounded-2xl"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          왜 ClickBlog 인가요?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              icon: Zap,
              title: "초간편 원클릭 빌드",
              desc: "Vercel 연동으로 버튼 하나만 누르면 나만의 블로그 도메인이 생성되고 배포됩니다."
            },
            {
              icon: Target,
              title: "SEO 최적화 AI",
              desc: "구글 애드센스 승인과 상위 노출을 위해 설계된 정교한 프롬프트 엔진이 글을 씁니다."
            },
            {
              icon: BarChart3,
              title: "마케팅 자동화",
              desc: "구독자 관리와 뉴스레터 발송, 데이터 분석까지 대시보드에서 한 번에 해결하세요."
            },
            {
              icon: Globe,
              title: "글로벌 확장성",
              desc: "다양한 언어로 번역 및 현지화된 콘텐츠를 생성하여 글로벌 트래픽을 유도합니다."
            },
            {
              icon: ShieldCheck,
              title: "안전한 인프라",
              desc: "사용자 본인의 키를 사용하여 인프라의 모든 통제권을 직접 가집니다."
            },
            {
              icon: Mail,
              title: "뉴스레터 통합",
              desc: "Resend를 통한 고성능 뉴스레터 시스템으로 팬들과 소통하세요."
            }
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="flex flex-col items-start p-8 rounded-3xl bg-base-200/50 hover:bg-base-200 transition-all border border-transparent hover:border-base-300">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/30">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-base-content/60 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded mt-auto">
        <aside>
          <p className="font-bold text-xl text-primary">ClickBlog</p>
          <p>Copyright © 2025 - All rights reserved by ClickBlog Inc.</p>
        </aside>
      </footer>
    </div>
  );
}

