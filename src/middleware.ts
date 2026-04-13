import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware() {},
  {
    pages: {
      signIn: "/admin/login",
    },
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname
        // Allow login and setup pages without auth
        if (
          pathname.startsWith("/admin/login") ||
          pathname.startsWith("/admin/setup")
        ) {
          return true
        }
        // All other /admin routes require a token
        if (pathname.startsWith("/admin")) {
          return !!token
        }
        return true
      }
    }
  }
)

export const config = {
  matcher: ["/admin/:path*"],
}
