'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PersonalInfo } from '@/types/cv';
import { useEffect, useRef, useCallback } from 'react';

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

  return (
    <Card className="border-border bg-cvBlack-lighter">
      <CardHeader>
        <CardTitle className="text-foreground">Informations personnelles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
