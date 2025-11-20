import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@pet/ui';
import './globals.css';

export const metadata: Metadata = {
  title: 'Products - All Pet Plus',
  description: 'E-commerce platform for custom pet gear and lifestyle products',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <main className="flex-grow">
          {children}
        </main>
        <Footer LinkComponent={Link} />
      </body>
    </html>
  );
}
