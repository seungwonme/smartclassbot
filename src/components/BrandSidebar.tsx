
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  TrendingUp, 
  Users, 
  Megaphone, 
  BarChart3, 
  Calculator,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const BrandSidebar = () => {
  console.log('BrandSidebar 컴포넌트 렌더링 시작...');
  
  const location = useLocation();
  console.log('현재 위치:', location.pathname);

  const menuItems = [
    { icon: LayoutDashboard, label: '대시보드', href: '/brand/dashboard' },
    { icon: Building2, label: '브랜드 및 제품관리', href: '/brand/products' },
    { icon: TrendingUp, label: '시장조사', href: '/brand/market-research' },
    { icon: Users, label: '인플루언서', href: '/brand/influencers' },
    { icon: Megaphone, label: '캠페인관리', href: '/brand/campaigns' },
    { icon: BarChart3, label: '성과분석', href: '/brand/analytics' },
    { icon: Calculator, label: '정산관리', href: '/brand/billing' },
  ];

  console.log('메뉴 아이템들:', menuItems);

  try {
    return (
      <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link to="/" className="flex items-center justify-center">
            <img 
              src="/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png" 
              alt="Circlue Logo" 
              className="h-10"
              onError={(e) => {
                console.error('로고 이미지 로드 실패:', e);
                e.currentTarget.style.display = 'none';
              }}
              onLoad={() => console.log('로고 이미지 로드 성공')}
            />
          </Link>
          <p className="text-sm text-muted-foreground mt-2 text-center">브랜드 관리자</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              console.log(`메뉴 아이템 ${index + 1} 렌더링:`, item.label);
              
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      location.pathname === item.href
                        ? "bg-green-100 text-green-700 border-2 border-green-300"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                    onClick={() => console.log('메뉴 클릭:', item.label, item.href)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900"
            onClick={() => console.log('로그아웃 클릭')}
          >
            <LogOut className="h-5 w-5 mr-3" />
            로그아웃
          </Button>
        </div>

        {/* Sidebar Debug Info */}
        <div className="p-3 bg-gray-50 border-t text-xs text-gray-500">
          <p>✅ 사이드바 로드됨</p>
          <p>현재: {location.pathname}</p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('BrandSidebar 렌더링 오류:', error);
    return (
      <div className="w-64 bg-red-50 border-r border-red-200 min-h-screen flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-red-600 font-semibold">사이드바 오류</p>
          <p className="text-xs text-red-500 mt-2">{error?.toString()}</p>
        </div>
      </div>
    );
  }
};

export default BrandSidebar;
