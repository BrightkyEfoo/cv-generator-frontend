'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCV } from '@/hooks/useCV';
import { paymentApi } from '@/services/api';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm({ cvId }: { cvId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success/${cvId}`,
        },
      });

      if (error) {
        toast.error(error.message || 'Erreur lors du paiement');
      }
    } catch (err) {
      toast.error('Erreur lors du paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-cvOrange hover:bg-cvOrange-dark"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          'Payer 500 FCFA'
        )}
      </Button>
    </form>
  );
}

export default function CheckoutPage() {
  const params = useParams();
  const cvId = params.cvId as string;
  const { data: cv, isLoading: cvLoading } = useCV(cvId);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoadingIntent, setIsLoadingIntent] = useState(true);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const intent = await paymentApi.createIntent(cvId);
        setClientSecret(intent.clientSecret);
      } catch (error) {
        toast.error('Erreur lors de la création du paiement');
      } finally {
        setIsLoadingIntent(false);
      }
    };

    if (cvId) {
      createPaymentIntent();
    }
  }, [cvId]);

  if (cvLoading || isLoadingIntent) {
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
          <p className="text-muted-foreground">Le CV que vous recherchez n'existe pas.</p>
        </div>
      </div>
    );
  }

  const features = [
    'Export PDF haute qualité',
    'Sans watermark',
    'Téléchargement immédiat',
    'Modifications illimitées',
    'Support par email',
  ];

  return (
    <div className="min-h-screen bg-cvBlack">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8 text-center">
            Téléchargez votre CV professionnel
          </h1>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Left - CV Summary */}
            <Card className="border-border bg-cvBlack-lighter">
              <CardHeader>
                <CardTitle className="text-foreground">Résumé de votre CV</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Titre</p>
                  <p className="font-medium text-foreground">{cv.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nom complet</p>
                  <p className="font-medium text-foreground">
                    {cv.personalInfo.firstName} {cv.personalInfo.lastName}
                  </p>
                </div>
                {cv.personalInfo.title && (
                  <div>
                    <p className="text-sm text-muted-foreground">Titre professionnel</p>
                    <p className="font-medium text-foreground">{cv.personalInfo.title}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-border">
                  <p className="font-semibold text-foreground mb-3">Ce qui est inclus:</p>
                  <ul className="space-y-2">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cvOrange flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-cvOrange">500 FCFA</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right - Payment Form */}
            <Card className="border-border bg-cvBlack-lighter">
              <CardHeader>
                <CardTitle className="text-foreground">Informations de paiement</CardTitle>
              </CardHeader>
              <CardContent>
                {clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'night',
                        variables: {
                          colorPrimary: '#f97316',
                        },
                      },
                    }}
                  >
                    <CheckoutForm cvId={cvId} />
                  </Elements>
                ) : (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-cvOrange" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
