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
  openGraph: {
    title: 'Sigmart - Belanja terus tanpa putus',
    description:
      'Nikmati pengalaman belanja yang menyenangkan hanya di Sigmart.',
    url: 'https://sigmart.shop',
    siteName: 'Sigmart',
    images: [
      {
        url: `https://sigmart.shop/sigmart-banner.png`,
        width: 1280,
        height: 426,
        alt: 'Sigmart - Belanja terus tanpa putus',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sigmart - Belanja terus tanpa putus',
    description:
      'Nikmati pengalaman belanja yang menyenangkan hanya di Sigmart.',
    images: ['https://sigmart.shop/sigmart-banner.png'],
  },
  keywords: ['Sigmart', 'belanja online', 'toko online', 'ecommerce'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
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
