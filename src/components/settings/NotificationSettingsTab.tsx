
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { brandSettingsService } from '@/services/brandSettings.service';

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  campaignUpdates: z.boolean(),
  settlementAlerts: z.boolean(),
});

type NotificationForm = z.infer<typeof notificationSchema>;

export const NotificationSettingsTab = () => {
  const { toast } = useToast();
  const currentSettings = brandSettingsService.getNotificationPreferences();
  
  const form = useForm<NotificationForm>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: currentSettings.emailNotifications,
      smsNotifications: currentSettings.smsNotifications,
      campaignUpdates: currentSettings.campaignUpdates,
      settlementAlerts: currentSettings.settlementAlerts,
    },
  });

  const onSubmit = async (data: NotificationForm) => {
    try {
      brandSettingsService.updateBrandSettings({
        notifications: data
      });
      
      toast({
        title: '저장 완료',
        description: '알림 설정이 성공적으로 저장되었습니다.',
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
          <CardTitle>알림 설정</CardTitle>
          <CardDescription>받고 싶은 알림 유형을 선택하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>이메일 알림</FormLabel>
                      <FormDescription>
                        중요한 알림을 이메일로 받습니다
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
                name="smsNotifications"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>SMS 알림</FormLabel>
                      <FormDescription>
                        긴급한 알림을 SMS로 받습니다
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
                name="campaignUpdates"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>캠페인 업데이트</FormLabel>
                      <FormDescription>
                        캠페인 진행 상황 업데이트를 받습니다
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
                name="settlementAlerts"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>정산 알림</FormLabel>
                      <FormDescription>
                        정산 관련 알림을 받습니다
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Button type="submit">알림 설정 저장</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
