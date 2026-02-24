"use client";

import { useState, type KeyboardEvent } from "react";
import { industries } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, X, Plus } from "lucide-react";

interface ProfileFormProps {
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
  onChange: (data: ProfileFormProps["data"]) => void;
  onComplete: () => void;
}

const TOTAL_STEPS = 4;

export function ProfileForm({ data, onChange, onComplete }: ProfileFormProps) {
  const [step, setStep] = useState(1);
  const [skillInput, setSkillInput] = useState("");
  const [titleInput, setTitleInput] = useState("");

  const progress = (step / TOTAL_STEPS) * 100;

  const updateField = (field: string, value: string | string[] | { name: string; level: string }[]) => {
    onChange({ ...data, [field]: value });
  };

  const addSkill = () => {
    if (skillInput.trim() && !data.skills.includes(skillInput.trim())) {
      updateField("skills", [...data.skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    updateField("skills", data.skills.filter((s) => s !== skill));
  };

  const addTitle = () => {
    if (titleInput.trim() && !data.desiredTitles.includes(titleInput.trim())) {
      updateField("desiredTitles", [...data.desiredTitles, titleInput.trim()]);
      setTitleInput("");
    }
  };

  const removeTitle = (title: string) => {
    updateField("desiredTitles", data.desiredTitles.filter((t) => t !== title));
  };

  const addLanguage = () => {
    updateField("languages", [...data.languages, { name: "", level: "Intermediate" }]);
  };

  const updateLanguage = (index: number, field: "name" | "level", value: string) => {
    const updated = [...data.languages];
    updated[index] = { ...updated[index], [field]: value };
    updateField("languages", updated);
  };

  const removeLanguage = (index: number) => {
    updateField("languages", data.languages.filter((_, i) => i !== index));
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); addSkill(); }
  };

  const handleTitleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); addTitle(); }
  };

  return (
    <section className="py-8 lg:py-12 bg-secondary">
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">Create Your Profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">Step {step} of {TOTAL_STEPS}</p>
          <Progress value={progress} className="mt-3 h-2" />
        </div>

        {/* Step 1: Personal */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="jfn">First Name</Label>
                  <Input id="jfn" value={data.firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder="First name" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="jln">Last Name</Label>
                  <Input id="jln" value={data.lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder="Last name" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="jem">Email</Label>
                <Input id="jem" type="email" value={data.email} onChange={(e) => updateField("email", e.target.value)} placeholder="your@email.com" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="jph">Phone</Label>
                <Input id="jph" type="tel" value={data.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+1 234 567 8900" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="jloc">Current Location</Label>
                  <Input id="jloc" value={data.location} onChange={(e) => updateField("location", e.target.value)} placeholder="City, Country" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="jnat">Nationality</Label>
                  <Input id="jnat" value={data.nationality} onChange={(e) => updateField("nationality", e.target.value)} placeholder="Your nationality" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Professional */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Professional Background</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="jobj">Career Objective</Label>
                <Textarea id="jobj" value={data.objective} onChange={(e) => updateField("objective", e.target.value)} placeholder="Briefly describe your career goals..." rows={3} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Years of Experience</Label>
                <Select value={data.experience} onValueChange={(v) => updateField("experience", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-2">0-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="jtitle">Current Job Title</Label>
                  <Input id="jtitle" value={data.currentTitle} onChange={(e) => updateField("currentTitle", e.target.value)} placeholder="e.g. Software Engineer" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="jcomp">Current Company</Label>
                  <Input id="jcomp" value={data.currentCompany} onChange={(e) => updateField("currentCompany", e.target.value)} placeholder="Company name" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Skills & Languages */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Skills & Languages</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Skills */}
              <div className="flex flex-col gap-2">
                <Label>Technical & Soft Skills</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    placeholder="Type a skill and press Enter"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addSkill} className="shrink-0">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add skill</span>
                  </Button>
                </div>
                {data.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="gap-1 bg-secondary text-secondary-foreground">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="ml-0.5 hover:text-destructive" aria-label={`Remove ${skill}`}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Languages */}
              <div className="flex flex-col gap-2">
                <Label>Languages</Label>
                {data.languages.map((lang, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={lang.name}
                      onChange={(e) => updateLanguage(i, "name", e.target.value)}
                      placeholder="Language"
                      className="flex-1"
                    />
                    <Select value={lang.level} onValueChange={(v) => updateLanguage(i, "level", v)}>
                      <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Fluent">Fluent</SelectItem>
                        <SelectItem value="Native">Native</SelectItem>
                      </SelectContent>
                    </Select>
                    {data.languages.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeLanguage(i)} className="shrink-0 text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove language</span>
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addLanguage} className="w-fit gap-1 text-foreground">
                  <Plus className="h-3.5 w-3.5" /> Add Language
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Preferences */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Industry & Preferences</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Primary Industry</Label>
                <Select value={data.industry} onValueChange={(v) => updateField("industry", v)}>
                  <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                  <SelectContent>
                    {industries.map((ind) => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Desired Job Titles</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    onKeyDown={handleTitleKeyDown}
                    placeholder="Type a title and press Enter"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addTitle} className="shrink-0">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add title</span>
                  </Button>
                </div>
                {data.desiredTitles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.desiredTitles.map((title) => (
                      <Badge key={title} variant="secondary" className="gap-1 bg-secondary text-secondary-foreground">
                        {title}
                        <button onClick={() => removeTitle(title)} className="ml-0.5 hover:text-destructive" aria-label={`Remove ${title}`}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                  <Label>Work Arrangement</Label>
                  <Select value={data.workArrangement} onValueChange={(v) => updateField("workArrangement", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="On-site">On-site</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Employment Type</Label>
                  <Select value={data.employmentType} onValueChange={(v) => updateField("employmentType", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Availability</Label>
                  <Select value={data.availability} onValueChange={(v) => updateField("availability", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Immediate">Immediate</SelectItem>
                      <SelectItem value="1 month">1 month</SelectItem>
                      <SelectItem value="3 months">3 months</SelectItem>
                      <SelectItem value="6 months">6 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Nav */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="gap-2 text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </Button>
          {step < TOTAL_STEPS ? (
            <Button onClick={() => setStep((s) => s + 1)} className="gap-2 bg-stc-green text-white hover:bg-stc-green/90">
              Next Step <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={onComplete} className="gap-2 bg-stc-green text-white hover:bg-stc-green/90">
              Preview Profile <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
