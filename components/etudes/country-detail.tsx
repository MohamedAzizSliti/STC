"use client";

import type { Country } from "@/lib/data";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, DollarSign, FileText, Home, GraduationCap, Send } from "lucide-react";
import Link from "next/link";

interface CountryDetailProps {
  country: Country;
  open: boolean;
  onClose: () => void;
}

export function CountryDetail({ country, open, onClose }: CountryDetailProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header image */}
        <div className="relative h-48 md:h-56 overflow-hidden rounded-t-lg">
          <img
            src={country.image}
            alt={`${country.name} campus view`}
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-3">
              {"flag" in country && country.flag && (
                <span className="text-4xl" role="img" aria-label={`${country.name} flag`}>{country.flag}</span>
              )}
              <div>
                <DialogTitle className="text-2xl font-bold text-white">{country.name}</DialogTitle>
                <p className="text-sm text-white/80">{country.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Top universities */}
          <div className="flex flex-wrap gap-2 mb-6">
            {country.overview.topUniversities.map((uni) => (
              <Badge key={uni} variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                <GraduationCap className="mr-1 h-3 w-3" />
                {uni}
              </Badge>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="overview" className="gap-1.5 text-xs sm:text-sm">
                <BookOpen className="h-3.5 w-3.5 hidden sm:block" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="costs" className="gap-1.5 text-xs sm:text-sm">
                <DollarSign className="h-3.5 w-3.5 hidden sm:block" />
                Costs
              </TabsTrigger>
              <TabsTrigger value="requirements" className="gap-1.5 text-xs sm:text-sm">
                <FileText className="h-3.5 w-3.5 hidden sm:block" />
                Requirements
              </TabsTrigger>
              <TabsTrigger value="living" className="gap-1.5 text-xs sm:text-sm">
                <Home className="h-3.5 w-3.5 hidden sm:block" />
                Living
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Educational System</h4>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{country.overview.system}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Academic Calendar</h4>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{country.overview.calendar}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="costs" className="mt-4">
              <div className="flex flex-col gap-4">
                <div className="rounded-lg border border-border p-4">
                  <h4 className="text-sm font-semibold text-foreground">Tuition Fees</h4>
                  <p className="mt-1 text-lg font-bold text-stc-blue">{country.costs.tuition}</p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <h4 className="text-sm font-semibold text-foreground">Living Expenses</h4>
                  <p className="mt-1 text-lg font-bold text-stc-green">{country.costs.living}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Scholarships</h4>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{country.costs.scholarships}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="requirements" className="mt-4">
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Visa Process</h4>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{country.requirements.visa}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Language Requirements</h4>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{country.requirements.language}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Documents Needed</h4>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{country.requirements.documents}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="living" className="mt-4">
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Accommodation</h4>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{country.living.accommodation}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Lifestyle & Culture</h4>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{country.living.lifestyle}</p>
                </div>
                <div className="rounded-lg bg-stc-blue/5 border border-stc-blue/20 p-4">
                  <h4 className="text-sm font-semibold text-foreground">Student Testimonial</h4>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed italic">{country.living.testimonial}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* CTA */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="flex-1 bg-stc-blue text-white hover:bg-stc-blue/90 gap-2">
              <Link href={`/etudes/apply?country=${country.id}`}>
                <Send className="h-4 w-4" />
                Apply Now
              </Link>
            </Button>
            <Button variant="outline" onClick={onClose} className="text-foreground">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
