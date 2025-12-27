# CV Generator - Application Frontend React

Une application moderne de génération de CV professionnels construite avec Next.js 14, TypeScript, TailwindCSS, et shadcn/ui.

## 🚀 Fonctionnalités

- ✨ **Templates Professionnels**: Choisissez parmi une variété de templates modernes
- 🎨 **Personnalisation Complète**: Modifiez couleurs, polices, espacements et mise en page
- ⚡ **Édition en Temps Réel**: Visualisez vos modifications instantanément
- 💾 **Sauvegarde Automatique**: Ne perdez jamais votre travail
- 📱 **Design Responsive**: Fonctionne parfaitement sur tous les appareils
- 💳 **Paiement Stripe**: Intégration sécurisée pour le téléchargement PDF
- 📄 **Export PDF Haute Qualité**: Téléchargez votre CV en PDF professionnel

## 🛠 Stack Technique

- **Framework**: Next.js 14 (App Router)
- **Langage**: TypeScript (strict mode)
- **Styling**: TailwindCSS + shadcn/ui
- **Formulaires**: React Hook Form + Zod
- **État Global**: Zustand
- **API Client**: TanStack Query (React Query)
- **Animations**: Framer Motion
- **Paiement**: Stripe.js
- **Icônes**: Lucide React

## 📋 Prérequis

- Node.js 18+
- Bun (ou npm/pnpm)
- Backend API en cours d'exécution sur `http://localhost:3001`

## 🚀 Installation

1. Clonez le repository et accédez au dossier:
```bash
cd cv-generator
```

2. Installez les dépendances:
```bash
bun install
```

3. Créez un fichier `.env.local` basé sur `.env.local.example`:
```bash
cp .env.local.example .env.local
```

4. Configurez vos variables d'environnement dans `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

5. Lancez le serveur de développement:
```bash
bun dev
```

6. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 📁 Structure du Projet

```
src/
├── app/                    # Next.js App Router pages
│   ├── editor/            # Page éditeur de CV
│   ├── templates/         # Page sélection de templates
│   ├── checkout/          # Page paiement
│   └── success/           # Page succès
├── components/
│   ├── ui/                # Composants shadcn/ui
│   ├── forms/             # Formulaires par section
│   ├── editor/            # Composants de l'éditeur
│   ├── preview/           # Composants de preview
│   └── layout/            # Header, Footer, Sidebar
├── hooks/                 # Custom hooks
│   ├── useCV.ts          # Hooks pour gérer le CV
│   ├── useTemplates.ts   # Hooks pour les templates
│   └── useDebounce.ts    # Hook pour l'auto-save
├── services/              # Services API
│   └── api.ts            # Client API centralisé
├── stores/                # Zustand stores
│   └── cvStore.ts        # Store global du CV
├── types/                 # TypeScript interfaces
│   └── cv.ts             # Types du CV
└── lib/                   # Configuration
    └── queryClient.ts    # Config TanStack Query
```

## 🎨 Thème et Design

L'application utilise un thème dark moderne avec:
- **Fond**: Noir (#0a0a0a, #1a1a1a, #2a2a2a)
- **Accent Principal**: Orange (#f97316)
- **Accent Secondaire**: Bleu (#3b82f6)
- **Texte**: Blanc/Gris clair

## 🔌 API Backend

L'application communique avec une API backend qui doit être en cours d'exécution. Les endpoints utilisés:

### Templates
- `GET /templates` - Liste tous les templates
- `GET /templates/:id` - Détails d'un template
- `GET /templates/category/:category` - Templates par catégorie

### CV
- `POST /cv` - Créer un nouveau CV
- `GET /cv/session` - Récupérer le CV de la session
- `GET /cv/:id` - Récupérer un CV par ID
- `PATCH /cv/:id/*` - Mettre à jour les sections du CV
- `GET /cv/:id/preview` - Générer PDF preview
- `GET /cv/:id/download` - Télécharger le PDF final

### Upload
- `POST /uploads/image` - Upload une image
- `DELETE /uploads/image/:id` - Supprimer une image

### Paiement
- `POST /payments/cv/:cvId/intent` - Créer une intention de paiement Stripe

## 🧪 Tests

```bash
bun test
```

## 🚀 Déploiement

```bash
bun run build
```

## 📝 Licence

MIT

## 🤝 Support

Pour toute question ou problème, contactez support@cvgenerator.com
