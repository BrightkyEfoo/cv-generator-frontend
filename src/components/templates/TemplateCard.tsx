'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Template } from '@/types/cv';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { getAssetUrl, templatesApi } from '@/services/api';

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const categoryColors = {
    professional: 'bg-cvBlue text-white',
    creative: 'bg-purple-500 text-white',
    modern: 'bg-cvOrange text-white',
    simple: 'bg-gray-500 text-white',
    academic: 'bg-green-500 text-white',
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden border-border bg-cvBlack-lighter hover:border-cvOrange/50 transition-colors h-full flex flex-col">
        <div className="relative aspect-[3/4] bg-muted">
          <Image
            src={template.previewUrl ? getAssetUrl(template.previewUrl) : templatesApi.getPreviewImage(template.id)}
            alt={template.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
          <div className="absolute top-2 right-2">
            <Badge className={categoryColors[template.category]}>
              {template.category}
            </Badge>
          </div>
        </div>
        <CardHeader>
          <CardTitle className="text-foreground">{template.name}</CardTitle>
          <CardDescription>{template.description}</CardDescription>
        </CardHeader>
        <CardContent className="mt-auto">
          <Button
            onClick={() => onSelect(template)}
            className="w-full bg-cvOrange hover:bg-cvOrange-dark"
          >
            Utiliser ce template
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
