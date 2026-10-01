import "./globals.css";
import PwaRegister from "./components/PwaRegister";

export const metadata = {
  metadataBase: new URL("https://yoi-no-ikkon.vercel.app"),
  title: {
    default: "宵の一献｜日本酒を、夜から選ぶ。",
    template: "%s｜宵の一献",
  },
  description:
    "家庭料理、気分、産地、味わい、夜の気配から、こんな夜に開けたい日本酒を探すペアリング帳です。",
  applicationName: "宵の一献",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "宵の一献｜日本酒を、夜から選ぶ。",
    description:
      "家庭料理、気分、産地、味わい、夜の気配から、こんな夜に開けたい日本酒を探すペアリング帳です。",
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
    title: "宵の一献｜日本酒を、夜から選ぶ。",
    description:
      "家庭料理、気分、産地、味わい、夜の気配から、こんな夜に開けたい日本酒を探すペアリング帳です。",
    images: ["/og-default.svg"],
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
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
  return (
    <html lang="ja">
      <body>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
