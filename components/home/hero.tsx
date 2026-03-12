"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeHero() {
  const [studyCount, setStudyCount] = useState<number | null>(null);
  useEffect(() => {
    fetch("/api/studies")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setStudyCount(Array.isArray(data) ? data.length : 0));
  }, []);

  const countriesLabel = studyCount != null && studyCount > 0 ? `${studyCount}+ Countries` : "9+ Countries";
  return (
    <section className="relative overflow-hidden bg-foreground text-background">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      
      <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-background/10 px-4 py-1.5 text-sm text-background/80 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-stc-orange" />
            Your International Gateway
          </div>
          
          <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
            Build Your Future{" "}
            <span className="text-stc-blue">Across Borders</span>
          </h1>
          
          <p className="mt-6 max-w-2xl text-lg text-background/70 leading-relaxed text-pretty">
            STC connects students, job seekers, and enterprises across international markets. 
            Explore study opportunities, find global careers, and access top talent worldwide.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-stc-blue text-white hover:bg-stc-blue/90 gap-2">
              <Link href="/etudes">
                <GraduationCap className="h-5 w-5" />
                Explore Studies
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 border-background/20 text-black hover:bg-background/10 hover:text-background">
              <Link href="/jobs">
                <Globe className="h-5 w-5" />
                Find Opportunities
              </Link>
            </Button>
          </div>

          {/* Feature pills */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            {[
              { label: countriesLabel, color: "bg-stc-blue/20 text-stc-blue" },
              { label: "500+ Universities", color: "bg-stc-green/20 text-stc-green" },
              { label: "1000+ Companies", color: "bg-stc-purple/20 text-stc-purple" },
            ].map((pill) => (
              <span key={pill.label} className={`rounded-full px-4 py-1.5 text-sm font-medium ${pill.color}`}>
                {pill.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
