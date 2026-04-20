import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.navbarSettings.findUnique({
      where: { id: "1" },
      include: { navLinks: { orderBy: { order: "asc" } } },
    });

    if (!settings) {
      // Create default if not exists
      const defaultSettings = await prisma.navbarSettings.create({
        data: {
          id: "1",
          logoText: "ALIF.",
          navLinks: {
            create: [
              { name: "Home", href: "/", order: 0 },
              { name: "About", href: "#about", order: 1 },
              { name: "Skills", href: "#skills", order: 2 },
              { name: "Projects", href: "#projects", order: 3 },
              { name: "Experience", href: "#experience", order: 4 },
              { name: "Contact", href: "#contact", order: 5 },
            ],
          },
        },
        include: { navLinks: true },
      });
      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

interface NavLink {
  name: string;
  href: string;
  isActive: boolean;
  order: number;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const { logoText, logoImage, ctaText, ctaLink, showCTA, navLinks } = json;

    // Update settings
    await prisma.navbarSettings.upsert({
      where: { id: "1" },
      update: { logoText, logoImage, ctaText, ctaLink, showCTA },
      create: { id: "1", logoText, logoImage, ctaText, ctaLink, showCTA },
    });

    // Delete existing links and recreate (simplest for management)
    await prisma.navLink.deleteMany({
      where: { navbarSettingsId: "1" },
    });

    if (navLinks && navLinks.length > 0) {
      await prisma.navLink.createMany({
        data: navLinks.map((link: NavLink) => ({
          name: link.name,
          href: link.href,
          isActive: link.isActive !== undefined ? link.isActive : true,
          order: link.order !== undefined ? link.order : 0,
          navbarSettingsId: "1",
        })),
      });
    }

    return NextResponse.json({ message: "Navbar settings updated successfully" });
  } catch (error) {
    console.error("Navbar update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
