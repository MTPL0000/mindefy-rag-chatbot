import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "CineSense - Discover Your Next Favorite Movie",
  description: "Personalized movie recommendations based on your taste",
};

export default function MoviesLayout({ children }) {
  return (
    <div className={`${inter.variable}`}>
      {children}
    </div>
  );
}
