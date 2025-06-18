
import React from 'react';
import {
  Home,
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
}

const AdminSidebar: React.FC = () => {
  const sidebarItems: SidebarItem[] = [
    {
      title: "대시보드",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "캠페인 관리",
      url: "/admin/campaigns",
      icon: Home,
    },
    {
      title: "브랜드 관리",
      url: "/admin/brands",
      icon: Users,
    },
    {
      title: "분석",
      url: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: "정산 관리",
      url: "/admin/billing",
      icon: DollarSign,
    },
    {
      title: "설정",
      url: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full py-4 px-2 flex flex-col">
      <div className="mb-8">
        <img src="/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png" alt="Circlue Logo" className="h-8 mx-auto" />
        <h1 className="text-center mt-2 font-semibold">Admin Dashboard</h1>
      </div>
      <nav className="flex-1">
        <ul>
          {sidebarItems.map((item) => (
            <li key={item.title} className="mb-1">
              <NavLink
                to={item.url}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md hover:bg-gray-100 ${
                    isActive ? 'bg-gray-100 font-semibold' : 'text-gray-700'
                  }`
                }
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto text-center text-sm text-gray-500">
        <p>&copy; 2024 Circlue.ai</p>
      </div>
    </div>
  );
};

export default AdminSidebar;
