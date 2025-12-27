'use client';

import { useState } from 'react';
import type { Reference } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Users } from 'lucide-react';
import { useDebouncedSave } from '@/hooks/useDebouncedSave';

interface ReferencesFormProps {
  data: Reference[];
  onSave: (data: Reference[]) => void;
}

export function ReferencesForm({ data, onSave }: ReferencesFormProps) {
  const [references, setReferences] = useState<Reference[]>(data || []);

  useDebouncedSave(references, onSave, 1500);

  const addReference = () => {
    const newReference: Reference = {
      id: crypto.randomUUID(),
      name: '',
      title: '',
      company: '',
      email: '',
      phone: '',
      relationship: '',
      isVisible: true,
    };
    setReferences([...references, newReference]);
  };

  const removeReference = (id: string) => {
    setReferences(references.filter((ref) => ref.id !== id));
  };

  const updateReference = (id: string, field: keyof Reference, value: string | boolean) => {
    setReferences(
      references.map((ref) =>
        ref.id === id ? { ...ref, [field]: value } : ref
      )
    );
  };

  return (
    <Card className="border-border bg-cvBlack-lighter">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground flex items-center gap-2">
          <Users className="h-5 w-5 text-cvOrange" />
          Références
        </CardTitle>
        <Button onClick={addReference} size="sm" className="bg-cvOrange hover:bg-cvOrange-dark">
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {references.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Aucune référence ajoutée. Cliquez sur "Ajouter" pour commencer.
          </p>
        ) : (
          references.map((ref, index) => (
            <div
              key={ref.id}
              className="p-4 rounded-lg border border-border bg-cvBlack space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Référence {index + 1}
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`visible-${ref.id}`}
                      checked={ref.isVisible}
                      onCheckedChange={(checked) => updateReference(ref.id, 'isVisible', checked)}
                    />
                    <Label htmlFor={`visible-${ref.id}`} className="text-sm text-muted-foreground">
                      Visible sur le CV
                    </Label>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeReference(ref.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`name-${ref.id}`}>Nom complet</Label>
                  <Input
                    id={`name-${ref.id}`}
                    value={ref.name}
                    onChange={(e) => updateReference(ref.id, 'name', e.target.value)}
                    placeholder="Ex: Jean Dupont"
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`title-${ref.id}`}>Titre / Fonction</Label>
                  <Input
                    id={`title-${ref.id}`}
                    value={ref.title}
                    onChange={(e) => updateReference(ref.id, 'title', e.target.value)}
                    placeholder="Ex: Directeur Marketing"
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`company-${ref.id}`}>Entreprise</Label>
                  <Input
                    id={`company-${ref.id}`}
                    value={ref.company}
                    onChange={(e) => updateReference(ref.id, 'company', e.target.value)}
                    placeholder="Ex: Société ABC"
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`relationship-${ref.id}`}>Relation</Label>
                  <Input
                    id={`relationship-${ref.id}`}
                    value={ref.relationship || ''}
                    onChange={(e) => updateReference(ref.id, 'relationship', e.target.value)}
                    placeholder="Ex: Ancien manager, Collègue..."
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`email-${ref.id}`}>Email</Label>
                  <Input
                    id={`email-${ref.id}`}
                    type="email"
                    value={ref.email || ''}
                    onChange={(e) => updateReference(ref.id, 'email', e.target.value)}
                    placeholder="jean.dupont@email.com"
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`phone-${ref.id}`}>Téléphone</Label>
                  <Input
                    id={`phone-${ref.id}`}
                    value={ref.phone || ''}
                    onChange={(e) => updateReference(ref.id, 'phone', e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>
              </div>
            </div>
          ))
        )}

        <p className="text-xs text-muted-foreground mt-4">
          Conseil: Assurez-vous d'avoir l'autorisation de vos références avant de les inclure sur votre CV.
        </p>
      </CardContent>
    </Card>
  );
}
