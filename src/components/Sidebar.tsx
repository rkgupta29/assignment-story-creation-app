"use client";

import React from "react";
import { Home, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const { signOut, user, loading, error } = useAuthStore();

  return (
    <div className="flex h-screen overflow-hidden">
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
          <div className="flex items-center gap-3 ">
            <div className="flex items-center gap-2 flex-1">
              <User size={20} className="text-gray-500" />
              <div className="flex-1">
                {loading ? (
                  <p className="text-sm text-gray-500">Loading...</p>
                ) : user ? (
                  <div>
                    <p className="font-medium capitalize">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-red-500">Profile not loaded</p>
                    {error && <p className="text-xs text-red-400">{error}</p>}
                  </div>
                )}
              </div>
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
      <div className="overflow-auto flex-1">{children}</div>
    </div>
  );
}
