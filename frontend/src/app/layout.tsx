import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import { FavoritesProvider } from "@/context/favouritesContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Trending Movies",
  description: "A list of trending movies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased`}
      >
        <Navbar />
        <FavoritesProvider>
        {children}
        <Toaster />
        </FavoritesProvider>
      </body>
    </html>
  );
}
