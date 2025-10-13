import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Blogify — Share Your Voice with the World",
  description:
    "Blogify is a modern platform for writers and readers. Share your ideas, read inspiring stories, and connect with a community that loves writing.",
  keywords: [
    "Blogify",
    "Blog platform",
    "Medium alternative",
    "Write and share blogs",
    "Read stories online",
  ],
  authors: [{ name: "Blogify Team" }],
  openGraph: {
    title: "Blogify — Share Your Voice with the World",
    description:
      "Read and write insightful blogs on Blogify, a minimal and powerful platform for creators.",
    url: "https://your-vercel-site.vercel.app",
    siteName: "Blogify",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Blogify - Read and Write Stories",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogify — Share Your Voice with the World",
    description:
      "Read and write insightful blogs on Blogify, a minimal and powerful platform for creators.",
    images: ["/og-image.png"],
    creator: "@blogify",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
