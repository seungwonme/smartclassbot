
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileText, X, Download } from 'lucide-react';
import { VideoPlanData } from '@/types/content';
import { downloadFile } from '@/utils/fileUtils';
import { useToast } from '@/hooks/use-toast';

interface VideoPlanFormProps {
  videoData: VideoPlanData;
  onUpdate: (data: Partial<VideoPlanData>) => void;
}

const VideoPlanForm: React.FC<VideoPlanFormProps> = ({ videoData, onUpdate }) => {
  const { toast } = useToast();

  const handleScenarioFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          onUpdate({
            scenarioFiles: [...videoData.scenarioFiles, {
              name: file.name,
              data: result,
              type: file.type
            }]
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeScenarioFile = (index: number) => {
    onUpdate({
      scenarioFiles: videoData.scenarioFiles.filter((_, i) => i !== index)
    });
  };

  const handleDownloadScenarioFile = async (file: { name: string; data: string; type: string }) => {
    try {
      downloadFile(file.data, file.name, file.type);
      toast({
        title: "파일 다운로드 완료",
        description: `${file.name} 파일이 다운로드되었습니다.`
      });
    } catch (error) {
      toast({
        title: "다운로드 실패",
        description: "파일을 다운로드할 수 없습니다.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="postTitle">포스팅 제목</Label>
        <Input
          id="postTitle"
          value={videoData.postTitle}
          onChange={(e) => {
            console.log('영상 포스팅 제목 변경:', e.target.value);
            onUpdate({ postTitle: e.target.value });
          }}
          placeholder="포스팅 제목을 입력하세요"
        />
      </div>

      <div>
        <Label htmlFor="scenario">시나리오</Label>
        <Textarea
          id="scenario"
          value={videoData.scenario}
          onChange={(e) => onUpdate({ scenario: e.target.value })}
          placeholder="영상 시나리오를 입력하세요"
          rows={12}
        />
        
        <div className="mt-4">
          <Label>시나리오 파일 업로드</Label>
          <div className="mt-2">
            <div className="flex items-center justify-center w-full">
              <label htmlFor="scenario-files" className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-3 pb-3">
                  <FileText className="w-6 h-6 mb-2 text-gray-500" />
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">워드, PDF 등 파일 업로드</span>
                  </p>
                  <p className="text-xs text-gray-500">DOC, DOCX, PDF, TXT (최대 10MB)</p>
                </div>
                <input
                  id="scenario-files"
                  type="file"
                  multiple
                  accept=".doc,.docx,.pdf,.txt"
                  className="hidden"
                  onChange={handleScenarioFileUpload}
                />
              </label>
            </div>
            {videoData.scenarioFiles.length > 0 && (
              <div className="space-y-2 mt-4">
                {videoData.scenarioFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs px-2 py-1 h-6"
                        onClick={() => handleDownloadScenarioFile(file)}
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-6 h-6 p-0"
                        onClick={() => removeScenarioFile(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="script">스크립트</Label>
        <Textarea
          id="script"
          value={videoData.script}
          onChange={(e) => onUpdate({ script: e.target.value })}
          placeholder="콘텐츠 스크립트를 입력하세요"
          rows={6}
        />
      </div>
    </div>
  );
};

export default VideoPlanForm;
