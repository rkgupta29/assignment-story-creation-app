import React from "react";
import BrandLogo from "../BrandLogo";

export default function AuthLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" min-h-screen grid">
      <div className="grid grid-cols-1 md:grid-cols-7 ">
        <div className="relative col-span-3 h-full bg-primary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1618120320644-68e7f84030b8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="signup-bg"
            className="w-full h-full object-cover absolute top-0 left-0"
          />
          <div className="absolute inset-0 p-10 flex flex-col justify-between">
            <BrandLogo height={60} width={60} />
            <div className="w-9/12">
              <span className="text-2xl text-background font-pp font-semibold leading-normal">
                Welcome to the Authentication page. This is a dummy text
              </span>
            </div>
          </div>
        </div>
        <div className="col-span-4">{children}</div>
      </div>
    </div>
  );
}
