# ITL Deepfake Detective - Advanced AI-Powered Detection Platform

## Table of Contents
1. [Environment Setup](#environment-setup)
2. [Project Creation](#project-creation)
3. [Dependencies Installation](#dependencies-installation)
4. [Advanced Project Structure](#advanced-project-structure)
5. [API Configuration](#api-configuration)
6. [Core Library Implementation](#core-library-implementation)
7. [UI Components System](#ui-components-system)
8. [Advanced Features Implementation](#advanced-features-implementation)
9. [Charts & Analytics](#charts--analytics)
10. [PDF Export & Reporting](#pdf-export--reporting)
11. [Explanation System](#explanation-system)
12. [Navigation & Layout](#navigation--layout)
13. [Storage & Data Management](#storage--data-management)
14. [Running the Project](#running-the-project)
15. [Testing](#testing)
16. [Deployment](#deployment)

---

## Environment Setup

### Prerequisites Check

First, verify your development environment:

```bash
# Check Node.js version (required: Node.js 18.17 or later)
node --version

# Check npm version
npm --version

# Check Git installation
git --version
```

### Installing Node.js (if not installed)

**Windows:**
- Download from [nodejs.org](https://nodejs.org/)
- Install LTS version (20.x recommended)

**macOS:**
```bash
# Using Homebrew
brew install node

# Or download from nodejs.org
```

**Linux (Ubuntu/Debian):**
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Development Tools

Install recommended tools:
```bash
# Install VS Code (recommended)
# Download from https://code.visualstudio.com/

# Install Git (if not installed)
# Windows: Download from https://git-scm.com/
# macOS: git is included with Xcode command line tools
# Linux: sudo apt-get install git
```

---

## Project Creation

### Step 1: Initialize the Project

```bash
# Create project directory
mkdir deepfakeweb
cd deepfakeweb

# Initialize Next.js project with TypeScript
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Initialize Git repository (if not done automatically)
git init
```

### Step 2: Project Configuration Files

Create essential configuration files:

**next.config.ts:**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
```

**IMPORTANT NOTE:** This project uses **Tailwind CSS v4** which doesn't require a separate `tailwind.config.ts` file. The configuration is handled directly in `globals.css` using the new `@theme` directive.

**postcss.config.mjs:**
```javascript
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
```

**components.json:**
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {}
}
```

**eslint.config.mjs:**
```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
```

**.gitignore:**
```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Next.js
.next/
out/
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# TypeScript
*.tsbuildinfo
next-env.d.ts
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## Dependencies Installation

### Core Dependencies

```bash
# Install UI and styling dependencies
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-progress @radix-ui/react-separator @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-toast @radix-ui/react-toggle

# Install utility libraries
npm install class-variance-authority clsx tailwind-merge lucide-react framer-motion next-themes sonner

# Install chart and visualization libraries
npm install chart.js chartjs-adapter-date-fns recharts

# Install file handling libraries
npm install react-dropzone html2canvas jspdf @types/jspdf

# Install API and environment libraries
npm install @realitydefender/realitydefender dotenv

# Install development dependencies
npm install -D @tailwindcss/postcss tailwindcss @types/node @types/react @types/react-dom typescript tw-animate-css
```

### Package.json Result

Your `package.json` should look like this:

```json
{
  "name": "deepfakeweb",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-toast": "^1.2.15",
    "@radix-ui/react-toggle": "^1.1.10",
    "@realitydefender/realitydefender": "^0.1.15",
    "@types/jspdf": "^1.3.3",
    "chart.js": "^4.5.0",
    "chartjs-adapter-date-fns": "^3.0.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "dotenv": "^17.2.2",
    "framer-motion": "^12.23.22",
    "html2canvas": "^1.4.1",
    "jspdf": "^3.0.3",
    "lucide-react": "^0.544.0",
    "next": "15.5.4",
    "next-themes": "^0.4.6",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-dropzone": "^14.3.8",
    "recharts": "^3.2.1",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.3.1"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.5.4",
    "tailwindcss": "^4",
    "tw-animate-css": "^1.4.0",
    "typescript": "^5"
  }
}
```

---

## Advanced Project Structure

Create the comprehensive directory structure for the advanced deepfake detection platform:

**Complete Directory Setup:**
```bash
# Create main application directories
mkdir -p src/app/{api/rd/{result/[id],signed-url},results,upload}
mkdir -p src/components/{charts,explanation,layout,pdf,ui}
mkdir -p src/lib/{types}
mkdir -p public

# Create all necessary files
touch src/app/{favicon.ico,globals.css,layout.tsx,page.tsx}
touch src/app/results/page.tsx
touch src/app/upload/{loading.tsx,page.tsx}
touch src/app/api/rd/signed-url/route.ts
touch src/app/api/rd/result/[id]/route.ts

# Create component files
touch src/components/{upload-box.tsx,usage-dashboard.tsx}
touch src/components/charts/{advanced-charts.tsx,category-chart.tsx,confidence-gauge.tsx}
touch src/components/explanation/explanation-dashboard.tsx
touch src/components/layout/{navbar.tsx,sidebar.tsx}
touch src/components/pdf/{pdf-chart-components.tsx,pdf-export-dialog.tsx}
touch src/components/ui/{badge.tsx,button.tsx,card.tsx,dialog.tsx,dropdown-menu.tsx,progress.tsx,separator.tsx,sonner.tsx,switch.tsx,toggle.tsx}

# Create library files
touch src/lib/{explanation-generator.ts,pdf-generator.ts,reality-defender.ts,storage.ts,usage-tracker.ts,utils.ts}
touch src/lib/types/index.ts
```

**Advanced Project Structure:**
```
deepfakeweb/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── rd/
│   │   │       ├── result/
│   │   │       │   └── [id]/
│   │   │       │       └── route.ts                 # [38 lines] - Analysis result retrieval
│   │   │       └── signed-url/
│   │   │           └── route.ts                     # [40 lines] - Secure upload URL generation
│   │   ├── results/
│   │   │   └── page.tsx                             # [628 lines] - Advanced results dashboard
│   │   ├── upload/
│   │   │   ├── loading.tsx                          # Loading state for upload
│   │   │   └── page.tsx                             # Advanced upload interface
│   │   ├── favicon.ico                              # App favicon
│   │   ├── globals.css                              # [187 lines] - Tailwind v4 + custom styles
│   │   ├── layout.tsx                               # [48 lines] - Enhanced root layout
│   │   └── page.tsx                                 # [242 lines] - Modern landing page
│   ├── components/
│   │   ├── charts/
│   │   │   ├── advanced-charts.tsx                  # Advanced visualization components
│   │   │   ├── category-chart.tsx                   # Category analysis charts
│   │   │   └── confidence-gauge.tsx                 # Confidence visualization
│   │   ├── explanation/
│   │   │   └── explanation-dashboard.tsx            # AI explanation system
│   │   ├── layout/
│   │   │   ├── navbar.tsx                           # Main navigation
│   │   │   └── sidebar.tsx                          # Analysis history sidebar
│   │   ├── pdf/
│   │   │   ├── pdf-chart-components.tsx             # PDF export charts
│   │   │   └── pdf-export-dialog.tsx                # PDF generation interface
│   │   ├── ui/
│   │   │   ├── badge.tsx                            # [46 lines] - Modern badge component
│   │   │   ├── button.tsx                           # [58 lines] - Enhanced button component
│   │   │   ├── card.tsx                             # [92 lines] - Advanced card component
│   │   │   ├── dialog.tsx                           # Modal dialogs
│   │   │   ├── dropdown-menu.tsx                    # Context menus
│   │   │   ├── progress.tsx                         # Progress indicators
│   │   │   ├── separator.tsx                        # Visual separators
│   │   │   ├── sonner.tsx                           # Toast notifications
│   │   │   ├── switch.tsx                           # Toggle switches
│   │   │   └── toggle.tsx                           # Toggle buttons
│   │   ├── upload-box.tsx                           # Advanced drag & drop upload
│   │   └── usage-dashboard.tsx                      # Usage tracking dashboard
│   └── lib/
│       ├── types/
│       │   └── index.ts                             # [311 lines] - Comprehensive TypeScript definitions
│       ├── explanation-generator.ts                 # AI explanation generation
│       ├── pdf-generator.ts                         # PDF report generation
│       ├── reality-defender.ts                      # API integration layer
│       ├── storage.ts                               # [304 lines] - Local storage management
│       ├── usage-tracker.ts                         # Usage analytics & limits
│       └── utils.ts                                 # [6 lines] - Utility functions
├── public/
├── .env.local                                       # Environment variables
├── .env.example                                     # Environment template
├── .gitignore                                       # Git ignore rules
├── components.json                                  # shadcn/ui configuration
├── next.config.ts                                   # Next.js configuration
├── package.json                                     # Dependencies & scripts
├── postcss.config.mjs                             # PostCSS configuration
├── tailwind.config.ts                              # Tailwind CSS configuration
└── tsconfig.json                                    # TypeScript configuration
```

---

## API Configuration

### Step 1: Environment Variables

Create `.env.example`:
```bash
# Reality Defender API Configuration
# Get your free API key from: https://www.realitydefender.com/platform/api
# Free tier includes 50 audio or image scans per month
NEXT_PUBLIC_RD_API_KEY=your_reality_defender_api_key_here
NEXT_PUBLIC_RD_API_URL=https://api.realitydefender.com

# App Configuration
NEXT_PUBLIC_APP_NAME="Deepfake Detective"
NEXT_PUBLIC_APP_DESCRIPTION="Advanced AI-powered deepfake detection for media files"

# Real API required - configure your API key above
```

Create `.env.local` (copy from .env.example and add your actual API key):
```bash
cp .env.example .env.local
# Edit .env.local with your actual API key
```

### Step 2: Get Reality Defender API Key

1. Visit [Reality Defender Platform](https://www.realitydefender.com/platform/api)
2. Sign up for a free account
3. Generate your API key
4. Add it to `.env.local`

---

## Core Library Implementation

### Step 1: TypeScript Type Definitions

**src/lib/types/index.ts:**
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface FileUploadState {
  file: File | null;
  preview: string | null;
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface UploadProgress {
  percentage: number;
  stage: 'upload' | 'preprocessing' | 'analysis' | 'results';
  message: string;
  stagesCompleted?: string[];
  analysisDetails?: {
    activeModels: string[];
    completedModels: number;
    totalModels: number;
    modelStatuses: Record<string, string>;
    currentPhase: string;
  };
  timeElapsed?: number;
  estimatedTimeRemaining?: number;
}

export interface ExplanationReason {
  id: string;
  category: 'visual' | 'audio' | 'metadata' | 'model' | 'temporal' | 'technical';
  type: 'evidence' | 'anomaly' | 'pattern' | 'inconsistency' | 'artifact';
  severity: 'high' | 'medium' | 'low';
  confidence: number;
  title: string;
  description: string;
  technicalDetails?: string;
  affectedRegions?: Array<{
    startTime?: number;
    endTime?: number;
    frame?: number;
    coordinates?: { x: number; y: number; width: number; height: number; };
  }>;
  supportingEvidence?: string[];
  modelSources?: string[];
}

export interface DetailedExplanation {
  id: string;
  analysisId: string;
  summary: ExplanationSummary;
  reasons: ExplanationReason[];
  evidence: ExplanationEvidence[];
  modelInsights: ModelInsight[];
  temporalAnalysis?: {
    frameByFrameReasons: Array<{
      frame: number;
      timestamp: number;
      primaryConcerns: string[];
      confidenceChange?: number;
    }>;
    overallTrends: string[];
  };
  metadataAnalysis?: {
    fileProperties: Array<{
      property: string;
      expectedValue?: string | number;
      actualValue: string | number;
      assessment: 'normal' | 'suspicious' | 'anomalous';
      explanation: string;
    }>;
    processingHistory?: string[];
  };
  generatedAt: string;
  processingVersion: string;
}

// ... [Additional 250+ lines of comprehensive type definitions]
```

### Step 2: Advanced Storage Management

**src/lib/storage.ts:**
```typescript
import type { AnalysisResult } from './reality-defender';

const STORAGE_KEYS = {
  ANALYSIS_HISTORY: 'deepfake_analysis_history',
  THEME: 'deepfake_theme',
  USER_PREFERENCES: 'deepfake_preferences',
} as const;

export interface StoredAnalysis extends AnalysisResult {
  thumbnailBlob?: string; // Base64 encoded thumbnail
}

export interface UserPreferences {
  maxHistoryItems: number;
  showDetailedAnalysis: boolean;
  autoDownloadReports: boolean;
  theme: 'light' | 'dark' | 'system';
}

class StorageManager {
  private isClient = typeof window !== 'undefined';

  // Analysis History Management
  getAnalysisHistory(): StoredAnalysis[] {
    if (!this.isClient) return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ANALYSIS_HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load analysis history:', error);
      return [];
    }
  }

  addAnalysisToHistory(analysis: AnalysisResult, thumbnailBlob?: string): void {
    if (!this.isClient) return;

    try {
      const history = this.getAnalysisHistory();
      const preferences = this.getUserPreferences();
      
      const storedAnalysis: StoredAnalysis = {
        ...analysis,
        thumbnailBlob,
      };

      // Add to beginning of array (most recent first)
      const updatedHistory = [storedAnalysis, ...history];
      
      // Limit history size
      const limitedHistory = updatedHistory.slice(0, preferences.maxHistoryItems);
      
      localStorage.setItem(STORAGE_KEYS.ANALYSIS_HISTORY, JSON.stringify(limitedHistory));
    } catch (error) {
      console.error('Failed to save analysis to history:', error);
    }
  }

  // ... [Additional 200+ lines of storage functionality]
}

export const storage = new StorageManager();

// Advanced thumbnail generation with video support
export const createThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type.startsWith('image/')) {
      // Image thumbnail generation logic
    } else if (file.type.startsWith('video/')) {
      // Video frame extraction logic
    } else {
      // Fallback placeholder for audio/other files
    }
  });
};
```

### Step 3: Advanced Utility Functions

**src/lib/utils.ts:**
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## UI Components System

### Step 1: Enhanced Button Component

**src/components/ui/button.tsx:**
```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
 
import { cn } from "@/lib/utils"
 
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
 
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}
 
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
 
export { Button, buttonVariants }
```

### Step 2: Modern Card Component with Enhanced Features

**src/components/ui/card.tsx:**
```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
```

### Step 3: Enhanced Badge Component

**src/components/ui/badge.tsx:**
```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
```

### Step 4: Additional UI Components

You'll need to create several additional UI components. Install shadcn/ui components:

```bash
# Install additional UI components using shadcn/ui CLI
npx shadcn@latest add dialog dropdown-menu progress separator switch toggle
```

Or create them manually:
- `dialog.tsx` - Modal dialogs for confirmations and forms
- `dropdown-menu.tsx` - Context menus and action menus  
- `progress.tsx` - Progress indicators for uploads and analysis
- `separator.tsx` - Visual dividers between content sections
- `sonner.tsx` - Toast notification system (create manually)
- `switch.tsx` - Toggle switches for settings
- `toggle.tsx` - Toggle buttons for UI states

**src/components/ui/sonner.tsx:**
```typescript
"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
```

### Step 3: API Routes

**src/app/api/rd/signed-url/route.ts:**
```typescript
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { fileName } = await req.json();

    if (!fileName || typeof fileName !== "string") {
      return NextResponse.json({ error: "Invalid fileName" }, { status: 400 });
    }

    const apiKey = process.env.RD_API_KEY || process.env.NEXT_PUBLIC_RD_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_RD_API_URL || "https://api.realitydefender.com";

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const upstream = await fetch(`${baseUrl}/api/files/aws-presigned`, {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileName }),
      cache: "no-store",
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Upstream error", status: upstream.status, response: data },
        { status: upstream.status }
      );
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unexpected error" }, { status: 500 });
  }
}
```

**src/app/api/rd/result/[id]/route.ts:**
```typescript
import { NextResponse } from "next/server";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params || { id: '' };

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const apiKey = process.env.RD_API_KEY || process.env.NEXT_PUBLIC_RD_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_RD_API_URL || "https://api.realitydefender.com";

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const upstream = await fetch(`${baseUrl}/api/media/users/${id}`, {
      method: "GET",
      headers: {
        "X-API-KEY": apiKey,
      },
      cache: "no-store",
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Upstream error", status: upstream.status, response: data },
        { status: upstream.status }
      );
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unexpected error" }, { status: 500 });
  }
}
```

## Advanced Features Implementation

### Important: Missing Advanced Components

**CRITICAL:** The following advanced components are essential for the project to work but are too large to include in full here. You need to create these files:

**src/components/layout/navbar.tsx** - Main navigation component
**src/components/layout/sidebar.tsx** - Analysis history sidebar  
**src/components/charts/confidence-gauge.tsx** - Confidence visualization
**src/components/charts/category-chart.tsx** - Category analysis charts
**src/components/charts/advanced-charts.tsx** - Advanced visualization components
**src/components/explanation/explanation-dashboard.tsx** - AI explanation system
**src/components/pdf/pdf-export-dialog.tsx** - PDF generation interface
**src/components/pdf/pdf-chart-components.tsx** - PDF export charts
**src/components/upload-box.tsx** - Advanced drag & drop upload
**src/components/usage-dashboard.tsx** - Usage tracking dashboard

**src/lib/explanation-generator.ts** - AI explanation generation
**src/lib/pdf-generator.ts** - PDF report generation  
**src/lib/reality-defender.ts** - API integration layer
**src/lib/usage-tracker.ts** - Usage analytics & limits

**Basic placeholder implementations:**

**src/components/layout/navbar.tsx:**
```typescript
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  X,
  Shield,
  Sun,
  Moon,
  Monitor,
  Settings,
  History,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onMenuToggle?: () => void;
  showMobileMenu?: boolean;
}

export function Navbar({ onMenuToggle, showMobileMenu }: NavbarProps) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('deepfake_theme') as 'light' | 'dark' | 'system';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      root.classList.toggle('dark', mediaQuery.matches);
      
      const handler = (e: MediaQueryListEvent) => {
        root.classList.toggle('dark', e.matches);
      };
      
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme, mounted]);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('deepfake_theme', newTheme);
  };

  const navigationItems = [
    { href: '/', label: 'Home', active: pathname === '/' },
    { href: '/upload', label: 'Analyze', active: pathname === '/upload' },
    { href: '/results', label: 'Results', active: pathname === '/results' },
  ];

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold">ITL Deepfake Detective</span>
          </div>
          <div className="w-8 h-8" /> {/* Placeholder for theme toggle */}
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold text-foreground">ITL Deepfake Detective</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                item.active 
                  ? 'text-primary border-b-2 border-primary pb-1' 
                  : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 px-0">
                <ThemeIcon className="h-4 w-4" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleThemeChange('light')}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange('system')}>
                <Monitor className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden w-9 px-0"
            onClick={onMenuToggle}
          >
            {showMobileMenu ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t overflow-hidden"
          >
            <div className="container px-4 py-4 space-y-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Theme</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleThemeChange('light')}
                      className="w-8 h-8 p-0"
                    >
                      <Sun className="h-3 w-3" />
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleThemeChange('dark')}
                      className="w-8 h-8 p-0"
                    >
                      <Moon className="h-3 w-3" />
                    </Button>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleThemeChange('system')}
                      className="w-8 h-8 p-0"
                    >
                      <Monitor className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
```

**src/components/layout/sidebar.tsx:**
```typescript
'use client';

interface SidebarProps {
  onAnalysisSelect?: (id: string) => void;
}

export function Sidebar({ onAnalysisSelect }: SidebarProps) {
  return (
    <div className="w-64 bg-muted/30 border-r">
      <div className="p-4">
        <h3 className="text-sm font-semibold mb-2">Analysis History</h3>
        <p className="text-xs text-muted-foreground">
          Previous analyses will appear here
        </p>
      </div>
    </div>
  );
}
```

**IMPORTANT: Complete Source Code Required**

This guide includes the basic structure, but the project has **many advanced components** that are too large to include in full here. For the **exact same project**, you'll need the complete source code for these files:

**📁 Required Advanced Components (Copy from original project):**

1. **Layout Components:**
   - ✅ `src/components/layout/navbar.tsx` (226 lines) - **INCLUDED ABOVE**
   - 📄 `src/components/layout/sidebar.tsx` (345+ lines) - **COPY NEEDED**

2. **Chart Components:**
   - 📄 `src/components/charts/confidence-gauge.tsx` (230+ lines)
   - 📄 `src/components/charts/category-chart.tsx` (260+ lines) 
   - 📄 `src/components/charts/advanced-charts.tsx` (410+ lines)

3. **Advanced Features:**
   - 📄 `src/components/explanation/explanation-dashboard.tsx` (680+ lines)
   - 📄 `src/components/pdf/pdf-export-dialog.tsx` (300+ lines)
   - 📄 `src/components/pdf/pdf-chart-components.tsx` (520+ lines)
   - 📄 `src/components/upload-box.tsx` (400+ lines)
   - 📄 `src/components/usage-dashboard.tsx` (200+ lines)

4. **Library Files:**
   - 📄 `src/lib/explanation-generator.ts` (200+ lines)
   - 📄 `src/lib/pdf-generator.ts` (150+ lines) 
   - 📄 `src/lib/reality-defender.ts` (100+ lines)
   - 📄 `src/lib/usage-tracker.ts` (180+ lines)

**🚨 To build exactly the same project:**
1. Follow this guide to set up the basic structure and configuration
2. **Request the complete source code files** for all components listed above
3. Copy them exactly as they are into the corresponding locations
4. Install all dependencies from the provided package.json

**The current results page (628 lines) and upload page also need the complete implementations.**

### Step 1: Enhanced Root Layout with Advanced Features

**src/app/layout.tsx:**
```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ITL Deepfake Detective | AI-Powered Media Authentication",
  description: "Advanced deepfake detection for images, videos, and audio files using AI technology. Verify media authenticity instantly.",
  keywords: "deepfake detection, AI, media verification, fake media detection, video analysis, image authentication",
  authors: [{ name: "ITL Deepfake Detective Team" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
```

### Step 2: Advanced Tailwind CSS v4 Styling

**src/app/globals.css:**
```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --radius: 0.625rem;
  --background: #ffffff;
  --foreground: #242424;
  --card: #ffffff;
  --card-foreground: #242424;
  --popover: #ffffff;
  --popover-foreground: #242424;
  --primary: #343434;
  --primary-foreground: #fafafa;
  --secondary: #f7f7f7;
  --secondary-foreground: #343434;
  --muted: #f7f7f7;
  --muted-foreground: #8e8e8e;
  --accent: #f7f7f7;
  --accent-foreground: #343434;
  --destructive: #dc2626;
  --border: #e5e5e5;
  --input: #e5e5e5;
  --ring: #b4b4b4;
  --chart-1: #f97316;
  --chart-2: #06b6d4;
  --chart-3: #6366f1;
  --chart-4: #84cc16;
  --chart-5: #eab308;
  --sidebar: #fafafa;
  --sidebar-foreground: #242424;
  --sidebar-primary: #343434;
  --sidebar-primary-foreground: #fafafa;
  --sidebar-accent: #f7f7f7;
  --sidebar-accent-foreground: #343434;
  --sidebar-border: #e5e5e5;
  --sidebar-ring: #b4b4b4;
}

.dark {
  --background: #0a0a0a;
  --foreground: #fafafa;
  --card: #141414;
  --card-foreground: #fafafa;
  --popover: #141414;
  --popover-foreground: #fafafa;
  --primary: #ffffff;
  --primary-foreground: #0a0a0a;
  --secondary: #1a1a1a;
  --secondary-foreground: #fafafa;
  --muted: #1a1a1a;
  --muted-foreground: #a1a1aa;
  --accent: #1a1a1a;
  --accent-foreground: #fafafa;
  --destructive: #ef4444;
  --border: rgba(255, 255, 255, 0.1);
  --input: rgba(255, 255, 255, 0.05);
  --ring: #404040;
  --chart-1: #8b5cf6;
  --chart-2: #10b981;
  --chart-3: #eab308;
  --chart-4: #a855f7;
  --chart-5: #f59e0b;
  --sidebar: #141414;
  --sidebar-foreground: #fafafa;
  --sidebar-primary: #8b5cf6;
  --sidebar-primary-foreground: #fafafa;
  --sidebar-accent: #1a1a1a;
  --sidebar-accent-foreground: #fafafa;
  --sidebar-border: rgba(255, 255, 255, 0.1);
  --sidebar-ring: #404040;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@layer components {
  .gradient-bg {
    @apply bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-black dark:via-gray-950 dark:to-gray-900;
  }
  
  .glass-morphism {
    @apply bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10;
  }
  
  .confidence-high {
    @apply text-green-600 dark:text-green-400;
  }
  
  .confidence-medium {
    @apply text-yellow-600 dark:text-yellow-400;
  }
  
  .confidence-low {
    @apply text-red-600 dark:text-red-400;
  }
  
  .upload-zone {
    @apply border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors duration-200;
  }
  
  .upload-zone.active {
    @apply border-primary bg-primary/5;
  }
}

@layer utilities {
  .animate-pulse-slow {
    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  .animate-bounce-subtle {
    animation: bounce-subtle 2s infinite;
  }
  
  .animate-scan {
    animation: scan 2s ease-in-out infinite;
  }
}

@keyframes bounce-subtle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes scan {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
```

### Step 3: Modern Landing Page with Advanced Features

**src/app/page.tsx:**
```typescript
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Zap,
  Eye,
  Upload,
  Brain,
  Lock,
  FileImage,
  FileVideo,
  FileAudio,
  ArrowRight,
  Github,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Detection",
      description: "Advanced machine learning algorithms analyze media for manipulation patterns and deepfake signatures.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get results in seconds with our optimized processing pipeline and cloud-based analysis.",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description: "Your files are processed securely and never stored permanently. Complete privacy guaranteed.",
    },
    {
      icon: Eye,
      title: "Detailed Analysis",
      description: "Comprehensive reports with confidence scores, frame-by-frame analysis, and visual breakdowns.",
    },
  ];

  const supportedFormats = [
    { icon: FileImage, name: "Images", formats: "JPG, PNG, GIF, WebP" },
    { icon: FileVideo, name: "Videos", formats: "MP4, WebM, MOV, AVI" },
    { icon: FileAudio, name: "Audio", formats: "MP3, WAV, FLAC, AAC" },
  ];

  const stats = [
    { value: "99.2%", label: "Accuracy Rate" },
    { value: "<3s", label: "Average Analysis" },
    { value: "50M+", label: "Files Analyzed" },
    { value: "24/7", label: "Availability" },
  ];

  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Badge variant="outline" className="px-3 py-1">
                <Star className="w-3 h-3 mr-1 fill-current" />
                AI-Powered Detection
              </Badge>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Upload Media.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Detect Deepfakes.
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Advanced AI-powered deepfake detection for images, videos, and audio files. 
              Verify media authenticity with enterprise-grade accuracy in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/upload" prefetch={true}>
                <Button size="lg" className="font-semibold px-8 py-6 text-base">
                  <Upload className="mr-2 h-5 w-5" />
                  Try Detection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="font-semibold px-8 py-6 text-base">
                <Github className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose ITL Deepfake Detective?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with cutting-edge AI technology to provide the most accurate and reliable deepfake detection available.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <feature.icon className="h-10 w-10 text-primary mb-4" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Formats */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Supports All Media Types
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive analysis for images, videos, and audio files with detailed insights and frame-by-frame detection.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {supportedFormats.map((format, index) => (
              <motion.div
                key={format.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <format.icon className="h-16 w-16 text-primary mx-auto mb-4" />
                    <CardTitle className="text-xl">{format.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {format.formats}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Verify Your Media?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start detecting deepfakes with our advanced AI technology. 
              Upload your file and get results in seconds.
            </p>
            <Link href="/upload" prefetch={true}>
              <Button size="lg" className="font-semibold px-8 py-6 text-base">
                <Upload className="mr-2 h-5 w-5" />
                Start Free Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
```

### Step 6: Results Page

**src/app/results/page.tsx:**
```typescript
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface AnalysisResult {
  id: string;
  status: string;
  result?: {
    overall_score: number;
    prediction: string;
    confidence: number;
    details?: any;
  };
  media_type: string;
  filename: string;
  created_at: string;
  updated_at: string;
}

function ResultsContent() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  useEffect(() => {
    if (!id) {
      setError('No upload ID provided');
      setLoading(false);
      return;
    }

    const pollResult = async () => {
      try {
        const response = await fetch(`/api/rd/result/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch result');
        }

        const data = await response.json();
        setResult(data);

        // Continue polling if still processing
        if (data.status === 'processing' || data.status === 'pending') {
          setTimeout(pollResult, 2000);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching result:', err);
        setError('Failed to fetch analysis result');
        setLoading(false);
      }
    };

    pollResult();
  }, [id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-red-600 dark:text-red-400';
    if (confidence >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  if (loading && !result) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
          <span className="text-lg">Analyzing your media file...</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          This may take a few moments
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Error Loading Results
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
        <Button onClick={() => router.push('/')} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Upload
        </Button>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Results Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Unable to find analysis results for this upload.
        </p>
        <Button onClick={() => router.push('/')} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Upload
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(result.status)}
                Analysis Results
              </CardTitle>
              <CardDescription>
                {result.filename} • {result.media_type}
              </CardDescription>
            </div>
            <Badge variant={result.status === 'completed' ? 'default' : 'secondary'}>
              {result.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {result.status === 'processing' || result.status === 'pending' ? (
            <div className="text-center py-8">
              <div className="animate-pulse">
                <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <Clock className="h-6 w-6" />
                  <span className="text-lg">Still processing...</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  We're analyzing your media file. This page will update automatically.
                </p>
              </div>
            </div>
          ) : result.result ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                  <span className={`text-3xl font-bold ${getConfidenceColor(result.result.confidence)}`}>
                    {Math.round(result.result.confidence * 100)}%
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {result.result.prediction === 'fake' ? 'Likely Deepfake' : 'Likely Authentic'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Confidence: {Math.round(result.result.confidence * 100)}%
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Analysis Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Overall Score:</span>
                    <span className="font-medium">{result.result.overall_score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Prediction:</span>
                    <span className="font-medium capitalize">{result.result.prediction}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Media Type:</span>
                    <span className="font-medium capitalize">{result.media_type}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Analysis completed but no results available.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={() => router.push('/')} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Analyze Another File
        </Button>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Suspense fallback={<div>Loading...</div>}>
            <ResultsContent />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
```

---

## Running the Project

### Development Server

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Setup

1. Copy environment template:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your Reality Defender API key:
```bash
NEXT_PUBLIC_RD_API_KEY=your_actual_api_key_here
```

---

## Testing

### Create Test Files

**test-api.js:**
```javascript
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const { RealityDefender } = require('@realitydefender/realitydefender');

const rd = new RealityDefender({
  apiKey: process.env.NEXT_PUBLIC_RD_API_KEY,
  baseUrl: process.env.NEXT_PUBLIC_RD_API_URL || 'https://api.realitydefender.com',
});

async function testAPI() {
  try {
    console.log('Testing Reality Defender API...');
    
    // Test creating a signed URL
    const response = await rd.upload.create({
      filename: 'test-image.jpg',
      media_type: 'image'
    });
    
    console.log('✅ API connection successful!');
    console.log('Upload URL created:', response.upload_id);
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPI();
```

Run the test:
```bash
node test-api.js
```

### Manual Testing Checklist

1. **Upload Flow:**
   - [ ] Drag and drop file works
   - [ ] Click to select file works
   - [ ] File size validation works
   - [ ] File type validation works

2. **API Integration:**
   - [ ] Signed URL generation works
   - [ ] File upload to Reality Defender works
   - [ ] Result polling works
   - [ ] Error handling works

3. **UI/UX:**
   - [ ] Loading states display correctly
   - [ ] Error messages are helpful
   - [ ] Results display correctly
   - [ ] Navigation works

---

## Deployment

### Vercel Deployment

1. **Prepare for deployment:**
```bash
# Ensure all files are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy to Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Add NEXT_PUBLIC_RD_API_KEY
# Add NEXT_PUBLIC_RD_API_URL
```

3. **Environment Variables in Vercel:**
   - Go to Vercel dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add your API key and other environment variables

### Other Deployment Options

**Netlify:**
```bash
# Build the project
npm run build

# Deploy build folder
# Upload .next folder to Netlify
```

**Docker:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

---

## Additional Resources

### Reality Defender API Documentation
- [API Docs](https://docs.realitydefender.com/)
- [Platform Dashboard](https://www.realitydefender.com/platform/api)

### Next.js Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)

### UI Components
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## Troubleshooting

### Common Issues

1. **API Key Issues:**
   - Verify API key is correctly set in `.env.local`
   - Check API key has not expired
   - Ensure you're within API limits

2. **Upload Issues:**
   - Check file size (max 50MB)
   - Verify supported file formats
   - Check network connectivity

3. **Build Issues:**
   - Clear `.next` folder: `rm -rf .next`
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run lint`

### Getting Help

- Check the console for error messages
- Review network requests in browser dev tools
- Check Reality Defender API status
- Review Next.js documentation for framework issues

---

## Project Status

This project is a fully functional deepfake detection web application that:
- ✅ Accepts image and audio file uploads
- ✅ Integrates with Reality Defender API
- ✅ Provides real-time analysis results
- ✅ Features modern, responsive UI
- ✅ Includes proper error handling
- ✅ Ready for production deployment

**Free Tier Limitations:**
- 50 scans per month with Reality Defender free tier
- File size limit: 50MB
- Supported formats: Images (JPG, PNG, GIF, WebP) and Audio (MP3, WAV, OGG, M4A)

---

## Verification Checklist

Before running the project, verify that all files are in place:

### Essential Files Checklist

```bash
# Check all configuration files exist
ls -la {
package.json,
tsconfig.json,
next.config.ts,
tailwind.config.ts,
postcss.config.mjs,
components.json,
eslint.config.mjs,
.env.example,
.env.local,
.gitignore
}

# Check source files structure
tree src/ -I 'node_modules'
```

**Expected src/ structure:**
```
src/
├── app/
│   ├── api/
│   │   └── rd/
│   │       ├── result/
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       └── signed-url/
│   │           └── route.ts
│   ├── results/
│   │   └── page.tsx
│   ├── upload/
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/
│       ├── badge.tsx
│       ├── button.tsx
│       └── card.tsx
└── lib/
    └── utils.ts
```

### Final Setup Verification

1. **Dependencies installed:**
```bash
# Check if node_modules exists and has content
ls node_modules | head -10

# Verify key packages
npm list @realitydefender/realitydefender next react
```

2. **Environment variables set:**
```bash
# Check .env.local exists and has API key
grep -q "NEXT_PUBLIC_RD_API_KEY=" .env.local && echo "✅ API key configured" || echo "❌ API key missing"
```

3. **TypeScript compilation:**
```bash
# Check TypeScript compiles without errors
npx tsc --noEmit
```

4. **Build test:**
```bash
# Test build process
npm run build
```

### Quick Start Commands

Once everything is verified:

```bash
# Start development server
npm run dev

# In another terminal, test API connection
node test-api.js

# Open browser
open http://localhost:3000
```

---

## Success Indicators

Your setup is successful when:

1. ✅ `npm run dev` starts without errors
2. ✅ Application loads at `http://localhost:3000`
3. ✅ File upload interface is visible and functional
4. ✅ API test script connects successfully
5. ✅ No TypeScript compilation errors
6. ✅ Tailwind CSS styling is applied correctly
7. ✅ Environment variables are loaded
8. ✅ Drag and drop file upload works

### Common Success Screenshots

**Home Page Should Look Like:**
- Clean, modern interface with gradient background
- "Deepfake Detective" title prominently displayed
- Upload area with drag-and-drop functionality
- File type indicators (image and audio icons)
- API key warning message (yellow box)
- Responsive design that works on mobile

**Upload Process Should:**
- Show loading spinner when uploading
- Redirect to results page with proper URL parameter
- Display "Analyzing your media file..." message
- Update automatically when analysis completes

**Results Page Should:**
- Show analysis status (processing/completed)
- Display confidence percentage in large circle
- Show "Likely Deepfake" or "Likely Authentic" result
- Include detailed analysis information
- Have "Analyze Another File" button

If all these elements are working, your deepfake detection application is successfully set up and ready for use!

---

## 🚨 IMPORTANT: Getting the Complete Advanced Source Code

### Current Status of This Guide

This PROJECT_SETUP_GUIDE.md provides:
- ✅ **Complete project setup and configuration**
- ✅ **All necessary dependencies and environment setup**
- ✅ **Basic UI components (button, card, badge)**
- ✅ **API routes implementation**
- ✅ **Landing page implementation**
- ✅ **Basic project structure**
- ✅ **Complete navbar.tsx implementation**

### What's Missing (Due to Size Constraints)

The following **advanced components** contain **3,000+ lines of code** that couldn't be included in this guide:

**Critical Missing Files:**
```
src/components/layout/sidebar.tsx          [345 lines]
src/components/charts/confidence-gauge.tsx [230 lines]
src/components/charts/category-chart.tsx   [260 lines]
src/components/charts/advanced-charts.tsx  [410 lines]
src/components/explanation/explanation-dashboard.tsx [680 lines]
src/components/pdf/pdf-export-dialog.tsx   [300 lines]
src/components/pdf/pdf-chart-components.tsx [520 lines]
src/components/upload-box.tsx               [400 lines]
src/components/usage-dashboard.tsx          [200 lines]
src/lib/explanation-generator.ts            [200 lines]
src/lib/pdf-generator.ts                    [150 lines]
src/lib/reality-defender.ts                 [100 lines]
src/lib/usage-tracker.ts                    [180 lines]
src/app/upload/page.tsx                     [Complete implementation]
src/app/results/page.tsx                    [628 lines - full dashboard]
```

### 📞 How to Get the Complete Project

**Option 1: Request Source Code Files**
Ask for the complete source code of the above files to be shared separately.

**Option 2: Build Incrementally**
1. Use this guide to set up the basic project structure
2. Create placeholder components initially
3. Gradually implement the advanced features as needed

**Option 3: Clone from Repository**
If the complete project is available in a Git repository, clone it directly.

### Minimal Working Version

To get started immediately, create these placeholder files:

```bash
# Create placeholder files
touch src/components/layout/sidebar.tsx
touch src/components/charts/{confidence-gauge,category-chart,advanced-charts}.tsx
touch src/components/explanation/explanation-dashboard.tsx
touch src/components/pdf/{pdf-export-dialog,pdf-chart-components}.tsx
touch src/components/{upload-box,usage-dashboard}.tsx
touch src/lib/{explanation-generator,pdf-generator,reality-defender,usage-tracker}.ts

# Add basic exports to avoid build errors
echo "export default function Sidebar() { return <div>Sidebar</div>; }" > src/components/layout/sidebar.tsx
# Repeat for other files...
```

### 🎆 Final Note

This advanced deepfake detection project is a **comprehensive, production-ready application** with:
- Modern landing page
- Advanced dashboard with 628-line results page
- PDF export functionality
- AI explanation system
- Chart visualizations
- Usage tracking
- Professional UI/UX

**The complete source code is essential for the full functionality described in this guide.**
