'use client';

import { useState } from 'react';
import type { Language, LanguageProficiency } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Languages } from 'lucide-react';
import { useDebouncedSave } from '@/hooks/useDebouncedSave';

interface LanguagesFormProps {
  data: Language[];
  onSave: (data: Language[]) => void;
}

const proficiencyLevels: { value: LanguageProficiency; label: string }[] = [
  { value: 'basic', label: 'Debutant' },
  { value: 'conversational', label: 'Conversationnel' },
  { value: 'professional', label: 'Professionnel' },
  { value: 'fluent', label: 'Courant' },
  { value: 'native', label: 'Natif' },
];

export function LanguagesForm({ data, onSave }: LanguagesFormProps) {
  const [languages, setLanguages] = useState<Language[]>(data || []);

  useDebouncedSave(languages, onSave, 1500);

  const addLanguage = () => {
    const newLanguage: Language = {
      id: crypto.randomUUID(),
      name: '',
      proficiency: 'basic',
    };
    setLanguages([...languages, newLanguage]);
  };

  const removeLanguage = (id: string) => {
    setLanguages(languages.filter((lang) => lang.id !== id));
  };

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    setLanguages(
      languages.map((lang) =>
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    );
  };

  return (
    <Card className="border-border bg-cvBlack-lighter">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground flex items-center gap-2">
          <Languages className="h-5 w-5 text-cvOrange" />
          Langues
        </CardTitle>
        <Button onClick={addLanguage} size="sm" className="bg-cvOrange hover:bg-cvOrange-dark">
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {languages.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Aucune langue ajoutee. Cliquez sur "Ajouter" pour commencer.
          </p>
        ) : (
          languages.map((lang, index) => (
            <div
              key={lang.id}
              className="p-4 rounded-lg border border-border bg-cvBlack space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Langue {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLanguage(lang.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`name-${lang.id}`}>Langue</Label>
                  <Input
                    id={`name-${lang.id}`}
                    value={lang.name}
                    onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                    placeholder="Ex: Francais"
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`proficiency-${lang.id}`}>Niveau</Label>
                  <Select
                    value={lang.proficiency}
                    onValueChange={(value) => updateLanguage(lang.id, 'proficiency', value)}
                  >
                    <SelectTrigger className="bg-cvBlack-lighter border-border">
                      <SelectValue placeholder="Selectionnez un niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      {proficiencyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
