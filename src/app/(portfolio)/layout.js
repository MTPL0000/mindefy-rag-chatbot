import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mindefy - AI & Full Stack Solutions Portfolio",
  description: "Explore Mindefy's portfolio showcasing cutting-edge AI, Full Stack Web Development, and Mobile App solutions. Transforming ideas into reality with modern technology.",
  keywords: ["Mindefy", "Portfolio", "AI Development", "Full Stack", "React", "Next.js", "Software Engineering"],
  openGraph: {
    title: "Mindefy - AI & Full Stack Solutions Portfolio",
    description: "Explore Mindefy's portfolio showcasing cutting-edge AI and Full Stack solutions.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <link rel="icon" href="/favicon.png" sizes="icon" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body> 
    </html>
  );
}
