import "../src/app/globals.css";

export const metadata = {
  title: "宵ノごはん",
  description: "料理、気分、産地、味わいから日本酒を探すペアリングアプリ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
