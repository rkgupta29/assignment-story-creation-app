import React from "react";
import BrandLogo from "../BrandLogo";
import Image from "next/image";

export default function AuthLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" min-h-screen grid">
      <div className="grid grid-cols-1 md:grid-cols-7 ">
        <div className="relative col-span-3 h-full bg-primary">
          <Image
            src="https://images.unsplash.com/photo-1618120320644-68e7f84030b8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="signup-bg"
            objectFit="cover"
            loading="eager"
            layout="fill"
          />
          <div className="absolute inset-0 p-10 flex flex-col justify-between">
            <BrandLogo height={60} width={60} />
            <div className="w-9/12">
              <span className="text-2xl text-background font-pp font-semibold leading-normal">
                Welcome to a platform where people hire people - not algorithms.
                Because you deserve to be seen, not scanned.
              </span>
            </div>
          </div>
        </div>
        <div className="col-span-4">{children}</div>
      </div>
    </div>
  );
}
