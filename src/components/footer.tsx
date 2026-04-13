"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Footer() {
  const pathname = usePathname()
  if (pathname.startsWith("/admin")) return null

  return (
    <footer className="border-t border-border/40 py-8 md:py-0 bg-background/80 backdrop-blur">
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 md:h-20 px-4">
        <p className="text-center text-sm leading-loose text-muted-foreground">
          Built with ❤️ by{" "}
          <Link href="/" className="font-semibold text-primary underline underline-offset-4">
            Shahriar Alif
          </Link>
          . All rights reserved &copy; {new Date().getFullYear()}.
        </p>
      </div>
    </footer>
  )
}
