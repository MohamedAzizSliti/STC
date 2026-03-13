"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JobsHero } from "@/components/jobs/hero";
import { ProfileForm } from "@/components/jobs/profile-form";
import { ProfilePreview } from "@/components/jobs/profile-preview";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export type ProfileFormData = {
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

const defaultFormData: ProfileFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
  nationality: "",
  objective: "",
  experience: "0-2",
  currentTitle: "",
  currentCompany: "",
  skills: [],
  languages: [{ name: "English", level: "Fluent" }],
  industry: "",
  desiredTitles: [],
  workArrangement: "On-site",
  employmentType: "Full-time",
  availability: "Immediate",
};

function apiToForm(api: Record<string, unknown>): ProfileFormData {
  const prefs = (api.job_preferences as Record<string, unknown>) ?? {};
  const langRaw = api.languages as string[] | undefined;
  const languages =
    Array.isArray(langRaw) && langRaw.length > 0
      ? langRaw.map((s) => {
          const parts = String(s).split(" - ");
          return { name: parts[0] ?? "", level: parts[1] ?? "Fluent" };
        })
      : [{ name: "English", level: "Fluent" }];
  const exp = String(api.years_experience ?? "");
  const experience = exp.replace(/\s*years?$/i, "") || "0-2";
  return {
    firstName: String(api.first_name ?? ""),
    lastName: String(api.last_name ?? ""),
    email: String(api.email ?? ""),
    phone: String(api.phone ?? ""),
    location: String(api.location ?? ""),
    nationality: String(api.nationality ?? ""),
    objective: String(api.professional_summary ?? ""),
    experience: ["0-2", "3-5", "5-10", "10+"].includes(experience) ? experience : "0-2",
    currentTitle: String(prefs.currentTitle ?? ""),
    currentCompany: String(prefs.currentCompany ?? ""),
    skills: Array.isArray(api.skills) ? (api.skills as string[]) : [],
    languages,
    industry: String(api.industry_primary ?? ""),
    desiredTitles: Array.isArray(prefs.desiredTitles) ? (prefs.desiredTitles as string[]) : [],
    workArrangement: String(prefs.workArrangement ?? "On-site"),
    employmentType: String(prefs.employmentType ?? "Full-time"),
    availability: String(prefs.availability ?? "Immediate"),
  };
}

function formToApi(data: ProfileFormData) {
  return {
    first_name: data.firstName.trim() || null,
    last_name: data.lastName.trim() || null,
    phone: data.phone.trim() || null,
    location: data.location.trim() || null,
    nationality: data.nationality.trim() || null,
    professional_summary: data.objective.trim() || null,
    years_experience: data.experience ? `${data.experience} years` : null,
    skills: data.skills,
    languages: data.languages
      .filter((l) => l.name.trim())
      .map((l) => `${l.name.trim()} - ${l.level || "Fluent"}`),
    industry_primary: data.industry.trim() || null,
    job_preferences: {
      desiredTitles: data.desiredTitles,
      workArrangement: data.workArrangement,
      employmentType: data.employmentType,
      availability: data.availability,
      currentTitle: data.currentTitle.trim() || undefined,
      currentCompany: data.currentCompany.trim() || undefined,
    },
  };
}

export default function JobsPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [profileData, setProfileData] = useState<ProfileFormData>(defaultFormData);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileVisible, setProfileVisible] = useState(true);
  const [cvUrl, setCvUrl] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setAllowed(false);
        setAuthChecked(true);
        return;
      }
      fetch("/api/job-seekers/me")
        .then((r) => {
          if (r.status === 403) {
            setAllowed(false);
            setAuthChecked(true);
            return;
          }
          if (!r.ok) {
            setAllowed(false);
            setAuthChecked(true);
            return;
          }
          return r.json();
        })
        .then((data) => {
          if (data) {
            setAllowed(true);
            setProfileData(apiToForm(data));
            setProfileVisible(data.profile_visible !== false);
            setCvUrl(data.cv_url ?? null);
          } else {
            setAllowed(false);
          }
        })
        .catch(() => setAllowed(false))
        .finally(() => setAuthChecked(true));
    });
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/job-seekers/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formToApi(profileData)),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to save");
      }
      setShowPreview(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleVisibilityChange = async (visible: boolean) => {
    const res = await fetch("/api/job-seekers/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile_visible: visible }),
    });
    if (res.ok) {
      setProfileVisible(visible);
    }
  };

  const handleCvUploaded = (url: string) => {
    setCvUrl(url);
  };

  if (!authChecked) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <JobsHero />
          <section className="py-12 px-4">
            <div className="mx-auto max-w-md text-center">
              <p className="text-muted-foreground mb-4">
                Create a job seeker profile to get discovered by international employers. Log in or sign up as a Job Seeker to continue.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button asChild variant="outline">
                  <Link href={"/login?redirect=" + encodeURIComponent("/jobs")}>Log in</Link>
                </Button>
                <Button asChild className="bg-stc-green text-white hover:bg-stc-green/90">
                  <Link href="/signup">Sign up as Job Seeker</Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {!showPreview ? (
          <>
            <JobsHero />
            <ProfileForm
              data={profileData}
              onChange={setProfileData}
              onComplete={handleSaveProfile}
              saving={saving}
            />
          </>
        ) : (
          <ProfilePreview
            data={profileData}
            onEdit={() => setShowPreview(false)}
            profileVisible={profileVisible}
            onVisibilityChange={handleVisibilityChange}
            cvUrl={cvUrl}
            onCvUploaded={handleCvUploaded}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
