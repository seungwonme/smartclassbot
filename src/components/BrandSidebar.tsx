import React from 'react';
import {
  Home,
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  DollarSign,
  BarChart3,
  Package,
  UserCheck,
  User,
  LogOut
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface SidebarItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
}

const BrandSidebar = () => {
  const { user, logout } = useAuth();
  
  const sidebarItems: SidebarItem[] = [
    {
      title: "대시보드",
      url: "/brand",
      icon: LayoutDashboard,
    },
    {
      title: "브랜드 및 제품관리",
      url: "/brand/products",
      icon: Package,
    },
    {
      title: "AI 페르소나 관리",
      url: "/brand/personas",
      icon: UserCheck,
    },
    {
      title: "인플루언서",
      url: "/brand/influencers",
      icon: Users,
    },
    {
      title: "캠페인 관리",
      url: "/brand/campaigns",
      icon: Home,
    },
    {
      title: "분석",
      url: "/brand/analytics",
      icon: BarChart3,
    },
    {
      title: "정산 관리",
      url: "/brand/billing",
      icon: DollarSign,
    },
    {
      title: "설정",
      url: "/brand/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full py-4 px-2 flex flex-col">
      <div className="mb-8">
        <img src="/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png" alt="Circlue Logo" className="h-8 mx-auto" />
        <h1 className="text-center mt-2 font-semibold">Brand Dashboard</h1>
      </div>
      
      <nav className="space-y-4 flex-1">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md
              ${isActive
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
            }
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </NavLink>
        ))}
      </nav>

      {/* User Info and Logout Section */}
      <div className="mt-auto border-t border-gray-200 pt-4">
        <div className="flex items-center px-3 py-2 mb-2">
          <User className="h-4 w-4 mr-2 text-gray-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">브랜드 관리자</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
        >
          <LogOut className="mr-2 h-4 w-4" />
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default BrandSidebar;
