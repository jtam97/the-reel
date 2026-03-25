import type { Metadata } from "next";
import { Playfair_Display, Special_Elite, IM_Fell_English } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const specialElite = Special_Elite({
  variable: "--font-typewriter",
  subsets: ["latin"],
  weight: "400",
});

const imFell = IM_Fell_English({
  variable: "--font-body",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "THE REEL — Every Frame. Every Date. Every Legend.",
  description:
    "A retro cinematic movie dashboard. Explore upcoming releases, discover what happened on any date in film history.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${specialElite.variable} ${imFell.variable} h-full`}
    >
      <body className="min-h-screen bg-dark text-cream font-[family-name:var(--font-body)] film-grain vignette">
        <div className="sprocket-left" />
        <div className="sprocket-right" />
        {children}
        <footer className="fixed bottom-0 left-0 right-0 z-[45] border-t border-film-brown/40 bg-dark/90 backdrop-blur-sm py-2 px-6 md:px-12">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <span className="font-[family-name:var(--font-typewriter)] text-cream/30 text-xs">
              Built by{" "}
              <a
                href="https://projects.justinztam.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/60 hover:text-gold transition-colors"
              >
                Justin Z Tam
              </a>
            </span>
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-cream/30 hover:text-cream/50 transition-colors"
            >
              <svg viewBox="0 0 190 18" className="h-3 w-auto opacity-50 hover:opacity-80 transition-opacity" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h6.3v1.6H4v14.8h2.3V18H0v-1.6h2.3V1.6H0V0zm8.6 0h5.8v1.6h-4.1v6h3.5v1.7h-3.5v7.1h4.1V18H8.6V0z" fill="currentColor"/>
                <text x="20" y="14" fontFamily="sans-serif" fontSize="14" fontWeight="bold" fill="currentColor">TMDB</text>
              </svg>
              <span className="font-[family-name:var(--font-typewriter)] text-[10px] hidden sm:inline">
                Uses the TMDB API — not endorsed or certified by TMDB.
              </span>
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
