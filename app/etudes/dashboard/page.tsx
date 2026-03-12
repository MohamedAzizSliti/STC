"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import {
  FileText,
  PlusCircle,
  Loader2,
  MapPin,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Upload,
} from "lucide-react";

type DocumentRecord = {
  id: string;
  document_type: string;
  file_name: string;
  file_url: string;
  file_size: number | null;
  upload_date: string;
  verified: boolean;
};

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
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [paymentProofByAppId, setPaymentProofByAppId] = useState<Record<string, DocumentRecord>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    Promise.all([
      fetch("/api/applications").then((res) => {
        if (res.status === 401) {
          router.replace("/login?redirect=/etudes/dashboard");
          return null;
        }
        if (res.status === 403) {
          router.replace("/etudes");
          return null;
        }
        return res.json();
      }),
      fetch("/api/documents").then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([appsData, docsData]: [Application[] | null, DocumentRecord[]]) => {
        if (Array.isArray(appsData)) setApplications(appsData);
        if (Array.isArray(docsData)) {
          const byApp: Record<string, DocumentRecord> = {};
          for (const doc of docsData) {
            if (doc.document_type.startsWith("Payment Proof - ")) {
              const appId = doc.document_type.replace("Payment Proof - ", "").trim();
              if (!byApp[appId] || new Date(doc.upload_date) > new Date(byApp[appId].upload_date)) {
                byApp[appId] = doc;
              }
            }
          }
          setPaymentProofByAppId(byApp);
        }
      })
      .finally(() => setLoading(false));
  }, [authChecked, router]);

  const triggerPaymentUpload = (applicationId: string) => {
    setUploadingId(applicationId);
    fileInputRef.current?.click();
  };

  const handlePaymentFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const id = uploadingId;
    setUploadingId(null);
    const file = e.target.files?.[0];
    if (!file || !id) return;
    e.target.value = "";
    const formData = new FormData();
    formData.set("file", file);
    formData.set("document_type", `Payment Proof - ${id}`);
    const res = await fetch("/api/documents/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.id) {
      setPaymentProofByAppId((prev) => ({
        ...prev,
        [id]: {
          id: data.id,
          document_type: data.document_type,
          file_name: data.file_name,
          file_url: data.file_url,
          file_size: data.file_size,
          upload_date: data.upload_date,
          verified: data.verified ?? false,
        },
      }));
      toast.success("Payment proof uploaded", {
        description: `${file.name} has been saved. We will verify it shortly.`,
      });
    } else {
      toast.error("Upload failed", {
        description: data.message || data.detail || "Please try again.",
      });
    }
  };

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
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={handlePaymentFileChange}
          />
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
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`/etudes/apply?country=${app.target_country}`}
                            className="gap-1"
                          >
                            View
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        <div className="flex flex-col gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={!!uploadingId && uploadingId !== app.id}
                            onClick={() => triggerPaymentUpload(app.id)}
                            className={
                              paymentProofByAppId[app.id]
                                ? "border-green-500/50 bg-green-500/5 text-green-700 dark:text-green-400"
                                : ""
                            }
                          >
                            {paymentProofByAppId[app.id] ? (
                              <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Proof uploaded
                              </span>
                            ) : uploadingId === app.id ? (
                              <span className="flex items-center gap-1">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Uploading…
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Upload className="h-3.5 w-3.5" />
                                Upload payment proof
                              </span>
                            )}
                          </Button>
                          {paymentProofByAppId[app.id] && (
                            <p className="text-xs text-muted-foreground">
                              {paymentProofByAppId[app.id].file_name}
                              {" · "}
                              {new Date(
                                paymentProofByAppId[app.id].upload_date
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
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
