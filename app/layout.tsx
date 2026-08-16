import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ChatWidget } from "@/components/chat-widget";
import { profile } from "@/data/profile";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${profile.name} — Portfolio`,
    template: `%s · ${profile.name}`,
  },
  description:
    "Computer Engineering student at PCCOE Pune building fast algorithms, full-stack platforms, and vision-powered robots. Projects, skills, and experience.",
  keywords: [
    "Hrushikesh Jagtap",
    "portfolio",
    "computer engineering",
    "software developer",
    "machine learning",
    "computer vision",
    "YOLO",
    "PCCOE",
  ],
  authors: [{ name: profile.name }],
  openGraph: {
    title: `${profile.name} — Portfolio`,
    description:
      "Computer Engineering student building fast algorithms, full-stack platforms, and vision-powered robots.",
    type: "website",
    url: "https://my-portfolio-kappa-teal-10.vercel.app",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream font-sans text-ink">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
