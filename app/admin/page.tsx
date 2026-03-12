"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Loader2 } from "lucide-react";

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<{ users: number; applications: number } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/users").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/admin/applications").then((r) => (r.ok ? r.json() : [])),
    ]).then(([users, applications]) => {
      setCounts({
        users: Array.isArray(users) ? users.length : 0,
        applications: Array.isArray(applications) ? applications.length : 0,
      });
    });
  }, []);

  if (counts === null) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Manage users and applications</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/admin/users">
          <Card className="transition-colors hover:bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{counts.users}</p>
              <p className="text-xs text-muted-foreground">View and manage all users</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/applications">
          <Card className="transition-colors hover:bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{counts.applications}</p>
              <p className="text-xs text-muted-foreground">View and manage study applications</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
