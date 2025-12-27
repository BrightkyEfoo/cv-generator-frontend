import Link from 'next/link';
import { FileText } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-cvBlack-light">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo et description */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold mb-4">
              <div className="rounded-lg bg-cvOrange p-2">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-foreground">CV Generator</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Créez des CV professionnels en quelques minutes avec notre générateur moderne et intuitif.
            </p>
          </div>

          {/* Produit */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Produit</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/templates" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Tarifs
                </Link>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Ressources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Aide
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Légal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Conditions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CV Generator. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
