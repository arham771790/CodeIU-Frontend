// src/app/layout.jsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import Structure from './Structure'
import { ThemeProvider } from "./components/ThemeProvider"
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://codeiu.in"),
  title: {
    default: "CodeIU - Master Your Coding Skills",
    template: "%s | CodeIU",
  },
  description: "CodeIU is an interactive platform for mastering data structures and algorithms through practice problems and contests. Join our community of developers today.",
  keywords: ["coding platform", "DSA problems", "online judge", "CodeIU", "programming practice", "competitive programming", "algorithm practice"],
  authors: [{ name: "Arham" }],
  openGraph: {
    title: "CodeIU - Master Your Coding Skills",
    description: "The ultimate platform for coders to practice, compete, and improve.",
    url: "https://codeiu.in",
    siteName: "CodeIU",
    images: [
      {
        url: "/codeimg.jpeg",
        width: 1200,
        height: 630,
        alt: "CodeIU",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeIU - Master Your Coding Skills",
    description: "Join CodeIU to solve DSA problems and participate in coding contests.",
    images: ["/codeimg.jpeg"],
  },
};

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

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VZBZVYC9Q7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-VZBZVYC9Q7');
          `}
        </Script>
      </body>
    </html>
  );
}