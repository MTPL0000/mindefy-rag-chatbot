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
  title: "AskDocs - Intelligent Document Assistant | Mindefy",
  description: "AskDocs by Mindefy: Your intelligent AI assistant for document analysis and Q&A. Upload PDFs and get instant, accurate answers using advanced RAG technology.",
  keywords: ["AskDocs", "AI", "Document Analysis", "PDF Chat", "RAG", "Mindefy", "Artificial Intelligence"],
  openGraph: {
    title: "AskDocs - Intelligent Document Assistant",
    description: "Chat with your documents using AskDocs AI.",
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
