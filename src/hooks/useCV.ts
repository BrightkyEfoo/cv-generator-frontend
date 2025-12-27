import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cvApi } from '@/services/api';
import { useCallback, useRef } from 'react';
import type {
  CV,
  PersonalInfo,
  Experience,
  Education,
  Skill,
  Language,
  Certification,
  Project,
  Publication,
  Award,
  Volunteer,
  Interest,
  Reference,
  CustomSection,
  CVCustomization,
} from '@/types/cv';

// Hook to fetch CV by ID
export const useCV = (cvId?: string) => {
  return useQuery({
    queryKey: ['cv', cvId],
    queryFn: () => {
      if (!cvId) throw new Error('CV ID is required');
      return cvApi.getById(cvId);
    },
    enabled: !!cvId,
  });
};

// Hook to create a new CV
export const useCreateCV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cvApi.create,
    onSuccess: (data) => {
      queryClient.setQueryData(['cv', data.id], data);
    },
  });
};

// Generic auto-save hook - returns stable save function
const useAutoSave = <T>(
  mutationFn: (id: string, data: T) => Promise<CV>,
  cvId?: string
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: T }) => mutationFn(id, data),
    onSuccess: (data: CV) => {
      queryClient.setQueryData(['cv', cvId], data);
    },
  });

  // Use ref to get stable reference to mutate function
  const mutateRef = useRef(mutation.mutate);
  mutateRef.current = mutation.mutate;

  const save = useCallback(
    (data: T) => {
      if (!cvId) return;
      mutateRef.current({ id: cvId, data });
    },
    [cvId]
  );

  return { save, isPending: mutation.isPending };
};

// Specific auto-save hooks for each section
export const useUpdatePersonalInfo = (cvId?: string) =>
  useAutoSave<Partial<PersonalInfo>>(cvApi.updatePersonalInfo, cvId);

export const useUpdateSummary = (cvId?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, summary }: { id: string; summary: string }) =>
      cvApi.updateSummary(id, summary),
    onSuccess: (data) => {
      queryClient.setQueryData(['cv', cvId], data);
    },
  });

  const mutateRef = useRef(mutation.mutate);
  mutateRef.current = mutation.mutate;

  const save = useCallback(
    (summary: string) => {
      if (!cvId) return;
      mutateRef.current({ id: cvId, summary });
    },
    [cvId]
  );

  return { save, isPending: mutation.isPending };
};

export const useUpdateObjective = (cvId?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, objective }: { id: string; objective: string }) =>
      cvApi.updateObjective(id, objective),
    onSuccess: (data) => {
      queryClient.setQueryData(['cv', cvId], data);
    },
  });

  const mutateRef = useRef(mutation.mutate);
  mutateRef.current = mutation.mutate;

  const save = useCallback(
    (objective: string) => {
      if (!cvId) return;
      mutateRef.current({ id: cvId, objective });
    },
    [cvId]
  );

  return { save, isPending: mutation.isPending };
};

export const useUpdateExperiences = (cvId?: string) =>
  useAutoSave<Experience[]>(cvApi.updateExperiences, cvId);

export const useUpdateEducation = (cvId?: string) =>
  useAutoSave<Education[]>(cvApi.updateEducation, cvId);

export const useUpdateSkills = (cvId?: string) =>
  useAutoSave<Skill[]>(cvApi.updateSkills, cvId);

export const useUpdateLanguages = (cvId?: string) =>
  useAutoSave<Language[]>(cvApi.updateLanguages, cvId);

export const useUpdateCertifications = (cvId?: string) =>
  useAutoSave<Certification[]>(cvApi.updateCertifications, cvId);

export const useUpdateProjects = (cvId?: string) =>
  useAutoSave<Project[]>(cvApi.updateProjects, cvId);

export const useUpdatePublications = (cvId?: string) =>
  useAutoSave<Publication[]>(cvApi.updatePublications, cvId);

export const useUpdateAwards = (cvId?: string) =>
  useAutoSave<Award[]>(cvApi.updateAwards, cvId);

export const useUpdateVolunteer = (cvId?: string) =>
  useAutoSave<Volunteer[]>(cvApi.updateVolunteer, cvId);

export const useUpdateInterests = (cvId?: string) =>
  useAutoSave<Interest[]>(cvApi.updateInterests, cvId);

export const useUpdateReferences = (cvId?: string) =>
  useAutoSave<Reference[]>(cvApi.updateReferences, cvId);

export const useUpdateCustomSections = (cvId?: string) =>
  useAutoSave<CustomSection[]>(cvApi.updateCustomSections, cvId);

export const useUpdateCustomization = (cvId?: string) =>
  useAutoSave<Partial<CVCustomization>>(cvApi.updateCustomization, cvId);
