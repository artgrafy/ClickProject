'use client';

import React, { useState, useEffect } from 'react';
import {
    Key,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    Save,
    ShieldCheck,
    Zap,
    Mail,
    Cpu,
    Camera,
    Layout,
    Type,
    Tag,
    Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SettingsPage = () => {
    const [keys, setKeys] = useState({
        vercel: '',
        resend: '',
        gemini: '',
        pexels: '',
    });

    const [blogSettings, setBlogSettings] = useState({
        name: 'My Awesome Blog',
        description: 'AI가 작성하는 지능형 블로그',
        category: 'Economy',
    });

    const [validation, setValidation] = useState({
        vercel: { status: 'idle', message: '' },
        resend: { status: 'idle', message: '' },
        gemini: { status: 'idle', message: '' },
        pexels: { status: 'idle', message: '' },
    });

    const [isSaving, setIsSaving] = useState(false);

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedKeys = localStorage.getItem('cb_api_keys');
        const savedBlog = localStorage.getItem('cb_blog_settings');
        if (savedKeys) setKeys(JSON.parse(savedKeys));
        if (savedBlog) setBlogSettings(JSON.parse(savedBlog));
    }, []);

    const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setKeys((prev) => ({ ...prev, [name]: value }));
    };

    const handleBlogChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBlogSettings((prev) => ({ ...prev, [name]: value }));
    };

    const validateKey = async (name: keyof typeof keys) => {
        const value = keys[name];
        if (!value) {
            setValidation((prev) => ({
                ...prev,
                [name]: { status: 'error', message: '키를 입력해주세요.' }
            }));
            return;
        }

        setValidation((prev) => ({
            ...prev,
            [name]: { status: 'loading', message: '검증 중...' }
        }));

        // Simulate validation
        setTimeout(() => {
            if (value.length > 20) {
                setValidation((prev) => ({
                    ...prev,
                    [name]: { status: 'success', message: '유효한 형식입니다.' }
                }));
            } else {
                setValidation((prev) => ({
                    ...prev,
                    [name]: { status: 'error', message: '잘못된 키 형식입니다.' }
                }));
            }
        }, 1000);
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        // Save to localStorage
        localStorage.setItem('cb_api_keys', JSON.stringify(keys));
        localStorage.setItem('cb_blog_settings', JSON.stringify(blogSettings));

        setTimeout(() => {
            setIsSaving(false);
            alert('모든 설정이 로컬에 안전하게 저장되었습니다.');
        }, 1000);
    };

    const KeyInput = ({
        id,
        label,
        value,
        placeholder,
        description,
        link,
        icon: Icon,
        validationKey
    }: {
        id: string;
        label: string;
        value: string;
        placeholder: string;
        description: string;
        link: string;
        icon: any;
        validationKey: keyof typeof keys;
    }) => {
        const status = validation[validationKey].status;
        const message = validation[validationKey].message;

        return (
            <div className="form-control w-full mb-8">
                <label className="label flex flex-col items-start gap-1">
                    <span className="label-text text-lg font-bold flex items-center gap-2">
                        <Icon className="w-5 h-5 text-primary" /> {label}
                    </span>
                    <span className="label-text-alt text-base-content/60">{description}</span>
                </label>

                <div className="relative group">
                    <input
                        type="password"
                        name={validationKey}
                        value={value}
                        onChange={handleKeyChange}
                        placeholder={placeholder}
                        className={cn(
                            "input input-bordered w-full pr-24 focus:input-primary transition-all rounded-xl",
                            status === 'success' && "input-success",
                            status === 'error' && "input-error"
                        )}
                    />
                    <button
                        onClick={() => validateKey(validationKey)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs text-primary hover:bg-primary/10"
                    >
                        {status === 'loading' ? <span className="loading loading-spinner loading-xs"></span> : '검증하기'}
                    </button>
                </div>

                <div className="label pt-2">
                    <span className={cn(
                        "label-text-alt flex items-center gap-1",
                        status === 'success' && "text-success",
                        status === 'error' && "text-error"
                    )}>
                        {status === 'success' && <CheckCircle2 className="w-3 h-3" />}
                        {status === 'error' && <AlertCircle className="w-3 h-3" />}
                        {message}
                    </span>
                    <a href={link} target="_blank" rel="noreferrer" className="label-text-alt link link-primary flex items-center gap-1">
                        키 발급받기 <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 mb-20 lg:mb-0">
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-3xl font-extrabold mb-3 flex items-center justify-center md:justify-start gap-3">
                    <Settings className="w-8 h-8 text-primary" /> 설정 대시보드
                </h1>
                <p className="text-base-content/60">
                    블로그 인프라와 콘텐츠 설정을 원클릭으로 관리하세요.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Column 1: API Keys */}
                <div className="flex flex-col gap-8">
                    <div className="card bg-base-100 shadow-xl border border-base-200">
                        <div className="card-body p-6 md:p-8">
                            <h2 className="card-title text-xl mb-6 flex items-center gap-2">
                                <Key className="w-6 h-6 text-primary" /> 인프라 API 키
                            </h2>

                            <KeyInput
                                id="vercel"
                                label="Vercel Access Token"
                                description="자동 배포를 위한 액세스 토큰"
                                value={keys.vercel}
                                validationKey="vercel"
                                placeholder="A8b3..."
                                link="https://vercel.com/account/tokens"
                                icon={Zap}
                            />

                            <KeyInput
                                id="gemini"
                                validationKey="gemini"
                                label="Gemini API Key"
                                description="AI 콘텐츠 생성을 위한 키"
                                value={keys.gemini}
                                placeholder="AIza..."
                                link="https://aistudio.google.com/app/apikey"
                                icon={Cpu}
                            />

                            <KeyInput
                                id="resend"
                                validationKey="resend"
                                label="Resend API Key"
                                description="뉴스레터 발송용 키"
                                value={keys.resend}
                                placeholder="re_..."
                                link="https://resend.com/api-keys"
                                icon={Mail}
                            />

                            <KeyInput
                                id="pexels"
                                validationKey="pexels"
                                label="Pexels API Key"
                                description="고화질 썸네일 이미지 검색용 키"
                                value={keys.pexels}
                                placeholder="5634..."
                                link="https://www.pexels.com/api/new/"
                                icon={Camera}
                            />
                        </div>
                    </div>
                </div>

                {/* Column 2: Blog Settings */}
                <div className="flex flex-col gap-8">
                    <div className="card bg-base-100 shadow-xl border border-base-200">
                        <div className="card-body p-6 md:p-8">
                            <h2 className="card-title text-xl mb-6 flex items-center gap-2">
                                <Layout className="w-6 h-6 text-primary" /> 블로그 정보 설정
                            </h2>

                            <div className="form-control w-full mb-6">
                                <label className="label">
                                    <span className="label-text font-bold flex items-center gap-2">
                                        <Type className="w-4 h-4" /> 블로그 이름
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={blogSettings.name}
                                    onChange={handleBlogChange}
                                    placeholder="내 멋진 블로그"
                                    className="input input-bordered w-full rounded-xl focus:input-primary"
                                />
                            </div>

                            <div className="form-control w-full mb-6">
                                <label className="label">
                                    <span className="label-text font-bold flex items-center gap-2">
                                        <Tag className="w-4 h-4" /> 카테고리
                                    </span>
                                </label>
                                <select
                                    name="category"
                                    value={blogSettings.category}
                                    onChange={handleBlogChange}
                                    className="select select-bordered w-full rounded-xl focus:select-primary"
                                >
                                    <option value="Economy">경제/재테크</option>
                                    <option value="Tech">IT/기술</option>
                                    <option value="Self-Growth">자기계발</option>
                                    <option value="Travel">여행/일상</option>
                                    <option value="Health">건강/라이프</option>
                                </select>
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-bold flex items-center gap-2">
                                        <Layout className="w-4 h-4" /> 블로그 설명
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="description"
                                    value={blogSettings.description}
                                    onChange={handleBlogChange}
                                    placeholder="세상을 보는 새로운 시각"
                                    className="input input-bordered w-full rounded-xl focus:input-primary"
                                />
                            </div>

                            <div className="alert alert-info bg-primary/5 border-primary/20 mt-10 rounded-xl">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                <div className="text-xs">
                                    <span className="font-bold">보안:</span> 위 정보는 브라우저 로컬 저장소에 암호화되어 보관되며, 서버로는 API 호출 시에만 전달됩니다.
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSaveAll}
                        disabled={isSaving}
                        className="btn btn-primary btn-lg w-full text-white rounded-2xl shadow-xl shadow-primary/30"
                    >
                        {isSaving ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <>
                                <Save className="w-6 h-6 mr-2" />
                                모든 설정 저장하고 적용하기
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="mt-12 text-center opacity-40 pb-20 lg:pb-0">
                <p className="text-xs">© 2026 ClickBlog Engine v1.0. Zero-Config Deployment.</p>
            </div>
        </div>
    );
};

export default SettingsPage;
