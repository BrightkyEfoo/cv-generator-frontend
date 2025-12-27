'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useCV } from '@/hooks/useCV';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Download, Edit, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cvApi } from '@/services/api';
import { motion } from 'framer-motion';

export default function SuccessPage() {
  const params = useParams();
  const cvId = params.cvId as string;
  const { data: cv, isLoading, refetch } = useCV(cvId);

  useEffect(() => {
    // Refetch CV to get updated payment status
    const timer = setTimeout(() => {
      refetch();
    }, 2000);
    return () => clearTimeout(timer);
  }, [refetch]);

  const handleDownload = () => {
    if (!cv) return;
    window.open(cvApi.getDownload(cv.id), '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cvBlack flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cvOrange" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cvBlack">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6"
            >
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </motion.div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Paiement réussi!
            </h1>
            <p className="text-lg text-muted-foreground">
              Votre CV est maintenant disponible au téléchargement
            </p>
          </div>

          <Card className="border-border bg-cvBlack-lighter text-left">
            <CardHeader>
              <CardTitle className="text-foreground">Prochaines étapes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button
                  onClick={handleDownload}
                  size="lg"
                  className="w-full bg-cvOrange hover:bg-cvOrange-dark"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Télécharger mon CV en PDF
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full border-border"
                >
                  <Link href={`/editor/${cvId}`}>
                    <Edit className="mr-2 h-5 w-5" />
                    Modifier mon CV
                  </Link>
                </Button>
              </div>

              <div className="pt-4 border-t border-border space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Note:</strong> Vous pouvez continuer à
                  modifier votre CV et télécharger de nouvelles versions à tout moment.
                </p>
                <p>
                  Un email de confirmation a été envoyé à{' '}
                  <strong className="text-foreground">{cv?.personalInfo.email}</strong>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-sm text-muted-foreground">
            <p>Des questions? Contactez-nous à support@cvgenerator.com</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
