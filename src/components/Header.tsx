import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Button } from "./ui/button";
import Logo from "./Logo";
import Link from "next/link";

function Header() {
  return (
    <MaxWidthWrapper>
      <div className="flex justify-between items-center">
        <Logo />
        <div className="flex gap-4">
          <Button className="p-4 rounded-xl">
            <Link href="/dashboard" className="font-medium text-lg">
              Dashboard
            </Link>
          </Button>
          <Button className="p-4 rounded-xl">
            <Link href="/" className="font-medium text-lg">
              Log in
            </Link>
          </Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}

export default Header;
