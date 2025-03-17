"use client";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

const Appbar = () => {
  return (
    <div className="m-4">
      <div className="flex justify-between">
        <div>Muzer</div>
        <div>
          <Button className="bg-blue-300 cursor-pointer" onClick={() => signIn()}>Sign in</Button>
        </div>
      </div>
    </div>
  );
};

export default Appbar;
