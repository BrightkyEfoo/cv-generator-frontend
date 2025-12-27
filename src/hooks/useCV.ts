import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cvApi } from '@/services/api';
import { useCallback, useRef } from 'react';
import { getCVDraft, updateCVDraftSection, clearCVDraft } from '@/services/cvPersistence';
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

// Hook to fetch CV by ID and merge with local draft
export const useCV = (cvId?: string) => {
  return useQuery({
    queryKey: ['cv', cvId],
    queryFn: async () => {
      if (!cvId) throw new Error('CV ID is required');
      const serverData = await cvApi.getById(cvId);

      // Check for local draft and merge if exists
      const localDraft = getCVDraft(cvId);
      if (localDraft) {
        // Merge local draft with server data (local takes priority for edited fields)
        return {
          ...serverData,
          ...localDraft,
          // Always keep server metadata
          id: serverData.id,
          createdAt: serverData.createdAt,
          updatedAt: serverData.updatedAt,
          isPaid: serverData.isPaid,
        } as CV;
      }

      return serverData;
    },
    enabled: !!cvId,
  });
};

// Hook to clear local draft (call when starting a new CV)
export const useClearCVDraft = () => {
  return useCallback(() => {
    clearCVDraft();
  }, []);
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

// Generic auto-save hook - returns stable save function with local persistence
const useAutoSave = <T, K extends keyof CV>(
  mutationFn: (id: string, data: T) => Promise<CV>,
  cvId?: string,
  sectionKey?: K
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: T }) => mutationFn(id, data),
    onSuccess: (data: CV) => {
      queryClient.setQueryData(['cv', cvId], data);
      // Clear local draft for this section after successful save to server
      // (the server now has the latest data)
    },
  });

  // Use ref to get stable reference to mutate function
  const mutateRef = useRef(mutation.mutate);
  mutateRef.current = mutation.mutate;

  const save = useCallback(
    (data: T) => {
      if (!cvId) return;
      // Save to localStorage immediately for persistence
      if (sectionKey) {
        updateCVDraftSection(cvId, sectionKey, data as CV[K]);
      }
      mutateRef.current({ id: cvId, data });
    },
    [cvId, sectionKey]
  );

  return { save, isPending: mutation.isPending };
};

// Specific auto-save hooks for each section with local persistence
export const useUpdatePersonalInfo = (cvId?: string) =>
  useAutoSave<Partial<PersonalInfo>, 'personalInfo'>(cvApi.updatePersonalInfo, cvId, 'personalInfo');

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
      // Save to localStorage for persistence
      updateCVDraftSection(cvId, 'summary', summary);
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
      // Save to localStorage for persistence
      updateCVDraftSection(cvId, 'objective', objective);
      mutateRef.current({ id: cvId, objective });
    },
    [cvId]
  );

  return { save, isPending: mutation.isPending };
};

export const useUpdateExperiences = (cvId?: string) =>
  useAutoSave<Experience[], 'experiences'>(cvApi.updateExperiences, cvId, 'experiences');

export const useUpdateEducation = (cvId?: string) =>
  useAutoSave<Education[], 'education'>(cvApi.updateEducation, cvId, 'education');

export const useUpdateSkills = (cvId?: string) =>
  useAutoSave<Skill[], 'skills'>(cvApi.updateSkills, cvId, 'skills');

export const useUpdateLanguages = (cvId?: string) =>
  useAutoSave<Language[], 'languages'>(cvApi.updateLanguages, cvId, 'languages');

export const useUpdateCertifications = (cvId?: string) =>
  useAutoSave<Certification[], 'certifications'>(cvApi.updateCertifications, cvId, 'certifications');

export const useUpdateProjects = (cvId?: string) =>
  useAutoSave<Project[], 'projects'>(cvApi.updateProjects, cvId, 'projects');

export const useUpdatePublications = (cvId?: string) =>
  useAutoSave<Publication[], 'publications'>(cvApi.updatePublications, cvId, 'publications');

export const useUpdateAwards = (cvId?: string) =>
  useAutoSave<Award[], 'awards'>(cvApi.updateAwards, cvId, 'awards');

export const useUpdateVolunteer = (cvId?: string) =>
  useAutoSave<Volunteer[], 'volunteer'>(cvApi.updateVolunteer, cvId, 'volunteer');

export const useUpdateInterests = (cvId?: string) =>
  useAutoSave<Interest[], 'interests'>(cvApi.updateInterests, cvId, 'interests');

export const useUpdateReferences = (cvId?: string) =>
  useAutoSave<Reference[], 'references'>(cvApi.updateReferences, cvId, 'references');

export const useUpdateCustomSections = (cvId?: string) =>
  useAutoSave<CustomSection[], 'customSections'>(cvApi.updateCustomSections, cvId, 'customSections');

export const useUpdateCustomization = (cvId?: string) =>
  useAutoSave<Partial<CVCustomization>, 'customization'>(cvApi.updateCustomization, cvId, 'customization');
