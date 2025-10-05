"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Trending" },
    { href: "/favourites", label: "My Favourites" },
  ];

  return (
    <header className="border-b bg-transparent backdrop-blur-sm absolute w-full top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          {/* App Name */}
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-primary">MovieHub</h1>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive
                      ? "text-primary border-b-2 border-primary pb-1"
                      : "text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
