import type { Metadata } from 'next';
import { AppLayout } from '@/components/app-layout';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { AuthProvider } from '@/components/auth-provider';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'ADR E-Store',
  description: 'Your one-stop shop for everything',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&family=Open+Sans:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased" style={{ fontFamily: "'Open Sans', sans-serif" }}>
        <AuthProvider>
            <AppLayout>{children}</AppLayout>
            <Toaster />
        </AuthProvider>
        <Script id="clear-local-storage" strategy="beforeInteractive">
          {`
            if (typeof window !== 'undefined') {
              window.localStorage.removeItem('users');
              window.localStorage.removeItem('allInvoices');
            }
          `}
        </Script>
      </body>
    </html>
  );
}
