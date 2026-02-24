"use client";

import { useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Briefcase, Clock, Heart, Eye, LayoutGrid, List, X, Plus, Filter, RotateCcw } from "lucide-react";

const mockCandidates = [
  {
    id: 1,
    name: "Maria S.",
    title: "Full-Stack Developer",
    location: "Lisbon, Portugal",
    experience: "5-10 years",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    languages: ["English", "Portuguese", "Spanish"],
    summary: "Experienced full-stack developer with a passion for building scalable web applications.",
    match: 92,
    availability: "Immediate",
  },
  {
    id: 2,
    name: "Ahmed K.",
    title: "Data Scientist",
    location: "Berlin, Germany",
    experience: "3-5 years",
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL"],
    languages: ["English", "Arabic", "German"],
    summary: "Data scientist specializing in ML and AI solutions for business intelligence.",
    match: 87,
    availability: "1 month",
  },
  {
    id: 3,
    name: "Sarah L.",
    title: "Marketing Manager",
    location: "Paris, France",
    experience: "5-10 years",
    skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
    languages: ["English", "French"],
    summary: "Strategic marketing professional with experience in international brand management.",
    match: 78,
    availability: "3 months",
  },
  {
    id: 4,
    name: "Wei C.",
    title: "Mechanical Engineer",
    location: "Dublin, Ireland",
    experience: "3-5 years",
    skills: ["CAD", "SolidWorks", "3D Printing", "Product Design"],
    languages: ["English", "Mandarin"],
    summary: "Innovative engineer with expertise in product development and manufacturing.",
    match: 85,
    availability: "Immediate",
  },
  {
    id: 5,
    name: "Priya R.",
    title: "UX Designer",
    location: "Barcelona, Spain",
    experience: "3-5 years",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    languages: ["English", "Hindi", "Spanish"],
    summary: "User-centered designer focused on creating intuitive digital experiences.",
    match: 90,
    availability: "1 month",
  },
  {
    id: 6,
    name: "David M.",
    title: "Financial Analyst",
    location: "Warsaw, Poland",
    experience: "0-2 years",
    skills: ["Financial Modeling", "Excel", "Bloomberg", "Risk Analysis"],
    languages: ["English", "Polish", "French"],
    summary: "Finance graduate with strong analytical skills and international market experience.",
    match: 73,
    availability: "Immediate",
  },
];

const experienceLevels = ["0-2 years", "3-5 years", "5-10 years", "10+ years"];
const educationLevels = ["High School", "Bachelor's", "Master's", "PhD"];

export function CandidateSearch() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skillFilters, setSkillFilters] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(true);

  const addSkillFilter = () => {
    if (skillInput.trim() && !skillFilters.includes(skillInput.trim())) {
      setSkillFilters([...skillFilters, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); addSkillFilter(); }
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
  };

  const filteredCandidates = mockCandidates.filter((c) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Filters Sidebar */}
      <div className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-72 shrink-0`}>
        <Card>
          <CardContent className="p-4 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filters
              </h3>
              <button className="text-xs text-stc-purple hover:underline flex items-center gap-1">
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            </div>

            {/* Skills filter */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium">Skills</Label>
              <div className="flex items-center gap-1">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Search skills..."
                  className="text-xs h-8"
                />
                <Button type="button" variant="outline" size="icon" onClick={addSkillFilter} className="h-8 w-8 shrink-0">
                  <Plus className="h-3 w-3" />
                  <span className="sr-only">Add skill filter</span>
                </Button>
              </div>
              {skillFilters.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {skillFilters.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs gap-1 bg-secondary text-secondary-foreground">
                      {s}
                      <button onClick={() => setSkillFilters(skillFilters.filter((f) => f !== s))} aria-label={`Remove ${s}`}>
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Experience */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium">Experience Level</Label>
              <div className="flex flex-col gap-1.5">
                {experienceLevels.map((level) => (
                  <label key={level} className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                    <Checkbox className="h-3.5 w-3.5" />
                    {level}
                  </label>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium">Education Level</Label>
              <div className="flex flex-col gap-1.5">
                {educationLevels.map((level) => (
                  <label key={level} className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                    <Checkbox className="h-3.5 w-3.5" />
                    {level}
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Availability</Label>
              <Select>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Any" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="1month">1 month</SelectItem>
                  <SelectItem value="3months">3 months</SelectItem>
                  <SelectItem value="6months">6 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full bg-stc-purple text-white hover:bg-stc-purple/90 text-xs h-9">
              Apply Filters
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {/* Search bar and controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidates by name, title, or skills..."
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden gap-1 text-foreground"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-3.5 w-3.5" />
              Filters
            </Button>
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 ${viewMode === "grid" ? "bg-stc-purple text-white" : "text-muted-foreground hover:text-foreground"}`}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
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

        {/* Candidates grid/list */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 gap-4 sm:grid-cols-2" : "flex flex-col gap-3"}>
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id} className="group overflow-hidden transition-all hover:shadow-md">
              <CardContent className={`p-4 ${viewMode === "list" ? "flex items-center gap-4" : ""}`}>
                <div className={viewMode === "list" ? "flex-1" : ""}>
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stc-purple/10 text-stc-purple text-sm font-bold">
                        {candidate.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{candidate.name}</h4>
                        <p className="text-xs text-stc-purple font-medium">{candidate.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-stc-purple/10 text-stc-purple text-xs border-0">
                        {candidate.match}% match
                      </Badge>
                      <button
                        onClick={() => toggleFavorite(candidate.id)}
                        className={`p-1 rounded-full transition-colors ${favorites.includes(candidate.id) ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
                        aria-label={`${favorites.includes(candidate.id) ? "Remove from" : "Add to"} favorites`}
                      >
                        <Heart className={`h-4 w-4 ${favorites.includes(candidate.id) ? "fill-current" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{candidate.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{candidate.experience}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{candidate.availability}</span>
                  </div>

                  {/* Summary */}
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{candidate.summary}</p>

                  {/* Skills */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {candidate.skills.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-[10px] px-2 py-0.5 bg-secondary text-secondary-foreground">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {/* Languages */}
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="font-medium">Languages:</span> {candidate.languages.join(", ")}
                  </div>
                </div>

                {/* Actions */}
                <div className={`flex gap-2 ${viewMode === "list" ? "shrink-0" : "mt-4"}`}>
                  <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs text-foreground">
                    <Eye className="h-3 w-3" /> View Profile
                  </Button>
                  <Button size="sm" className="flex-1 gap-1 text-xs bg-stc-purple text-white hover:bg-stc-purple/90">
                    <Heart className="h-3 w-3" /> Express Interest
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
