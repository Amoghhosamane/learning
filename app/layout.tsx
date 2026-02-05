import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Nav from '@/components/Nav';

const roboto = Roboto({
  weight: ['400', '900'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SkillOrbit - Learn Skills That Matter',
  description: 'Master in-demand skills with expert-led courses and hands-on projects',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Providers>
          {/* Global navigation */}
          <Nav />

          {children}
        </Providers>
      </body>
    </html>
  );
}