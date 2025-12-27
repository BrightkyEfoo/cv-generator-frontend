'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { Experience } from '@/types/cv';
import { useDebouncedSave } from '@/hooks/useDebouncedSave';

interface ExperiencesFormProps {
  data: Experience[];
  onSave: (data: Experience[]) => void;
}

export function ExperiencesForm({ data, onSave }: ExperiencesFormProps) {
  const [experiences, setExperiences] = useState<Experience[]>(data);

  useDebouncedSave(experiences, onSave, 1500);

  const addExperience = () => {
    const newExperience: Experience = {
      id: crypto.randomUUID(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
    };
    setExperiences([...experiences, newExperience]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: Experience[keyof Experience]) => {
    setExperiences(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  return (
    <Card className="border-border bg-cvBlack-lighter">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Expériences professionnelles</CardTitle>
          <Button
            onClick={addExperience}
            size="sm"
            className="bg-cvOrange hover:bg-cvOrange-dark"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {experiences.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Aucune expérience ajoutée. Cliquez sur "Ajouter" pour commencer.
          </p>
        ) : (
          experiences.map((exp, index) => (
            <div
              key={exp.id}
              className="space-y-4 p-4 border border-border rounded-lg bg-cvBlack"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Expérience {index + 1}
                  </span>
                </div>
                <Button
                  onClick={() => removeExperience(exp.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`jobTitle-${exp.id}`}>Titre du poste</Label>
                  <Input
                    id={`jobTitle-${exp.id}`}
                    value={exp.jobTitle}
                    onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`company-${exp.id}`}>Entreprise</Label>
                  <Input
                    id={`company-${exp.id}`}
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`location-${exp.id}`}>Lieu</Label>
                <Input
                  id={`location-${exp.id}`}
                  value={exp.location || ''}
                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                  className="bg-cvBlack-lighter border-border"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`startDate-${exp.id}`}>Date de début</Label>
                  <Input
                    id={`startDate-${exp.id}`}
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`endDate-${exp.id}`}>Date de fin</Label>
                  <Input
                    id={`endDate-${exp.id}`}
                    type="month"
                    value={exp.endDate || ''}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    disabled={exp.current}
                    className="bg-cvBlack-lighter border-border"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`current-${exp.id}`}
                      checked={exp.current}
                      onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                      className="h-4 w-4 rounded border-border"
                    />
                    <Label htmlFor={`current-${exp.id}`} className="text-sm">
                      Poste actuel
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${exp.id}`}>Description</Label>
                <Textarea
                  id={`description-${exp.id}`}
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  rows={4}
                  className="bg-cvBlack-lighter border-border"
                  placeholder="Décrivez vos responsabilités et réalisations..."
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
