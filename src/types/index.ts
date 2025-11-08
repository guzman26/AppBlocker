export interface SelectedApplication {
  identifier: string;
  name: string;
  bundleId?: string;
  category?: string;
  iconUrl?: string;
  blockedUntil?: string;
}

export interface BlockedWebsite {
  domain: string;
  addedAt: string;
  note?: string;
}

export interface IntentionRecord {
  id: string;
  createdAt: string;
  intention: string;
  fulfilled: boolean;
  notes?: string;
}

export interface InterventionConfig {
  enabled: boolean;
  breathingDuration: number;
  requireIntention: boolean;
  showAlternatives: boolean;
}

export interface DailyStats {
  date: string;
  blockedMinutes: number;
  interventionCount: number;
  successfulBlocks: number;
  focusScore?: number;
}

