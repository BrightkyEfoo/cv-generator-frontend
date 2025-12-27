'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Skill, SkillLevel } from '@/types/cv';
import { useDebouncedSave } from '@/hooks/useDebouncedSave';

interface SkillsFormProps {
  data: Skill[];
  onSave: (data: Skill[]) => void;
}

export function SkillsForm({ data, onSave }: SkillsFormProps) {
  const [skills, setSkills] = useState<Skill[]>(data);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('intermediate');

  useDebouncedSave(skills, onSave, 1500);

  const addSkill = () => {
    if (!newSkillName.trim()) return;

    const newSkill: Skill = {
      id: crypto.randomUUID(),
      name: newSkillName.trim(),
      category: newSkillCategory.trim() || undefined,
      level: newSkillLevel,
    };
    setSkills([...skills, newSkill]);
    setNewSkillName('');
    setNewSkillCategory('');
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter((skill) => skill.id !== id));
  };

  const updateSkillLevel = (id: string, level: SkillLevel) => {
    setSkills(
      skills.map((skill) =>
        skill.id === id ? { ...skill, level } : skill
      )
    );
  };

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Général';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const levelLabels: Record<SkillLevel, string> = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé',
    expert: 'Expert',
  };

  const levelColors: Record<SkillLevel, string> = {
    beginner: 'bg-gray-500',
    intermediate: 'bg-cvBlue',
    advanced: 'bg-cvOrange',
    expert: 'bg-green-500',
  };

  return (
    <Card className="border-border bg-cvBlack-lighter">
      <CardHeader>
        <CardTitle className="text-foreground">Compétences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new skill */}
        <div className="space-y-4 p-4 border border-border rounded-lg bg-cvBlack">
          <h3 className="font-medium text-foreground">Ajouter une compétence</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="skillName">Nom de la compétence *</Label>
              <Input
                id="skillName"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="bg-cvBlack-lighter border-border"
                placeholder="Ex: JavaScript, Design UI/UX..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skillCategory">Catégorie (optionnel)</Label>
              <Input
                id="skillCategory"
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value)}
                className="bg-cvBlack-lighter border-border"
                placeholder="Ex: Langages, Frameworks..."
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="skillLevel">Niveau</Label>
              <Select value={newSkillLevel} onValueChange={(value) => setNewSkillLevel(value as SkillLevel)}>
                <SelectTrigger className="bg-cvBlack-lighter border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Débutant</SelectItem>
                  <SelectItem value="intermediate">Intermédiaire</SelectItem>
                  <SelectItem value="advanced">Avancé</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={addSkill}
                className="bg-cvOrange hover:bg-cvOrange-dark w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </div>
          </div>
        </div>

        {/* Skills list grouped by category */}
        {skills.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Aucune compétence ajoutée. Ajoutez vos compétences ci-dessus.
          </p>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category} className="space-y-3">
                <h3 className="font-semibold text-foreground text-sm">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <Badge
                      key={skill.id}
                      className={`${levelColors[skill.level || 'intermediate']} text-white flex items-center gap-2 px-3 py-1.5`}
                    >
                      <span>{skill.name}</span>
                      {skill.level && (
                        <span className="text-xs opacity-75">
                          ({levelLabels[skill.level]})
                        </span>
                      )}
                      <button
                        onClick={() => removeSkill(skill.id)}
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
