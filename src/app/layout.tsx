import type { Metadata } from "next";
import { Lato, Roboto } from "next/font/google";
import "./globals.css";

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
});

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Gemini OneClick V2",
  description:
    "Suivi des opérations d'onboarding, offboarding et de synchronisation des données.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${lato.variable} ${roboto.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        />
      </head>
      <body>
        {children}
        <footer className="site-footer">
          <p>© VALECO - IT Department</p>
        </footer>
      </body>
    </html>
  );
}
