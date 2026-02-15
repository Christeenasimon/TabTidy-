
export enum TabCategory {
  STUDY = 'Study',
  SHOPPING = 'Shopping',
  SOCIAL = 'Social',
  RESEARCH = 'Research',
  UNCATEGORIZED = 'Uncategorized'
}

export interface Tab {
  id: string;
  title: string;
  url: string;
  category: TabCategory;
  lastAccessed: number; // timestamp
  isDuplicate: boolean;
  favicon?: string;
}

export interface TabGroup {
  id: string;
  name: string;
  tabs: Tab[];
  summary?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export type OverwhelmLevel = 'Calm' | 'Mild chaos' | 'Brain meltdown mode';
