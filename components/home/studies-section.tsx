"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Country } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HomeStudiesSection() {
  const [studies, setStudies] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/studies")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setStudies(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  if (loading || studies.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
              Study Destinations
            </h2>
            <p className="mt-3 text-muted-foreground text-lg max-w-2xl">
              Explore study opportunities in {studies.length}+ countr{studies.length === 1 ? "y" : "ies"}. Choose your destination and start your application.
            </p>
          </div>
          <Button asChild variant="outline" className="gap-2 shrink-0">
            <Link href="/etudes">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {studies.slice(0, 6).map((country) => (
            <Link key={country.id} href={`/etudes?country=${country.id}#destinations`} className="group">
              <Card className="h-full border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden py-0">
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={country.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <span className="font-semibold text-white">{country.name}</span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{country.description}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-stc-blue group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
