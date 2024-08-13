import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Provider from "./provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import HeaderComponent from "@/components/LayoutComponents/HeaderComponent";
import NavigationComponent from "@/components/LayoutComponents/NavigationComponent";

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
      <head>
        {/* Google Search Console */}
        <meta
          name="google-site-verification"
          content="jkoYdn7HV4fimraagC-nhIJYIs8bbgU_K2Q3VmEu-bY"
        />
        {/* Naver Search Advisor */}
        <meta
          name="naver-site-verification"
          content="9ac48991deaaa73527ef2d50075aa95f73ce6c73"
        />
      </head>
      <body className={inter.className}>
        <Provider>
          <div className="container" style={{ paddingBottom: "80px" }}>
            <HeaderComponent />
            {children}
            <NavigationComponent />
          </div>
        </Provider>
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
