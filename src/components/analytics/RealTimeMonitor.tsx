
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Play, Pause, RefreshCw } from 'lucide-react';
import { performanceTrackerService } from '@/services/performanceTracker.service';

interface RealTimeMonitorProps {
  campaignId?: string;
}

const RealTimeMonitor: React.FC<RealTimeMonitorProps> = ({ campaignId }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [updateCount, setUpdateCount] = useState(0);

  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 추적 중지
      performanceTrackerService.stopTracking();
    };
  }, []);

  const handleStartTracking = () => {
    performanceTrackerService.startTracking();
    setIsTracking(true);
    setLastUpdate(new Date().toLocaleTimeString('ko-KR'));
    
    // 업데이트 카운터 시작
    const interval = setInterval(() => {
      setUpdateCount(prev => prev + 1);
      setLastUpdate(new Date().toLocaleTimeString('ko-KR'));
    }, 60000); // 1분마다 카운터 업데이트

    // 컴포넌트 언마운트 시 정리를 위해 저장
    (window as any).trackingInterval = interval;
  };

  const handleStopTracking = () => {
    performanceTrackerService.stopTracking();
    setIsTracking(false);
    
    if ((window as any).trackingInterval) {
      clearInterval((window as any).trackingInterval);
      (window as any).trackingInterval = null;
    }
  };

  const handleManualUpdate = () => {
    // 수동 업데이트는 private 메서드에 접근할 수 없으므로 서비스 재시작으로 처리
    if (isTracking) {
      handleStopTracking();
      setTimeout(() => handleStartTracking(), 100);
    }
    setLastUpdate(new Date().toLocaleTimeString('ko-KR'));
  };

  return (
    <Card className={`${isTracking ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className={`w-5 h-5 ${isTracking ? 'text-green-600 animate-pulse' : 'text-gray-400'}`} />
            실시간 성과 모니터링
          </div>
          <Badge variant={isTracking ? "default" : "secondary"}>
            {isTracking ? '모니터링 중' : '대기 중'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">모니터링 상태</p>
            <p className="text-xs text-muted-foreground">
              {isTracking 
                ? `10분마다 자동 업데이트 (${updateCount}회 완료)`
                : '모니터링이 중지되어 있습니다'
              }
            </p>
            {lastUpdate && (
              <p className="text-xs text-muted-foreground">
                마지막 업데이트: {lastUpdate}
              </p>
            )}
          </div>
          
          <div className="flex gap-2">
            {!isTracking ? (
              <Button onClick={handleStartTracking} size="sm" className="bg-green-600 hover:bg-green-700">
                <Play className="w-4 h-4 mr-1" />
                시작
              </Button>
            ) : (
              <Button onClick={handleStopTracking} size="sm" variant="outline">
                <Pause className="w-4 h-4 mr-1" />
                중지
              </Button>
            )}
            
            <Button onClick={handleManualUpdate} size="sm" variant="outline">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-lg font-bold text-green-600">
              {isTracking ? '실시간' : '정적'}
            </p>
            <p className="text-xs text-muted-foreground">데이터 상태</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-blue-600">
              10분
            </p>
            <p className="text-xs text-muted-foreground">업데이트 주기</p>
          </div>
        </div>

        {isTracking && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
              <span className="text-sm font-medium text-blue-800">
                중국 플랫폼 성과 데이터를 실시간으로 추적 중입니다
              </span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              샤오홍슈와 도우인의 노출량, 좋아요, 댓글, 공유 지표가 자동으로 업데이트됩니다.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeMonitor;
