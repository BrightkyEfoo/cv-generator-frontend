'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminTemplatesApi, adminCVsApi } from '@/services/adminApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    templatesCount: 0,
    cvsCount: 0,
    paidCvsCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [templates, cvs] = await Promise.all([
          adminTemplatesApi.getAll(),
          adminCVsApi.getAll(),
        ]);

        setStats({
          templatesCount: templates.length,
          cvsCount: cvs.length,
          paidCvsCount: cvs.filter((cv) => cv.isPaid).length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

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
    </div>
  );
}
