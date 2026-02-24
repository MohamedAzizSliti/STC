"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, GraduationCap, Briefcase, Building2, Phone, Globe, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/etudes", label: "Studies", icon: GraduationCap, color: "text-stc-blue" },
  { href: "/jobs", label: "Job Seekers", icon: Briefcase, color: "text-stc-green" },
  { href: "/enterprise", label: "For Enterprise", icon: Building2, color: "text-stc-purple" },
  { href: "/contact", label: "Contact", icon: Phone, color: "text-stc-orange" },
];

const languages = ["EN", "FR", "DE", "ES"];

export function Navbar() {
  const pathname = usePathname();
  const [language, setLanguage] = useState("EN");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stc-blue">
            <span className="text-sm font-bold text-white">STC</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold leading-none text-foreground">STC</p>
            <p className="text-[10px] leading-tight text-muted-foreground tracking-wider">STEAM CONSULTING</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <link.icon className={cn("h-4 w-4", isActive ? link.color : "")} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span className="text-xs font-medium">{language}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem key={lang} onClick={() => setLanguage(lang)}>
                  {lang}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth buttons (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <LogIn className="mr-1.5 h-4 w-4" />
              Log In
            </Button>
            <Button size="sm" className="bg-stc-blue text-white hover:bg-stc-blue/90">
              <User className="mr-1.5 h-4 w-4" />
              Sign Up
            </Button>
          </div>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav className="flex flex-col gap-1 pt-8">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      <link.icon className={cn("h-5 w-5", link.color)} />
                      {link.label}
                    </Link>
                  );
                })}
                <div className="mt-4 border-t border-border pt-4 flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="w-full justify-start text-foreground">
                    <LogIn className="mr-2 h-4 w-4" />
                    Log In
                  </Button>
                  <Button size="sm" className="w-full justify-start bg-stc-blue text-white hover:bg-stc-blue/90">
                    <User className="mr-2 h-4 w-4" />
                    Sign Up
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
