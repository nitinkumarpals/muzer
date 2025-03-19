"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
};

export default Providers;
