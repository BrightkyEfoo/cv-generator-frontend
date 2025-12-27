'use client';

import { useState } from 'react';
import type { Interest } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Heart } from 'lucide-react';
import { useDebouncedSave } from '@/hooks/useDebouncedSave';

interface InterestsFormProps {
  data: Interest[];
  onSave: (data: Interest[]) => void;
}

export function InterestsForm({ data, onSave }: InterestsFormProps) {
  const [interests, setInterests] = useState<Interest[]>(data || []);

  useDebouncedSave(interests, onSave, 1500);

  const addInterest = () => {
    const newInterest: Interest = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
    };
    setInterests([...interests, newInterest]);
  };

  const removeInterest = (id: string) => {
    setInterests(interests.filter((interest) => interest.id !== id));
  };

  const updateInterest = (id: string, field: keyof Interest, value: string) => {
    setInterests(
      interests.map((interest) =>
        interest.id === id ? { ...interest, [field]: value } : interest
      )
    );
  };

  return (
    <Card className="border-border bg-cvBlack-lighter">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground flex items-center gap-2">
          <Heart className="h-5 w-5 text-cvOrange" />
          Centres d'intérêt
        </CardTitle>
        <Button onClick={addInterest} size="sm" className="bg-cvOrange hover:bg-cvOrange-dark">
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {interests.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Aucun centre d'intérêt ajouté. Cliquez sur "Ajouter" pour commencer.
          </p>
        ) : (
          interests.map((interest, index) => (
            <div
              key={interest.id}
              className="p-4 rounded-lg border border-border bg-cvBlack space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Intérêt {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeInterest(interest.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`name-${interest.id}`}>Nom</Label>
                  <Input
                    id={`name-${interest.id}`}
                    value={interest.name}
                    onChange={(e) => updateInterest(interest.id, 'name', e.target.value)}
                    placeholder="Ex: Photographie, Voyage, Lecture..."
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`description-${interest.id}`}>Description (optionnel)</Label>
                  <Input
                    id={`description-${interest.id}`}
                    value={interest.description || ''}
                    onChange={(e) => updateInterest(interest.id, 'description', e.target.value)}
                    placeholder="Ex: Membre d'un club photo, 20 pays visités..."
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
