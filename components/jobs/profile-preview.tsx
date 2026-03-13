"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Edit,
  MapPin,
  Briefcase,
  Clock,
  Shield,
  Eye,
  User,
  Upload,
  FileText,
  Loader2,
  Heart,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

interface ProfilePreviewProps {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    nationality: string;
    objective: string;
    experience: string;
    currentTitle: string;
    currentCompany: string;
    skills: string[];
    languages: { name: string; level: string }[];
    industry: string;
    desiredTitles: string[];
    workArrangement: string;
    employmentType: string;
    availability: string;
  };
  onEdit: () => void;
  profileVisible?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
  cvUrl?: string | null;
  onCvUploaded?: (url: string) => void;
}

type MatchRow = {
  id: string;
  contact_requested: boolean;
  status: string;
  created_at: string;
  posting: { id: string; title: string; department: string | null; location: string | null } | null;
  enterprise: { id: string; company_name: string | null } | null;
};

export function ProfilePreview({
  data,
  onEdit,
  profileVisible = true,
  onVisibilityChange,
  cvUrl,
  onCvUploaded,
}: ProfilePreviewProps) {
  const [visibility, setVisibility] = useState({
    profile: profileVisible,
    contact: false,
    messages: true,
    alerts: true,
  });
  const [cvUploading, setCvUploading] = useState(false);
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setVisibility((v) => ({ ...v, profile: profileVisible }));
  }, [profileVisible]);

  useEffect(() => {
    fetch("/api/job-seekers/me/matches")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setMatches(Array.isArray(data) ? data : []))
      .finally(() => setMatchesLoading(false));
  }, []);

  const displayName = `${data.firstName || "John"} ${data.lastName || "Doe"}`;
  const experienceLabel = data.experience ? `${data.experience} years` : "";

  const handleProfileVisibilityChange = (checked: boolean) => {
    setVisibility((v) => ({ ...v, profile: checked }));
    onVisibilityChange?.(checked);
  };

  const handleCvSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("document_type", "CV");
      const res = await fetch("/api/documents/upload", { method: "POST", body: formData });
      const doc = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(doc.message || "Upload failed.");
        return;
      }
      const fileUrl = doc.file_url;
      const patchRes = await fetch("/api/job-seekers/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv_url: fileUrl }),
      });
      if (!patchRes.ok) {
        toast.error("Profile update failed.");
        return;
      }
      onCvUploaded?.(fileUrl);
      toast.success("CV uploaded.");
    } finally {
      setCvUploading(false);
      e.target.value = "";
    }
  };

  return (
    <section className="py-8 lg:py-12 bg-secondary">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Your profile</h2>
          <Button variant="outline" onClick={onEdit} className="gap-2 text-foreground">
            <Edit className="h-4 w-4" /> Edit profile
          </Button>
        </div>

        <Card className="overflow-hidden">
          <div className="h-2 bg-stc-green" />
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-stc-green/10 text-stc-green">
                <User className="h-10 w-10" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground">{displayName}</h3>
                <p className="text-sm text-stc-green font-medium">{data.currentTitle || "Job seeker"}</p>
                {data.currentCompany && <p className="text-sm text-muted-foreground">at {data.currentCompany}</p>}
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {data.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {data.location}
                    </span>
                  )}
                  {experienceLabel && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" /> {experienceLabel}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {data.availability}
                  </span>
                </div>
              </div>
            </div>

            {data.objective && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-foreground">Career objective</h4>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{data.objective}</p>
              </div>
            )}

            {data.skills.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-foreground">Skills</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-stc-green/10 text-stc-green border-0">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {data.languages.filter((l) => l.name).length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-foreground">Languages</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.languages.filter((l) => l.name).map((lang, i) => (
                    <Badge key={i} variant="outline" className="text-foreground">
                      {lang.name} – {lang.level}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              {data.industry && (
                <span>Industry: <span className="font-medium text-foreground">{data.industry}</span></span>
              )}
              <span>Type: <span className="font-medium text-foreground">{data.employmentType}</span></span>
              <span>Work: <span className="font-medium text-foreground">{data.workArrangement}</span></span>
            </div>

            {data.desiredTitles.length > 0 && (
              <div className="mt-3">
                <span className="text-sm text-muted-foreground">Looking for: </span>
                {data.desiredTitles.map((t) => (
                  <Badge key={t} variant="secondary" className="mr-1 bg-secondary text-secondary-foreground">{t}</Badge>
                ))}
              </div>
            )}

            {/* CV */}
            <div className="mt-6 pt-4 border-t border-border">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" /> CV / Resume
              </h4>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleCvSelect}
              />
              {cvUrl ? (
                <div className="mt-2 flex items-center gap-3">
                  <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-stc-green hover:underline flex items-center gap-1">
                    <ExternalLink className="h-3.5 w-3.5" /> View current CV
                  </a>
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={cvUploading}>
                    {cvUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                    Replace
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="mt-2 gap-2" onClick={() => fileInputRef.current?.click()} disabled={cvUploading}>
                  {cvUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  Upload CV (PDF, DOCX, or image)
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Interest received */}
        {!matchesLoading && matches.length > 0 && (
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Heart className="h-4 w-4 text-stc-green" /> Interest from employers
              </h3>
              <ul className="mt-4 space-y-3">
                {matches.filter((m) => m.contact_requested).map((m) => (
                  <li key={m.id} className="flex flex-col gap-1 rounded-lg border border-border p-3">
                    <span className="font-medium text-foreground">{m.posting?.title ?? "Position"}</span>
                    {m.enterprise?.company_name && (
                      <span className="text-sm text-muted-foreground">{m.enterprise.company_name}</span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(m.created_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Visibility */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Eye className="h-4 w-4" /> Profile visibility
            </h3>
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="profile-vis" className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  Make profile visible to employers
                </Label>
                <Switch
                  id="profile-vis"
                  checked={visibility.profile}
                  onCheckedChange={handleProfileVisibilityChange}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                When on, verified enterprises can discover you and express interest. You can hide your profile anytime.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 rounded-lg border border-stc-green/20 bg-stc-green/5 p-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-stc-green shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your profile is only visible to verified enterprise accounts. Contact information is shared only when both sides agree.
          </p>
        </div>
      </div>
    </section>
  );
}
