"use client";

import { useState, useEffect, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Search, MapPin, Briefcase, Heart, LayoutGrid, List, X, Plus, Filter, RotateCcw, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { industries } from "@/lib/data";

type Candidate = {
  id: string;
  name: string;
  professional_summary: string | null;
  years_experience: string | null;
  education_level: string | null;
  skills: string[];
  languages: string[];
  industry_primary: string | null;
  industry_secondary: string | null;
  location: string | null;
  nationality: string | null;
  cv_url: string | null;
};

type Posting = { id: string; title: string; status: string };

const experienceLevels = ["0-2 years", "3-5 years", "5-10 years", "10+ years"];
const educationLevels = ["High School", "Bachelor's", "Master's", "PhD"];

export function CandidateSearch() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [postings, setPostings] = useState<Posting[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skillFilters, setSkillFilters] = useState<string[]>([]);
  const [industryFilter, setIndustryFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState<string[]>([]);
  const [educationFilter, setEducationFilter] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [interestCandidateId, setInterestCandidateId] = useState<string | null>(null);
  const [selectedPostingId, setSelectedPostingId] = useState("");
  const [sendingInterest, setSendingInterest] = useState(false);

  const fetchCandidates = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (industryFilter) params.set("industry", industryFilter);
    if (skillFilters.length) params.set("skills", skillFilters.join(","));
    if (experienceFilter.length) params.set("experience", experienceFilter[0]);
    if (educationFilter.length) params.set("education", educationFilter[0]);
    fetch(`/api/enterprises/candidates?${params}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setCandidates(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    fetch("/api/enterprises/me/postings")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setPostings(Array.isArray(data) ? data.filter((p: Posting) => p.status === "published") : []));
  }, []);

  const addSkillFilter = () => {
    if (skillInput.trim() && !skillFilters.includes(skillInput.trim())) {
      setSkillFilters([...skillFilters, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkillFilter();
    }
  };

  const toggleExperience = (level: string) => {
    setExperienceFilter((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [level]
    );
  };
  const toggleEducation = (level: string) => {
    setEducationFilter((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [level]
    );
  };

  const applyFilters = () => {
    fetchCandidates();
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSkillFilters([]);
    setIndustryFilter("");
    setExperienceFilter([]);
    setEducationFilter([]);
    fetchCandidates();
  };

  const openExpressInterest = (candidateId: string) => {
    setInterestCandidateId(candidateId);
    setSelectedPostingId(postings[0]?.id ?? "");
  };

  const sendInterest = async () => {
    if (!interestCandidateId || !selectedPostingId) return;
    setSendingInterest(true);
    try {
      const res = await fetch(`/api/enterprises/candidates/${interestCandidateId}/interest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posting_id: selectedPostingId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || "Failed to send interest.");
        return;
      }
      toast.success("Interest sent. The candidate will be notified.");
      setInterestCandidateId(null);
    } finally {
      setSendingInterest(false);
    }
  };

  const filteredCandidates = candidates.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.professional_summary ?? "").toLowerCase().includes(q) ||
        (c.skills ?? []).some((s) => String(s).toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-72 shrink-0`}>
        <Card>
          <CardContent className="p-4 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filters
              </h3>
              <button type="button" onClick={resetFilters} className="text-xs text-stc-purple hover:underline flex items-center gap-1">
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium">Skills</Label>
              <div className="flex items-center gap-1">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Add skill..."
                  className="text-xs h-8"
                />
                <Button type="button" variant="outline" size="icon" onClick={addSkillFilter} className="h-8 w-8 shrink-0">
                  <Plus className="h-3 w-3" />
                  <span className="sr-only">Add</span>
                </Button>
              </div>
              {skillFilters.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {skillFilters.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs gap-1">
                      {s}
                      <button type="button" onClick={() => setSkillFilters(skillFilters.filter((f) => f !== s))} aria-label={`Remove ${s}`}>
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium">Industry</Label>
              <Select value={industryFilter || undefined} onValueChange={setIndustryFilter}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Any" /></SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium">Experience</Label>
              <div className="flex flex-col gap-1.5">
                {experienceLevels.map((level) => (
                  <label key={level} className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                    <Checkbox
                      checked={experienceFilter.includes(level)}
                      onCheckedChange={() => toggleExperience(level)}
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium">Education</Label>
              <div className="flex flex-col gap-1.5">
                {educationLevels.map((level) => (
                  <label key={level} className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                    <Checkbox
                      checked={educationFilter.includes(level)}
                      onCheckedChange={() => toggleEducation(level)}
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>
            <Button className="w-full bg-stc-purple text-white hover:bg-stc-purple/90 text-xs h-9" onClick={applyFilters}>
              Apply filters
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyFilters())}
              placeholder="Search by name, summary, or skills..."
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="lg:hidden gap-1" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-3.5 w-3.5" /> Filters
            </Button>
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 ${viewMode === "grid" ? "bg-stc-purple text-white" : "text-muted-foreground hover:text-foreground"}`}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 ${viewMode === "list" ? "bg-stc-purple text-white" : "text-muted-foreground hover:text-foreground"}`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <span className="text-xs text-muted-foreground">{filteredCandidates.length} candidates</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredCandidates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No candidates found. Try adjusting your filters or search. Job seekers with visible profiles will appear here.
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 gap-4 sm:grid-cols-2" : "flex flex-col gap-3"}>
            {filteredCandidates.map((c) => (
              <Card key={c.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardContent className={`p-4 ${viewMode === "list" ? "flex items-center gap-4" : ""}`}>
                  <div className={viewMode === "list" ? "flex-1" : ""}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stc-purple/10 text-stc-purple text-sm font-bold">
                          {c.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">{c.name}</h4>
                          <p className="text-xs text-stc-purple font-medium">
                            {c.industry_primary ?? "Professional"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {c.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {c.location}
                        </span>
                      )}
                      {c.years_experience && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" /> {c.years_experience}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {c.professional_summary ?? "No summary."}
                    </p>
                    {(c.skills?.length ?? 0) > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {(c.skills as string[]).slice(0, 4).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-[10px] px-2 py-0.5">
                            {String(skill)}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {(c.languages?.length ?? 0) > 0 && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Languages: {(c.languages as string[]).join(", ")}
                      </p>
                    )}
                  </div>
                  <div className={`flex gap-2 ${viewMode === "list" ? "shrink-0" : "mt-4"}`}>
                    {c.cv_url && (
                      <Button variant="outline" size="sm" className="gap-1 text-xs" asChild>
                        <a href={c.cv_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" /> CV
                        </a>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      className="gap-1 text-xs bg-stc-purple text-white hover:bg-stc-purple/90"
                      onClick={() => openExpressInterest(c.id)}
                      disabled={postings.length === 0}
                      title={postings.length === 0 ? "Publish at least one job to express interest" : ""}
                    >
                      <Heart className="h-3 w-3" /> Express interest
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!interestCandidateId} onOpenChange={(open) => !open && setInterestCandidateId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Express interest</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Select the job position this interest is for. The candidate will be notified.</p>
          <div className="py-2">
            <Label className="text-xs">Job position</Label>
            <Select value={selectedPostingId} onValueChange={setSelectedPostingId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {postings.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInterestCandidateId(null)}>Cancel</Button>
            <Button onClick={sendInterest} disabled={sendingInterest || !selectedPostingId} className="bg-stc-purple hover:bg-stc-purple/90">
              {sendingInterest ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send interest"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
