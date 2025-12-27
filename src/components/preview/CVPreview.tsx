'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Maximize2, Loader2, RefreshCw, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { CV } from '@/types/cv';
import { cvApi, settingsApi } from '@/services/api';
import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

interface CVPreviewProps {
  cv: CV;
  onDownload?: () => void;
}

export function CVPreview({ cv, onDownload }: CVPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [freeDownloads, setFreeDownloads] = useState(false);
  const lastUpdatedAtRef = useRef<string | undefined>(cv.updatedAt);

  // Fetch public settings to check if downloads are free
  useEffect(() => {
    settingsApi.getPublic()
      .then((settings) => setFreeDownloads(settings.freeDownloads))
      .catch(() => setFreeDownloads(false));
  }, []);

  // Helper to check if user can download for free
  const canDownloadFree = cv.isPaid || freeDownloads;

  // Handle direct download (for free downloads or paid CVs)
  const handleDirectDownload = () => {
    window.open(cvApi.getDownload(cv.id), '_blank');
  };

  const fetchPreviewImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await cvApi.getPreviewImages(cv.id);
      setImages(response.images);
      setCurrentPage(0);
    } catch (error) {
      console.error('Error fetching preview images:', error);
    } finally {
      setIsLoading(false);
    }
  }, [cv.id]);

  // Initial load
  useEffect(() => {
    fetchPreviewImages();
  }, [fetchPreviewImages]);

  // Refresh when CV updatedAt changes
  useEffect(() => {
    if (cv.updatedAt !== lastUpdatedAtRef.current) {
      lastUpdatedAtRef.current = cv.updatedAt;
      const timer = setTimeout(() => {
        fetchPreviewImages();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [cv.updatedAt, fetchPreviewImages]);

  const handleRefresh = useCallback(() => {
    fetchPreviewImages();
  }, [fetchPreviewImages]);

  const handleOpenFullscreen = () => {
    setIsFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };

  const goToPage = (page: number) => {
    if (page >= 0 && page < images.length) {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => {
    goToPage(currentPage - 1);
  };

  const goToNextPage = () => {
    goToPage(currentPage + 1);
  };

  return (
    <div className="sticky top-20 space-y-4">
      <Card className="border-border bg-cvBlack-lighter">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Aperçu du CV</h3>
            <div className="flex gap-2">
              <Button
                onClick={handleRefresh}
                size="sm"
                variant="outline"
                className="border-border"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                onClick={handleOpenFullscreen}
                size="sm"
                variant="outline"
                className="border-border"
              >
                <Maximize2 className="mr-2 h-4 w-4" />
                Agrandir
              </Button>
              {canDownloadFree && (
                <Button
                  onClick={handleDirectDownload}
                  size="sm"
                  className="bg-cvOrange hover:bg-cvOrange-dark"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {freeDownloads && !cv.isPaid ? 'Télécharger (gratuit)' : 'Télécharger'}
                </Button>
              )}
            </div>
          </div>

          {/* Main Preview Image */}
          <div className="relative aspect-[3/4] bg-white rounded-lg overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-cvBlack/50 z-10">
                <Loader2 className="h-8 w-8 animate-spin text-cvOrange" />
              </div>
            )}
            {images.length > 0 && (
              <Image
                src={`data:image/png;base64,${images[currentPage]}`}
                alt={`CV Preview - Page ${currentPage + 1}`}
                fill
                className="object-contain"
                unoptimized
              />
            )}

            {/* Navigation arrows for multi-page */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 0}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed z-20"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === images.length - 1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed z-20"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails for multi-page */}
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 justify-center overflow-x-auto py-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`relative flex-shrink-0 w-12 h-16 rounded border-2 overflow-hidden transition-all ${
                    index === currentPage
                      ? 'border-cvOrange ring-2 ring-cvOrange/30'
                      : 'border-border hover:border-cvOrange/50'
                  }`}
                >
                  <Image
                    src={`data:image/png;base64,${image}`}
                    alt={`Page ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Page indicator */}
          {images.length > 1 && (
            <div className="text-center text-sm text-muted-foreground mt-2">
              Page {currentPage + 1} sur {images.length}
            </div>
          )}

          {!canDownloadFree && (
            <div className="mt-4 p-3 bg-cvOrange/10 border border-cvOrange/20 rounded-lg">
              <p className="text-sm text-cvOrange text-center">
                Payez 500 FCFA pour télécharger votre CV en PDF haute qualité sans watermark
              </p>
              <Button
                onClick={onDownload}
                className="w-full mt-2 bg-cvOrange hover:bg-cvOrange-dark"
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger le PDF
              </Button>
            </div>
          )}

          {freeDownloads && !cv.isPaid && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-sm text-green-500 text-center">
                Téléchargement gratuit disponible ! Cliquez sur le bouton ci-dessus pour télécharger votre CV.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CV Info */}
      <Card className="border-border bg-cvBlack-lighter">
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Titre:</span>
            <span className="text-foreground font-medium">{cv.title}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Dernière mise à jour:</span>
            <span className="text-foreground font-medium">
              {cv.updatedAt ? new Date(cv.updatedAt).toLocaleDateString('fr-FR') : '-'}
            </span>
          </div>
          {cv.version && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Version:</span>
              <span className="text-foreground font-medium">{cv.version}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fullscreen Modal with Slider */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
          onClick={handleCloseFullscreen}
        >
          <Button
            onClick={handleCloseFullscreen}
            size="sm"
            variant="ghost"
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-50"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Main Image Container */}
          <div
            className="relative flex-1 w-full max-w-4xl flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {images.length > 0 && (
              <div className="relative w-full h-full max-h-[80vh]">
                <Image
                  src={`data:image/png;base64,${images[currentPage]}`}
                  alt={`CV Preview - Page ${currentPage + 1}`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goToPreviousPage(); }}
                  disabled={currentPage === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goToNextPage(); }}
                  disabled={currentPage === images.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails at bottom */}
          {images.length > 1 && (
            <div
              className="mt-4 flex gap-3 justify-center overflow-x-auto py-2 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`relative flex-shrink-0 w-16 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                    index === currentPage
                      ? 'border-cvOrange ring-2 ring-cvOrange/50 scale-110'
                      : 'border-white/30 hover:border-cvOrange/50'
                  }`}
                >
                  <Image
                    src={`data:image/png;base64,${image}`}
                    alt={`Page ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Page indicator */}
          <div className="mt-2 text-white text-sm">
            Page {currentPage + 1} sur {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
