export interface NavLink {
  label: string;
  href: string;
}

export interface NavBar {
  leftLinks: NavLink[];
  centerLogo: { label: string; href: string };
  rightLinks: NavLink[];
  discordUrl?: string;
  githubUrl?: string;
}

export interface HeroSection {
  tagline: string;
  subtitle: string;
  title: string;
  ctaText: string;
  posterImage: string;
  videoSrc?: string;
}

export interface DownloadCard {
  platform: string;
  osLabel: string;
  minVersion: string;
  imageSrc: string;
  downloadUrl: string;
  buttonLabel: string;
  isTerminal?: boolean;
}

export interface PreviewSection {
  videoPoster: string;
  videoSrc?: string;
}

export interface FeatureItem {
  number: string;
  title: string;
  description: string;
  imageSrc: string;
}

export interface FeatureSection {
  badgeImage: string;
  features: FeatureItem[];
}

export interface PricingPlan {
  name: string;
  description: string;
  href: string;
}

export interface FooterSection {
  plans: PricingPlan[];
  portalUrl: string;
  portalWordmark: string;
  figureImage: string;
  version: string;
  nousLogo: string;
  nousName: string;
  year: number;
  license: string;
  orbVideoSrc?: string;
}
