import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'embertalk lite',
  description: '5分で、キャリアを言語化しよう',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
