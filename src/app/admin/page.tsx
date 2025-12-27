'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminTemplatesApi, adminCVsApi, adminSettingsApi, type AppSettings } from '@/services/adminApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FileText, Users, TrendingUp, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    templatesCount: 0,
    cvsCount: 0,
    paidCvsCount: 0,
  });
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templates, cvs, appSettings] = await Promise.all([
          adminTemplatesApi.getAll(),
          adminCVsApi.getAll(),
          adminSettingsApi.get(),
        ]);

        setStats({
          templatesCount: templates.length,
          cvsCount: cvs.length,
          paidCvsCount: cvs.filter((cv) => cv.isPaid).length,
        });
        setSettings(appSettings);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFreeDownloadsToggle = async (enabled: boolean) => {
    setIsUpdatingSettings(true);
    try {
      const updatedSettings = await adminSettingsApi.update({ freeDownloads: enabled });
      setSettings(updatedSettings);
      toast.success(enabled ? 'Téléchargements gratuits activés' : 'Téléchargements gratuits désactivés');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des paramètres');
      console.error('Failed to update settings:', error);
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  const statCards = [
    {
      title: 'Templates',
      value: stats.templatesCount,
      description: 'Templates actifs',
      icon: FileText,
      href: '/admin/templates',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'CVs Créés',
      value: stats.cvsCount,
      description: 'Total des CVs',
      icon: Users,
      href: '/admin/cvs',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'CVs Payés',
      value: stats.paidCvsCount,
      description: 'Téléchargements payants',
      icon: TrendingUp,
      href: '/admin/cvs',
      color: 'text-cvOrange',
      bgColor: 'bg-cvOrange/10',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de votre plateforme CV Generator
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href}>
              <Card className="hover:border-cvOrange/50 transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {isLoading ? '...' : card.value}
                  </div>
                  <CardDescription>{card.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Settings Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Paramètres</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Téléchargements
            </CardTitle>
            <CardDescription>
              Configurez les options de téléchargement des CVs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="free-downloads" className="text-base">
                  Téléchargements gratuits
                </Label>
                <p className="text-sm text-muted-foreground">
                  Permet aux utilisateurs de télécharger les CVs sans paiement (mode test)
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isUpdatingSettings && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                <Switch
                  id="free-downloads"
                  checked={settings?.freeDownloads ?? false}
                  onCheckedChange={handleFreeDownloadsToggle}
                  disabled={isLoading || isUpdatingSettings}
                />
              </div>
            </div>
            {settings?.freeDownloads && (
              <div className="mt-4 p-3 bg-cvOrange/10 border border-cvOrange/20 rounded-lg">
                <p className="text-sm text-cvOrange">
                  Les téléchargements sont actuellement gratuits. Les utilisateurs peuvent télécharger les CVs sans payer.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
