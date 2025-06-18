
import React from 'react';
import BrandSidebar from '@/components/BrandSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserSettingsTab } from '@/components/settings/UserSettingsTab';
import { NotificationSettingsTab } from '@/components/settings/NotificationSettingsTab';
import { SecuritySettingsTab } from '@/components/settings/SecuritySettingsTab';
import { LanguageRegionTab } from '@/components/settings/LanguageRegionTab';
import { DataManagementTab } from '@/components/settings/DataManagementTab';

const BrandSettings = () => {
  return (
    <div className="min-h-screen flex w-full">
      <BrandSidebar />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">설정</h1>
          
          <Tabs defaultValue="user" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="user">사용자 설정</TabsTrigger>
              <TabsTrigger value="notifications">알림 설정</TabsTrigger>
              <TabsTrigger value="security">보안 설정</TabsTrigger>
              <TabsTrigger value="language">언어 및 지역</TabsTrigger>
              <TabsTrigger value="data">데이터 관리</TabsTrigger>
            </TabsList>

            <TabsContent value="user" className="space-y-6">
              <UserSettingsTab />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <NotificationSettingsTab />
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <SecuritySettingsTab />
            </TabsContent>

            <TabsContent value="language" className="space-y-6">
              <LanguageRegionTab />
            </TabsContent>

            <TabsContent value="data" className="space-y-6">
              <DataManagementTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BrandSettings;
