'use client';

import React from 'react';
import { supabase } from '@/lib/supabase';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) console.error('Error logging in:', error.message);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 bg-gradient-to-b from-base-100 to-base-200">
            <div className="card w-full max-w-sm bg-base-100 shadow-xl border border-base-200">
                <div className="card-body items-center text-center py-10">
                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                        <LogIn className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="card-title text-2xl font-bold mb-2">반갑습니다!</h2>
                    <p className="text-base-content/60 mb-8">
                        ClickBlog과 함께 AI 자동화 블로그의<br />
                        세계를 경험해보세요.
                    </p>

                    <button
                        onClick={handleGoogleLogin}
                        className="btn btn-outline w-full gap-3 normal-case border-base-300 hover:bg-base-200 hover:text-base-content"
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google 계정으로 시작하기
                    </button>

                    <div className="divider text-xs text-base-content/40 mt-8">또는</div>

                    <p className="text-xs text-base-content/40 mt-4 leading-relaxed">
                        로그인 시 ClickBlog의 <span className="underline cursor-pointer">이용약관</span> 및 <br />
                        <span className="underline cursor-pointer">개인정보처리방침</span>에 동의하게 됩니다.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
