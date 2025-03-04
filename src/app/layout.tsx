import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WixClientContextProvider } from "@/context/wixContext";
import Hero from "@/components/Banner";


export const metadata: Metadata = {
  title: "BDN",
  description: "A complete e-commerce application with Next.js and Wix",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-quicksand">
  

        <WixClientContextProvider>
        <Navbar/>
           {children}
          <Footer/>
        </WixClientContextProvider>
      
        </body>
    </html>
  );
}
