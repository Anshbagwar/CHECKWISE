import React from "react";
import { Mona_Sans } from "next/font/google";
import "./globals.css";

const mona_Sans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Crackwise",
  description: "An AI-powered platform for interview preparation",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en" className="dark">
      <body className={`${mona_Sans.className} antialiased pattern`}>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
