'use client';

import { useEffect, useState } from 'react';
import { adminCVsApi } from '@/services/adminApi';
import type { CV } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function AdminCVsPage() {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const data = await adminCVsApi.getAll();
        setCvs(data);
      } catch (error) {
        console.error('Failed to fetch CVs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCVs();
  }, []);

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
                    <TableHead>Modifié le</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCVs.map((cv) => (
                    <TableRow key={cv.id}>
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
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(cv.updatedAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
