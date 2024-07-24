import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Provider from "./provider";
import { GoogleAnalytics } from "@next/third-parties/google"

const inter = Inter({ subsets: ["latin"] });

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  title: "JUMO",
  description: "내가 찾던 완벽한 주류 모임, 주모",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          {children}
        </Provider>
      </body>
      { gaId && <GoogleAnalytics gaId={gaId} /> }
    </html>
  );
}
