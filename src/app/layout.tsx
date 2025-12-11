import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { HabitProvider } from "@/context/HabitContext";
import { Chatbot } from "@/components/chatbot";
import { LlamaIntegration } from "@/llama/LlamaIntegration";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Habitual",
  description: "A minimalist and aesthetic habit tracker.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <HabitProvider>
            {children}
            <Chatbot />
            <LlamaIntegration />
          </HabitProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
