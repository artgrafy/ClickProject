'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Layout, Menu, LogOut, User, Cpu, Sparkles } from 'lucide-react';
import { supabase, getEffectiveUser } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';

const Navigation = () => {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const user = await getEffectiveUser();
            setUser(user as any);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session) {
                setUser(session.user);
            } else {
                const devUser = await getEffectiveUser();
                setUser(devUser as any);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
            <div className="w-full px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
                            <Cpu className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tighter text-white">ClickProject</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/dashboard/builder" className="text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                            <Sparkles className="w-4 h-4" /> 프로젝트 빌더
                        </Link>
                        <Link href="/projects" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">나의 프로젝트</Link>
                        <Link href="/pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">요금제</Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-white/10 overflow-hidden">
                                {user.user_metadata.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="profile" />
                                ) : (
                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                        <User className="w-5 h-5 text-slate-400" />
                                    </div>
                                )}
                            </div>
                            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content bg-slate-900 border border-white/10 rounded-2xl w-52">
                                <li className="px-4 py-3 font-bold text-white border-b border-white/5">
                                    {user.user_metadata.full_name || user.email}
                                </li>
                                <li className="mt-2"><Link href="/profile" className="py-2">마이페이지</Link></li>
                                <li><Link href="/credits" className="py-2 flex justify-between items-center text-cyan-400">
                                    잔여 크레딧 <span>10</span>
                                </Link></li>
                                <div className="divider my-1 opacity-20"></div>
                                <li><button onClick={handleLogout} className="text-error py-2">로그아웃</button></li>
                            </ul>
                        </div>
                    ) : (
                        <Link href="/login" className="btn btn-primary btn-sm rounded-full px-6 text-white bg-cyan-600 hover:bg-cyan-500 border-none">
                            시작하기
                        </Link>
                    )}
                    <div className="md:hidden">
                        <button className="btn btn-ghost btn-circle text-white">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
