import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "E-Learning Perakitan Komputer",
  description: "Media Pembelajaran Perakitan Komputer Berbasis Website",
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

<Toaster
  position="top-right"
  reverseOrder={false}
  toastOptions={{
    duration: 2500,
    style: {
      borderRadius: "10px",
      color: "#fff",
      padding: "12px 16px",
      fontSize: "14px",
      fontWeight: "500",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },

    success: {
      style: {
        background: "#22c55e",
        color: "#fff",
      },
      iconTheme: {
        primary: "#fff",      // warna icon
        secondary: "#22c55e", // warna lingkaran
      },
    },

    error: {
      style: {
        background: "#ef4444",
        color: "#fff",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#ef4444",
      },
    },
  }}
/>
      </body>
    </html>
  );
}