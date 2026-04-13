import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // পরবর্তী ধাপে এখানে ডাটাবেস থেকে ইউজার চেক করার অপশন যোগ করা হবে।
        // আপাতত ডেভেলপমেন্টের জন্য হার্ডকোডেড লগইন:
        if (credentials?.email === "admin@example.com" && credentials?.password === "admin123") {
          return { id: "1", name: "Admin", email: credentials.email };
        }
        return null; // লগইন ফেইল করলে
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    }
  },
  pages: {
    signIn: "/admin/login",
  },
  // ডেভেলপমেন্টের জন্য সিক্রেট (প্রোডাকশনে env থেকে আসবে)
  secret: process.env.NEXTAUTH_SECRET || "a-super-secret-key-for-nextauth",
};
