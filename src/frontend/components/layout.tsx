"use client";

import type { ReactNode } from "react";
import { BottomNavbar, buildNavItems, type NavItem, type UserRole } from "@/components/bottom-navbar";

export interface AppLayoutProps {
  children: ReactNode;
  title?: ReactNode; // Updated from string to ReactNode
  subtitle?: string;
  role?: UserRole;
  isAuthenticated?: boolean;
  showHeader?: boolean;
  showBottomNav?: boolean;
  navItems?: NavItem[];
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

export function AppLayout({
  children,
  title,
  subtitle,
  role = "buyer",
  isAuthenticated = true,
  showHeader = true,
  showBottomNav = true,
  navItems,
  className = "",
  headerClassName = "",
  bodyClassName = "",
}: AppLayoutProps) {
  const resolvedNavItems = navItems ?? buildNavItems({ role, isAuthenticated });

  return (
    <div className="min-h-screen bg-[#e6e0c8]">
      <div className="flex min-h-screen w-full flex-col overflow-hidden bg-[#e6e0c8]">
        {showHeader && (
          <header
            className={`bg-[#f56369] px-5 pb-5 pt-7 text-[#fff4f2] sm:px-6 lg:px-8 ${headerClassName}`}
          >
            {title ? (
              typeof title === "string" ? (
                <h1 className="text-3xl font-black tracking-[-0.06em] text-[#fff4f2] sm:text-4xl lg:text-5xl">
                  {title}
                </h1>
              ) : (
                // If it's a React element (like an Image), render it directly without forcing an <h1>
                title
              )
            ) : null}
            {subtitle ? <p className="mt-2 text-sm opacity-90">{subtitle}</p> : null}
          </header>
        )}

        <main className={`flex-1 bg-[#e6e0c8] ${bodyClassName} ${className}`}>
          {children}
        </main>

        {showBottomNav ? <BottomNavbar items={resolvedNavItems} className="lg:mt-auto" /> : null}
      </div>
    </div>
  );
}