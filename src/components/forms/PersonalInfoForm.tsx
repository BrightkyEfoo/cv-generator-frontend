'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { PersonalInfo } from '@/types/cv';
import { useEffect, useRef, useCallback, useState } from 'react';
import { uploadApi, getAssetUrl } from '@/services/api';
import { Camera, Loader2, X } from 'lucide-react';
import Image from 'next/image';

const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'Prénom requis'),
  lastName: z.string().min(1, 'Nom requis'),
  title: z.string().optional(),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onSave: (data: Partial<PersonalInfo>) => void;
}

export function PersonalInfoForm({ data, onSave }: PersonalInfoFormProps) {
  const { register, watch, formState: { errors } } = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: data,
  });

  const [photoUrl, setPhotoUrl] = useState<string | undefined>(data.photoUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use refs to avoid dependency issues and prevent unnecessary saves
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  const lastSavedRef = useRef<string>(JSON.stringify(data));
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const isInitialMount = useRef(true);

  const formData = watch();

  // Debounced save that only triggers if data actually changed
  const debouncedSave = useCallback((newData: Partial<PersonalInfo>) => {
    const newDataStr = JSON.stringify(newData);

    // Skip if data hasn't changed
    if (newDataStr === lastSavedRef.current) {
      return;
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      lastSavedRef.current = newDataStr;
      onSaveRef.current(newData);
    }, 1500);
  }, []);

  // Watch for form changes (skip initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    debouncedSave(formData);
  }, [formData, debouncedSave]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Photo upload handler
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Format invalide. Utilisez JPEG, PNG ou WebP.');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Fichier trop volumineux. Maximum 5MB.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const result = await uploadApi.uploadImage(file);
      const newPhotoUrl = result.url;
      setPhotoUrl(newPhotoUrl);
      onSaveRef.current({ photoUrl: newPhotoUrl });
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError('Échec du téléchargement. Veuillez réessayer.');
    } finally {
      setIsUploading(false);
      // Reset the input so the same file can be re-selected
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Remove photo handler
  const handleRemovePhoto = () => {
    setPhotoUrl(undefined);
    onSaveRef.current({ photoUrl: undefined });
  };

  return (
    <Card className="border-border bg-cvBlack-lighter">
      <CardHeader>
        <CardTitle className="text-foreground">Informations personnelles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Photo Upload Section */}
        <div className="space-y-2">
          <Label>Photo de profil</Label>
          <div className="flex items-center gap-4">
            <div className="relative">
              {photoUrl ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-border">
                  <Image
                    src={getAssetUrl(photoUrl)}
                    alt="Photo de profil"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    title="Supprimer la photo"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-border flex items-center justify-center bg-cvBlack">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-cvBlack border-border hover:bg-cvBlack-lighter"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    {photoUrl ? 'Changer' : 'Ajouter'}
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                JPEG, PNG ou WebP. Max 5MB.
              </p>
            </div>
          </div>
          {uploadError && (
            <p className="text-sm text-red-500">{uploadError}</p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom *</Label>
            <Input
              id="firstName"
              {...register('firstName')}
              className="bg-cvBlack border-border"
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom *</Label>
            <Input
              id="lastName"
              {...register('lastName')}
              className="bg-cvBlack border-border"
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Titre professionnel</Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="Ex: Développeur Full Stack"
            className="bg-cvBlack border-border"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className="bg-cvBlack border-border"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              {...register('phone')}
              className="bg-cvBlack border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            {...register('address')}
            className="bg-cvBlack border-border"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              {...register('city')}
              className="bg-cvBlack border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Pays</Label>
            <Input
              id="country"
              {...register('country')}
              className="bg-cvBlack border-border"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
