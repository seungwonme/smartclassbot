
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
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: '대시보드', href: '/brand/dashboard' },
    { icon: Building2, label: '브랜드 및 제품관리', href: '/brand/products' },
    { icon: TrendingUp, label: '시장조사', href: '/brand/market-research' },
    { icon: Users, label: '인플루언서', href: '/brand/influencers' },
    { icon: Megaphone, label: '캠페인관리', href: '/brand/campaigns' },
    { icon: BarChart3, label: '성과분석', href: '/brand/analytics' },
    { icon: Calculator, label: '정산관리', href: '/brand/billing' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative">
            <div className="w-8 h-8 bg-green-500 rounded-full"></div>
            <div className="absolute top-2 left-2 w-6 h-6 bg-black rounded-full"></div>
          </div>
          <span className="text-2xl font-bold text-foreground">circlue</span>
        </Link>
        <p className="text-sm text-muted-foreground mt-1">브랜드 관리자</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-green-100 text-green-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-gray-900"
        >
          <LogOut className="h-5 w-5 mr-3" />
          로그아웃
        </Button>
      </div>
    </div>
  );
};

export default BrandSidebar;
