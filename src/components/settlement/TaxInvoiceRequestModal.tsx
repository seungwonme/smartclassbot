
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { BusinessInfo } from '@/types/settlement';
import { FileText } from 'lucide-react';

interface TaxInvoiceRequestModalProps {
  settlementId: string;
  onRequestSubmitted: (businessInfo: BusinessInfo) => void;
  children?: React.ReactNode;
}

const TaxInvoiceRequestModal: React.FC<TaxInvoiceRequestModalProps> = ({
  settlementId,
  onRequestSubmitted,
  children
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    companyName: '',
    businessNumber: '',
    representative: '',
    address: '',
    email: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessInfo.companyName || !businessInfo.businessNumber || !businessInfo.representative) {
      toast({
        title: "필수 정보를 입력해주세요",
        description: "회사명, 사업자등록번호, 대표자명은 필수입니다.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onRequestSubmitted(businessInfo);
      toast({
        title: "세금계산서 발행 요청",
        description: "세금계산서 발행 요청이 전송되었습니다."
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "요청 실패",
        description: "세금계산서 발행 요청에 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof BusinessInfo, value: string) => {
    setBusinessInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            세금계산서 요청
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>세금계산서 발행 요청</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">회사명 *</Label>
            <Input
              id="companyName"
              value={businessInfo.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="회사명을 입력하세요"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="businessNumber">사업자등록번호 *</Label>
            <Input
              id="businessNumber"
              value={businessInfo.businessNumber}
              onChange={(e) => handleInputChange('businessNumber', e.target.value)}
              placeholder="123-45-67890"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="representative">대표자명 *</Label>
            <Input
              id="representative"
              value={businessInfo.representative}
              onChange={(e) => handleInputChange('representative', e.target.value)}
              placeholder="대표자명을 입력하세요"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">주소</Label>
            <Textarea
              id="address"
              value={businessInfo.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="주소를 입력하세요"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={businessInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="email@company.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">연락처</Label>
            <Input
              id="phone"
              value={businessInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="02-1234-5678"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? '요청 중...' : '발행 요청'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaxInvoiceRequestModal;
