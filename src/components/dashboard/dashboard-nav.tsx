"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LanguageSwitcher } from "../language-switcher";
import { useUIStore } from "@/store/ui-store";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function DashboardNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const theme = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);

  const navigation = [
    { name: "Profile", href: "/dashboard/profile" },
    { name: "Experience", href: "/dashboard/experience" },
    { name: "Education", href: "/dashboard/education" },
    { name: "Skills", href: "/dashboard/skills" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/dashboard"
                className="text-xl font-bold text-gray-900 dark:text-white"
              >
                Profile Builder
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? "border-blue-500 text-gray-900 dark:text-white"
                      : "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-white"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {theme === "light" ? (
                <MoonIcon className="h-6 w-6" />
              ) : (
                <SunIcon className="h-6 w-6" />
              )}
            </button>
            <div className="ml-3 relative">
              <div className="flex items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {session?.user?.name || session?.user?.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 