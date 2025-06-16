
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Play, Pause } from 'lucide-react';

interface CompactRealTimeStatusProps {
  isTracking: boolean;
  lastUpdate: string;
  onStartTracking: () => void;
  onStopTracking: () => void;
}

const CompactRealTimeStatus: React.FC<CompactRealTimeStatusProps> = ({
  isTracking,
  lastUpdate,
  onStartTracking,
  onStopTracking
}) => {
  return (
    <Card className={`${isTracking ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className={`w-5 h-5 ${isTracking ? 'text-green-600 animate-pulse' : 'text-gray-400'}`} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">실시간 모니터링</span>
                <Badge variant={isTracking ? "default" : "secondary"} className="text-xs">
                  {isTracking ? 'ON' : 'OFF'}
                </Badge>
              </div>
              {lastUpdate && (
                <p className="text-xs text-muted-foreground">
                  {lastUpdate}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isTracking ? (
              <Button onClick={onStartTracking} size="sm" className="bg-green-600 hover:bg-green-700">
                <Play className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={onStopTracking} size="sm" variant="outline">
                <Pause className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactRealTimeStatus;
