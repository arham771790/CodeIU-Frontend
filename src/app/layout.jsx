// src/app/layout.jsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import Structure from './Structure'
import { ThemeProvider } from "./components/ThemeProvider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-base-100 text-base-content flex flex-col transition-colors duration-300`}
      >
        <ThemeProvider>
          {/* Ensure Structure component doesn't have bg-black inside it */}
          <Structure>{children}</Structure>
        </ThemeProvider>
      </body>
    </html>
  );
}