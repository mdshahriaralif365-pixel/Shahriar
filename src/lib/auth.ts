import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // অটোমেটিক ডাটাবেস আপডেট এবং বাইপাস:
        if (credentials.email === "admin@example.com" && credentials.password === "admin123") {
          const hashedPassword = await bcrypt.hash("admin123", 10);
          const adminUser = await prisma.user.upsert({
            where: { email: "admin@example.com" },
            update: { password: hashedPassword },
            create: { name: "Admin", email: "admin@example.com", password: hashedPassword },
          });
          return { id: adminUser.id, name: adminUser.name, email: adminUser.email };
        }

        // ডাটাবেস থেকে ইউজার খোঁজা হচ্ছে
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        // ইউজার না থাকলে বা পাসওয়ার্ড ভুল হলে লগইন ফেইল
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) return null;

        return { 
          id: user.id, 
          name: user.name, 
          email: user.email 
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).id = token.sub;
      }
      return session;
    }
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "a-super-secret-key-for-nextauth",
};
