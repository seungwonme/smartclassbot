
import { useState, useEffect } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  role: 'brand' | 'admin';
  name: string;
}

// 하드코딩된 개발용 계정 정보
const DEVELOPMENT_ACCOUNTS = {
  brand: { email: 'brand', password: '123', name: '브랜드 사용자' },
  admin: { email: 'admin', password: '123', name: '시스템 관리자' }
};

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userRole, setUserRole] = useState<'brand' | 'admin' | null>(null);

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 확인
    const savedUser = localStorage.getItem('circlue_user');
    console.log('[Auth] 초기화 - localStorage 데이터:', savedUser);
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('[Auth] 저장된 사용자 데이터 복원:', userData);
        setUser(userData);
        setUserRole(userData.role);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('[Auth] localStorage 데이터 파싱 오류:', error);
        // 잘못된 데이터가 있으면 제거
        localStorage.removeItem('circlue_user');
      }
    }
  }, []);

  const login = (email: string, password: string, role: 'brand' | 'admin') => {
    console.log(`[Auth] 로그인 시도 - Role: ${role}, Email: ${email}`);
    
    // 기존 localStorage 데이터 완전 제거
    localStorage.removeItem('circlue_user');
    console.log('[Auth] 기존 localStorage 데이터 제거 완료');
    
    // 하드코딩된 계정 정보와 비교
    const account = DEVELOPMENT_ACCOUNTS[role];
    
    if (email !== account.email || password !== account.password) {
      throw new Error(`잘못된 ${role === 'admin' ? '관리자' : '브랜드'} 계정 정보입니다.`);
    }
    
    // 로그인 성공 시 사용자 데이터 생성
    const userData: AuthUser = {
      id: `${role}_user_1`,
      email: account.email,
      role,
      name: account.name
    };
    
    console.log('[Auth] 새 사용자 데이터 생성:', userData);
    
    // localStorage에 저장하고 상태 동기적으로 업데이트
    localStorage.setItem('circlue_user', JSON.stringify(userData));
    setUser(userData);
    setUserRole(role);
    setIsLoggedIn(true);
    
    console.log('[Auth] 로그인 완료 - 상태 업데이트됨');
  };

  const logout = () => {
    console.log('[Auth] 로그아웃 시작');
    
    localStorage.removeItem('circlue_user');
    setUser(null);
    setUserRole(null);
    setIsLoggedIn(false);
    
    console.log('[Auth] 로그아웃 완료 - 페이지 새로고침');
    
    // 상태 완전 초기화를 위한 페이지 새로고침
    window.location.href = '/';
  };

  return {
    isLoggedIn,
    user,
    userRole,
    login,
    logout
  };
};
