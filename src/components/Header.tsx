import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Logo from "./Logo";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

async function Header() {
  const user = await currentUser();

  console.log(user);
  return (
    <MaxWidthWrapper>
      <div className="flex justify-between items-center">
        <Logo />
        <div className="flex gap-4">
          <SignedIn>
            <Link href="/dashboard" className="font-medium text-lg">
              Dashboard
            </Link>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}

export default Header;
