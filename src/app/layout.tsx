import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'embertalk',
  description: '焚き火のそばで、自分らしさを見つけるコーチング',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
