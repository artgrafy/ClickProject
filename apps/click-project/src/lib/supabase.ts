import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 클라이언트 사이드 서포트 및 개발용 모드 지원
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 개발 단계에서는 실제 로그인 없이도 세션을 가진 것처럼 동작하게 하는 헬퍼
 */
export const getEffectiveUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) return user;

    // 개발 모드용 가상 유저 데이터 (환경변수나 특정 조건에서 활성화 가능)
    if (process.env.NODE_ENV === 'development') {
        return {
            id: 'dev-user-id',
            email: 'dev@success365.kr',
            user_metadata: {
                full_name: '개발자 모드',
                avatar_url: null,
                is_dev: true
            }
        };
    }
    return null;
};
