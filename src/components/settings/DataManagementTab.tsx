
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Trash2, FileText, BarChart3, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const dataManagementSchema = z.object({
  dataRetentionPeriod: z.string().min(1, '데이터 보관 기간을 선택해주세요'),
  autoDeleteEnabled: z.boolean(),
});

type DataManagementForm = z.infer<typeof dataManagementSchema>;

export const DataManagementTab = () => {
  const { toast } = useToast();
  
  const form = useForm<DataManagementForm>({
    resolver: zodResolver(dataManagementSchema),
    defaultValues: {
      dataRetentionPeriod: '3years',
      autoDeleteEnabled: false,
    },
  });

  const onSubmit = async (data: DataManagementForm) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('데이터 관리 설정 저장:', data);
      
      toast({
        title: '저장 완료',
        description: '데이터 관리 설정이 성공적으로 저장되었습니다.',
      });
    } catch (error) {
      toast({
        title: '저장 실패',
        description: '설정 저장 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleDataExport = (dataType: string) => {
    toast({
      title: '데이터 내보내기 시작',
      description: `${dataType} 데이터를 내보내고 있습니다. 완료되면 다운로드 링크를 이메일로 보내드리겠습니다.`,
    });
  };

  const handleDataDeletion = () => {
    toast({
      title: '데이터 삭제 요청 접수',
      description: '데이터 삭제 요청이 접수되었습니다. 처리 현황을 이메일로 안내드리겠습니다.',
    });
  };

  return (
    <div className="space-y-6">
      {/* 데이터 내보내기 */}
      <Card>
        <CardHeader>
          <CardTitle>데이터 내보내기</CardTitle>
          <CardDescription>캠페인, 인플루언서, 성과 데이터를 CSV 또는 Excel 형식으로 다운로드하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => handleDataExport('캠페인')}
            >
              <FileText className="h-6 w-6" />
              <span>캠페인 데이터</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => handleDataExport('인플루언서')}
            >
              <Users className="h-6 w-6" />
              <span>인플루언서 데이터</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => handleDataExport('성과')}
            >
              <BarChart3 className="h-6 w-6" />
              <span>성과 데이터</span>
            </Button>
          </div>
          
          <div className="pt-4">
            <Button
              className="w-full"
              onClick={() => handleDataExport('전체')}
            >
              <Download className="mr-2 h-4 w-4" />
              전체 데이터 내보내기
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 데이터 보관 설정 */}
      <Card>
        <CardHeader>
          <CardTitle>데이터 보관 설정</CardTitle>
          <CardDescription>데이터 보관 기간과 자동 삭제 정책을 설정하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="dataRetentionPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>데이터 보관 기간</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="보관 기간을 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1year">1년</SelectItem>
                        <SelectItem value="3years">3년</SelectItem>
                        <SelectItem value="5years">5년</SelectItem>
                        <SelectItem value="permanent">영구 보관</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      설정된 기간이 지나면 오래된 데이터는 자동으로 삭제됩니다.
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <Button type="submit">설정 저장</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* 개인정보 처리 */}
      <Card>
        <CardHeader>
          <CardTitle>개인정보 처리</CardTitle>
          <CardDescription>개인정보 삭제 요청 및 처리 현황을 확인하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">데이터 삭제 요청</h4>
            <p className="text-sm text-muted-foreground mb-4">
              계정과 관련된 모든 개인정보의 삭제를 요청할 수 있습니다. 
              삭제 요청 후에는 복구가 불가능하니 신중히 결정해주세요.
            </p>
            <Button
              variant="destructive"
              onClick={handleDataDeletion}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              데이터 삭제 요청
            </Button>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">처리 현황</h4>
            <p className="text-sm text-muted-foreground">
              현재 진행 중인 데이터 처리 요청이 없습니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
