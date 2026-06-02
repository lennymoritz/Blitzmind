import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlitzMind — The Adaptive Gaming Controller",
  description:
    "A controller that reads your physiology and adapts the game around you. Built for competitive play.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Inter+Tight:wght@300;400;500;600&family=Geist+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-bg text-fg font-sans selection:bg-accent/30 selection:text-fg">
        {children}
      </body>
    </html>
  );
}
