
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>, role: 'brand' | 'admin') => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      login(email, password, role);
      toast({
        title: "로그인 성공",
        description: `${role === 'admin' ? '관리자' : '브랜드'} 계정으로 로그인되었습니다.`
      });
      navigate(role === 'admin' ? '/admin' : '/brand');
    } catch (error) {
      toast({
        title: "로그인 실패",
        description: error instanceof Error ? error.message : "이메일 또는 비밀번호를 확인해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center">
            <img src="/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png" alt="Circlue Logo" className="h-12" />
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">로그인</CardTitle>
            <CardDescription>
              Circlue 계정으로 로그인하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="brand" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="brand">브랜드</TabsTrigger>
                <TabsTrigger value="admin">관리자</TabsTrigger>
              </TabsList>
              
              <TabsContent value="brand" className="space-y-4">
                <div className="mb-4 p-3 bg-blue-50 rounded-md text-sm text-blue-700">
                  <strong>개발용 계정:</strong> ID: brand, PW: 123
                </div>
                <form onSubmit={(e) => handleLogin(e, 'brand')} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand-email">이메일</Label>
                    <Input
                      id="brand-email"
                      name="email"
                      type="text"
                      placeholder="brand"
                      defaultValue="brand"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand-password">비밀번호</Label>
                    <Input
                      id="brand-password"
                      name="password"
                      type="password"
                      placeholder="123"
                      defaultValue="123"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? '로그인 중...' : '브랜드 로그인'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="admin" className="space-y-4">
                <div className="mb-4 p-3 bg-blue-50 rounded-md text-sm text-blue-700">
                  <strong>개발용 계정:</strong> ID: admin, PW: 123
                </div>
                <form onSubmit={(e) => handleLogin(e, 'admin')} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">이메일</Label>
                    <Input
                      id="admin-email"
                      name="email"
                      type="text"
                      placeholder="admin"
                      defaultValue="admin"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">비밀번호</Label>
                    <Input
                      id="admin-password"
                      name="password"
                      type="password"
                      placeholder="123"
                      defaultValue="123"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? '로그인 중...' : '관리자 로그인'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="text-center text-sm text-muted-foreground mt-4">
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
