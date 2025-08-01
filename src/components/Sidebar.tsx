"use client";

import React from "react";
import { Home, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuthStoreWithInit } from "@/stores/auth-store";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const { signOut, user } = useAuthStoreWithInit();

  console.log(user);

  return (
    <>
      <aside className="w-64 min-h-screen bg-gray-100 p-4 flex flex-col">
        <nav className="flex-1">
          <Link
            href="/"
            className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded"
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
        </nav>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center gap-3 p-2">
            <div className="flex-1">
              <p className="font-medium">{user?.name}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="p-2 hover:bg-gray-200 rounded"
              title="Log out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>
      {children}
    </>
  );
}
