'use client';

import { useState } from 'react';
import type { Publication } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, BookOpen, X } from 'lucide-react';
import { useDebouncedSave } from '@/hooks/useDebouncedSave';
import { Badge } from '@/components/ui/badge';

interface PublicationsFormProps {
  data: Publication[];
  onSave: (data: Publication[]) => void;
}

export function PublicationsForm({ data, onSave }: PublicationsFormProps) {
  const [publications, setPublications] = useState<Publication[]>(data || []);
  const [newAuthor, setNewAuthor] = useState<{ [key: string]: string }>({});

  useDebouncedSave(publications, onSave, 1500);

  const addPublication = () => {
    const newPublication: Publication = {
      id: crypto.randomUUID(),
      title: '',
      publisher: '',
      date: '',
      url: '',
      description: '',
      authors: [],
    };
    setPublications([...publications, newPublication]);
  };

  const removePublication = (id: string) => {
    setPublications(publications.filter((pub) => pub.id !== id));
  };

  const updatePublication = (id: string, field: keyof Publication, value: string | string[]) => {
    setPublications(
      publications.map((pub) =>
        pub.id === id ? { ...pub, [field]: value } : pub
      )
    );
  };

  const addAuthor = (publicationId: string) => {
    const author = newAuthor[publicationId]?.trim();
    if (!author) return;

    const pub = publications.find((p) => p.id === publicationId);
    if (pub && !pub.authors?.includes(author)) {
      updatePublication(publicationId, 'authors', [...(pub.authors || []), author]);
    }
    setNewAuthor({ ...newAuthor, [publicationId]: '' });
  };

  const removeAuthor = (publicationId: string, author: string) => {
    const pub = publications.find((p) => p.id === publicationId);
    if (pub) {
      updatePublication(
        publicationId,
        'authors',
        pub.authors?.filter((a) => a !== author) || []
      );
    }
  };

  return (
    <Card className="border-border bg-cvBlack-lighter">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-cvOrange" />
          Publications
        </CardTitle>
        <Button onClick={addPublication} size="sm" className="bg-cvOrange hover:bg-cvOrange-dark">
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {publications.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Aucune publication ajoutée. Cliquez sur "Ajouter" pour commencer.
          </p>
        ) : (
          publications.map((pub, index) => (
            <div
              key={pub.id}
              className="p-4 rounded-lg border border-border bg-cvBlack space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Publication {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePublication(pub.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`title-${pub.id}`}>Titre de la publication</Label>
                  <Input
                    id={`title-${pub.id}`}
                    value={pub.title}
                    onChange={(e) => updatePublication(pub.id, 'title', e.target.value)}
                    placeholder="Ex: Impact de l'IA sur le marché du travail"
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`publisher-${pub.id}`}>Éditeur / Journal</Label>
                  <Input
                    id={`publisher-${pub.id}`}
                    value={pub.publisher}
                    onChange={(e) => updatePublication(pub.id, 'publisher', e.target.value)}
                    placeholder="Ex: Journal of AI Research"
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`date-${pub.id}`}>Date de publication</Label>
                  <Input
                    id={`date-${pub.id}`}
                    value={pub.date}
                    onChange={(e) => updatePublication(pub.id, 'date', e.target.value)}
                    placeholder="Ex: Mars 2024"
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`url-${pub.id}`}>URL (optionnel)</Label>
                  <Input
                    id={`url-${pub.id}`}
                    value={pub.url || ''}
                    onChange={(e) => updatePublication(pub.id, 'url', e.target.value)}
                    placeholder="https://doi.org/..."
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${pub.id}`}>Résumé (optionnel)</Label>
                <Textarea
                  id={`description-${pub.id}`}
                  value={pub.description || ''}
                  onChange={(e) => updatePublication(pub.id, 'description', e.target.value)}
                  placeholder="Brève description de la publication..."
                  className="bg-cvBlack-lighter border-border min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Co-auteurs</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {pub.authors?.map((author) => (
                    <Badge
                      key={author}
                      variant="secondary"
                      className="bg-cvBlue/20 text-cvBlue hover:bg-cvBlue/30"
                    >
                      {author}
                      <button
                        type="button"
                        onClick={() => removeAuthor(pub.id, author)}
                        className="ml-1 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newAuthor[pub.id] || ''}
                    onChange={(e) => setNewAuthor({ ...newAuthor, [pub.id]: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAuthor(pub.id))}
                    placeholder="Nom d'un co-auteur..."
                    className="bg-cvBlack-lighter border-border"
                  />
                  <Button
                    type="button"
                    onClick={() => addAuthor(pub.id)}
                    variant="outline"
                    className="border-cvBlue text-cvBlue hover:bg-cvBlue/10"
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
