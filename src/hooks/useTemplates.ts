import { useQuery } from '@tanstack/react-query';
import { templatesApi } from '@/services/api';
import type { Template, TemplateCategory } from '@/types/cv';

export const useTemplates = () => {
  return useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const response = await templatesApi.getAll();
      // Handle both array response and { templates: [], total: number } response
      if (Array.isArray(response)) {
        return response;
      }
      return (response as { templates: Template[]; total: number }).templates;
    },
  });
};

export const useTemplate = (id?: string) => {
  return useQuery({
    queryKey: ['template', id],
    queryFn: () => {
      if (!id) throw new Error('Template ID is required');
      return templatesApi.getById(id);
    },
    enabled: !!id,
  });
};

export const useTemplatesByCategory = (category?: TemplateCategory) => {
  return useQuery({
    queryKey: ['templates', 'category', category],
    queryFn: () => {
      if (!category) throw new Error('Category is required');
      return templatesApi.getByCategory(category);
    },
    enabled: !!category,
  });
};
