import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: [
    "300",
    "400",
    "500",
    "600",
    "700",
  ],
});

export const metadata: Metadata = {
  title: "E-Learning Perakitan Komputer",
  description:
    "Media Pembelajaran Perakitan Komputer Berbasis Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${poppins.className} min-h-full flex flex-col antialiased`}
      >
        {children}
      </body>
    </html>
  );
}