
import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Shield, Bell, Database } from 'lucide-react';

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

          <div className="space-y-6">
            {/* 시스템 설정 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>시스템 설정</span>
                </CardTitle>
                <CardDescription>
                  전체 시스템의 기본 설정을 관리합니다
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">사이트 이름</Label>
                    <Input id="site-name" defaultValue="Circlue" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">관리자 이메일</Label>
                    <Input id="admin-email" type="email" defaultValue="admin@circlue.ai" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>유지보수 모드</Label>
                    <p className="text-sm text-gray-500">시스템 점검 시 사용자 접근을 제한합니다</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* 보안 설정 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>보안 설정</span>
                </CardTitle>
                <CardDescription>
                  시스템 보안 관련 설정을 관리합니다
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>2단계 인증 필수</Label>
                    <p className="text-sm text-gray-500">모든 사용자에게 2FA 인증을 요구합니다</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>로그인 시도 제한</Label>
                    <p className="text-sm text-gray-500">연속 로그인 실패 시 계정을 일시 잠금합니다</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* 알림 설정 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>알림 설정</span>
                </CardTitle>
                <CardDescription>
                  시스템 알림 및 이메일 설정을 관리합니다
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>신규 캠페인 알림</Label>
                    <p className="text-sm text-gray-500">새로운 캠페인 생성 시 관리자에게 알림을 보냅니다</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>정산 완료 알림</Label>
                    <p className="text-sm text-gray-500">정산 처리 완료 시 관련자에게 알림을 보냅니다</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* 저장 버튼 */}
            <div className="flex justify-end space-x-4">
              <Button variant="outline">취소</Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                설정 저장
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
