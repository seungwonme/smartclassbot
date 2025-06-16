
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, BellRing, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
}

const HorizontalNotificationSystem: React.FC = () => {
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
    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'success',
        title: '성과 목표 달성',
        message: '샤오홍슈 캠페인이 목표 조회수 100만회를 달성했습니다!',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        read: false
      },
      {
        id: '2',
        type: 'warning',
        title: '성과 저조 알림',
        message: '도우인 콘텐츠의 참여율이 평균보다 20% 낮습니다.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        read: false
      },
      {
        id: '3',
        type: 'info',
        title: '일간 성과 리포트',
        message: '어제 총 조회수: 50만회, 좋아요: 2만개, 댓글: 500개',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        read: true
      }
    ];

    setAlerts(mockAlerts);
    setUnreadCount(mockAlerts.filter(alert => !alert.read).length);
  }, []);

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
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 좌측: 알림 설정 */}
          <div className="lg:col-span-1">
            <h4 className="text-sm font-medium mb-4">알림 설정</h4>
            <div className="space-y-3">
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

          {/* 우측: 최근 알림 리스트 */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-medium mb-4">최근 알림</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    alert.read ? 'bg-gray-50' : 'bg-white border-blue-200'
                  }`}
                  onClick={() => markAsRead(alert.id)}
                >
                  <div className="flex items-start gap-3">
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
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {alerts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                아직 알림이 없습니다.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HorizontalNotificationSystem;
