'use client';

import { useState } from 'react';
import type { Award } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Trophy } from 'lucide-react';
import { useDebouncedSave } from '@/hooks/useDebouncedSave';

interface AwardsFormProps {
  data: Award[];
  onSave: (data: Award[]) => void;
}

export function AwardsForm({ data, onSave }: AwardsFormProps) {
  const [awards, setAwards] = useState<Award[]>(data || []);

  useDebouncedSave(awards, onSave, 1500);

  const addAward = () => {
    const newAward: Award = {
      id: crypto.randomUUID(),
      title: '',
      issuer: '',
      date: '',
      description: '',
    };
    setAwards([...awards, newAward]);
  };

  const removeAward = (id: string) => {
    setAwards(awards.filter((award) => award.id !== id));
  };

  const updateAward = (id: string, field: keyof Award, value: string) => {
    setAwards(
      awards.map((award) =>
        award.id === id ? { ...award, [field]: value } : award
      )
    );
  };

  return (
    <Card className="border-border bg-cvBlack-lighter">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground flex items-center gap-2">
          <Trophy className="h-5 w-5 text-cvOrange" />
          Prix & Distinctions
        </CardTitle>
        <Button onClick={addAward} size="sm" className="bg-cvOrange hover:bg-cvOrange-dark">
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {awards.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Aucun prix ajouté. Cliquez sur "Ajouter" pour commencer.
          </p>
        ) : (
          awards.map((award, index) => (
            <div
              key={award.id}
              className="p-4 rounded-lg border border-border bg-cvBlack space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Prix {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAward(award.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`title-${award.id}`}>Titre du prix</Label>
                  <Input
                    id={`title-${award.id}`}
                    value={award.title}
                    onChange={(e) => updateAward(award.id, 'title', e.target.value)}
                    placeholder="Ex: Meilleur projet innovation"
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`issuer-${award.id}`}>Organisation</Label>
                  <Input
                    id={`issuer-${award.id}`}
                    value={award.issuer}
                    onChange={(e) => updateAward(award.id, 'issuer', e.target.value)}
                    placeholder="Ex: Chambre de Commerce"
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`date-${award.id}`}>Date</Label>
                  <Input
                    id={`date-${award.id}`}
                    value={award.date}
                    onChange={(e) => updateAward(award.id, 'date', e.target.value)}
                    placeholder="Ex: Juin 2023"
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${award.id}`}>Description (optionnel)</Label>
                <Textarea
                  id={`description-${award.id}`}
                  value={award.description || ''}
                  onChange={(e) => updateAward(award.id, 'description', e.target.value)}
                  placeholder="Décrivez le contexte et la signification de ce prix..."
                  className="bg-cvBlack-lighter border-border min-h-[80px]"
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
