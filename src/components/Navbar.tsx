"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Home, Bell, User } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  // Don't show navbar on the landing page
  if (pathname === "/") return null;

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Search", href: "/search", icon: Search },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-card/80 backdrop-blur-xl border-t border-white/5 z-50 pb-safe md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around md:justify-start md:gap-8 h-16">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-3 py-2 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "fill-primary/20" : ""}`} />
                <span className="text-[10px] md:text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
