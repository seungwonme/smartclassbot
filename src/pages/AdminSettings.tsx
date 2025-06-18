
import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminSystemSettingsTab } from '@/components/settings/AdminSystemSettingsTab';
import { AdminPlatformManagementTab } from '@/components/settings/AdminPlatformManagementTab';
import { AdminUserManagementTab } from '@/components/settings/AdminUserManagementTab';
import { AdminNotificationManagementTab } from '@/components/settings/AdminNotificationManagementTab';

const AdminSettings = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">일반설정</h1>
            <p className="text-gray-600 mt-2">시스템 전반적인 설정을 관리합니다</p>
          </div>

          <Tabs defaultValue="system" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="system">시스템 설정</TabsTrigger>
              <TabsTrigger value="platforms">플랫폼 관리</TabsTrigger>
              <TabsTrigger value="users">사용자 관리</TabsTrigger>
              <TabsTrigger value="notifications">알림 관리</TabsTrigger>
            </TabsList>

            <TabsContent value="system" className="space-y-6">
              <AdminSystemSettingsTab />
            </TabsContent>

            <TabsContent value="platforms" className="space-y-6">
              <AdminPlatformManagementTab />
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <AdminUserManagementTab />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <AdminNotificationManagementTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
