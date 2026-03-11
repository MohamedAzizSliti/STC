"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import {
  FileText,
  PlusCircle,
  Loader2,
  MapPin,
  Calendar,
  ArrowRight,
} from "lucide-react";

type Application = {
  id: string;
  target_country: string;
  university: string | null;
  program: string | null;
  application_platform: string | null;
  status: string;
  payment_status: string;
  tracking_number: string | null;
  submission_date: string | null;
  created_at: string;
};

export default function EtudesDashboardPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace("/login?redirect=/etudes/dashboard");
        return;
      }
      setAuthChecked(true);
    });
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;
    fetch("/api/applications")
      .then((res) => {
        if (res.status === 401) {
          router.replace("/login?redirect=/etudes/dashboard");
          return null;
        }
        if (res.status === 403) {
          router.replace("/etudes");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setApplications(data);
      })
      .finally(() => setLoading(false));
  }, [authChecked, router]);

  if (!authChecked || loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-secondary">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-secondary">
        <div className="mx-auto max-w-4xl px-4 py-8 lg:py-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                My Applications
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Track your study abroad applications
              </p>
            </div>
            <Button asChild className="gap-2 bg-stc-blue text-white hover:bg-stc-blue/90">
              <Link href="/etudes/apply">
                <PlusCircle className="h-4 w-4" />
                New Application
              </Link>
            </Button>
          </div>

          {applications.length === 0 ? (
            <Card className="mt-8">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm font-medium text-foreground">
                  No applications yet
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start your first study abroad application
                </p>
                <Button asChild className="mt-6 gap-2 bg-stc-blue text-white hover:bg-stc-blue/90">
                  <Link href="/etudes/apply">
                    <PlusCircle className="h-4 w-4" />
                    Apply Now
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="mt-8 space-y-4">
              {applications.map((app) => (
                <Card key={app.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-foreground capitalize">
                            {app.target_country.replace(/-/g, " ")}
                          </h3>
                          <Badge
                            variant={
                              app.status === "submitted"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              app.status === "submitted"
                                ? "bg-stc-blue"
                                : "bg-secondary text-secondary-foreground"
                            }
                          >
                            {app.status}
                          </Badge>
                          {app.payment_status !== "paid" && (
                            <Badge variant="outline">
                              {app.payment_status}
                            </Badge>
                          )}
                        </div>
                        {(app.university || app.program) && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {[app.university, app.program]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                          {app.application_platform && (
                            <span className="flex items-center gap-1">
                              <FileText className="h-3.5 w-3.5" />
                              {app.application_platform}
                            </span>
                          )}
                          {app.submission_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(
                                app.submission_date
                              ).toLocaleDateString()}
                            </span>
                          )}
                          {app.tracking_number && (
                            <span className="flex items-center gap-1 font-mono">
                              <MapPin className="h-3.5 w-3.5" />
                              {app.tracking_number}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/etudes/apply?country=${app.target_country}`}
                          className="gap-1"
                        >
                          View
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
