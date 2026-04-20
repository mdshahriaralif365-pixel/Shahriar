import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SessionProvider } from "@/components/session-provider";
import { Toaster } from "sonner";
import { prisma } from "@/lib/prisma";

const outfit = Outfit({ subsets: ["latin"], display: "swap" });


export async function generateMetadata(): Promise<Metadata> {
  let siteName = "Shahriar Alif";
  let siteRole = "Full-Stack Web Developer";
  let favicon = "/favicon.ico";

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const siteSettings = await (prisma as any).siteSettings.findUnique({
      where: { id: "1" }
    });
    if (siteSettings) {
      siteName = siteSettings.siteName || siteName;
      siteRole = siteSettings.siteRole || siteRole;
      favicon = siteSettings.favicon || favicon;
    }
  } catch (err) {
    console.error("Metadata fetch error:", err);
  }

  return {
    title: {
      default: `${siteName} | ${siteRole}`,
      template: `%s | ${siteName}`
    },
    description: `Senior ${siteRole} & UI/UX Designer specializing in building high-performance, responsive web applications with Next.js, React, and Node.js.`,
    keywords: [siteName, siteRole, "Next.js Developer", "React Developer", "Portfolio", "Web Design", "Software Engineer"],
    authors: [{ name: siteName, url: "https://github.com/shahriar-alif" }],
    creator: siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://shahriaralif.dev",
      title: `${siteName} | ${siteRole}`,
      description: `Modern portfolio of ${siteName}. Building exceptional digital experiences.`,
      siteName: `${siteName} Portfolio`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} | ${siteRole}`,
      description: `Senior ${siteRole} & UI/UX Designer.`,
      creator: "@shahriar_alif",
    },
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let navbarSettings = null;
  let footerSettings = null;

  try {
    navbarSettings = await prisma.navbarSettings.findUnique({
      where: { id: "1" },
      include: { navLinks: { orderBy: { order: "asc" } } },
    });
  } catch (err) {
    console.error("Navbar settings fetch error:", err);
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    footerSettings = await (prisma as any).footerSettings.findUnique({
      where: { id: "1" },
    });
  } catch (err) {
    console.error("Footer settings fetch error:", err);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} min-h-screen bg-background font-sans antialiased text-foreground`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <Navbar settings={navbarSettings} />
              <main className="flex-1">{children}</main>
              <Footer settings={footerSettings} />
            </div>
            <Toaster position="bottom-right" richColors closeButton />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
