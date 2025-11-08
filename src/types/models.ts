export interface BlockSession {
  name: string;
  description: string;
  timeRange: string;
  progress: number;
  isActive: boolean;
  accentColor: string;
}

export interface AppUsage {
  name: string;
  category: string;
  used: number; // Duration in minutes
  limit: number; // Duration in minutes
  changePercentage: number;
  icon: string;
  tint: string;
}

export interface Schedule {
  name: string;
  days: string[];
  timeRange: string;
  isEnabled: boolean;
}

export interface Insight {
  title: string;
  subtitle: string;
  deltaDescription: string;
  highlight: number;
  trend: number;
}

export interface Profile {
  name: string;
  role: string;
  email: string;
  avatarUrl: string;
  notificationsEnabled: boolean;
  hapticFeedbackEnabled: boolean;
}

export interface MockData {
  sessions: BlockSession[];
  usage: AppUsage[];
  schedules: Schedule[];
  insights: Insight[];
  profile: Profile;
}














