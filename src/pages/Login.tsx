
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="relative">
              <div className="w-10 h-10 bg-green-500 rounded-full"></div>
              <div className="absolute top-2.5 left-2.5 w-7 h-7 bg-black rounded-full"></div>
            </div>
            <span className="text-3xl font-bold text-foreground">circlue</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">로그인</CardTitle>
            <CardDescription>
              Circlue 계정으로 로그인하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="이메일을 입력하세요"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <Link to="/forgot-password" className="text-green-600 hover:text-green-700">
                비밀번호를 잊으셨나요?
              </Link>
            </div>
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
              로그인
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              계정이 없으신가요?{' '}
              <Link to="/signup" className="text-green-600 hover:text-green-700 font-medium">
                회원가입
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
