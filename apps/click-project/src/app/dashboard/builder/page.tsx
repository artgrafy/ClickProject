'use client';

import React, { useState, useEffect } from 'react';
import {
    Plus,
    GripVertical,
    Trash2,
    Files,
    FileText,
    Calculator,
    Play,
    ChevronRight,
    ChevronLeft,
    ChevronUp,
    ChevronDown,
    Sparkles,
    AlertTriangle,
    Info,
    History,
    Save,
    Layout,
    Type,
    Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 목차 타입 정의
interface TocItem {
    id: string;
    title: string;
    type: 'text' | 'table';
    instruction: string;
    level: number; // 0: 장, 1: 절, 2: 항...
    itemCount?: string; // 글 구성 항목 수
    charCount?: string; // 총 글자수
}

type BuilderStep = 'base' | 'structure' | 'budget' | 'instruction';

const BuilderPage = () => {
    // 1. 초기 템플릿 데이터 (계층 구조 반영)
    const initialTOC: TocItem[] = [
        { id: '1', title: '사업 개요', type: 'text', instruction: '본 사업의 추진 배경 및 필요성을 강조하고, 해결하고자 하는 시장의 페인포인트를 구체적으로 기술해줘. 관련 통계나 시장 조사 자료를 인용하여 사업의 시급성을 독자가 공감할 수 있게 작성해줘.', level: 0 },
        { id: '2', title: '연구개발의 내용', type: 'text', instruction: '개발하고자 하는 핵심 기술의 아키텍처와 구현 방법을 단계별로 기술해줘. 기존 기술과의 차별성을 표나 비교 분석을 통해 명확히 드러내고, 기술적 난관을 어떻게 극복할 것인지 상세히 기술해줘.', level: 0 },
        { id: '3', title: '추진 체계', type: 'text', instruction: '주관기관의 r&d 역량과 참여기관별 전문성을 바탕으로 한 역할 분담을 명확히 정의해줘. 유기적인 협력을 위한 의사결정 구조와 인력 투입 계획을 논리적인 흐름으로 정리해줘.', level: 0 },
        { id: '4', title: '기대 효과', type: 'text', instruction: '본 과제 성공 시 예상되는 기술적 파급효과와 경제적 이익(매출 증대, 고용 창출 등)을 구체적인 수치와 함께 제시해줘. 사회적으로 어떤 긍정적 변화를 가져올 수 있는지 ESG 관점에서도 서술해줘.', level: 0 },
        { id: '5', title: '사업비', type: 'table', instruction: '정부 과제 집행 지침에 따라 비목별 산정 근거를 명확히 제시해줘. 특히 연구원들의 인건비 계상율과 간접비 비율이 규정을 준수하도록 계산하고, 민간부담금의 현금/현물 비율을 확인해줘.', level: 0 },
    ];

    const [toc, setToc] = useState<TocItem[]>(initialTOC);
    const [selectedId, setSelectedId] = useState<string>(initialTOC[0].id);
    const [activeStep, setActiveStep] = useState<BuilderStep>('base');
    const [isGenerating, setIsGenerating] = useState(false);
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

    // 기본 정보 상태
    const [baseInfo, setBaseInfo] = useState({
        projectName: '',
        businessName: '',
        businessPeriod: '',
        leadOrg: '',
        coDevOrg: '',
        demandOrg: '',
        dedicatedOrg: ''
    });

    // 사업비 구성 상태
    const [budgetData, setBudgetData] = useState({
        total: 100000000,
        government: 75000000,
        private: 25000000,
        labor: 40000000,
        researchFacility: 20000000,
        researchMaterial: 15000000,
        researchActivity: 15000000,
        consignment: 10000000,
        direct: 50000000,
        indirect: 10000000
    });

    // 자동 번호 생성 로직
    const getAutoNumber = (index: number) => {
        const counters = [0, 0, 0, 0]; // 각 레벨별 카운터

        for (let i = 0; i <= index; i++) {
            const level = toc[i]?.level ?? 0;
            if (level < 0 || level > 3) continue;
            counters[level]++;
            // 하위 레벨 카운터 초기화
            for (let j = level + 1; j < counters.length; j++) {
                counters[j] = 0;
            }
        }

        const currentLevel = toc[index]?.level ?? 0;
        const activeCounters = counters.filter((c, idx) => idx <= currentLevel);

        // 0레벨(장)은 '1.', 1레벨(절)은 '1.1.' 식의 표현
        if (activeCounters.length === 1) return `${activeCounters[0]}.`;
        return activeCounters.join('.') + '.';
    };

    // 드래그 앤 드롭 핸들러
    const handleDragStart = (index: number) => {
        setDraggedItemIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
    };

    const handleDrop = (index: number) => {
        if (draggedItemIndex === null) return;
        const newToc = [...toc];
        const draggedItem = newToc[draggedItemIndex];
        newToc.splice(draggedItemIndex, 1);
        newToc.splice(index, 0, draggedItem);
        setNormalizedToc(newToc);
        setDraggedItemIndex(null);
    };

    // 계층 보정 로직 (Strict Hierarchy)
    const normalizeToc = (items: TocItem[]): TocItem[] => {
        let lastLevel = -1;
        return items.map((item, idx) => {
            let level = item.level;
            if (idx === 0) {
                level = 0; // 첫 번째 항목은 항상 Level 0
            } else if (level > lastLevel + 1) {
                level = lastLevel + 1; // 이전 항목보다 2단계 이상 깊어질 수 없음
            }
            lastLevel = level;
            return { ...item, level };
        });
    };

    // 계층 변경 함수 (들여쓰기/내어쓰기)
    const changeLevel = (id: string, delta: number) => {
        setToc(prevToc => {
            const newToc = prevToc.map(item => {
                if (item.id === id) {
                    const currentLevel = typeof item.level === 'number' ? item.level : 0;
                    const newLevel = Math.max(0, Math.min(3, currentLevel + delta));
                    return { ...item, level: newLevel };
                }
                return item;
            });
            return normalizeToc(newToc);
        });
    };

    // 선택된 아이템 찾기
    const selectedItem = toc.find(item => item.id === selectedId);

    // 목차 추가 함수
    const addSection = () => {
        const newId = Math.random().toString(36).substr(2, 9);
        const newItem: TocItem = {
            id: newId,
            title: '새로운 섹션',
            type: 'text',
            instruction: '이 섹션의 핵심 내용을 사업 계획서의 전체적인 논리 흐름에 맞게 상세히 기술해 주세요. 필요시 전문적인 용어를 사용하고 구체적인 실천 방안이나 데이터 중심의 근거를 포함해 달라고 AI에게 요청하세요.',
            level: selectedItem ? selectedItem.level : 0,
            itemCount: '3',
            charCount: '1000'
        };

        // 현재 선택된 위치 다음에 추가
        const selectedIndex = toc.findIndex(item => item.id === selectedId);
        const newToc = [...toc];
        newToc.splice(selectedIndex + 1, 0, newItem);
        setNormalizedToc(newToc);
        setSelectedId(newId);
    };

    // 목차 삭제 함수
    const deleteSection = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (toc.length <= 1) return;
        const newToc = toc.filter(item => item.id !== id);
        setNormalizedToc(newToc);
        if (selectedId === id) setSelectedId(newToc[0].id);
    };

    // 지침 업데이트 함수
    const updateInstruction = (value: string) => {
        setToc(toc.map(item => item.id === selectedId ? { ...item, instruction: value } : item));
    };

    // 제목 업데이트 함수
    const updateTitle = (value: string) => {
        setToc(toc.map(item => item.id === selectedId ? { ...item, title: value } : item));
    };

    // 상세 설정 업데이트 함수
    const updateDetail = (field: 'itemCount' | 'charCount', value: string) => {
        setToc(toc.map(item => item.id === selectedId ? { ...item, [field]: value } : item));
    };

    // 상태 변경 시 항상 보정 적용
    const setNormalizedToc = (rawToc: TocItem[]) => {
        setToc(normalizeToc(rawToc));
    };

    // 항목 이동 함수 (화살표 대응 및 그룹 이동)
    const moveItem = (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= toc.length) return;

        // 그룹 찾기 (현재 항목 + 하위 항목들)
        const getGroupIndices = (idx: number) => {
            const indices = [idx];
            const level = toc[idx].level;
            for (let i = idx + 1; i < toc.length; i++) {
                if (toc[i].level > level) {
                    indices.push(i);
                } else {
                    break;
                }
            }
            return indices;
        };

        const currentGroup = getGroupIndices(index);

        let swapTargetIdx = -1;
        if (direction === 'up') {
            // 위로 이동할 때는 내 바로 위의 형제 그룹을 찾아야 함
            for (let i = index - 1; i >= 0; i--) {
                if (toc[i].level <= toc[index].level) {
                    swapTargetIdx = i;
                    break;
                }
            }
        } else {
            // 아래로 이동할 때는 내 그룹이 끝나는 바로 다음 항목
            const lastOfCurrent = currentGroup[currentGroup.length - 1];
            if (lastOfCurrent + 1 < toc.length) {
                swapTargetIdx = lastOfCurrent + 1;
            }
        }

        if (swapTargetIdx === -1) return;

        const newToc = [...toc];
        if (direction === 'up') {
            const itemsToMove = newToc.splice(index, currentGroup.length);
            newToc.splice(swapTargetIdx, 0, ...itemsToMove);
        } else {
            // 아래로 이동할 대상 그룹 찾기
            const targetGroup = getGroupIndices(swapTargetIdx);
            const itemsToMove = newToc.splice(index, currentGroup.length);
            newToc.splice(swapTargetIdx + targetGroup.length - currentGroup.length, 0, ...itemsToMove);
        }
        setNormalizedToc(newToc);
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 overflow-hidden flex-col lg:flex-row mt-16 lg:mt-0">
            {/* 📁 [Column 1] Left Sidebar: Hidden on Mobile */}
            <aside className="hidden lg:flex w-80 border-r border-white/5 flex-col bg-slate-900/50 shrink-0">
                <div className="p-8 border-b border-white/5 bg-slate-900/80 bg-gradient-to-b from-slate-900 to-slate-900/50">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                                {activeStep === 'base' ? <Info className="w-5 h-5 text-cyan-400" /> : activeStep === 'structure' ? <Layout className="w-5 h-5 text-cyan-400" /> : activeStep === 'budget' ? <Calculator className="w-5 h-5 text-cyan-400" /> : <Sparkles className="w-5 h-5 text-cyan-400" />}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">STEP {activeStep === 'base' ? '01' : activeStep === 'structure' ? '02' : activeStep === 'budget' ? '03' : '04'}</span>
                                <h2 className="text-2xl font-black text-slate-100 mt-1">
                                    {activeStep === 'base' ? '기본 설정' : activeStep === 'structure' ? '목차 설정' : activeStep === 'budget' ? '사업비 구성' : '지침 설정'}
                                </h2>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 border-l-cyan-500/50 border-l-4">
                            <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
                                {activeStep === 'base'
                                    ? '프로젝트의 핵심 사업 정보를 정의합니다. 입력된 정보는 AI가 사업의 성격을 파악하는 기준이 됩니다.'
                                    : activeStep === 'structure'
                                        ? '문서의 흐름을 논리적으로 설계합니다. 각 절의 제목과 계층 구조를 설정하여 전체 윤곽을 잡으세요.'
                                        : activeStep === 'budget'
                                            ? '사업비 구성 상세 내역을 입력합니다. 인건비 및 주요 경비 비율을 분석하여 사업의 실현 가능성을 높입니다.'
                                            : '각 목차별 세부 지침을 설정합니다. 구체적인 요청사항을 추가하여 완성도 높은 초안을 생성하세요.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
                    {activeStep === 'instruction' ? (
                        <div className="mb-6 px-2 animate-in fade-in slide-in-from-left-4 duration-500">
                            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 flex items-center justify-between">
                                <span>목차 내비게이션</span>
                            </h3>
                            {toc.map((item, index) => (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedId(item.id)}
                                    style={{ paddingLeft: `${item.level * 12}px` }}
                                    className={cn(
                                        "group flex items-center gap-2 p-2.5 rounded-xl transition-all cursor-pointer mb-1 border",
                                        selectedId === item.id
                                            ? "bg-cyan-600/10 border-cyan-500/30 text-white shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                                            : "bg-transparent border-transparent hover:bg-white/5 text-slate-400 font-medium"
                                    )}
                                >
                                    <div className="flex-grow min-w-0">
                                        <p className={cn(
                                            "text-xs truncate",
                                            item.level === 0 ? "font-black text-slate-200" : "font-medium"
                                        )}>
                                            <span className="text-cyan-500/50 mr-1.5 tabular-nums">{getAutoNumber(index)}</span>
                                            {item.title}
                                        </p>
                                    </div>
                                    {selectedId === item.id && <ChevronRight className="w-3 h-3 text-cyan-400" />}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4 opacity-40">
                            <div className="w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center">
                                <Layout className="w-5 h-5 text-slate-600" />
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                {activeStep === 'base' ? '사업 기본 정보를\n먼저 입력해 주세요' : '목차 구성은\n중앙 섹션에서 진행됩니다'}
                            </p>
                        </div>
                    )}

                    {/* Template Scanning UI (상시 노출) */}
                    {activeStep === 'structure' && (
                        <div className="mt-auto p-4 rounded-2xl bg-cyan-600/5 border border-cyan-500/10 border-dashed mx-2 transition-all animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <p className="text-xs font-bold text-cyan-400 mb-1 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> AI 양식 스캐너
                            </p>
                            <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">공고문 목차를 스캔하여 자동 구조화합니다.</p>
                            <button className="btn btn-xs btn-outline btn-primary w-full border-cyan-500/30 text-cyan-400">시작하기</button>
                        </div>
                    )}
                </div>
            </aside>

            {/* 📝 [Column 2] Center Area: Prompt Editor */}
            <main className="flex-grow flex flex-col min-w-0 bg-slate-950 relative border-r border-white/5 overflow-y-auto">
                <div className="px-4 lg:px-8 py-6 lg:py-10 border-b border-white/5 bg-slate-950/80 backdrop-blur-md z-10 sticky top-0">
                    <div className="max-w-4xl flex flex-col gap-8">
                        {/* Step Indicator */}
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-600">
                            <button
                                onClick={() => setActiveStep('base')}
                                className={cn(
                                    "flex items-center gap-2 transition-all hover:text-cyan-400 group",
                                    activeStep === 'base' ? "text-cyan-400" : "text-slate-400"
                                )}
                            >
                                <span className={cn(
                                    "text-xs font-black tracking-tighter",
                                    activeStep === 'base' ? "text-cyan-400 opacity-100" : "text-slate-500 opacity-50 group-hover:opacity-80"
                                )}>01</span>
                                <span className="font-bold">기본 설정</span>
                            </button>
                            <div className="w-8 h-px bg-white/10 mx-1"></div>
                            <button
                                onClick={() => setActiveStep('structure')}
                                className={cn(
                                    "flex items-center gap-2 transition-all hover:text-cyan-400 group",
                                    activeStep === 'structure' ? "text-cyan-400" : "text-slate-400"
                                )}
                            >
                                <span className={cn(
                                    "text-xs font-black tracking-tighter",
                                    activeStep === 'structure' ? "text-cyan-400 opacity-100" : "text-slate-500 opacity-50 group-hover:opacity-80"
                                )}>02</span>
                                <span className="font-bold">목차 설정</span>
                            </button>
                            <div className="w-8 h-px bg-white/10 mx-1"></div>
                            <button
                                onClick={() => setActiveStep('budget')}
                                className={cn(
                                    "flex items-center gap-2 transition-all hover:text-cyan-400 group",
                                    activeStep === 'budget' ? "text-cyan-400" : "text-slate-400"
                                )}
                            >
                                <span className={cn(
                                    "text-xs font-black tracking-tighter",
                                    activeStep === 'budget' ? "text-cyan-400 opacity-100" : "text-slate-500 opacity-50 group-hover:opacity-80"
                                )}>03</span>
                                <span className="font-bold">사업비 구성</span>
                            </button>
                            <div className="w-8 h-px bg-white/10 mx-1"></div>
                            <button
                                onClick={() => setActiveStep('instruction')}
                                className={cn(
                                    "flex items-center gap-2 transition-all hover:text-cyan-400 group",
                                    activeStep === 'instruction' ? "text-cyan-400" : "text-slate-400"
                                )}
                            >
                                <span className={cn(
                                    "text-xs font-black tracking-tighter",
                                    activeStep === 'instruction' ? "text-cyan-400 opacity-100" : "text-slate-500 opacity-50 group-hover:opacity-80"
                                )}>04</span>
                                <span className="font-bold">지침 설정</span>
                            </button>
                        </div>

                        <div className="flex justify-between items-center w-full gap-8">
                            <div className="flex-grow flex flex-col gap-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase">
                                        {activeStep === 'base' ? 'Step 01' : activeStep === 'structure' ? 'Step 02' : activeStep === 'budget' ? 'Step 03' : 'Step 04'}
                                    </span>
                                </div>
                                <h1 className="text-2xl font-black flex items-center gap-3 w-full text-slate-100">
                                    {activeStep === 'base' ? (
                                        <input
                                            value={baseInfo.projectName || '새로운 프로젝트'}
                                            onChange={(e) => setBaseInfo(prev => ({ ...prev, projectName: e.target.value }))}
                                            className="bg-transparent border-none focus:ring-0 w-full outline-none placeholder:text-slate-800 transition-all font-black"
                                            placeholder="프로젝트명을 입력하세요"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            {activeStep === 'structure' ? <Layout className="w-6 h-6 text-cyan-400" /> :
                                                activeStep === 'budget' ? <Calculator className="w-6 h-6 text-cyan-400" /> :
                                                    <Sparkles className="w-6 h-6 text-cyan-400" />}
                                            {activeStep === 'structure' ? '전체 목차 상세 구성' :
                                                activeStep === 'budget' ? '전체 사업비 구성' :
                                                    '세부 작성 지침 설정'}
                                        </div>
                                    )}
                                </h1>
                            </div>
                            <div className="flex gap-3 shrink-0">
                                <button className="btn btn-ghost btn-sm text-slate-400 border border-white/5"><History className="w-4 h-4" /> 기록</button>
                                <button className="btn btn-ghost btn-sm text-slate-400 border border-white/5"><Save className="w-4 h-4" /> 임시저장</button>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="flex-grow px-8 py-10 overflow-y-auto custom-scrollbar">
                    <div className="max-w-4xl space-y-10 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        {activeStep === 'base' ? (
                            <div className="space-y-8 pb-10">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-4">
                                        <label className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <Info className="w-4 h-4 text-cyan-400" /> 필수 정보
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2 flex flex-col">
                                                <label className="label mb-2 cursor-pointer">
                                                    <span className="label-text text-slate-400 font-bold">프로젝트명 <span className="text-rose-500 font-bold ml-0.5">*</span></span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={baseInfo.projectName}
                                                    onChange={(e) => setBaseInfo(prev => ({ ...prev, projectName: e.target.value }))}
                                                    placeholder="프로젝트명을 입력하세요"
                                                    className="input input-lg bg-slate-900/50 border-white/10 rounded-2xl focus:border-cyan-500/50 text-slate-200 transition-all focus:bg-slate-900 w-full"
                                                />
                                            </div>
                                            <div className="md:col-span-2 flex flex-col">
                                                <label className="label mb-2 cursor-pointer">
                                                    <span className="label-text text-slate-400 font-bold">사업명 <span className="text-rose-500 font-bold ml-0.5">*</span></span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={baseInfo.businessName}
                                                    onChange={(e) => setBaseInfo(prev => ({ ...prev, businessName: e.target.value }))}
                                                    placeholder="정식 사업명을 입력하세요"
                                                    className="input bg-slate-900/50 border-white/10 rounded-2xl focus:border-cyan-500/50 text-slate-200 w-full lg:h-12"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="label mb-2 cursor-pointer">
                                                    <span className="label-text text-slate-400 font-bold">사업기간 <span className="text-rose-500 font-bold ml-0.5">*</span></span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={baseInfo.businessPeriod}
                                                    onChange={(e) => setBaseInfo(prev => ({ ...prev, businessPeriod: e.target.value }))}
                                                    placeholder="예: 2024.03 ~ 2026.12"
                                                    className="input bg-slate-900/50 border-white/10 rounded-2xl focus:border-cyan-500/50 text-slate-200 w-full lg:h-12"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="label mb-2 cursor-pointer">
                                                    <span className="label-text text-slate-400 font-bold">주관기관 <span className="text-rose-500 font-bold ml-0.5">*</span></span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={baseInfo.leadOrg}
                                                    onChange={(e) => setBaseInfo(prev => ({ ...prev, leadOrg: e.target.value }))}
                                                    placeholder="주관연구개발기관명"
                                                    className="input bg-slate-900/50 border-white/10 rounded-2xl focus:border-cyan-500/50 text-slate-200 w-full lg:h-12"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <label className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <Plus className="w-4 h-4 text-cyan-400" /> 추가 정보 (선택)
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex flex-col">
                                                <label className="label mb-2 cursor-pointer">
                                                    <span className="label-text text-slate-400 font-bold">공동개발기관</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={baseInfo.coDevOrg}
                                                    onChange={(e) => setBaseInfo(prev => ({ ...prev, coDevOrg: e.target.value }))}
                                                    placeholder="공동연구개발기관 (있는 경우)"
                                                    className="input bg-slate-900/30 border-white/10 rounded-2xl focus:border-cyan-500/50 text-slate-400 text-sm w-full lg:h-12"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="label mb-2 cursor-pointer">
                                                    <span className="label-text text-slate-400 font-bold">수요기관</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={baseInfo.demandOrg}
                                                    onChange={(e) => setBaseInfo(prev => ({ ...prev, demandOrg: e.target.value }))}
                                                    placeholder="연구결과 활용 수요기관"
                                                    className="input bg-slate-900/30 border-white/10 rounded-2xl focus:border-cyan-500/50 text-slate-400 text-sm w-full lg:h-12"
                                                />
                                            </div>
                                            <div className="md:col-span-2 flex flex-col pt-2">
                                                <label className="label mb-2 cursor-pointer">
                                                    <span className="label-text text-slate-400 font-bold">전담기관</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={baseInfo.dedicatedOrg}
                                                    onChange={(e) => setBaseInfo(prev => ({ ...prev, dedicatedOrg: e.target.value }))}
                                                    placeholder="사업 전담 관리 기관"
                                                    className="input bg-slate-900/30 border-white/10 rounded-2xl focus:border-cyan-500/50 text-slate-400 text-sm w-full lg:h-12"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : activeStep === 'structure' ? (
                            <div className="space-y-8 pb-32 animate-in fade-in duration-700">
                                <div className="flex items-center justify-end mb-4">
                                    <button
                                        onClick={() => addSection()}
                                        className="btn btn-sm btn-primary bg-cyan-600 hover:bg-cyan-500 border-none rounded-xl px-4 font-bold"
                                    >
                                        <Plus className="w-4 h-4 mr-1.5" /> 섹션 추가
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {toc.map((item, index) => (
                                        <div
                                            key={item.id}
                                            draggable="true"
                                            onDragStart={() => handleDragStart(index)}
                                            onDragOver={(e) => handleDragOver(e, index)}
                                            onDrop={() => handleDrop(index)}
                                            style={{ marginLeft: `${item.level * 32}px` }}
                                            className={cn(
                                                "group flex items-center gap-4 p-4 rounded-2xl border transition-all relative overflow-hidden",
                                                selectedId === item.id
                                                    ? "bg-slate-900 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.05)]"
                                                    : "bg-slate-900/40 border-white/5 hover:border-white/10",
                                                draggedItemIndex === index && "opacity-50 border-cyan-500/50 scale-[0.98]"
                                            )}
                                        >
                                            <div className="flex items-center gap-3 shrink-0">
                                                <GripVertical className="w-4 h-4 text-slate-600 cursor-grab active:cursor-grabbing hover:text-cyan-400 transition-colors" />
                                                <div className="w-8 h-8 rounded-lg bg-slate-950 border border-white/5 flex items-center justify-center font-black text-xs text-cyan-500 tabular-nums">
                                                    {getAutoNumber(index)}
                                                </div>
                                            </div>

                                            <div className="flex-grow flex items-center gap-4">
                                                <input
                                                    value={item.title}
                                                    onChange={(e) => {
                                                        setSelectedId(item.id);
                                                        updateTitle(e.target.value);
                                                    }}
                                                    className="bg-transparent border-none focus:ring-0 w-full outline-none font-bold text-slate-200 placeholder:text-slate-700"
                                                    placeholder="목차 제목을 입력하세요"
                                                />
                                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-tighter shrink-0">
                                                    {item.type === 'table' ? <Calculator className="w-3 h-3 text-cyan-500" /> : <Type className="w-3 h-3" />}
                                                    {item.type === 'table' ? 'BUDGET TABLE' : 'TEXT SECTION'}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 shrink-0 bg-slate-950/50 p-1.5 rounded-xl border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => moveItem(index, 'up')}
                                                    disabled={index === 0}
                                                    className="btn btn-ghost btn-xs btn-square text-slate-400 hover:text-cyan-400 disabled:opacity-20"
                                                >
                                                    <ChevronUp className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => moveItem(index, 'down')}
                                                    disabled={index === toc.length - 1}
                                                    className="btn btn-ghost btn-xs btn-square text-slate-400 hover:text-cyan-400 disabled:opacity-20"
                                                >
                                                    <ChevronDown className="w-4 h-4" />
                                                </button>
                                                <div className="w-px h-4 bg-white/10 mx-1"></div>
                                                <button
                                                    onClick={() => changeLevel(item.id, -1)}
                                                    disabled={item.level === 0}
                                                    className="btn btn-ghost btn-xs btn-square text-slate-400 hover:text-cyan-400 disabled:opacity-20"
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => changeLevel(item.id, 1)}
                                                    disabled={index === 0 || item.level > toc[index - 1].level}
                                                    className="btn btn-ghost btn-xs btn-square text-slate-400 hover:text-cyan-400 disabled:opacity-20"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                                <div className="w-px h-4 bg-white/10 mx-1"></div>
                                                <button
                                                    onClick={(e) => deleteSection(item.id, e)}
                                                    className="btn btn-ghost btn-xs btn-square text-slate-500 hover:text-rose-500"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        ) : activeStep === 'budget' ? (
                            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-20 pt-4">

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-4">
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Budget</div>
                                        <div className="text-2xl font-black text-white">100,000,000<span className="text-sm font-bold text-slate-500 ml-1">원</span></div>
                                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-cyan-500 w-full"></div>
                                        </div>
                                        <p className="text-[10px] text-slate-500">지난 프로젝트 대비 +5.2%</p>
                                    </div>
                                    <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-4">
                                        <div className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Gov. Support</div>
                                        <div className="text-2xl font-black text-white">75,000,000<span className="text-sm font-bold text-slate-500 ml-1">원 (75%)</span></div>
                                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-cyan-500 w-3/4"></div>
                                        </div>
                                        <p className="text-[10px] text-cyan-500/70 font-bold">최대 지원 한도 적용 중</p>
                                    </div>
                                    <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-4">
                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Private Cash</div>
                                        <div className="text-2xl font-black text-white">25,000,000<span className="text-sm font-bold text-slate-500 ml-1">원 (25%)</span></div>
                                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 w-1/4"></div>
                                        </div>
                                        <p className="text-[10px] text-emerald-500/70 font-bold">민간부담금 매칭 완료</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                    <div className="space-y-6">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Type className="w-4 h-4 text-cyan-400" /> 상세 예산 입력
                                        </h3>
                                        <div className="space-y-4">
                                            {[
                                                { label: '인건비', value: budgetData.labor, color: 'bg-cyan-400' },
                                                { label: '연구시설/장비비', value: budgetData.researchFacility, color: 'bg-indigo-400' },
                                                { label: '연구재료비', value: budgetData.researchMaterial, color: 'bg-violet-400' },
                                                { label: '연구활동비', value: budgetData.researchActivity, color: 'bg-fuchsia-400' },
                                                { label: '위탁연구개발비', value: budgetData.consignment, color: 'bg-rose-400' },
                                            ].map((row, i) => (
                                                <div key={i} className="flex items-center gap-4">
                                                    <div className="w-24 shrink-0 text-xs font-bold text-slate-500">{row.label}</div>
                                                    <div className="flex-grow">
                                                        <input
                                                            type="range"
                                                            className="range range-xs range-primary"
                                                            value={(row.value / 100000000) * 100}
                                                            readOnly
                                                        />
                                                    </div>
                                                    <div className="text-xs font-black text-slate-300 w-24 text-right">
                                                        {row.value.toLocaleString()}<span className="text-[10px] ml-0.5">원</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-8 rounded-3xl bg-slate-900 border border-white/10 flex flex-col justify-between">
                                        <div className="space-y-2">
                                            <h4 className="font-black text-white flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-amber-400" />
                                                예산 배분 인사이트
                                            </h4>
                                            <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                                현재 인건비 비중은 전체의 40%로, IT 소프트웨어 개발 과제 평균 대비 적절한 수준입니다. 직접비 중 연구활동비 비중을 조금 더 높여 기술 고도화에 집중하는 것을 추천합니다.
                                            </p>
                                        </div>
                                        <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 mt-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">Budget Safety Score</span>
                                                <span className="text-xs font-black text-cyan-400">92/100</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-cyan-600 w-[92%]"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Prompt Settings */}
                                <div className="space-y-4 pt-4">
                                    <textarea
                                        value={selectedItem?.instruction}
                                        onChange={(e) => updateInstruction(e.target.value)}
                                        className="w-full h-80 bg-white/5 border border-white/10 rounded-[32px] p-8 text-lg focus:border-cyan-500/50 outline-none transition-all resize-none shadow-inner text-slate-200"
                                        placeholder="예: 우리 회사의 특허 기술력을 강조해서 작성해 줘. 최근 3년 이내의 실적을 포함할 것."
                                    />

                                    {/* 글 구성 상세 설정 (1.1 계층인 경우에만 표시) */}
                                    {selectedItem?.level === 1 && (
                                        <div className="grid grid-cols-2 gap-4 mt-4 py-4 px-8 bg-cyan-600/5 border border-white/5 rounded-[24px]">
                                            <div className="flex items-center justify-between gap-4">
                                                <label className="text-xs font-bold text-slate-500 whitespace-nowrap">글 구성 항목 수</label>
                                                <div className="relative flex-grow max-w-[120px]">
                                                    <input
                                                        type="number"
                                                        value={selectedItem?.itemCount || ''}
                                                        onChange={(e) => updateDetail('itemCount', e.target.value)}
                                                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-right focus:border-cyan-500/50 outline-none text-cyan-400"
                                                        placeholder="3"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between gap-4">
                                                <label className="text-xs font-bold text-slate-500 whitespace-nowrap">총 글자수</label>
                                                <div className="relative flex-grow max-w-[120px]">
                                                    <input
                                                        type="number"
                                                        value={selectedItem?.charCount || ''}
                                                        onChange={(e) => updateDetail('charCount', e.target.value)}
                                                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-right focus:border-cyan-500/50 outline-none text-cyan-400"
                                                        placeholder="1000"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Credit Status & Info */}
                                <div className="alert bg-blue-500/5 border-blue-500/20 rounded-3xl p-6">
                                    <Info className="w-6 h-6 text-blue-400" />
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-blue-100 text-sm">양식 구성은 무제한 무료입니다.</h4>
                                        <p className="text-xs text-blue-200/60 mt-1">최종적으로 [AI 생성 시작] 버튼을 클릭할 때만 1크레딧이 차감됩니다.</p>
                                    </div>
                                </div>

                                {selectedItem?.type === 'table' && (
                                    <div className="p-8 rounded-[40px] bg-cyan-600/5 border border-cyan-500/20 border-dashed">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center text-white">
                                                <Calculator className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white">지능형 예산 자동 계산기</h3>
                                                <p className="text-xs text-slate-500">정부 지원금 룰을 바탕으로 최적의 예산안을 도출합니다.</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="form-control">
                                                <label className="label"><span className="label-text text-xs text-slate-400">총 사업비</span></label>
                                                <div className="relative">
                                                    <input type="text" placeholder="100,000,000" className="input input-sm bg-slate-900 border-white/10 rounded-lg w-full pr-8" />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">원</span>
                                                </div>
                                            </div>
                                            <div className="form-control">
                                                <label className="label"><span className="label-text text-xs text-slate-400">정부 지원율 (%)</span></label>
                                                <input type="text" placeholder="75" className="input input-sm bg-slate-900 border-white/10 rounded-lg w-full" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Main Action Bar */}
                <div className="fixed lg:absolute bottom-0 left-0 w-full p-4 lg:p-8 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent z-20">
                    <div className="w-full lg:max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-4 lg:gap-6 p-4 lg:p-4 rounded-[24px] lg:rounded-[32px] bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-5xl cyan-glow">
                        <div className="flex items-center gap-4 flex-grow w-full lg:w-auto px-2 lg:px-4 lg:border-l lg:border-white/5 lg:ml-2">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-cyan-600 flex items-center justify-center text-white ring-4 lg:ring-8 ring-cyan-500/10 shadow-lg shadow-cyan-600/30 shrink-0">
                                {activeStep === 'base' ? <Info className="w-5 h-5 lg:w-6 lg:h-6" /> : activeStep === 'structure' ? <Layout className="w-5 h-5 lg:w-6 lg:h-6" /> : activeStep === 'budget' ? <Calculator className="w-5 h-5 lg:w-6 lg:h-6" /> : <Play className="w-5 h-5 lg:w-6 lg:h-6 fill-current" />}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs lg:text-sm font-black text-white tracking-tight truncate">
                                    {activeStep === 'base' ? '사업 기본 정보 입력 중' : activeStep === 'structure' ? '목차 설정 진행 중' : activeStep === 'budget' ? '사업비 구성 진행 중' : '지침 설정 진행 중'}
                                </p>
                                <p className="text-[9px] lg:text-[10px] text-cyan-400 font-bold opacity-80 truncate">
                                    {activeStep === 'base' ? '정확한 사업 정보를 입력해 주세요.' : activeStep === 'structure' ? '원하는 구조를 완성하고 사업비를 설정하세요.' : activeStep === 'budget' ? '사업비 상세 내역을 입력하고 정부지원금을 확인하세요.' : '세부 지침 작성을 완료하고 사업계획서를 생성하세요.'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            {activeStep !== 'base' && (
                                <button
                                    onClick={() => {
                                        if (activeStep === 'structure') setActiveStep('base');
                                        else if (activeStep === 'budget') setActiveStep('structure');
                                        else if (activeStep === 'instruction') setActiveStep('budget');
                                    }}
                                    className="btn btn-ghost btn-sm text-slate-500 hover:text-white flex items-center gap-2 flex-grow lg:flex-initial"
                                >
                                    <ChevronLeft className="w-4 h-4" /> 이전
                                </button>
                            )}
                            {activeStep === 'base' ? (
                                <button
                                    onClick={() => setActiveStep('structure')}
                                    className="btn btn-primary rounded-[16px] lg:rounded-[20px] px-6 lg:px-10 h-12 lg:h-14 bg-cyan-600 hover:bg-cyan-500 border-none text-white font-black shadow-xl shadow-cyan-600/20 flex-grow lg:flex-initial"
                                >
                                    다음 단계
                                </button>
                            ) : activeStep === 'structure' ? (
                                <button
                                    onClick={() => setActiveStep('budget')}
                                    className="btn btn-primary rounded-[16px] lg:rounded-[20px] px-6 lg:px-10 h-12 lg:h-14 bg-cyan-600 hover:bg-cyan-500 border-none text-white font-black shadow-xl shadow-cyan-600/20 flex-grow lg:flex-initial"
                                >
                                    다음 단계
                                </button>
                            ) : activeStep === 'budget' ? (
                                <button
                                    onClick={() => setActiveStep('instruction')}
                                    className="btn btn-primary rounded-[16px] lg:rounded-[20px] px-6 lg:px-10 h-12 lg:h-14 bg-cyan-600 hover:bg-cyan-500 border-none text-white font-black shadow-xl shadow-cyan-600/20 flex-grow lg:flex-initial"
                                >
                                    다음 단계
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsGenerating(true)}
                                    className="btn btn-primary rounded-[16px] lg:rounded-[20px] px-8 lg:px-12 h-12 lg:h-14 bg-cyan-600 hover:bg-cyan-500 border-none text-white font-black shadow-2xl shadow-cyan-600/40 animate-pulse flex-grow lg:flex-initial"
                                >
                                    사업계획서 생성
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* 📄 [Column 3] Right Area: Preview - Hidden on Mobile */}
            <aside className="hidden lg:flex w-[480px] border-l border-white/5 bg-slate-900/30 flex-col overflow-y-auto shrink-0 scrollbar-hide">
                <div className="p-6 border-b border-white/5 flex flex-col gap-1 bg-slate-900/50">
                    <h2 className="text-xs font-black text-slate-200 uppercase tracking-widest flex items-center gap-2">
                        <FileText className="w-4 h-4 text-cyan-400" />
                        미리 보기
                    </h2>
                    <span className="text-[10px] text-slate-500 font-medium">실시간 문서 반영 상태를 확인하세요</span>
                </div>

                <div className="p-8 flex justify-center">
                    <div className="bg-white rounded-lg shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] min-h-[1200px] w-full p-12 text-slate-900 space-y-5 origin-top scale-[0.85] border border-slate-200">
                        {/* Mock Document */}
                        <div className="border-b-[8px] border-slate-900 pb-8">
                            <h1 className="text-3xl font-black uppercase leading-tight">
                                {baseInfo.businessName || baseInfo.projectName || '새로운 프로젝트'}
                            </h1>
                            <div className="mt-4 text-[10px] font-bold text-slate-500 grid grid-cols-2 gap-x-4 gap-y-1">
                                {baseInfo.leadOrg && <div>주관기관: {baseInfo.leadOrg}</div>}
                                {baseInfo.businessPeriod && <div>사업기간: {baseInfo.businessPeriod}</div>}
                            </div>
                        </div>

                        {toc.map((item, index) => (
                            <div key={item.id} className={cn(
                                "space-y-1.5 py-1.5 px-3 rounded-lg transition-all",
                                selectedId === item.id && "bg-cyan-50/50 ring-1 ring-cyan-200 shadow-sm"
                            )}>
                                <h3 className={cn(
                                    "font-black leading-tight tracking-tight text-slate-900",
                                    item.level === 0 ? "text-[14px] border-b-[0.5px] border-slate-200 pb-1.5" :
                                        item.level === 1 ? "text-[12px] pl-1.5 border-l-2 border-slate-900" : "text-[11px] pl-4 italic"
                                )}>
                                    <span className="text-slate-400 mr-1.5 tabular-nums text-[10px]">{getAutoNumber(index)}</span>
                                    {item.title}
                                </h3>

                                {item.type === 'table' ? (
                                    <div className="border-[1.5px] border-slate-900 rounded-sm overflow-hidden ml-4">
                                        <table className="w-full text-[8px] text-center border-collapse">
                                            <thead className="bg-slate-50 border-b-[1.5px] border-slate-900">
                                                <tr>
                                                    <th className="border-r-[1.5px] border-slate-900 p-1 font-black">항목</th>
                                                    <th className="border-r-[1.5px] border-slate-900 p-1 font-black">예산(원)</th>
                                                    <th className="p-1 font-black">비고</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b-[0.5px] border-slate-200">
                                                    <td className="p-1 border-r-[1.5px] border-slate-900 font-bold">인건비</td>
                                                    <td className="p-1 border-r-[1.5px] border-slate-900 font-medium">55,000,000</td>
                                                    <td className="p-1 text-[7px] text-slate-500">지급완료</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className={cn("space-y-1.5", item.level > 0 ? "ml-5" : "ml-2")}>
                                        <div className="h-1.5 bg-slate-100 rounded-full w-full"></div>
                                        <div className="h-1.5 bg-slate-100 rounded-full w-[94%]"></div>
                                        <div className="h-1 bg-slate-100 rounded-full w-[88%] opacity-60"></div>
                                    </div>
                                )}
                            </div>
                        ))}

                        <div className="pt-32 text-center opacity-10">
                            <p className="text-[12px] font-serif italic font-black tracking-widest uppercase text-slate-900">ClickProject Intelligence Output System</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Generation Overlay (Mock) */}
            {isGenerating && (
                <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 space-y-8 animate-in fade-in duration-500">
                    <div className="relative">
                        <div className="w-40 h-40 rounded-full border-4 border-cyan-500/10 border-t-cyan-500 animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Cpu className="w-16 h-16 text-cyan-400 animate-pulse" />
                        </div>
                    </div>
                    <div className="text-center space-y-6">
                        <h2 className="text-4xl font-black text-white">AI가 최적의 논리를 구성 중입니다...</h2>
                        <div className="w-80 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
                            <div className="h-full bg-cyan-500 w-1/3 animate-[progress_2s_ease-in-out_infinite]"></div>
                        </div>
                        <p className="text-slate-400 max-w-sm mx-auto leading-relaxed">
                            현재 {toc[0].title} 섹션을 분석하여<br />
                            전문가 수준의 문장을 생성하고 있습니다. (35%)
                        </p>
                    </div>
                    <button
                        onClick={() => setIsGenerating(false)}
                        className="btn btn-ghost text-slate-500 hover:text-white"
                    >
                        취소하고 돌아가기
                    </button>
                </div>
            )}
        </div>
    );
};

export default BuilderPage;
