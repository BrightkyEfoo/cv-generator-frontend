'use client';

import { useState } from 'react';
import type { Volunteer } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, HeartHandshake, X } from 'lucide-react';
import { useDebouncedSave } from '@/hooks/useDebouncedSave';
import { Badge } from '@/components/ui/badge';

interface VolunteerFormProps {
  data: Volunteer[];
  onSave: (data: Volunteer[]) => void;
}

export function VolunteerForm({ data, onSave }: VolunteerFormProps) {
  const [volunteer, setVolunteer] = useState<Volunteer[]>(data || []);
  const [newHighlight, setNewHighlight] = useState<{ [key: string]: string }>({});

  useDebouncedSave(volunteer, onSave, 1500);

  const addVolunteer = () => {
    const newItem: Volunteer = {
      id: crypto.randomUUID(),
      organization: '',
      role: '',
      cause: '',
      startDate: '',
      endDate: '',
      description: '',
      highlights: [],
    };
    setVolunteer([...volunteer, newItem]);
  };

  const removeVolunteer = (id: string) => {
    setVolunteer(volunteer.filter((item) => item.id !== id));
  };

  const updateVolunteer = (id: string, field: keyof Volunteer, value: string | string[]) => {
    setVolunteer(
      volunteer.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addHighlight = (volunteerId: string) => {
    const highlight = newHighlight[volunteerId]?.trim();
    if (!highlight) return;

    const item = volunteer.find((v) => v.id === volunteerId);
    if (item && !item.highlights?.includes(highlight)) {
      updateVolunteer(volunteerId, 'highlights', [...(item.highlights || []), highlight]);
    }
    setNewHighlight({ ...newHighlight, [volunteerId]: '' });
  };

  const removeHighlight = (volunteerId: string, highlight: string) => {
    const item = volunteer.find((v) => v.id === volunteerId);
    if (item) {
      updateVolunteer(
        volunteerId,
        'highlights',
        item.highlights?.filter((h) => h !== highlight) || []
      );
    }
  };

  return (
    <Card className="border-border bg-cvBlack-lighter">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground flex items-center gap-2">
          <HeartHandshake className="h-5 w-5 text-cvOrange" />
          Bénévolat
        </CardTitle>
        <Button onClick={addVolunteer} size="sm" className="bg-cvOrange hover:bg-cvOrange-dark">
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {volunteer.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Aucune expérience bénévole ajoutée. Cliquez sur "Ajouter" pour commencer.
          </p>
        ) : (
          volunteer.map((item, index) => (
            <div
              key={item.id}
              className="p-4 rounded-lg border border-border bg-cvBlack space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Expérience {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVolunteer(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`organization-${item.id}`}>Organisation</Label>
                  <Input
                    id={`organization-${item.id}`}
                    value={item.organization}
                    onChange={(e) => updateVolunteer(item.id, 'organization', e.target.value)}
                    placeholder="Ex: Croix-Rouge française"
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`role-${item.id}`}>Rôle</Label>
                  <Input
                    id={`role-${item.id}`}
                    value={item.role}
                    onChange={(e) => updateVolunteer(item.id, 'role', e.target.value)}
                    placeholder="Ex: Bénévole, Coordinateur..."
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`cause-${item.id}`}>Cause (optionnel)</Label>
                  <Input
                    id={`cause-${item.id}`}
                    value={item.cause || ''}
                    onChange={(e) => updateVolunteer(item.id, 'cause', e.target.value)}
                    placeholder="Ex: Aide humanitaire, Environnement..."
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`startDate-${item.id}`}>Date de début</Label>
                  <Input
                    id={`startDate-${item.id}`}
                    value={item.startDate}
                    onChange={(e) => updateVolunteer(item.id, 'startDate', e.target.value)}
                    placeholder="Ex: Janvier 2022"
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`endDate-${item.id}`}>Date de fin (optionnel)</Label>
                  <Input
                    id={`endDate-${item.id}`}
                    value={item.endDate || ''}
                    onChange={(e) => updateVolunteer(item.id, 'endDate', e.target.value)}
                    placeholder="Ex: Décembre 2023 ou En cours"
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${item.id}`}>Description</Label>
                <Textarea
                  id={`description-${item.id}`}
                  value={item.description || ''}
                  onChange={(e) => updateVolunteer(item.id, 'description', e.target.value)}
                  placeholder="Décrivez vos responsabilités et votre impact..."
                  className="bg-cvBlack-lighter border-border min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Réalisations clés</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {item.highlights?.map((highlight) => (
                    <Badge
                      key={highlight}
                      variant="secondary"
                      className="bg-cvOrange/20 text-cvOrange hover:bg-cvOrange/30"
                    >
                      {highlight}
                      <button
                        type="button"
                        onClick={() => removeHighlight(item.id, highlight)}
                        className="ml-1 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newHighlight[item.id] || ''}
                    onChange={(e) => setNewHighlight({ ...newHighlight, [item.id]: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight(item.id))}
                    placeholder="Ex: Organisation d'événements, Collecte de fonds..."
                    className="bg-cvBlack-lighter border-border"
                  />
                  <Button
                    type="button"
                    onClick={() => addHighlight(item.id)}
                    variant="outline"
                    className="border-cvOrange text-cvOrange hover:bg-cvOrange/10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
