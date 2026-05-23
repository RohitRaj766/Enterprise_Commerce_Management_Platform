import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const gilroyLight = localFont({
  src: "../public/fonts/Gilroy/Gilroy-Light.otf",
  variable: "--font-gilroy-light",
  weight: "300",
  display: "swap",
});

const gilroyExtraBold = localFont({
  src: "../public/fonts/Gilroy/Gilroy-ExtraBold.otf",
  variable: "--font-gilroy-extrabold",
  weight: "800",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nectar | Fresh Groceries Delivered Fast",
    template: "%s | Nectar Grocery Delivery",
  },
  description:
    "Order fresh groceries, produce, meat, and daily essentials with fast delivery. Track orders, save favorites, and checkout securely on Nectar.",
  keywords: [
    "online grocery delivery",
    "fresh produce",
    "same-day groceries",
    "order fruits online",
    "order vegetables online",
    "grocery deals",
    "Nectar app",
  ],
  applicationName: "Nectar",
  authors: [{ name: "Nectar" }],
  openGraph: {
    title: "Nectar | Fresh Groceries Delivered Fast",
    description:
      "Order fresh groceries, produce, meat, and daily essentials with fast delivery. Track orders, save favorites, and checkout securely on Nectar.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Nectar | Fresh Groceries Delivered Fast",
    description:
      "Order fresh groceries, produce, meat, and daily essentials with fast delivery. Track orders, save favorites, and checkout securely on Nectar.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${gilroyLight.variable} ${gilroyExtraBold.variable} antialiased`}
      >
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
