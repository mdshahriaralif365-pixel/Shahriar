import { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}

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

        // Check if any user exists, if not create default admin
        const userCount = await prisma.user.count();
        if (userCount === 0) {
          const hashedPassword = await bcrypt.hash("admin123", 10);
          await prisma.user.create({
            data: {
              name: "Admin",
              email: "admin@example.com",
              password: hashedPassword,
            },
          });
        }

        // Find user from database
        const normalizedEmail = credentials.email.toLowerCase().trim();
        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail }
        });

        // If user not found or password doesn't match
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          console.log("Login failed: Invalid password for", credentials.email);
          return null;
        }

        console.log("Login successful for", credentials.email);

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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        console.log("JWT callback: user authenticated", user.email);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "a-super-secret-key-for-nextauth",
};
