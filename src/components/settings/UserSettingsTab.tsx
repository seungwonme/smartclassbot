
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { brandSettingsService } from '@/services/brandSettings.service';

const userSettingsSchema = z.object({
  // 회사 정보
  companyName: z.string().min(1, '회사명을 입력해주세요'),
  businessNumber: z.string().min(1, '사업자등록번호를 입력해주세요'),
  address: z.string().min(1, '주소를 입력해주세요'),
  ceoName: z.string().min(1, '대표자명을 입력해주세요'),
  industry: z.string().min(1, '업종을 입력해주세요'),
  
  // 담당자 정보
  contactName: z.string().min(1, '담당자명을 입력해주세요'),
  contactEmail: z.string().email('올바른 이메일을 입력해주세요'),
  contactPhone: z.string().min(1, '전화번호를 입력해주세요'),
  department: z.string().min(1, '부서를 입력해주세요'),
  position: z.string().min(1, '직책을 입력해주세요'),
  
  // 결제 정보
  billingEmail: z.string().email('올바른 이메일을 입력해주세요'),
  paymentMethod: z.string().min(1, '결제 방법을 선택해주세요'),
  taxInvoiceInfo: z.string().optional(),
});

type UserSettingsForm = z.infer<typeof userSettingsSchema>;

export const UserSettingsTab = () => {
  const { toast } = useToast();
  
  // 기존 설정값 로드
  const currentSettings = brandSettingsService.getBrandSettings();
  
  const form = useForm<UserSettingsForm>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      companyName: currentSettings.company.companyName,
      businessNumber: currentSettings.company.businessNumber,
      address: currentSettings.company.address,
      ceoName: currentSettings.company.ceoName,
      industry: currentSettings.company.industry,
      contactName: currentSettings.contact.contactName,
      contactEmail: currentSettings.contact.contactEmail,
      contactPhone: currentSettings.contact.contactPhone,
      department: currentSettings.contact.department,
      position: currentSettings.contact.position,
      billingEmail: currentSettings.billing.billingEmail,
      paymentMethod: currentSettings.billing.paymentMethod,
      taxInvoiceInfo: currentSettings.billing.taxInvoiceInfo,
    },
  });

  const onSubmit = async (data: UserSettingsForm) => {
    try {
      // 새로운 브랜드 설정 서비스를 사용하여 데이터 저장
      brandSettingsService.updateBrandSettings({
        company: {
          companyName: data.companyName,
          businessNumber: data.businessNumber,
          address: data.address,
          ceoName: data.ceoName,
          industry: data.industry,
        },
        contact: {
          contactName: data.contactName,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          department: data.department,
          position: data.position,
        },
        billing: {
          billingEmail: data.billingEmail,
          paymentMethod: data.paymentMethod,
          taxInvoiceInfo: data.taxInvoiceInfo,
        },
      });
      
      console.log('브랜드 사용자 설정 저장:', data);
      
      toast({
        title: '저장 완료',
        description: '사용자 설정이 성공적으로 저장되었습니다.',
      });
    } catch (error) {
      toast({
        title: '저장 실패',
        description: '사용자 설정 저장 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 회사 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>회사 정보</CardTitle>
            <CardDescription>회사의 기본 정보를 입력해주세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>회사명</FormLabel>
                    <FormControl>
                      <Input placeholder="회사명을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="businessNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>사업자등록번호</FormLabel>
                    <FormControl>
                      <Input placeholder="000-00-00000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>주소</FormLabel>
                  <FormControl>
                    <Textarea placeholder="회사 주소를 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ceoName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>대표자명</FormLabel>
                    <FormControl>
                      <Input placeholder="대표자명을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>업종</FormLabel>
                    <FormControl>
                      <Input placeholder="업종을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* 담당자 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>담당자 정보</CardTitle>
            <CardDescription>담당자의 연락처 정보를 입력해주세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>담당자명</FormLabel>
                    <FormControl>
                      <Input placeholder="담당자명을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>전화번호</FormLabel>
                    <FormControl>
                      <Input placeholder="010-0000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>부서</FormLabel>
                    <FormControl>
                      <Input placeholder="마케팅팀" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>직책</FormLabel>
                    <FormControl>
                      <Input placeholder="팀장" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* 결제 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>결제 정보</CardTitle>
            <CardDescription>청구서 및 결제 관련 정보를 입력해주세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="billingEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>청구서 수신 이메일</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="billing@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>결제 방법</FormLabel>
                    <FormControl>
                      <Input placeholder="신용카드, 계좌이체 등" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="taxInvoiceInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>세금계산서 정보</FormLabel>
                  <FormControl>
                    <Textarea placeholder="세금계산서 발행에 필요한 추가 정보를 입력하세요" {...field} />
                  </FormControl>
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
