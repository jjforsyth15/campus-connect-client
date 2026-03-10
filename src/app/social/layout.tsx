'use client';

import { ThemeProvider } from '@/social-feed/context/ThemeContext';

export default function SocialLayout({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
