
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, BellRing, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationSystemProps {
  campaignId?: string;
  isAdmin?: boolean;
}

interface NotificationSettings {
  performanceAlerts: boolean;
  dailyReports: boolean;
  lowPerformanceWarnings: boolean;
  milestoneAchievements: boolean;
  contentReviewNeeded: boolean;
}

interface Alert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  campaignId?: string;
  influencerId?: string;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ 
  campaignId, 
  isAdmin = false 
}) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSettings>({
    performanceAlerts: true,
    dailyReports: false,
    lowPerformanceWarnings: true,
    milestoneAchievements: true,
    contentReviewNeeded: true
  });
  
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // 모의 알림 데이터 생성
    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'success',
        title: '성과 목표 달성',
        message: '샤오홍슈 캠페인이 목표 조회수 100만회를 달성했습니다!',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30분 전
        read: false,
        campaignId: campaignId
      },
      {
        id: '2',
        type: 'warning',
        title: '성과 저조 알림',
        message: '도우인 콘텐츠의 참여율이 평균보다 20% 낮습니다.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2시간 전
        read: false,
        campaignId: campaignId
      },
      {
        id: '3',
        type: 'info',
        title: '일간 성과 리포트',
        message: '어제 총 조회수: 50만회, 좋아요: 2만개, 댓글: 500개',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8시간 전
        read: true,
        campaignId: campaignId
      },
      {
        id: '4',
        type: 'error',
        title: '콘텐츠 검토 필요',
        message: '부정적 댓글이 급증하고 있습니다. 즉시 검토가 필요합니다.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12시간 전
        read: false,
        campaignId: campaignId
      }
    ];

    setAlerts(mockAlerts);
    setUnreadCount(mockAlerts.filter(alert => !alert.read).length);

    // 실시간 알림 시뮬레이션
    const interval = setInterval(() => {
      if (settings.performanceAlerts && Math.random() > 0.8) {
        generateRandomAlert();
      }
    }, 30000); // 30초마다 랜덤 알림

    return () => clearInterval(interval);
  }, [campaignId, settings.performanceAlerts]);

  const generateRandomAlert = () => {
    const alertTypes = ['성과 급상승', '새로운 댓글', '인플루언서 활동', '트렌드 변화'];
    const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    
    const newAlert: Alert = {
      id: `alert_${Date.now()}`,
      type: 'info',
      title: randomType,
      message: `${randomType}이 감지되었습니다. 자세한 내용을 확인해보세요.`,
      timestamp: new Date().toISOString(),
      read: false,
      campaignId: campaignId
    };

    setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
    setUnreadCount(prev => prev + 1);

    // 토스트 알림 표시
    toast({
      title: newAlert.title,
      description: newAlert.message,
      duration: 5000,
    });
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
    setUnreadCount(0);
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    toast({
      title: '알림 설정 변경',
      description: `${getSettingLabel(key)}이 ${value ? '활성화' : '비활성화'}되었습니다.`,
    });
  };

  const getSettingLabel = (key: keyof NotificationSettings): string => {
    const labels = {
      performanceAlerts: '성과 알림',
      dailyReports: '일간 리포트',
      lowPerformanceWarnings: '저조한 성과 경고',
      milestoneAchievements: '목표 달성 알림',
      contentReviewNeeded: '콘텐츠 검토 알림'
    };
    return labels[key];
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}시간 전`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}일 전`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5" />
            실시간 알림
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              모두 읽음
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 알림 설정 */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">알림 설정</h4>
          <div className="space-y-2">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm">{getSettingLabel(key as keyof NotificationSettings)}</span>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => updateSetting(key as keyof NotificationSettings, checked)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 최근 알림 */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">최근 알림</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  alert.read ? 'bg-gray-50' : 'bg-white border-blue-200'
                }`}
                onClick={() => markAsRead(alert.id)}
              >
                <div className="flex items-start gap-2">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className={`text-sm font-medium ${!alert.read ? 'text-blue-900' : 'text-gray-900'}`}>
                        {alert.title}
                      </h5>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(alert.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                    {!alert.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {alerts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            아직 알림이 없습니다.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSystem;
