import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Cat, Home } from "lucide-react";
import BodySection from "@/components/custom/BodySection";
import QueryClientWrapper from "@/components/custom/queryClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cats App",
  description: "Tu aplicación de gatos favorita",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientWrapper>
      <html lang="en">
        <body className={inter.className}>
          <header className="bg-white z-10 sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold md:text-base"
              >
                <Cat className="h-6 w-6" />
                <span>CATS APP</span>
                <span className="sr-only">Home</span>
              </Link>
            </nav>
          </header>
          <BodySection>{children}</BodySection>
        </body>
      </html>
    </QueryClientWrapper>
  );
}
