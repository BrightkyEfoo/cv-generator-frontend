'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { adminTemplatesApi } from '@/services/adminApi';
import { getAssetUrl } from '@/services/api';
import type { AdminTemplate } from '@/types/admin';
import { Plus, RefreshCw, Trash2, Eye, Code } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<AdminTemplate | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'code' | null>(null);
  const [regenerating, setRegenerating] = useState<string | null>(null);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const data = await adminTemplatesApi.getAll();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleRegeneratePreview = async (id: string) => {
    setRegenerating(id);
    try {
      await adminTemplatesApi.regeneratePreview(id);
      await fetchTemplates();
    } catch (error) {
      console.error('Error regenerating preview:', error);
    } finally {
      setRegenerating(null);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir désactiver ce template?')) return;
    try {
      await adminTemplatesApi.deactivate(id);
      await fetchTemplates();
    } catch (error) {
      console.error('Error deactivating template:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cvOrange" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="text-muted-foreground">
            Gérez les templates de CV disponibles
          </p>
        </div>
        <Button className="bg-cvOrange hover:bg-cvOrange-dark">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            {/* Preview Image */}
            <div className="relative aspect-[3/4] bg-muted">
              {template.previewUrl ? (
                <Image
                  src={getAssetUrl(template.previewUrl)}
                  alt={template.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Pas de preview
                </div>
              )}
            </div>

            {/* Template Info */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold">{template.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {template.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cvOrange/10 text-cvOrange">
                  {template.category}
                </span>
                {template.availableLanguages?.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 uppercase"
                  >
                    {lang}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setSelectedTemplate(template);
                    setViewMode('preview');
                  }}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setSelectedTemplate(template);
                    setViewMode('code');
                  }}
                >
                  <Code className="h-3 w-3 mr-1" />
                  Code
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRegeneratePreview(template.id)}
                  disabled={regenerating === template.id}
                >
                  <RefreshCw
                    className={`h-3 w-3 ${regenerating === template.id ? 'animate-spin' : ''}`}
                  />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                  onClick={() => handleDeactivate(template.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun template disponible</p>
        </div>
      )}

      {/* Preview/Code Dialog */}
      <Dialog
        open={!!selectedTemplate && !!viewMode}
        onOpenChange={() => {
          setSelectedTemplate(null);
          setViewMode(null);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate?.name} -{' '}
              {viewMode === 'preview' ? 'Preview' : 'Edge Code'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {viewMode === 'preview' && selectedTemplate?.previewUrl && (
              <div className="relative w-full min-h-[600px]">
                <Image
                  src={getAssetUrl(selectedTemplate.previewUrl)}
                  alt={selectedTemplate.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            {viewMode === 'code' && selectedTemplate?.edgeCodes && (
              <div className="space-y-4">
                {Object.entries(selectedTemplate.edgeCodes).map(([lang, code]) => (
                  <div key={lang}>
                    <h4 className="font-medium mb-2 uppercase text-sm text-muted-foreground">
                      {lang}
                    </h4>
                    <pre className="bg-cvBlack p-4 rounded-lg overflow-x-auto text-xs">
                      <code>{code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
