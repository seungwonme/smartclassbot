
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface HashtagInputProps {
  hashtags: string[];
  onUpdate: (hashtags: string[]) => void;
}

const HashtagInput: React.FC<HashtagInputProps> = ({ hashtags, onUpdate }) => {
  const [hashtagInput, setHashtagInput] = useState('');

  const addHashtag = () => {
    if (hashtagInput.trim()) {
      const tag = hashtagInput.startsWith('#') ? hashtagInput : `#${hashtagInput}`;
      onUpdate([...hashtags, tag]);
      setHashtagInput('');
    }
  };

  const removeHashtag = (index: number) => {
    onUpdate(hashtags.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Label>해시태그</Label>
      <div className="flex gap-2 mt-2">
        <Input
          value={hashtagInput}
          onChange={(e) => setHashtagInput(e.target.value)}
          placeholder="#해시태그를 입력하세요"
          onKeyPress={(e) => e.key === 'Enter' && addHashtag()}
        />
        <Button type="button" onClick={addHashtag}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {hashtags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X className="w-3 h-3 cursor-pointer" onClick={() => removeHashtag(index)} />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default HashtagInput;
