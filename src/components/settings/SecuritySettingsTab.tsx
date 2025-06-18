
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요'),
  newPassword: z.string().min(8, '새 비밀번호는 8자 이상이어야 합니다'),
  confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
});

const twoFactorSchema = z.object({
  enableTwoFactor: z.boolean(),
  phoneNumber: z.string().optional(),
});

type PasswordChangeForm = z.infer<typeof passwordChangeSchema>;
type TwoFactorForm = z.infer<typeof twoFactorSchema>;

// 더미 로그인 기록 데이터
const loginHistory = [
  { date: '2024-06-18 14:30', ip: '192.168.1.100', device: 'Chrome on Windows', location: '서울, 대한민국' },
  { date: '2024-06-18 09:15', ip: '192.168.1.100', device: 'Chrome on Windows', location: '서울, 대한민국' },
  { date: '2024-06-17 18:45', ip: '192.168.1.100', device: 'Safari on iPhone', location: '서울, 대한민국' },
  { date: '2024-06-17 10:20', ip: '192.168.1.100', device: 'Chrome on Windows', location: '서울, 대한민국' },
  { date: '2024-06-16 16:10', ip: '192.168.1.100', device: 'Chrome on Windows', location: '서울, 대한민국' },
];

export const SecuritySettingsTab = () => {
  const { toast } = useToast();
  
  const passwordForm = useForm<PasswordChangeForm>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const twoFactorForm = useForm<TwoFactorForm>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      enableTwoFactor: false,
      phoneNumber: '',
    },
  });

  const onPasswordSubmit = async (data: PasswordChangeForm) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('비밀번호 변경:', data);
      
      toast({
        title: '비밀번호 변경 완료',
        description: '비밀번호가 성공적으로 변경되었습니다.',
      });
      
      passwordForm.reset();
    } catch (error) {
      toast({
        title: '비밀번호 변경 실패',
        description: '비밀번호 변경 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  const onTwoFactorSubmit = async (data: TwoFactorForm) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('2단계 인증 설정:', data);
      
      toast({
        title: '2단계 인증 설정 완료',
        description: '2단계 인증 설정이 성공적으로 저장되었습니다.',
      });
    } catch (error) {
      toast({
        title: '설정 저장 실패',
        description: '2단계 인증 설정 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 비밀번호 변경 */}
      <Card>
        <CardHeader>
          <CardTitle>비밀번호 변경</CardTitle>
          <CardDescription>계정 보안을 위해 정기적으로 비밀번호를 변경하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>현재 비밀번호</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="현재 비밀번호를 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>새 비밀번호</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="새 비밀번호를 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호 확인</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="새 비밀번호를 다시 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit">비밀번호 변경</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* 2단계 인증 */}
      <Card>
        <CardHeader>
          <CardTitle>2단계 인증</CardTitle>
          <CardDescription>계정의 보안을 강화하기 위해 2단계 인증을 설정하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...twoFactorForm}>
            <form onSubmit={twoFactorForm.handleSubmit(onTwoFactorSubmit)} className="space-y-4">
              <FormField
                control={twoFactorForm.control}
                name="enableTwoFactor"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">2단계 인증 활성화</FormLabel>
                      <FormDescription>
                        로그인 시 추가 인증 단계를 거쳐 보안을 강화합니다.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {twoFactorForm.watch('enableTwoFactor') && (
                <FormField
                  control={twoFactorForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>인증용 전화번호</FormLabel>
                      <FormControl>
                        <Input placeholder="010-0000-0000" {...field} />
                      </FormControl>
                      <FormDescription>
                        SMS 인증을 위한 전화번호를 입력하세요.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <Button type="submit">설정 저장</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* 로그인 히스토리 */}
      <Card>
        <CardHeader>
          <CardTitle>로그인 히스토리</CardTitle>
          <CardDescription>최근 로그인 기록을 확인하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>로그인 시간</TableHead>
                <TableHead>IP 주소</TableHead>
                <TableHead>기기/브라우저</TableHead>
                <TableHead>위치</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loginHistory.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.ip}</TableCell>
                  <TableCell>{record.device}</TableCell>
                  <TableCell>{record.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
