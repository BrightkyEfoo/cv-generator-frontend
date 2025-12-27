'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';
import { useDebouncedSave } from '@/hooks/useDebouncedSave';

interface SummaryFormProps {
  summary: string;
  objective: string;
  onSaveSummary: (summary: string) => void;
  onSaveObjective: (objective: string) => void;
}

export function SummaryForm({ summary, objective, onSaveSummary, onSaveObjective }: SummaryFormProps) {
  const [localSummary, setLocalSummary] = useState(summary || '');
  const [localObjective, setLocalObjective] = useState(objective || '');

  useDebouncedSave(localSummary, onSaveSummary, 1500);
  useDebouncedSave(localObjective, onSaveObjective, 1500);

  return (
    <Card className="border-border bg-cvBlack-lighter">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5 text-cvOrange" />
          Résumé & Objectif
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="summary">Résumé professionnel</Label>
          <Textarea
            id="summary"
            value={localSummary}
            onChange={(e) => setLocalSummary(e.target.value)}
            placeholder="Décrivez brièvement votre parcours professionnel, vos compétences clés et ce qui vous distingue..."
            className="bg-cvBlack-lighter border-border min-h-[150px]"
          />
          <p className="text-xs text-muted-foreground">
            Un résumé efficace met en avant vos principales réalisations et compétences en 3-5 phrases.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="objective">Objectif de carrière (optionnel)</Label>
          <Textarea
            id="objective"
            value={localObjective}
            onChange={(e) => setLocalObjective(e.target.value)}
            placeholder="Décrivez vos objectifs professionnels et le type de poste que vous recherchez..."
            className="bg-cvBlack-lighter border-border min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground">
            L'objectif de carrière est particulièrement utile pour les jeunes diplômés ou lors d'une reconversion.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
