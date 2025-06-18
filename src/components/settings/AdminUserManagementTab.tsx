
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { settingsService } from '@/services/settings.service';
import { useToast } from '@/hooks/use-toast';

const userManagementSchema = z.object({
  twoFactorRequired: z.boolean(),
  loginAttemptLimit: z.boolean(),
  maxLoginAttempts: z.number().min(3).max(10),
  lockoutDuration: z.number().min(5).max(120),
});

type UserManagementForm = z.infer<typeof userManagementSchema>;

export const AdminUserManagementTab = () => {
  const { toast } = useToast();
  const userSettings = settingsService.getSettings().users;
  
  const form = useForm<UserManagementForm>({
    resolver: zodResolver(userManagementSchema),
    defaultValues: {
      twoFactorRequired: userSettings.twoFactorRequired,
      loginAttemptLimit: userSettings.loginAttemptLimit,
      maxLoginAttempts: userSettings.maxLoginAttempts,
      lockoutDuration: userSettings.lockoutDuration,
    },
  });

  const onSubmit = async (data: UserManagementForm) => {
    try {
      settingsService.updateSettings({
        users: data
      });
      
      toast({
        title: '저장 완료',
        description: '사용자 관리 설정이 성공적으로 저장되었습니다.',
      });
    } catch (error) {
      toast({
        title: '저장 실패',
        description: '설정 저장 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>보안 설정</CardTitle>
          <CardDescription>사용자 인증 및 보안 정책을 관리합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="twoFactorRequired"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>2단계 인증 필수</FormLabel>
                      <FormDescription>
                        모든 사용자에게 2FA 인증을 요구합니다
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="loginAttemptLimit"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>로그인 시도 제한</FormLabel>
                      <FormDescription>
                        연속 로그인 실패 시 계정을 일시 잠금합니다
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="maxLoginAttempts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>최대 로그인 시도 횟수</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormDescription>
                        계정 잠금 전 허용되는 로그인 실패 횟수
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lockoutDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>계정 잠금 시간 (분)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormDescription>
                        계정이 잠금되는 시간 (분 단위)
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit">사용자 관리 설정 저장</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
