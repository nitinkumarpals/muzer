import { prisma } from "@/lib/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variable is not set"
  );
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.email) return false;
      const existingUser = await prisma.user.findFirst({
        where: { email: profile.email },
      });
      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: profile.email,
            provider: "Google",
          },
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (!session.user?.email) return session;
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
