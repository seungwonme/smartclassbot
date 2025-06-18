
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { brandSettingsService } from '@/services/brandSettings.service';

const securitySchema = z.object({
  twoFactorEnabled: z.boolean(),
  sessionTimeout: z.number().min(5).max(240),
  passwordExpiryDays: z.number().min(30).max(365),
});

type SecurityForm = z.infer<typeof securitySchema>;

export const SecuritySettingsTab = () => {
  const { toast } = useToast();
  const currentSettings = brandSettingsService.getSecuritySettings();
  
  const form = useForm<SecurityForm>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      twoFactorEnabled: currentSettings.twoFactorEnabled,
      sessionTimeout: currentSettings.sessionTimeout,
      passwordExpiryDays: currentSettings.passwordExpiryDays,
    },
  });

  const onSubmit = async (data: SecurityForm) => {
    try {
      brandSettingsService.updateBrandSettings({
        security: data
      });
      
      toast({
        title: '저장 완료',
        description: '보안 설정이 성공적으로 저장되었습니다.',
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
          <CardDescription>계정 보안을 강화하기 위한 설정입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="twoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>2단계 인증</FormLabel>
                      <FormDescription>
                        로그인 시 추가 인증을 요구합니다
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
                  name="sessionTimeout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>세션 타임아웃 (분)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(Number(e.target.value))} 
                        />
                      </FormControl>
                      <FormDescription>
                        비활성 상태에서 자동 로그아웃되는 시간
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="passwordExpiryDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>비밀번호 만료 (일)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(Number(e.target.value))} 
                        />
                      </FormControl>
                      <FormDescription>
                        비밀번호 변경을 요구하는 주기
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit">보안 설정 저장</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
