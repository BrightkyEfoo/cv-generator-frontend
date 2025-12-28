'use client';

import { useEffect, useState } from 'react';
import { adminCVsApi, getAdminToken } from '@/services/adminApi';
import type { CV } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Loader2, CheckCircle, XCircle, MoreHorizontal, Eye, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cv-generator.brightkyefoo.cm/api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'secret-api-key-please-changeme';

export default function AdminCVsPage() {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    try {
      const data = await adminCVsApi.getAll();
      setCvs(data);
    } catch (error) {
      console.error('Failed to fetch CVs:', error);
      toast.error('Erreur lors du chargement des CVs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCV = (cv: CV) => {
    setSelectedCV(cv);
    setIsDialogOpen(true);
  };

  const handleDownloadCV = async (cv: CV) => {
    setIsDownloading(cv.id);
    try {
      const token = getAdminToken();
      const response = await fetch(`${API_BASE_URL}/cv/${cv.id}/download`, {
        headers: {
          ...(API_KEY && { 'X-API-Key': API_KEY }),
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download CV');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV-${cv.personalInfo.firstName}-${cv.personalInfo.lastName}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('CV téléchargé');
    } catch (error) {
      console.error('Failed to download CV:', error);
      toast.error('Erreur lors du téléchargement');
    } finally {
      setIsDownloading(null);
    }
  };

  const handleDeleteCV = async (cv: CV) => {
    if (!confirm(`Supprimer le CV de ${cv.personalInfo.firstName} ${cv.personalInfo.lastName} ?`)) {
      return;
    }

    try {
      const token = getAdminToken();
      const response = await fetch(`${API_BASE_URL}/cv/${cv.id}`, {
        method: 'DELETE',
        headers: {
          ...(API_KEY && { 'X-API-Key': API_KEY }),
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete CV');
      }

      setCvs(cvs.filter(c => c.id !== cv.id));
      toast.success('CV supprimé');
    } catch (error) {
      console.error('Failed to delete CV:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const filteredCVs = cvs.filter((cv) => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`.toLowerCase();
    const email = cv.personalInfo.email?.toLowerCase() || '';
    return fullName.includes(searchLower) || email.includes(searchLower) || cv.title.toLowerCase().includes(searchLower);
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">CVs</h1>
        <p className="text-muted-foreground">
          Liste de tous les CVs créés sur la plateforme
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>
              {isLoading ? 'Chargement...' : `${filteredCVs.length} CV(s)`}
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredCVs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? 'Aucun CV trouvé' : 'Aucun CV créé'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Langue</TableHead>
                    <TableHead>Payé</TableHead>
                    <TableHead>Créé le</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCVs.map((cv) => (
                    <TableRow key={cv.id} className="cursor-pointer hover:bg-accent/50" onClick={() => handleViewCV(cv)}>
                      <TableCell className="font-medium">
                        {cv.personalInfo.firstName} {cv.personalInfo.lastName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {cv.personalInfo.email || '-'}
                      </TableCell>
                      <TableCell>{cv.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{cv.templateLanguage.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>
                        {cv.isPaid ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(cv.createdAt)}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewCV(cv)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadCV(cv)} disabled={isDownloading === cv.id}>
                              {isDownloading === cv.id ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4 mr-2" />
                              )}
                              Télécharger PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteCV(cv)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CV Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>
                CV de {selectedCV?.personalInfo.firstName} {selectedCV?.personalInfo.lastName}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedCV && handleDownloadCV(selectedCV)}
                  disabled={isDownloading === selectedCV?.id}
                >
                  {isDownloading === selectedCV?.id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Télécharger
                </Button>
              </div>
            </DialogTitle>
            <DialogDescription>
              Créé le {selectedCV && formatDate(selectedCV.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {selectedCV && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Preview */}
              <div className="order-1 md:order-2">
                <h3 className="font-semibold mb-3">Aperçu</h3>
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={`${API_BASE_URL}/cv/${selectedCV.id}/preview-image?t=${Date.now()}`}
                    alt="Aperçu du CV"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="order-2 md:order-1 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Informations personnelles</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Email:</span> {selectedCV.personalInfo.email}</p>
                    <p><span className="text-muted-foreground">Téléphone:</span> {selectedCV.personalInfo.phone || '-'}</p>
                    <p><span className="text-muted-foreground">Ville:</span> {selectedCV.personalInfo.city || '-'}</p>
                    <p><span className="text-muted-foreground">Titre:</span> {selectedCV.personalInfo.title || '-'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Statistiques</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-accent rounded">
                      <span className="text-muted-foreground">Expériences:</span>{' '}
                      <span className="font-medium">{selectedCV.experiences?.length || 0}</span>
                    </div>
                    <div className="p-2 bg-accent rounded">
                      <span className="text-muted-foreground">Formations:</span>{' '}
                      <span className="font-medium">{selectedCV.education?.length || 0}</span>
                    </div>
                    <div className="p-2 bg-accent rounded">
                      <span className="text-muted-foreground">Compétences:</span>{' '}
                      <span className="font-medium">{selectedCV.skills?.length || 0}</span>
                    </div>
                    <div className="p-2 bg-accent rounded">
                      <span className="text-muted-foreground">Projets:</span>{' '}
                      <span className="font-medium">{selectedCV.projects?.length || 0}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Métadonnées</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">ID:</span> <code className="text-xs bg-accent px-1 rounded">{selectedCV.id}</code></p>
                    <p><span className="text-muted-foreground">Template:</span> {selectedCV.customization?.templateId || '-'}</p>
                    <p><span className="text-muted-foreground">Langue:</span> {selectedCV.templateLanguage.toUpperCase()}</p>
                    <p>
                      <span className="text-muted-foreground">Statut:</span>{' '}
                      {selectedCV.isPaid ? (
                        <Badge className="bg-green-500">Payé</Badge>
                      ) : (
                        <Badge variant="outline">Non payé</Badge>
                      )}
                    </p>
                  </div>
                </div>

                {selectedCV.summary && (
                  <div>
                    <h3 className="font-semibold mb-2">Résumé</h3>
                    <p className="text-sm text-muted-foreground">{selectedCV.summary}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
