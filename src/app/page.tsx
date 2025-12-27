'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import {
  FileText,
  Palette,
  Download,
  Zap,
  Shield,
  Star,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: <Palette className="h-8 w-8 text-cvOrange" />,
      title: 'Personnalisation complète',
      description: 'Modifiez couleurs, polices, espacements et mise en page selon vos préférences.',
    },
    {
      icon: <Zap className="h-8 w-8 text-cvOrange" />,
      title: 'Édition en temps réel',
      description: 'Visualisez instantanément vos modifications avec notre aperçu en direct.',
    },
    {
      icon: <FileText className="h-8 w-8 text-cvOrange" />,
      title: 'Templates professionnels',
      description: 'Choisissez parmi une sélection de templates modernes et élégants.',
    },
    {
      icon: <Download className="h-8 w-8 text-cvOrange" />,
      title: 'Export PDF haute qualité',
      description: 'Téléchargez votre CV en PDF avec une qualité professionnelle.',
    },
    {
      icon: <Shield className="h-8 w-8 text-cvOrange" />,
      title: 'Sauvegarde automatique',
      description: 'Ne perdez jamais votre travail grâce à la sauvegarde automatique.',
    },
    {
      icon: <Star className="h-8 w-8 text-cvOrange" />,
      title: 'Sections personnalisables',
      description: 'Ajoutez, supprimez et réorganisez les sections selon vos besoins.',
    },
  ];

  const pricingFeatures = [
    'Tous les templates disponibles',
    'Personnalisation illimitée',
    'Export PDF haute qualité',
    'Sauvegarde automatique',
    'Support par email',
    'Téléchargement immédiat',
  ];

  return (
    <div className="min-h-screen bg-cvBlack">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cvOrange/10 via-transparent to-cvBlue/10" />
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl text-center"
          >
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Créez un CV professionnel
              <span className="text-cvOrange"> en quelques minutes</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Notre générateur de CV moderne vous permet de créer un curriculum vitae
              professionnel et personnalisé en un rien de temps. Simple, rapide et efficace.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="bg-cvOrange hover:bg-cvOrange-dark text-lg">
                <Link href="/templates">
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg border-cvOrange text-cvOrange hover:bg-cvOrange/10">
                <Link href="/templates">Voir les templates</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-cvBlack-light py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Fonctionnalités puissantes
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Tous les outils dont vous avez besoin pour créer un CV qui se démarque
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-border bg-cvBlack-lighter hover:border-cvOrange/50 transition-colors">
                  <CardHeader>
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle className="text-foreground">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Tarif simple et transparent
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Un seul paiement pour télécharger votre CV en PDF haute qualité
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-lg"
          >
            <Card className="border-cvOrange bg-cvBlack-lighter">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-foreground">CV Professionnel</CardTitle>
                <CardDescription className="text-base">Créez et téléchargez votre CV</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-cvOrange">500 FCFA</span>
                  <span className="text-muted-foreground"> / CV</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {pricingFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-cvOrange flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full bg-cvOrange hover:bg-cvOrange-dark" size="lg">
                  <Link href="/templates">Créer mon CV maintenant</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
