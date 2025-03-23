import { prisma } from "@/lib/db";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variable is not set"
  );
}

export const authOptions: AuthOptions = {
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
            id: profile.sub,
            email: profile.email,
            provider: "Google",
          },
        });
      }
      return true;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET ?? "secret",
  //@ts-expect-error: no error here
  nextUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
};