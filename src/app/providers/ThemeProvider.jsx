"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }) {
  return (
    <NextThemesProvider 
      attribute="data-theme" 
      defaultTheme="dark"
      /* Add this line to stop the browser from forcing dark mode */
      enableColorScheme={false} 
    >
      {children}
    </NextThemesProvider>
  );
}