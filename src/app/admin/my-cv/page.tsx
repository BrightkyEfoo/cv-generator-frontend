'use client';

import { useEffect, useState } from 'react';
import { adminPersonalCVApi } from '@/services/adminApi';
import type { CV } from '@/types/cv';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Save, Loader2, User, Briefcase, GraduationCap, Code, Languages, FolderOpen, Eye, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cv-generator.brightkyefoo.cm/api';

export default function MyCV() {
  const [cv, setCV] = useState<CV | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    loadCV();
  }, []);

  const loadCV = async () => {
    try {
      const data = await adminPersonalCVApi.get();
      setCV(data);
      // Load preview after CV is loaded
      if (data?.id) {
        loadPreview(data.id);
      }
    } catch (error) {
      console.error('Failed to load CV:', error);
      toast.error('Erreur lors du chargement du CV');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPreview = async (cvId: string) => {
    setIsLoadingPreview(true);
    try {
      setPreviewUrl(`${API_BASE_URL}/cv/${cvId}/preview-image?t=${Date.now()}`);
    } catch (error) {
      console.error('Failed to load preview:', error);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const refreshPreview = () => {
    if (cv?.id) {
      setPreviewKey(prev => prev + 1);
      setPreviewUrl(`${API_BASE_URL}/cv/${cv.id}/preview-image?t=${Date.now()}`);
      toast.success('Aperçu mis à jour');
    }
  };

  const handleSave = async () => {
    if (!cv) return;
    setIsSaving(true);
    try {
      const updated = await adminPersonalCVApi.update(cv);
      setCV(updated);
      toast.success('CV sauvegardé avec succès');
    } catch (error) {
      console.error('Failed to save CV:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async (format: 'pdf' | 'png' = 'pdf') => {
    setIsDownloading(true);
    try {
      const blob = await adminPersonalCVApi.download(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV-Brightman-EFOO.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('CV téléchargé avec succès');
    } catch (error) {
      console.error('Failed to download CV:', error);
      toast.error('Erreur lors du téléchargement');
    } finally {
      setIsDownloading(false);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    if (!cv) return;
    setCV({
      ...cv,
      personalInfo: { ...cv.personalInfo, [field]: value },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-cvOrange" />
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">CV non trouvé</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mon CV</h1>
          <p className="text-muted-foreground">
            Gérez votre CV personnel avec le template Bright OS
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleDownload('pdf')} disabled={isDownloading}>
            {isDownloading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Télécharger PDF
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-cvOrange hover:bg-cvOrange/90">
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Sauvegarder
          </Button>
        </div>
      </div>

      <Tabs defaultValue="preview" className="space-y-6">
        <TabsList className="grid grid-cols-7 w-full max-w-3xl">
          <TabsTrigger value="preview" className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Aperçu</span>
          </TabsTrigger>
          <TabsTrigger value="personal" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Personnel</span>
          </TabsTrigger>
          <TabsTrigger value="experience" className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Expériences</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-1">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Formation</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-1">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Compétences</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-1">
            <FolderOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Projets</span>
          </TabsTrigger>
          <TabsTrigger value="languages" className="flex items-center gap-1">
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">Langues</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Aperçu du CV
                  </CardTitle>
                  <CardDescription>Prévisualisation de votre CV avec le template Bright OS</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={refreshPreview}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Rafraîchir
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                {isLoadingPreview ? (
                  <div className="flex items-center justify-center h-[600px]">
                    <Loader2 className="h-8 w-8 animate-spin text-cvOrange" />
                  </div>
                ) : previewUrl ? (
                  <div className="border rounded-lg overflow-hidden shadow-lg max-w-[600px]">
                    <img
                      key={previewKey}
                      src={previewUrl}
                      alt="Aperçu du CV"
                      className="w-full h-auto"
                      onError={() => {
                        console.error('Failed to load preview image');
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    Aucun aperçu disponible
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations personnelles
              </CardTitle>
              <CardDescription>Vos coordonnées et informations de contact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={cv.personalInfo.firstName}
                    onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={cv.personalInfo.lastName}
                    onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Titre professionnel</Label>
                <Input
                  id="title"
                  value={cv.personalInfo.title || ''}
                  onChange={(e) => updatePersonalInfo('title', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={cv.personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={cv.personalInfo.phone || ''}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={cv.personalInfo.city || ''}
                    onChange={(e) => updatePersonalInfo('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Pays</Label>
                  <Input
                    id="country"
                    value={cv.personalInfo.country || ''}
                    onChange={(e) => updatePersonalInfo('country', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Résumé professionnel</Label>
                <Textarea
                  id="summary"
                  rows={4}
                  value={cv.summary || ''}
                  onChange={(e) => setCV({ ...cv, summary: e.target.value })}
                  placeholder="Un bref résumé de votre profil professionnel..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Expériences professionnelles
              </CardTitle>
              <CardDescription>{cv.experiences?.length || 0} expérience(s)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cv.experiences?.map((exp) => (
                <div key={exp.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{exp.jobTitle}</h4>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {exp.startDate} - {exp.current ? 'Présent' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-sm">{exp.description}</p>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Formation
              </CardTitle>
              <CardDescription>{cv.education?.length || 0} formation(s)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cv.education?.map((edu) => (
                <div key={edu.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{edu.degree}</h4>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {edu.startDate} - {edu.endDate || 'Présent'}
                    </span>
                  </div>
                  {edu.field && <p className="text-sm">Domaine: {edu.field}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Compétences
              </CardTitle>
              <CardDescription>{cv.skills?.length || 0} compétence(s)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {cv.skills?.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1.5 bg-cvOrange/10 text-cvOrange text-sm rounded-full"
                  >
                    {skill.name}
                    {skill.level && <span className="text-xs ml-1 opacity-70">({skill.level})</span>}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Projets
              </CardTitle>
              <CardDescription>{cv.projects?.length || 0} projet(s)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cv.projects?.map((project) => (
                <div key={project.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold">{project.name}</h4>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cvOrange hover:underline text-sm"
                      >
                        Voir le projet
                      </a>
                    )}
                  </div>
                  <p className="text-sm">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 bg-accent text-xs rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="languages">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Langues
              </CardTitle>
              <CardDescription>{cv.languages?.length || 0} langue(s)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cv.languages?.map((lang) => (
                  <div key={lang.id} className="p-4 border rounded-lg text-center">
                    <h4 className="font-semibold">{lang.name}</h4>
                    <p className="text-sm text-muted-foreground capitalize">{lang.proficiency}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
