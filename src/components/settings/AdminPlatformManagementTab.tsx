
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { settingsService } from '@/services/settings.service';
import { useToast } from '@/hooks/use-toast';

const platformSchema = z.object({
  xiaohongshu: z.object({
    enabled: z.boolean(),
    crawlingInterval: z.number().min(5).max(60),
  }),
  douyin: z.object({
    enabled: z.boolean(),
    crawlingInterval: z.number().min(5).max(60),
  }),
});

type PlatformForm = z.infer<typeof platformSchema>;

export const AdminPlatformManagementTab = () => {
  const { toast } = useToast();
  const platformSettings = settingsService.getPlatformSettings();
  
  const form = useForm<PlatformForm>({
    resolver: zodResolver(platformSchema),
    defaultValues: {
      xiaohongshu: {
        enabled: platformSettings.xiaohongshu.enabled,
        crawlingInterval: platformSettings.xiaohongshu.crawlingInterval,
      },
      douyin: {
        enabled: platformSettings.douyin.enabled,
        crawlingInterval: platformSettings.douyin.crawlingInterval,
      },
    },
  });

  const onSubmit = async (data: PlatformForm) => {
    try {
      const updatedSettings = {
        xiaohongshu: {
          ...platformSettings.xiaohongshu,
          enabled: data.xiaohongshu.enabled,
          crawlingInterval: data.xiaohongshu.crawlingInterval,
        },
        douyin: {
          ...platformSettings.douyin,
          enabled: data.douyin.enabled,
          crawlingInterval: data.douyin.crawlingInterval,
        },
      };
      
      settingsService.updatePlatformSettings(updatedSettings);
      
      toast({
        title: '저장 완료',
        description: '플랫폼 설정이 성공적으로 저장되었습니다.',
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
      {/* 지원 플랫폼 현황 */}
      <Card>
        <CardHeader>
          <CardTitle>지원 플랫폼 현황</CardTitle>
          <CardDescription>현재 시스템에서 지원하는 중국 소셜미디어 플랫폼입니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">📕</span>
                <div>
                  <h3 className="font-medium">샤오홍슈 (小红书)</h3>
                  <p className="text-sm text-muted-foreground">중국 대표 라이프스타일 플랫폼</p>
                </div>
                <Badge variant={platformSettings.xiaohongshu.enabled ? "default" : "secondary"}>
                  {platformSettings.xiaohongshu.enabled ? "활성" : "비활성"}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div><strong>수집 지표:</strong> 노출량, 좋아요, 수집, 댓글, 공유</div>
                <div><strong>도메인:</strong> xiaohongshu.com, xhslink.com</div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">🎵</span>
                <div>
                  <h3 className="font-medium">도우인 (抖音)</h3>
                  <p className="text-sm text-muted-foreground">중국 틱톡</p>
                </div>
                <Badge variant={platformSettings.douyin.enabled ? "default" : "secondary"}>
                  {platformSettings.douyin.enabled ? "활성" : "비활성"}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div><strong>수집 지표:</strong> 재생량, 좋아요, 댓글, 공유, 팔로우</div>
                <div><strong>도메인:</strong> douyin.com, iesdouyin.com</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 플랫폼 설정 */}
      <Card>
        <CardHeader>
          <CardTitle>플랫폼 설정</CardTitle>
          <CardDescription>각 플랫폼의 활성화 상태와 데이터 수집 설정을 관리합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 샤오홍슈 설정 */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center space-x-2">
                    <span>📕</span>
                    <span>샤오홍슈 설정</span>
                  </h4>
                  
                  <FormField
                    control={form.control}
                    name="xiaohongshu.enabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel>플랫폼 활성화</FormLabel>
                          <FormDescription>샤오홍슈 데이터 수집을 활성화합니다</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="xiaohongshu.crawlingInterval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>데이터 수집 주기 (분)</FormLabel>
                        <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="5">5분</SelectItem>
                            <SelectItem value="10">10분</SelectItem>
                            <SelectItem value="30">30분</SelectItem>
                            <SelectItem value="60">1시간</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          데이터 수집 빈도를 설정합니다. 너무 자주 수집하면 차단될 수 있습니다.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                {/* 도우인 설정 */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center space-x-2">
                    <span>🎵</span>
                    <span>도우인 설정</span>
                  </h4>
                  
                  <FormField
                    control={form.control}
                    name="douyin.enabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel>플랫폼 활성화</FormLabel>
                          <FormDescription>도우인 데이터 수집을 활성화합니다</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="douyin.crawlingInterval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>데이터 수집 주기 (분)</FormLabel>
                        <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="5">5분</SelectItem>
                            <SelectItem value="10">10분</SelectItem>
                            <SelectItem value="30">30분</SelectItem>
                            <SelectItem value="60">1시간</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          데이터 수집 빈도를 설정합니다. 너무 자주 수집하면 차단될 수 있습니다.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full">
                플랫폼 설정 저장
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* API 대안 안내 */}
      <Card>
        <CardHeader>
          <CardTitle>데이터 수집 방식 안내</CardTitle>
          <CardDescription>중국 플랫폼의 특성과 데이터 수집 제한사항</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">⚠️ 중요 안내</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• 샤오홍슈와 도우인은 공개 API를 제공하지 않습니다</li>
              <li>• URL 기반 크롤링 방식으로 데이터를 수집합니다</li>
              <li>• 실시간 데이터가 아닌 배치 처리 방식입니다</li>
              <li>• 플랫폼 정책에 따라 수집 제한이 있을 수 있습니다</li>
            </ul>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">📊 수집 가능한 데이터</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <strong>샤오홍슈:</strong> 노출량, 좋아요, 수집, 댓글 수, 공유 수
              </div>
              <div>
                <strong>도우인:</strong> 재생량, 좋아요, 댓글 수, 공유 수, 팔로우 수
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
