'use client';

import { useState } from 'react';
import type { Certification } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Award } from 'lucide-react';
import { useDebouncedSave } from '@/hooks/useDebouncedSave';

interface CertificationsFormProps {
  data: Certification[];
  onSave: (data: Certification[]) => void;
}

export function CertificationsForm({ data, onSave }: CertificationsFormProps) {
  const [certifications, setCertifications] = useState<Certification[]>(data || []);

  useDebouncedSave(certifications, onSave, 1500);

  const addCertification = () => {
    const newCertification: Certification = {
      id: crypto.randomUUID(),
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      url: '',
    };
    setCertifications([...certifications, newCertification]);
  };

  const removeCertification = (id: string) => {
    setCertifications(certifications.filter((cert) => cert.id !== id));
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    setCertifications(
      certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    );
  };

  return (
    <Card className="border-border bg-cvBlack-lighter">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground flex items-center gap-2">
          <Award className="h-5 w-5 text-cvOrange" />
          Certifications
        </CardTitle>
        <Button onClick={addCertification} size="sm" className="bg-cvOrange hover:bg-cvOrange-dark">
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {certifications.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Aucune certification ajoutee. Cliquez sur "Ajouter" pour commencer.
          </p>
        ) : (
          certifications.map((cert, index) => (
            <div
              key={cert.id}
              className="p-4 rounded-lg border border-border bg-cvBlack space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Certification {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCertification(cert.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`name-${cert.id}`}>Nom de la certification</Label>
                  <Input
                    id={`name-${cert.id}`}
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                    placeholder="Ex: AWS Solutions Architect"
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`issuer-${cert.id}`}>Organisme</Label>
                  <Input
                    id={`issuer-${cert.id}`}
                    value={cert.issuer}
                    onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                    placeholder="Ex: Amazon Web Services"
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`issueDate-${cert.id}`}>Date d'obtention</Label>
                  <Input
                    id={`issueDate-${cert.id}`}
                    value={cert.issueDate}
                    onChange={(e) => updateCertification(cert.id, 'issueDate', e.target.value)}
                    placeholder="Ex: Janvier 2024"
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`expiryDate-${cert.id}`}>Date d'expiration (optionnel)</Label>
                  <Input
                    id={`expiryDate-${cert.id}`}
                    value={cert.expiryDate || ''}
                    onChange={(e) => updateCertification(cert.id, 'expiryDate', e.target.value)}
                    placeholder="Ex: Janvier 2027"
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`credentialId-${cert.id}`}>ID de la certification (optionnel)</Label>
                  <Input
                    id={`credentialId-${cert.id}`}
                    value={cert.credentialId || ''}
                    onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                    placeholder="Ex: ABC123XYZ"
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`url-${cert.id}`}>URL de verification (optionnel)</Label>
                  <Input
                    id={`url-${cert.id}`}
                    value={cert.url || ''}
                    onChange={(e) => updateCertification(cert.id, 'url', e.target.value)}
                    placeholder="https://..."
                    className="bg-cvBlack-lighter border-border"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
