
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface Influencer {
  id: string;
  name: string;
  platform: string;
}

interface InfluencerSelectorProps {
  selectedInfluencer: string;
  influencers: Influencer[];
  onInfluencerChange: (influencerId: string) => void;
}

const InfluencerSelector: React.FC<InfluencerSelectorProps> = ({
  selectedInfluencer,
  influencers,
  onInfluencerChange
}) => {
  const selectedInfluencerData = influencers.find(inf => inf.id === selectedInfluencer);

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-4">
          {/* 인플루언서 선택 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Users className="w-4 h-4" />
              인플루언서
            </div>
            <Select value={selectedInfluencer} onValueChange={onInfluencerChange}>
              <SelectTrigger>
                <SelectValue placeholder="인플루언서 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 인플루언서</SelectItem>
                {influencers.map((influencer) => (
                  <SelectItem key={influencer.id} value={influencer.id}>
                    <div className="flex items-center gap-2">
                      <span>{influencer.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {influencer.platform === 'xiaohongshu' ? '📕' : '🎵'}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 선택된 인플루언서 정보 */}
        {selectedInfluencerData && selectedInfluencer !== 'all' && (
          <div className="mt-4">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {selectedInfluencerData.platform === 'xiaohongshu' ? '📕' : '🎵'}
                </span>
                <span className="font-medium text-green-800">{selectedInfluencerData.name}</span>
              </div>
              <div className="text-xs text-green-600 mt-1">
                {selectedInfluencerData.platform === 'xiaohongshu' ? '샤오홍슈' : '도우인'} 인플루언서
              </div>
            </div>
          </div>
        )}

        {/* 인플루언서 데이터 요약 정보 */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>참여 인플루언서: {influencers.length}명</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfluencerSelector;
