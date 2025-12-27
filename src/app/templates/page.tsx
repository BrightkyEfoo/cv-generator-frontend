'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { Button } from '@/components/ui/button';
import { useTemplates } from '@/hooks/useTemplates';
import { useCreateCV, useClearCVDraft } from '@/hooks/useCV';
import type { Template, TemplateCategory } from '@/types/cv';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const categories: { value: TemplateCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'professional', label: 'Professionnel' },
  { value: 'creative', label: 'Créatif' },
  { value: 'modern', label: 'Moderne' },
  { value: 'simple', label: 'Simple' },
  { value: 'academic', label: 'Académique' },
];

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const { data: templates, isLoading } = useTemplates();
  const createCV = useCreateCV();
  const clearDraft = useClearCVDraft();

  const filteredTemplates = templates?.filter(
    (template) => selectedCategory === 'all' || template.category === selectedCategory
  );

  const handleSelectTemplate = async (template: Template) => {
    try {
      // Clear any existing draft before creating new CV
      clearDraft();
      const cv = await createCV.mutateAsync({
        title: 'Mon CV',
        templateId: template.id,
      });
      toast.success('CV créé avec succès!');
      router.push(`/editor/${cv.id}`);
    } catch (error) {
      toast.error('Erreur lors de la création du CV');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-cvBlack">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Choisissez votre template
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Sélectionnez un template professionnel et commencez à créer votre CV en quelques minutes
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.value)}
              className={
                selectedCategory === category.value
                  ? 'bg-cvOrange hover:bg-cvOrange-dark'
                  : 'border-border hover:bg-cvOrange/10'
              }
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-cvOrange" />
          </div>
        ) : filteredTemplates && filteredTemplates.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={handleSelectTemplate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Aucun template disponible pour cette catégorie</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
