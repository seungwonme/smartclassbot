
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const languageRegionSchema = z.object({
  language: z.string().min(1, '언어를 선택해주세요'),
  timezone: z.string().min(1, '시간대를 선택해주세요'),
  currency: z.string().min(1, '통화를 선택해주세요'),
  dateFormat: z.string().min(1, '날짜 형식을 선택해주세요'),
  numberFormat: z.string().min(1, '숫자 형식을 선택해주세요'),
});

type LanguageRegionForm = z.infer<typeof languageRegionSchema>;

export const LanguageRegionTab = () => {
  const { toast } = useToast();
  
  const form = useForm<LanguageRegionForm>({
    resolver: zodResolver(languageRegionSchema),
    defaultValues: {
      language: 'ko',
      timezone: 'Asia/Seoul',
      currency: 'KRW',
      dateFormat: 'YYYY-MM-DD',
      numberFormat: '1,234.56',
    },
  });

  const onSubmit = async (data: LanguageRegionForm) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('언어 및 지역 설정 저장:', data);
      
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>언어 및 지역 설정</CardTitle>
            <CardDescription>사용자 인터페이스 언어와 지역별 표시 형식을 설정하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <SelectItem value="zh-CN">中文 (简体)</SelectItem>
                        <SelectItem value="zh-TW">中文 (繁體)</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
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
                        <SelectItem value="Asia/Seoul">서울 (GMT+9)</SelectItem>
                        <SelectItem value="Asia/Tokyo">도쿄 (GMT+9)</SelectItem>
                        <SelectItem value="Asia/Shanghai">상하이 (GMT+8)</SelectItem>
                        <SelectItem value="Asia/Hong_Kong">홍콩 (GMT+8)</SelectItem>
                        <SelectItem value="America/New_York">뉴욕 (GMT-5)</SelectItem>
                        <SelectItem value="America/Los_Angeles">로스앤젤레스 (GMT-8)</SelectItem>
                        <SelectItem value="Europe/London">런던 (GMT+0)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <SelectItem value="JPY">엔 (JPY)</SelectItem>
                        <SelectItem value="EUR">유로 (EUR)</SelectItem>
                        <SelectItem value="GBP">파운드 (GBP)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
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
                        <SelectItem value="YYYY-MM-DD">2024-06-18</SelectItem>
                        <SelectItem value="DD/MM/YYYY">18/06/2024</SelectItem>
                        <SelectItem value="MM/DD/YYYY">06/18/2024</SelectItem>
                        <SelectItem value="DD.MM.YYYY">18.06.2024</SelectItem>
                        <SelectItem value="YYYY년 MM월 DD일">2024년 06월 18일</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="numberFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>숫자 형식</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="숫자 형식을 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1,234.56">1,234.56 (쉼표, 점)</SelectItem>
                      <SelectItem value="1.234,56">1.234,56 (점, 쉼표)</SelectItem>
                      <SelectItem value="1 234.56">1 234.56 (공백, 점)</SelectItem>
                      <SelectItem value="1234.56">1234.56 (구분자 없음)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
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
