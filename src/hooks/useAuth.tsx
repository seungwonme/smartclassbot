
import { useState, useEffect } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  role: 'brand' | 'admin';
  name: string;
}

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
    // 간단한 로그인 로직 (실제 환경에서는 API 호출)
    const userData: AuthUser = {
      id: `${role}_user_1`,
      email,
      role,
      name: role === 'admin' ? '관리자' : '브랜드 사용자'
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
