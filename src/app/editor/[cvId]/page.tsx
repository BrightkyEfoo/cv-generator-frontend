'use client';

import { useParams, useRouter } from 'next/navigation';
import type { PersonalInfo, Experience, Education, Skill, Language, Certification, Project, Publication, Award, Volunteer, Interest, Reference } from '@/types/cv';
import {
  useCV,
  useUpdatePersonalInfo,
  useUpdateSummary,
  useUpdateObjective,
  useUpdateExperiences,
  useUpdateEducation,
  useUpdateSkills,
  useUpdateLanguages,
  useUpdateCertifications,
  useUpdateProjects,
  useUpdatePublications,
  useUpdateAwards,
  useUpdateVolunteer,
  useUpdateInterests,
  useUpdateReferences,
} from '@/hooks/useCV';
import { Header } from '@/components/layout/Header';
import { CVPreview } from '@/components/preview/CVPreview';
import { PersonalInfoForm } from '@/components/forms/PersonalInfoForm';
import { ExperiencesForm } from '@/components/forms/ExperiencesForm';
import { EducationForm } from '@/components/forms/EducationForm';
import { SkillsForm } from '@/components/forms/SkillsForm';
import { LanguagesForm } from '@/components/forms/LanguagesForm';
import { CertificationsForm } from '@/components/forms/CertificationsForm';
import { ProjectsForm } from '@/components/forms/ProjectsForm';
import { SummaryForm } from '@/components/forms/SummaryForm';
import { InterestsForm } from '@/components/forms/InterestsForm';
import { AwardsForm } from '@/components/forms/AwardsForm';
import { VolunteerForm } from '@/components/forms/VolunteerForm';
import { ReferencesForm } from '@/components/forms/ReferencesForm';
import { PublicationsForm } from '@/components/forms/PublicationsForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cvApi } from '@/services/api';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const cvId = params.cvId as string;

  const { data: cv, isLoading } = useCV(cvId);

  // All update hooks
  const updatePersonalInfo = useUpdatePersonalInfo(cvId);
  const updateSummary = useUpdateSummary(cvId);
  const updateObjective = useUpdateObjective(cvId);
  const updateExperiences = useUpdateExperiences(cvId);
  const updateEducation = useUpdateEducation(cvId);
  const updateSkills = useUpdateSkills(cvId);
  const updateLanguages = useUpdateLanguages(cvId);
  const updateCertifications = useUpdateCertifications(cvId);
  const updateProjects = useUpdateProjects(cvId);
  const updatePublications = useUpdatePublications(cvId);
  const updateAwards = useUpdateAwards(cvId);
  const updateVolunteer = useUpdateVolunteer(cvId);
  const updateInterests = useUpdateInterests(cvId);
  const updateReferences = useUpdateReferences(cvId);

  // Check if any mutation is pending
  const isSaving =
    updatePersonalInfo.isPending ||
    updateSummary.isPending ||
    updateObjective.isPending ||
    updateExperiences.isPending ||
    updateEducation.isPending ||
    updateSkills.isPending ||
    updateLanguages.isPending ||
    updateCertifications.isPending ||
    updateProjects.isPending ||
    updatePublications.isPending ||
    updateAwards.isPending ||
    updateVolunteer.isPending ||
    updateInterests.isPending ||
    updateReferences.isPending;

  const handleDownload = () => {
    if (!cv) return;
    if (cv.isPaid) {
      window.open(cvApi.getDownload(cv.id), '_blank');
    } else {
      router.push(`/checkout/${cv.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cvBlack flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cvOrange" />
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="min-h-screen bg-cvBlack flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">CV non trouvé</h1>
          <p className="text-muted-foreground">Le CV que vous recherchez n&apos;existe pas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cvBlack">
      <Header />

      {/* Save indicator */}
      {isSaving && (
        <div className="fixed top-20 right-4 z-50">
          <Badge className="bg-cvOrange flex items-center gap-2">
            <Save className="h-3 w-3 animate-pulse" />
            Enregistrement...
          </Badge>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Section - Left Side */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-foreground mb-6">{cv.title}</h1>

            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-cvBlack-lighter">
                <TabsTrigger value="personal">Personnel</TabsTrigger>
                <TabsTrigger value="summary">Résumé</TabsTrigger>
                <TabsTrigger value="experiences">Expériences</TabsTrigger>
                <TabsTrigger value="education">Formation</TabsTrigger>
                <TabsTrigger value="skills">Compétences</TabsTrigger>
                <TabsTrigger value="languages">Langues</TabsTrigger>
                <TabsTrigger value="certifications">Certifications</TabsTrigger>
                <TabsTrigger value="more">Plus</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" keepMounted>
                <PersonalInfoForm
                  data={cv.personalInfo}
                  onSave={updatePersonalInfo.save}
                />
              </TabsContent>

              <TabsContent value="summary" keepMounted>
                <SummaryForm
                  summary={cv.summary || ''}
                  objective={cv.objective || ''}
                  onSaveSummary={updateSummary.save}
                  onSaveObjective={updateObjective.save}
                />
              </TabsContent>

              <TabsContent value="experiences" keepMounted>
                <ExperiencesForm
                  data={cv.experiences}
                  onSave={updateExperiences.save}
                />
              </TabsContent>

              <TabsContent value="education" keepMounted>
                <EducationForm
                  data={cv.education}
                  onSave={updateEducation.save}
                />
              </TabsContent>

              <TabsContent value="skills" keepMounted>
                <SkillsForm
                  data={cv.skills}
                  onSave={updateSkills.save}
                />
              </TabsContent>

              <TabsContent value="languages" keepMounted>
                <LanguagesForm
                  data={cv.languages}
                  onSave={updateLanguages.save}
                />
              </TabsContent>

              <TabsContent value="certifications" keepMounted>
                <CertificationsForm
                  data={cv.certifications}
                  onSave={updateCertifications.save}
                />
              </TabsContent>

              <TabsContent value="more" keepMounted>
                <div className="space-y-6">
                  <ProjectsForm
                    data={cv.projects}
                    onSave={updateProjects.save}
                  />
                  <InterestsForm
                    data={cv.interests}
                    onSave={updateInterests.save}
                  />
                  <AwardsForm
                    data={cv.awards}
                    onSave={updateAwards.save}
                  />
                  <VolunteerForm
                    data={cv.volunteer}
                    onSave={updateVolunteer.save}
                  />
                  <PublicationsForm
                    data={cv.publications}
                    onSave={updatePublications.save}
                  />
                  <ReferencesForm
                    data={cv.references}
                    onSave={updateReferences.save}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Section - Right Side */}
          <div className="lg:col-span-1">
            <CVPreview cv={cv} onDownload={handleDownload} />
          </div>
        </div>
      </div>
    </div>
  );
}
