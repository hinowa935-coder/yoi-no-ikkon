import "./globals.css";
import PwaRegister from "./components/PwaRegister";
import { FavoritesProvider } from "./components/Ochoko.jsx";
import CommerceMediaProvider from './components/CommerceMediaProvider.jsx';
import {readCommerceConfig} from '../commerce/providers.js';

export const metadata = {
  metadataBase: new URL("https://yoi-no-ikkon.vercel.app"),
  title: {
    default: "宵の一献｜日本酒と家庭料理のペアリング帳",
    template: "%s｜宵の一献",
  },
  description:
    "日本酒と家庭料理のペアリングを、料理・銘柄・産地・味わい・今夜の気分から探せるサイトです。",
  applicationName: "宵の一献",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "宵の一献｜日本酒と家庭料理のペアリング帳",
    description:
      "日本酒と家庭料理のペアリングを、料理・銘柄・産地・味わい・今夜の気分から探せるサイトです。",
    url: "https://yoi-no-ikkon.vercel.app/",
    siteName: "宵の一献",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/og-default.svg",
        width: 1200,
        height: 630,
        alt: "宵の一献",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "宵の一献｜日本酒と家庭料理のペアリング帳",
    description:
      "日本酒と家庭料理のペアリングを、料理・銘柄・産地・味わい・今夜の気分から探せるサイトです。",
    images: ["/og-default.svg"],
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-v24.svg", type: "image/svg+xml" },
      { url: "/icons/favicon-32-v24.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192-v24.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512-v24.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon-v24.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: "宵の一献",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
  themeColor: "#061127",
};

export default function RootLayout({ children }) {
  const commerce=readCommerceConfig(process.env);
  const mediaEnabled=commerce.enabled&&commerce.enabledProviders.includes('rakuten')&&commerce.routes.rakuten==='rakuten'&&commerce.registeredSite==='https://yoi-no-ikkon.vercel.app/';
  return (
    <html lang="ja">
      <body>
        <CommerceMediaProvider enabled={mediaEnabled}><FavoritesProvider>{children}</FavoritesProvider></CommerceMediaProvider>
        <PwaRegister />
      </body>
    </html>
  );
}
