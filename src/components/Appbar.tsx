"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Music } from "lucide-react";

const Appbar = () => {
  const {data: session, status} = useSession();


  return (
    <div>
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Music className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Muzer</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-primary"
            >
              How It Works
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium hover:text-primary"
            >
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
                {status === "loading" ? (
                  <Button className="bg-gray-500 cursor-not-allowed" disabled>
                    Loading...
                  </Button>
                ) : session?.user?.name ? (
                  <Button
                    className="bg-red-500 cursor-pointer"
                    onClick={() => signOut()}
                  >
                    Logout
                  </Button>
                ) : (
                  <Button
                    className="bg-blue-500 cursor-pointer"
                    onClick={() => signIn()}
                  >
                    Sign in
                  </Button>
                )}
            </Link>
            <Button>Sign Up Free</Button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Appbar;
