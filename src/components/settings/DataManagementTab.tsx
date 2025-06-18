import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { brandSettingsService } from '@/services/brandSettings.service';

const dataManagementSchema = z.object({
  autoBackup: z.boolean(),
  dataRetentionDays: z.number().min(30).max(3650),
  exportFormat: z.enum(['CSV', 'Excel', 'JSON']),
});

type DataManagementForm = z.infer<typeof dataManagementSchema>;

export const DataManagementTab = () => {
  const { toast } = useToast();
  const currentSettings = brandSettingsService.getDataSettings();
  
  const form = useForm<DataManagementForm>({
    resolver: zodResolver(dataManagementSchema),
    defaultValues: {
      autoBackup: currentSettings.autoBackup,
      dataRetentionDays: currentSettings.dataRetentionDays,
      exportFormat: currentSettings.exportFormat,
    },
  });

  const onSubmit = async (data: DataManagementForm) => {
    try {
      brandSettingsService.updateBrandSettings({
        data: data as any
      });
      
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

  const handleExportData = () => {
    const settings = brandSettingsService.getBrandSettings();
    const dataToExport = {
      exportedAt: new Date().toISOString(),
      settings: settings,
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `brand-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    toast({
      title: '내보내기 완료',
      description: '설정 데이터가 성공적으로 내보내졌습니다.',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>데이터 관리 설정</CardTitle>
          <CardDescription>데이터 백업, 보관 정책 등을 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="autoBackup"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>자동 백업</FormLabel>
                      <FormDescription>
                        데이터를 자동으로 백업합니다
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
                  name="dataRetentionDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>데이터 보관 기간 (일)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(Number(e.target.value))} 
                        />
                      </FormControl>
                      <FormDescription>
                        데이터를 보관할 기간을 설정합니다
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="exportFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>내보내기 형식</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="형식을 선택하세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CSV">CSV</SelectItem>
                          <SelectItem value="Excel">Excel</SelectItem>
                          <SelectItem value="JSON">JSON</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        데이터 내보내기 기본 형식
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleExportData}>
                  설정 데이터 내보내기
                </Button>
                <Button type="submit">데이터 관리 설정 저장</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
