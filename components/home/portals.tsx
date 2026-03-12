"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, Briefcase, Building2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const portalConfig = (studyCount: number) => [
  {
    title: "Studies",
    subtitle: "Study Abroad Portal",
    description: studyCount > 0
      ? `Explore study opportunities across ${studyCount}+ countries. Find the perfect university program and get guided through the entire application process.`
      : "Explore study opportunities. Find the perfect university program and get guided through the entire application process.",
    icon: GraduationCap,
    href: "/etudes",
    color: "bg-stc-blue",
    lightColor: "bg-stc-blue/10",
    textColor: "text-stc-blue",
    features: studyCount > 0 ? [`${studyCount}+ Countries`, "Application Support", "Visa Guidance"] : ["Application Support", "Visa Guidance"],
  },
  {
    title: "Job Seekers",
    subtitle: "Career Platform",
    description: "Build your professional profile and connect with international employers. Get discovered by leading companies across multiple industries.",
    icon: Briefcase,
    href: "/jobs",
    color: "bg-stc-green",
    lightColor: "bg-stc-green/10",
    textColor: "text-stc-green",
    features: ["Profile Builder", "Job Matching", "Direct Connect"],
  },
  {
    title: "For Enterprise",
    subtitle: "Enterprise Portal",
    description: "Find top international talent for your company. Post positions, search candidates, and connect with qualified professionals worldwide.",
    icon: Building2,
    href: "/enterprise",
    color: "bg-stc-purple",
    lightColor: "bg-stc-purple/10",
    textColor: "text-stc-purple",
    features: ["Talent Search", "Job Posting", "Candidate Profiles"],
  },
];

export function HomePortals() {
  const [studyCount, setStudyCount] = useState(0);
  useEffect(() => {
    fetch("/api/studies")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setStudyCount(Array.isArray(data) ? data.length : 0));
  }, []);
  const portals = portalConfig(studyCount);

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Three Portals, One Platform
          </h2>
          <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Whether you are a student, job seeker, or enterprise, STC has the tools you need to succeed internationally.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {portals.map((portal) => (
            <Link key={portal.href} href={portal.href} className="group">
              <Card className="h-full border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 py-0 overflow-hidden">
                <div className={`h-1.5 ${portal.color}`} />
                <CardContent className="p-6">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${portal.lightColor}`}>
                    <portal.icon className={`h-6 w-6 ${portal.textColor}`} />
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-foreground">{portal.title}</h3>
                  <p className={`text-sm font-medium ${portal.textColor}`}>{portal.subtitle}</p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{portal.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {portal.features.map((f) => (
                      <span key={f} className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className={`mt-5 inline-flex items-center gap-1 text-sm font-medium ${portal.textColor} group-hover:gap-2 transition-all`}>
                    Get Started <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
