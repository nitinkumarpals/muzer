"use client";
import { Button } from "./ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

const Appbar = () => {
  const {data: session, status} = useSession();


  return (
    <div className="m-4">
      <div className="flex justify-between">
        <div>Muzer</div>
        <div>
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
        </div>
      </div>
    </div>
  );
};

export default Appbar;
