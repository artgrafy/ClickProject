'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Settings, FileText, BarChart2, Menu, LogOut, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

const Navigation = () => {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    return (
        <>
            <div className="navbar bg-base-100 shadow-sm fixed top-0 z-50 lg:px-8">
                <div className="flex-1">
                    <Link href="/" className="btn btn-ghost text-xl font-bold text-primary">
                        ClickBlog
                    </Link>
                </div>
                <div className="flex-none lg:hidden">
                    <label htmlFor="my-drawer" className="btn btn-square btn-ghost drawer-button">
                        <Menu className="w-6 h-6" />
                    </label>
                </div>
                <div className="flex-none hidden lg:block">
                    <ul className="menu menu-horizontal px-1 gap-2 items-center">
                        <li><Link href="/dashboard">대시보드</Link></li>
                        <li><Link href="/posts">포스팅 관리</Link></li>
                        <li><Link href="/settings">설정</Link></li>
                        {user ? (
                            <div className="dropdown dropdown-end ml-4">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-base-200">
                                    <div className="w-10 rounded-full flex items-center justify-center bg-base-200">
                                        {user.user_metadata.avatar_url ? (
                                            <img src={user.user_metadata.avatar_url} alt="profile" />
                                        ) : (
                                            <User className="w-6 h-6 text-base-content/40" />
                                        )}
                                    </div>
                                </div>
                                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-200">
                                    <li className="px-4 py-2 font-bold border-bottom border-base-200">
                                        {user.user_metadata.full_name || user.email}
                                    </li>
                                    <div className="divider my-0"></div>
                                    <li><Link href="/profile">내 프로필</Link></li>
                                    <li><button onClick={handleLogout} className="text-error">로그아웃</button></li>
                                </ul>
                            </div>
                        ) : (
                            <li><Link href="/login" className="btn btn-primary btn-sm text-white ml-2 rounded-lg">로그인</Link></li>
                        )}
                    </ul>
                </div>
            </div>

            <div className="btm-nav lg:hidden z-50 h-16 border-t border-base-200">
                <Link href="/dashboard" className="text-primary active">
                    <Home className="w-5 h-5" />
                    <span className="btm-nav-label text-xs">홈</span>
                </Link>
                <Link href="/posts">
                    <FileText className="w-5 h-5" />
                    <span className="btm-nav-label text-xs">글 관리</span>
                </Link>
                <Link href="/analytics">
                    <BarChart2 className="w-5 h-5" />
                    <span className="btm-nav-label text-xs">통계</span>
                </Link>
                <Link href="/settings">
                    <Settings className="w-5 h-5" />
                    <span className="btm-nav-label text-xs">설정</span>
                </Link>
            </div>
        </>
    );
};

export default Navigation;
