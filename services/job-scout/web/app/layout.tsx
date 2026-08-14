import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Jobvis",
  description: "The voice concierge for Job Scout — a holographic console over an observable agent.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
