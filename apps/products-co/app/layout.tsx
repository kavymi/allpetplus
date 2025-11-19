import type { Metadata } from 'next';
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
      <body>{children}</body>
    </html>
  );
}
