export type BlockSchedule = {
  identifier: string;
  startDate: string;
  endDate: string;
  repeatsDaily: boolean;
  weekday?: number;
};

export type SelectedApplication = {
  bundleIdentifier: string;
  displayName: string;
  category: string;
};

export type EventPayload = {
  event: 'activitySummary' | 'activityAlert' | 'appLaunchAttempt' | 'interventionShown';
  message: string;
  bundleIdentifier?: string;
  timestamp?: string;
};

export type UsageData = {
  totalBlockedTime: number;
  blockedApps: AppUsage[];
  interventions: number;
  intentionsFulfilled: number;
};

export type AppUsage = {
  bundleIdentifier: string;
  displayName: string;
  blockedMinutes: number;
  launchAttempts: number;
};

export type FocusMode = {
  id: string;
  name: string;
  isActive?: boolean;
};

export type InterventionConfig = {
  enabled: boolean;
  breathingDuration: number;
  requireIntention: boolean;
  showAlternatives: boolean;
};

export type IntentionRecord = {
  id: string;
  appBundleId: string;
  appName: string;
  intention: string;
  timestamp: string;
  fulfilled: boolean;
};

export type BlockedWebsite = {
  domain: string;
  addedAt: string;
};

export type DailyStats = {
  date: string;
  blockedMinutes: number;
  interventionCount: number;
  successfulBlocks: number;
};

