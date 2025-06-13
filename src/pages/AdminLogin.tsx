
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const AdminLogin = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <img src="/lovable-uploads/0f1a6de4-0dc9-4e15-acb2-66b900ce33db.png" alt="Circlue Logo" className="w-10 h-10" />
            <span className="text-3xl font-bold text-foreground">circlue</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">관리자 로그인</CardTitle>
            <CardDescription>
              시스템 관리자 전용 로그인
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminEmail">관리자 이메일</Label>
              <Input
                id="adminEmail"
                type="email"
                placeholder="관리자 이메일을 입력하세요"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminPassword">관리자 비밀번호</Label>
              <Input
                id="adminPassword"
                type="password"
                placeholder="관리자 비밀번호를 입력하세요"
                required
              />
            </div>
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
              관리자 로그인
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              일반 사용자이신가요?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                일반 로그인
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
