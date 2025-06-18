
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

const systemSchema = z.object({
  siteName: z.string().min(1, '사이트 이름을 입력해주세요'),
  adminEmail: z.string().email('올바른 이메일을 입력해주세요'),
  maintenanceMode: z.boolean(),
});

type SystemForm = z.infer<typeof systemSchema>;

export const AdminSystemSettingsTab = () => {
  const { toast } = useToast();
  const systemSettings = settingsService.getSettings().system;
  
  const form = useForm<SystemForm>({
    resolver: zodResolver(systemSchema),
    defaultValues: {
      siteName: systemSettings.siteName,
      adminEmail: systemSettings.adminEmail,
      maintenanceMode: systemSettings.maintenanceMode,
    },
  });

  const onSubmit = async (data: SystemForm) => {
    try {
      settingsService.updateSettings({
        system: data as any
      });
      
      toast({
        title: '저장 완료',
        description: '시스템 설정이 성공적으로 저장되었습니다.',
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
          <CardTitle>시스템 기본 설정</CardTitle>
          <CardDescription>전체 시스템의 기본 정보를 관리합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="siteName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>사이트 이름</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        시스템 전반에 표시될 사이트명입니다
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="adminEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>관리자 이메일</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormDescription>
                        시스템 알림을 받을 관리자 이메일입니다
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="maintenanceMode"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>유지보수 모드</FormLabel>
                      <FormDescription>
                        시스템 점검 시 사용자 접근을 제한합니다
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Button type="submit">시스템 설정 저장</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
