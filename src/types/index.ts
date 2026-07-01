// ─────────────────────────────────────────────
//  Core domain types for the Marketing Dashboard
// ─────────────────────────────────────────────

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  userName: string;
  text: string;
  timeMarker: string;
  resolved: boolean;
}

export interface Project {
  id: string;
  dayAdded: string;
  type: string;
  campaign: string;
  purpose: string;
  priority: string;
  title: string;
  assignee: string;
  by: string;
  script: string;
  raw: string;
  edit: string;
  adLink?: string;
  notes: string;
  overall: string;
  thumbnailSeed: string;
  checklist: ChecklistItem[];
  assets: string[];
  comments: Comment[];
  isArchived: boolean;

  // Schedule fields
  shootTime: string;
  shootDuration: number;
  shootDetails: string;
  socMedPlatform: string;
  postTime: string;
  adPlatforms: string[];
  adTime: string;
  adStartDate?: string;
  adEndDate?: string;
}

export interface TypeEntry {
  name: string;
  colorKey: string;
}

export interface CampaignEntry {
  name: string;
  colorKey: string;
}

export interface StageEntry {
  id: string;
  name: string;
  colorKey: string;
}

export interface StylingPreset {
  label: string;
  classes: string;
}

export type StylingPresetKey =
  | 'zinc'
  | 'red'
  | 'orange'
  | 'amber'
  | 'emerald'
  | 'blue'
  | 'indigo'
  | 'fuchsia';

export interface VideoEmbedInfo {
  type: 'html5' | 'youtube' | 'gdrive';
  url: string;
}

export interface CalendarDay {
  dayNum: number;
  isCurrentMonth: boolean;
  fullDate: string;
}

export interface WeekDay {
  dayNum: number;
  fullDate: string;
  label: string;
}

export type SocialPostStatus = 'Draft' | 'Scheduled' | 'Published' | 'Failed';
export type SocialPlatform = 'Instagram' | 'Facebook' | 'TikTok' | 'YouTube';

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  caption: string;
  scheduledDate: string;   // YYYY-MM-DD
  scheduledTime: string;   // e.g. "09:00 AM"
  status: SocialPostStatus;
  hashtags: string[];
  projectId?: string;
}

export type CalendarMode = 'production' | 'socmed' | 'ads';
