/**
 * Content & Media CO Types
 * Division 3 of 12
 */

export interface ContentPiece {
  id: string;
  title: string;
  type: 'video' | 'podcast' | 'article' | 'short-story' | 'ebook';
  platform: string[];
  publishedAt: Date;
  views: number;
  engagement: number;
}

export interface InfluencerPartnership {
  id: string;
  influencerId: string;
  tier: 'nano' | 'micro' | 'macro' | 'mega';
  followers: number;
  contractType: 'campaign' | 'annual' | 'ambassador';
  compensation: number;
  status: 'active' | 'inactive';
}

export interface SponsorshipDeal {
  id: string;
  brandName: string;
  dealType: 'episode' | 'series' | 'event' | 'product-placement';
  amount: number;
  startDate: Date;
  endDate: Date;
  deliverables: string[];
}

export interface Competition {
  id: string;
  name: string;
  category: string;
  startDate: Date;
  endDate: Date;
  prizes: Array<{ place: number; prize: string; value: number }>;
  participants: number;
}

