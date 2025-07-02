import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";
import { getBranding } from "./lib/api/branding";
import { BrandingProvider } from "@/context/branding-context";

export const metadata: Metadata = {
  title: "Zetexa",
  description: "Zetexa - The best way to get an eSIM for your trip",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const branding = await getBranding();
  return (
    <html lang="en">
      <body>
        <BrandingProvider value={branding.branding}>
          <Header branding={branding.branding}/>
          <main className="pt-16" >{children}</main>
          <Footer branding={branding.branding}/>
        </BrandingProvider>
      </body>
    </html>
  );
}
