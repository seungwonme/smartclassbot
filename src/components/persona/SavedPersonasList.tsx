
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SavedPersonasListProps {
  savedPersonas: any[];
}

const SavedPersonasList: React.FC<SavedPersonasListProps> = ({
  savedPersonas
}) => {
  if (savedPersonas.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>저장된 페르소나</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {savedPersonas.map((persona, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">{persona.name}</div>
                <div className="text-sm text-gray-600">
                  {new Date(persona.completedAt).toLocaleDateString('ko-KR')} - 신뢰도: {persona.confidence}%
                </div>
                {persona.reportName && (
                  <div className="text-xs text-gray-500">
                    기반 보고서: {persona.reportName}
                  </div>
                )}
              </div>
              <Button variant="outline" size="sm">
                상세보기
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedPersonasList;
