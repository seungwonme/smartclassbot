
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { brandSettingsService } from '@/services/brandSettings.service';

const languageSchema = z.object({
  language: z.enum(['ko', 'en', 'zh']),
  timezone: z.string(),
  currency: z.enum(['KRW', 'USD', 'CNY']),
  dateFormat: z.enum(['YYYY-MM-DD', 'MM/DD/YYYY', 'DD/MM/YYYY']),
});

type LanguageForm = z.infer<typeof languageSchema>;

export const LanguageRegionTab = () => {
  const { toast } = useToast();
  const currentSettings = brandSettingsService.getLanguageSettings();
  
  const form = useForm<LanguageForm>({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      language: currentSettings.language,
      timezone: currentSettings.timezone,
      currency: currentSettings.currency,
      dateFormat: currentSettings.dateFormat,
    },
  });

  const onSubmit = async (data: LanguageForm) => {
    try {
      brandSettingsService.updateBrandSettings({
        language: data
      });
      
      toast({
        title: '저장 완료',
        description: '언어 및 지역 설정이 성공적으로 저장되었습니다.',
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
          <CardTitle>언어 및 지역 설정</CardTitle>
          <CardDescription>언어, 시간대, 통화 등을 설정합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>언어</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="언어를 선택하세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ko">한국어</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="zh">中文</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        시스템 표시 언어
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>시간대</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="시간대를 선택하세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Asia/Seoul">서울 (UTC+9)</SelectItem>
                          <SelectItem value="America/New_York">뉴욕 (UTC-5)</SelectItem>
                          <SelectItem value="Asia/Shanghai">상하이 (UTC+8)</SelectItem>
                          <SelectItem value="Europe/London">런던 (UTC+0)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        날짜와 시간 표시 기준
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>통화</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="통화를 선택하세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="KRW">원 (KRW)</SelectItem>
                          <SelectItem value="USD">달러 (USD)</SelectItem>
                          <SelectItem value="CNY">위안 (CNY)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        가격 표시 통화
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dateFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>날짜 형식</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="날짜 형식을 선택하세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="YYYY-MM-DD">2024-01-01</SelectItem>
                          <SelectItem value="MM/DD/YYYY">01/01/2024</SelectItem>
                          <SelectItem value="DD/MM/YYYY">01/01/2024</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        날짜 표시 형식
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit">언어 및 지역 설정 저장</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
