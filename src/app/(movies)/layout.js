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
  title: "CineSense - AI Powered Movie Recommendations | Mindefy",
  description: "CineSense by Mindefy: Discover your next favorite movie with our AI-powered recommendation engine. Get personalized suggestions based on your taste.",
  keywords: ["CineSense", "Movie Recommendations", "AI Movies", "Personalized Suggestions", "Cinema", "Mindefy"],
  openGraph: {
    title: "CineSense - AI Powered Movie Recommendations",
    description: "Discover your next favorite movie with CineSense AI.",
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
