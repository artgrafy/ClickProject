import Link from 'next/link';
import { Cpu, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-white/5 pt-16 pb-8 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="md:col-span-2 space-y-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center text-white ring-4 ring-cyan-500/20">
                            <Cpu className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white">ClickProject</span>
                    </Link>
                    <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
                        AI 기반 R&D 사업계획서 자동 생성 솔루션.
                        복잡한 지침과 양식을 지능적으로 분석하여 최적의 제안서를 완성합니다.
                    </p>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <ShieldCheck className="w-4 h-4" />
                            <span>PG 인증 결제 보안 적용</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6">서비스</h4>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li><Link href="/features" className="hover:text-cyan-400 transition-colors">주요 기능</Link></li>
                        <li><Link href="/pricing" className="hover:text-cyan-400 transition-colors">요금 안내</Link></li>
                        <li><Link href="/guide" className="hover:text-cyan-400 transition-colors">이용 가이드</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6">고객지원</h4>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li><Link href="/terms" className="hover:text-cyan-400 transition-colors">이용약관</Link></li>
                        <li><Link href="/privacy" className="hover:text-cyan-400 transition-colors">개인정보처리방침</Link></li>
                        <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> jyoo21c@gmail.com</li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-white/5 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        <p>상호명: 투비프리 (To be Free) | 대표자: 유준영 | 개인정보보호책임자: 유준영</p>
                        <p>사업자등록번호: [사업자번호 입력 필요] | 통신판매업신고: [신고번호 입력 필요]</p>
                        <p>주소: [상세 주소 입력 필요]</p>
                        <p className="mt-2">© 2026 ClickProject by To be Free. All rights reserved.</p>
                    </div>
                    <div className="flex md:justify-end gap-6">
                        <img src="https://via.placeholder.com/120x40?text=PG+Secure" alt="PG Payment Secure" className="opacity-40 grayscale" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
