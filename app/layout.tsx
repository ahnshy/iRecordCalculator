import type { Metadata } from 'next';
import './globals.css';
import ThemeRegistry from '../components/ThemeRegistry';

export const metadata: Metadata = {
  title: 'iRecordCalculator',
  description: 'iPhone-style calculator with history',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><ThemeRegistry>{children}</ThemeRegistry></body>
    </html>
  );
}
