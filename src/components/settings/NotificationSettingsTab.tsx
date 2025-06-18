
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const notificationSettingsSchema = z.object({
  // 이메일 알림
  emailCampaignApproval: z.boolean(),
  emailInfluencerApplication: z.boolean(),
  emailSettlement: z.boolean(),
  emailPerformanceReport: z.boolean(),
  
  // 푸시 알림
  pushRealTimeUpdates: z.boolean(),
  pushUrgentNotifications: z.boolean(),
  
  // 알림 주기
  reportFrequency: z.string(),
  performanceUpdateFrequency: z.string(),
});

type NotificationSettingsForm = z.infer<typeof notificationSettingsSchema>;

export const NotificationSettingsTab = () => {
  const { toast } = useToast();
  
  const form = useForm<NotificationSettingsForm>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailCampaignApproval: true,
      emailInfluencerApplication: true,
      emailSettlement: true,
      emailPerformanceReport: false,
      pushRealTimeUpdates: false,
      pushUrgentNotifications: true,
      reportFrequency: 'weekly',
      performanceUpdateFrequency: 'daily',
    },
  });

  const onSubmit = async (data: NotificationSettingsForm) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('알림 설정 저장:', data);
      
      toast({
        title: '저장 완료',
        description: '알림 설정이 성공적으로 저장되었습니다.',
      });
    } catch (error) {
      toast({
        title: '저장 실패',
        description: '알림 설정 저장 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 이메일 알림 */}
        <Card>
          <CardHeader>
            <CardTitle>이메일 알림</CardTitle>
            <CardDescription>이메일로 받고 싶은 알림을 선택하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="emailCampaignApproval"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">캠페인 승인/거절</FormLabel>
                    <FormDescription>
                      캠페인 신청이 승인되거나 거절될 때 알림을 받습니다.
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
            
            <FormField
              control={form.control}
              name="emailInfluencerApplication"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">인플루언서 지원</FormLabel>
                    <FormDescription>
                      새로운 인플루언서가 캠페인에 지원할 때 알림을 받습니다.
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
            
            <FormField
              control={form.control}
              name="emailSettlement"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">정산 완료</FormLabel>
                    <FormDescription>
                      정산이 완료될 때 알림을 받습니다.
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
            
            <FormField
              control={form.control}
              name="emailPerformanceReport"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">성과 리포트</FormLabel>
                    <FormDescription>
                      정기 성과 리포트를 이메일로 받습니다.
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
          </CardContent>
        </Card>

        {/* 푸시 알림 */}
        <Card>
          <CardHeader>
            <CardTitle>푸시 알림</CardTitle>
            <CardDescription>브라우저 푸시 알림을 설정하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="pushRealTimeUpdates"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">실시간 성과 업데이트</FormLabel>
                    <FormDescription>
                      캠페인 성과가 실시간으로 업데이트될 때 알림을 받습니다.
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
            
            <FormField
              control={form.control}
              name="pushUrgentNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">긴급 알림</FormLabel>
                    <FormDescription>
                      시스템 점검, 중요 공지사항 등 긴급한 내용을 알림으로 받습니다.
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
          </CardContent>
        </Card>

        {/* 알림 주기 */}
        <Card>
          <CardHeader>
            <CardTitle>알림 주기</CardTitle>
            <CardDescription>정기 알림의 주기를 설정하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="reportFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>리포트 주기</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="리포트 주기를 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">매일</SelectItem>
                      <SelectItem value="weekly">매주</SelectItem>
                      <SelectItem value="monthly">매월</SelectItem>
                      <SelectItem value="never">받지 않음</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="performanceUpdateFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>성과 업데이트 주기</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="성과 업데이트 주기를 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="realtime">실시간</SelectItem>
                      <SelectItem value="daily">매일</SelectItem>
                      <SelectItem value="weekly">매주</SelectItem>
                      <SelectItem value="never">받지 않음</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            취소
          </Button>
          <Button type="submit">
            저장
          </Button>
        </div>
      </form>
    </Form>
  );
};
