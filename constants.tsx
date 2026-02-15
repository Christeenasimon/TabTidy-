
import React from 'react';
import { Tab, TabCategory, Badge } from './types';

export const COLORS = {
  primary: '#ffa175', // Butternut
  accent: '#5c0702',  // Deep Cherry
  softOrange: '#ffb58c',
  white: '#ffffff',
};

export const MOCK_TABS: Tab[] = [
  { id: '1', title: 'React Documentation', url: 'react.dev', category: TabCategory.RESEARCH, lastAccessed: Date.now() - 100000, isDuplicate: false, favicon: 'https://react.dev/favicon.ico' },
  { id: '2', title: 'Amazon: Cherry Plushie', url: 'amazon.com', category: TabCategory.SHOPPING, lastAccessed: Date.now() - 500000, isDuplicate: false, favicon: 'https://www.amazon.com/favicon.ico' },
  { id: '3', title: 'Twitter / X', url: 'twitter.com', category: TabCategory.SOCIAL, lastAccessed: Date.now() - 200000, isDuplicate: false, favicon: 'https://abs.twimg.com/favicons/twitter.2.ico' },
  { id: '4', title: 'Tailwind CSS Guide', url: 'tailwindcss.com', category: TabCategory.RESEARCH, lastAccessed: Date.now() - 10000, isDuplicate: false, favicon: 'https://tailwindcss.com/favicon.ico' },
  { id: '5', title: 'Udemy: UI/UX Masterclass', url: 'udemy.com', category: TabCategory.STUDY, lastAccessed: Date.now() - 600000, isDuplicate: false, favicon: 'https://www.udemy.com/static/images/favicon-32x32.png' },
  { id: '6', title: 'React Documentation (Copy)', url: 'react.dev', category: TabCategory.RESEARCH, lastAccessed: Date.now() - 800000, isDuplicate: true, favicon: 'https://react.dev/favicon.ico' },
  { id: '7', title: 'Etsy: Hand-knit sweater', url: 'etsy.com', category: TabCategory.SHOPPING, lastAccessed: Date.now() - 1200000, isDuplicate: false, favicon: 'https://www.etsy.com/favicon.ico' },
  { id: '8', title: 'Wikipedia: Cherries', url: 'wikipedia.org', category: TabCategory.RESEARCH, lastAccessed: Date.now() - 1000, isDuplicate: false, favicon: 'https://wikipedia.org/favicon.ico' },
];

export const INITIAL_BADGES: Badge[] = [
  { id: 'b1', name: 'Cherry Picker', description: 'Closed 10 tabs', icon: '🍒', unlocked: false },
  { id: 'b2', name: 'Zen Master', description: 'Reached 100 Cleanup Score', icon: '🧘', unlocked: false },
  { id: 'b3', name: 'Organizer', description: 'Grouped all tabs with AI', icon: '📦', unlocked: false },
];
