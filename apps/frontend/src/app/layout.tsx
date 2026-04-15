import { Header } from '@/components/shared/header';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Unimad',
  description: 'A full-stack web application built with Next.js, Express, and MongoDB.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn('font-sans', geist.variable)}>
      <body>
        <Header />
        <main className="px-6 lg:px-8">{children}</main>
      </body>
    </html>
  );
}
