
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
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setUserRole(userData.role);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (email: string, password: string, role: 'brand' | 'admin') => {
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
    
    localStorage.setItem('circlue_user', JSON.stringify(userData));
    setUser(userData);
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('circlue_user');
    setUser(null);
    setUserRole(null);
    setIsLoggedIn(false);
  };

  return {
    isLoggedIn,
    user,
    userRole,
    login,
    logout
  };
};
