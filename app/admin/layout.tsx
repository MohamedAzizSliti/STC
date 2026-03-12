"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  GraduationCap,
  Shield,
  Loader2,
  ArrowLeft,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => {
        if (res.status === 401) {
          router.replace("/login?redirect=" + encodeURIComponent(pathname || "/admin"));
          return false;
        }
        if (res.status === 403) {
          router.replace("/");
          return false;
        }
        return res.ok;
      })
      .then(setAllowed);
  }, [pathname, router]);

  if (allowed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!allowed) return null;

  const nav = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/applications", label: "Applications", icon: FileText },
    { href: "/admin/studies", label: "Studies", icon: GraduationCap },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-56 shrink-0 border-r border-border bg-muted/30 p-4">
        <div className="flex items-center gap-2 border-b border-border pb-4">
          <Shield className="h-5 w-5 text-stc-blue" />
          <span className="font-semibold text-foreground">Admin</span>
        </div>
        <nav className="mt-4 flex flex-col gap-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-stc-blue text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/"
          className="mt-6 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to site
        </Link>
      </aside>
      <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
    </div>
  );
}
