import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import ReactQueryProvider from '@/components/providers/ReactQueryProvider';
import StoreProvider from '@/components/providers/StoreProvider';
import FirstLoad from '@/components/FirstLoad';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s - Sigmart',
    default: 'Sigmart',
  },
  description: 'Belanja terus tanpa putus',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <StoreProvider>
            <FirstLoad>{children}</FirstLoad>
          </StoreProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
