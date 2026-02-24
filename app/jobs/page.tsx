"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JobsHero } from "@/components/jobs/hero";
import { ProfileForm } from "@/components/jobs/profile-form";
import { ProfilePreview } from "@/components/jobs/profile-preview";

export default function JobsPage() {
  const [showPreview, setShowPreview] = useState(false);
  const [profileData, setProfileData] = useState({
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
    skills: [] as string[],
    languages: [{ name: "English", level: "Fluent" }] as { name: string; level: string }[],
    industry: "",
    desiredTitles: [] as string[],
    workArrangement: "On-site",
    employmentType: "Full-time",
    availability: "Immediate",
  });

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
              onComplete={() => setShowPreview(true)}
            />
          </>
        ) : (
          <ProfilePreview data={profileData} onEdit={() => setShowPreview(false)} />
        )}
      </main>
      <Footer />
    </div>
  );
}
