'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { Education } from '@/types/cv';
import { useDebouncedSave } from '@/hooks/useDebouncedSave';

interface EducationFormProps {
  data: Education[];
  onSave: (data: Education[]) => void;
}

export function EducationForm({ data, onSave }: EducationFormProps) {
  const [education, setEducation] = useState<Education[]>(data);

  useDebouncedSave(education, onSave, 1500);

  const addEducation = () => {
    const newEducation: Education = {
      id: crypto.randomUUID(),
      degree: '',
      field: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      honors: '',
      description: '',
    };
    setEducation([...education, newEducation]);
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter((edu) => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: string | boolean) => {
    setEducation(
      education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  return (
    <Card className="border-border bg-cvBlack-lighter">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Formation</CardTitle>
          <Button
            onClick={addEducation}
            size="sm"
            className="bg-cvOrange hover:bg-cvOrange-dark"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {education.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Aucune formation ajoutée. Cliquez sur "Ajouter" pour commencer.
          </p>
        ) : (
          education.map((edu, index) => (
            <div
              key={edu.id}
              className="space-y-4 p-4 border border-border rounded-lg bg-cvBlack"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Formation {index + 1}
                  </span>
                </div>
                <Button
                  onClick={() => removeEducation(edu.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`degree-${edu.id}`}>Diplôme</Label>
                  <Input
                    id={`degree-${edu.id}`}
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    className="bg-cvBlack-lighter border-border"
                    placeholder="Ex: Master en Informatique"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`field-${edu.id}`}>Domaine</Label>
                  <Input
                    id={`field-${edu.id}`}
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                    className="bg-cvBlack-lighter border-border"
                    placeholder="Ex: Génie Logiciel"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`institution-${edu.id}`}>Établissement</Label>
                <Input
                  id={`institution-${edu.id}`}
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                  className="bg-cvBlack-lighter border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`location-${edu.id}`}>Lieu</Label>
                <Input
                  id={`location-${edu.id}`}
                  value={edu.location || ''}
                  onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                  className="bg-cvBlack-lighter border-border"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`startDate-${edu.id}`}>Date de début</Label>
                  <Input
                    id={`startDate-${edu.id}`}
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`endDate-${edu.id}`}>Date de fin</Label>
                  <Input
                    id={`endDate-${edu.id}`}
                    type="month"
                    value={edu.endDate || ''}
                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                    disabled={edu.current}
                    className="bg-cvBlack-lighter border-border"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`current-${edu.id}`}
                      checked={edu.current}
                      onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                      className="h-4 w-4 rounded border-border"
                    />
                    <Label htmlFor={`current-${edu.id}`} className="text-sm">
                      En cours
                    </Label>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`gpa-${edu.id}`}>Mention/GPA</Label>
                  <Input
                    id={`gpa-${edu.id}`}
                    value={edu.gpa || ''}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    className="bg-cvBlack-lighter border-border"
                    placeholder="Ex: Mention Très Bien"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`honors-${edu.id}`}>Distinctions</Label>
                  <Input
                    id={`honors-${edu.id}`}
                    value={edu.honors || ''}
                    onChange={(e) => updateEducation(edu.id, 'honors', e.target.value)}
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${edu.id}`}>Description</Label>
                <Textarea
                  id={`description-${edu.id}`}
                  value={edu.description || ''}
                  onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                  rows={3}
                  className="bg-cvBlack-lighter border-border"
                  placeholder="Cours pertinents, projets, réalisations..."
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
