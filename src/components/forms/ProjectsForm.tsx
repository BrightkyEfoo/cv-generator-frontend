'use client';

import { useState } from 'react';
import type { Project } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, FolderKanban, X } from 'lucide-react';
import { useDebouncedSave } from '@/hooks/useDebouncedSave';
import { Badge } from '@/components/ui/badge';

interface ProjectsFormProps {
  data: Project[];
  onSave: (data: Project[]) => void;
}

export function ProjectsForm({ data, onSave }: ProjectsFormProps) {
  const [projects, setProjects] = useState<Project[]>(data || []);
  const [newTech, setNewTech] = useState<{ [key: string]: string }>({});

  useDebouncedSave(projects, onSave, 1500);

  const addProject = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      url: '',
      technologies: [],
      startDate: '',
      endDate: '',
    };
    setProjects([...projects, newProject]);
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter((proj) => proj.id !== id));
  };

  const updateProject = (id: string, field: keyof Project, value: string | string[]) => {
    setProjects(
      projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    );
  };

  const addTechnology = (projectId: string) => {
    const tech = newTech[projectId]?.trim();
    if (!tech) return;

    const project = projects.find((p) => p.id === projectId);
    if (project && !project.technologies?.includes(tech)) {
      updateProject(projectId, 'technologies', [...(project.technologies || []), tech]);
    }
    setNewTech({ ...newTech, [projectId]: '' });
  };

  const removeTechnology = (projectId: string, tech: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(
        projectId,
        'technologies',
        project.technologies?.filter((t) => t !== tech) || []
      );
    }
  };

  return (
    <Card className="border-border bg-cvBlack-lighter">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground flex items-center gap-2">
          <FolderKanban className="h-5 w-5 text-cvOrange" />
          Projets
        </CardTitle>
        <Button onClick={addProject} size="sm" className="bg-cvOrange hover:bg-cvOrange-dark">
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Aucun projet ajoute. Cliquez sur "Ajouter" pour commencer.
          </p>
        ) : (
          projects.map((proj, index) => (
            <div
              key={proj.id}
              className="p-4 rounded-lg border border-border bg-cvBlack space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Projet {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(proj.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`name-${proj.id}`}>Nom du projet</Label>
                  <Input
                    id={`name-${proj.id}`}
                    value={proj.name}
                    onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                    placeholder="Ex: Application E-commerce"
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`url-${proj.id}`}>URL du projet (optionnel)</Label>
                  <Input
                    id={`url-${proj.id}`}
                    value={proj.url || ''}
                    onChange={(e) => updateProject(proj.id, 'url', e.target.value)}
                    placeholder="https://github.com/..."
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`startDate-${proj.id}`}>Date de debut</Label>
                  <Input
                    id={`startDate-${proj.id}`}
                    value={proj.startDate || ''}
                    onChange={(e) => updateProject(proj.id, 'startDate', e.target.value)}
                    placeholder="Ex: Janvier 2024"
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`endDate-${proj.id}`}>Date de fin (optionnel)</Label>
                  <Input
                    id={`endDate-${proj.id}`}
                    value={proj.endDate || ''}
                    onChange={(e) => updateProject(proj.id, 'endDate', e.target.value)}
                    placeholder="Ex: Mars 2024 ou En cours"
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${proj.id}`}>Description</Label>
                <Textarea
                  id={`description-${proj.id}`}
                  value={proj.description}
                  onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                  placeholder="Decrivez le projet, vos responsabilites et les resultats obtenus..."
                  className="bg-cvBlack-lighter border-border min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Technologies utilisees</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {proj.technologies?.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="bg-cvOrange/20 text-cvOrange hover:bg-cvOrange/30"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(proj.id, tech)}
                        className="ml-1 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTech[proj.id] || ''}
                    onChange={(e) => setNewTech({ ...newTech, [proj.id]: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology(proj.id))}
                    placeholder="Ex: React, Node.js, PostgreSQL..."
                    className="bg-cvBlack-lighter border-border"
                  />
                  <Button
                    type="button"
                    onClick={() => addTechnology(proj.id)}
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
