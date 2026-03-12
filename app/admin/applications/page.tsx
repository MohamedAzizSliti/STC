"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Loader2, MoreHorizontal, FileText, ExternalLink } from "lucide-react";
import { toast } from "sonner";

type DocRow = {
  id: string;
  document_type: string;
  file_name: string;
  file_url: string;
  file_size: number | null;
  upload_date: string;
  verified: boolean;
  is_payment_proof?: boolean;
};

type ApplicationRow = {
  id: string;
  student_id: string;
  target_country: string;
  university: string | null;
  program: string | null;
  application_platform: string | null;
  status: string;
  payment_status: string;
  tracking_number: string | null;
  submission_date: string | null;
  notes: string | null;
  created_at: string;
  student: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  } | null;
};

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [documentsOpenForApp, setDocumentsOpenForApp] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DocRow[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);

  const fetchApplications = () => {
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (paymentFilter !== "all") params.set("payment_status", paymentFilter);
    const url = "/api/admin/applications" + (params.toString() ? "?" + params.toString() : "");
    fetch(url)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setApplications(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    fetchApplications();
  }, [statusFilter, paymentFilter]);

  const openDocuments = (appId: string) => {
    setDocumentsOpenForApp(appId);
    setDocumentsLoading(true);
    setDocuments([]);
    fetch(`/api/admin/applications/${appId}/documents`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setDocuments(Array.isArray(data) ? data : []))
      .finally(() => setDocumentsLoading(false));
  };

  const updateApplication = async (
    id: string,
    field: "status" | "payment_status",
    value: string
  ) => {
    setUpdatingId(id);
    const res = await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    setUpdatingId(null);
    if (res.ok) {
      toast.success("Updated", { description: `${field} set to ${value}` });
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
      );
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error("Update failed", { description: data.message });
    }
  };

  if (loading && applications.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Applications</h1>
          <p className="mt-1 text-sm text-muted-foreground">Study abroad applications</p>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All payments</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card className="mt-6">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="font-mono text-xs">Tracking #</TableHead>
                <TableHead className="w-28">Documents</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No applications found
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {app.student
                            ? [app.student.first_name, app.student.last_name].filter(Boolean).join(" ") || "—"
                            : "—"}
                        </p>
                        {app.student?.email && (
                          <p className="text-xs text-muted-foreground">{app.student.email}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">
                      {app.target_country.replace(/-/g, " ")}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {app.application_platform || "—"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 gap-1 px-2" disabled={updatingId === app.id}>
                            {updatingId === app.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Badge variant="secondary" className="capitalize font-normal">
                                {app.status}
                              </Badge>
                            )}
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => updateApplication(app.id, "status", "draft")}>
                            Set Draft
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateApplication(app.id, "status", "submitted")}>
                            Set Submitted
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 gap-1 px-2" disabled={updatingId === app.id}>
                            {updatingId === app.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Badge
                                variant={app.payment_status === "paid" ? "default" : "outline"}
                                className={app.payment_status === "paid" ? "bg-green-600" : "font-normal"}
                              >
                                {app.payment_status}
                              </Badge>
                            )}
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => updateApplication(app.id, "payment_status", "pending")}>
                            Set Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateApplication(app.id, "payment_status", "paid")}>
                            Set Paid
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {app.submission_date
                        ? new Date(app.submission_date).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs font-mono">
                      {app.tracking_number || "—"}
                    </TableCell>
                    <TableCell>
                      <Sheet
                        open={documentsOpenForApp === app.id}
                        onOpenChange={(open) => {
                          if (!open) setDocumentsOpenForApp(null);
                        }}
                      >
                        <SheetTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1"
                            onClick={() => {
                              setDocumentsOpenForApp(app.id);
                              openDocuments(app.id);
                            }}
                          >
                            <FileText className="h-3.5 w-3.5" />
                            View docs
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                          <SheetHeader>
                            <SheetTitle>Uploaded documents</SheetTitle>
                          </SheetHeader>
                          <div className="mt-4">
                            {documentsLoading ? (
                              <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                              </div>
                            ) : documents.length === 0 ? (
                              <p className="text-sm text-muted-foreground py-4">No documents uploaded yet.</p>
                            ) : (
                              <ul className="space-y-3">
                                {documents.map((d) => (
                                  <li
                                    key={d.id}
                                    className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
                                  >
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-medium text-foreground truncate" title={d.file_name}>
                                        {d.file_name}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-0.5">
                                        {d.is_payment_proof ? "Payment proof" : d.document_type}
                                        {" · "}
                                        {new Date(d.upload_date).toLocaleDateString()}
                                        {d.file_size != null && ` · ${(d.file_size / 1024).toFixed(1)} KB`}
                                      </p>
                                    </div>
                                    <a
                                      href={d.file_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="shrink-0 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                                      title="Open file"
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </SheetContent>
                      </Sheet>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
