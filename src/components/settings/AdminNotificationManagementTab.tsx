
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { settingsService } from '@/services/settings.service';
import { useToast } from '@/hooks/use-toast';

const notificationSchema = z.object({
  newCampaignNotification: z.boolean(),
  settlementNotification: z.boolean(),
});

type NotificationForm = z.infer<typeof notificationSchema>;

export const AdminNotificationManagementTab = () => {
  const { toast } = useToast();
  const notificationSettings = settingsService.getSettings().notifications;
  
  const form = useForm<NotificationForm>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      newCampaignNotification: notificationSettings.newCampaignNotification,
      settlementNotification: notificationSettings.settlementNotification,
    },
  });

  const onSubmit = async (data: NotificationForm) => {
    try {
      settingsService.updateSettings({
        notifications: {
          ...notificationSettings,
          ...data
        }
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
          <CardTitle>시스템 알림 설정</CardTitle>
          <CardDescription>관리자가 받을 시스템 알림을 설정합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="newCampaignNotification"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>신규 캠페인 알림</FormLabel>
                      <FormDescription>
                        새로운 캠페인 생성 시 관리자에게 알림을 보냅니다
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
                name="settlementNotification"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>정산 완료 알림</FormLabel>
                      <FormDescription>
                        정산 처리 완료 시 관련자에게 알림을 보냅니다
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
