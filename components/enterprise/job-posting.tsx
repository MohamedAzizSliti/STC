"use client";

import { useState, useEffect, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Save, Send, Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Posting = {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  positions_available: number;
  employment_type: string | null;
  experience_required: string | null;
  education_required: string | null;
  skills_required: string[];
  salary_range: string | null;
  description: string | null;
  expiry_date: string | null;
  status: string;
  posted_date: string;
};

export function JobPostingForm() {
  const [postings, setPostings] = useState<Posting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [positionsAvailable, setPositionsAvailable] = useState(1);
  const [employmentType, setEmploymentType] = useState("");
  const [experienceRequired, setExperienceRequired] = useState("");
  const [educationRequired, setEducationRequired] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const loadPostings = () => {
    fetch("/api/enterprises/me/postings")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setPostings(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPostings();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDepartment("");
    setLocation("");
    setPositionsAvailable(1);
    setEmploymentType("");
    setExperienceRequired("");
    setEducationRequired("");
    setSkills([]);
    setDescription("");
    setSalaryRange("");
    setExpiryDate("");
  };

  const openEdit = (p: Posting) => {
    setEditingId(p.id);
    setTitle(p.title);
    setDepartment(p.department ?? "");
    setLocation(p.location ?? "");
    setPositionsAvailable(p.positions_available);
    setEmploymentType(p.employment_type ?? "");
    setExperienceRequired(p.experience_required ?? "");
    setEducationRequired(p.education_required ?? "");
    setSkills(p.skills_required ?? []);
    setDescription(p.description ?? "");
    setSalaryRange(p.salary_range ?? "");
    setExpiryDate(p.expiry_date ?? "");
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!title.trim()) {
      toast.error("Position title is required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        department: department.trim() || null,
        location: location.trim() || null,
        positions_available: positionsAvailable,
        employment_type: employmentType.trim() || null,
        experience_required: experienceRequired.trim() || null,
        education_required: educationRequired.trim() || null,
        skills_required: skills,
        salary_range: salaryRange.trim() || null,
        description: description.trim() || null,
        expiry_date: expiryDate.trim() || null,
        status,
      };
      if (editingId) {
        const res = await fetch(`/api/enterprises/me/postings/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          toast.error(err.message || "Failed to update.");
          return;
        }
        toast.success("Position updated.");
      } else {
        const res = await fetch("/api/enterprises/me/postings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          toast.error(err.message || "Failed to create.");
          return;
        }
        toast.success("Position created.");
      }
      resetForm();
      loadPostings();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job posting?")) return;
    const res = await fetch(`/api/enterprises/me/postings/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to delete.");
      return;
    }
    toast.success("Posting deleted.");
    loadPostings();
    if (editingId === id) resetForm();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {postings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Your job postings</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {postings.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
                  <div>
                    <p className="font-medium text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.department && `${p.department} · `}{p.positions_available} position(s) ·{" "}
                      <Badge variant={p.status === "published" ? "default" : "secondary"} className="text-xs">
                        {p.status}
                      </Badge>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(p)} className="gap-1">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(p.id)} className="gap-1 text-destructive hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">{editingId ? "Edit position" : "Post a new position"}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ptitle">Position title</Label>
              <Input id="ptitle" placeholder="e.g. Senior Software Engineer" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dept">Department</Label>
              <Input id="dept" placeholder="e.g. Engineering" value={department} onChange={(e) => setDepartment(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label>Number of openings (1–5)</Label>
              <Select value={String(positionsAvailable)} onValueChange={(v) => setPositionsAvailable(Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Experience level</Label>
              <Select value={experienceRequired || undefined} onValueChange={setExperienceRequired}>
                <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entry Level">Entry Level</SelectItem>
                  <SelectItem value="Mid Level">Mid Level</SelectItem>
                  <SelectItem value="Senior Level">Senior Level</SelectItem>
                  <SelectItem value="Lead / Manager">Lead / Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Education level</Label>
              <Select value={educationRequired || undefined} onValueChange={setEducationRequired}>
                <SelectTrigger><SelectValue placeholder="Minimum education" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="High School">High School</SelectItem>
                  <SelectItem value="Bachelor's">Bachelor&apos;s</SelectItem>
                  <SelectItem value="Master's">Master&apos;s</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="location">Location / branch</Label>
              <Input id="location" placeholder="e.g. Paris Office" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Employment type</Label>
              <Select value={employmentType || undefined} onValueChange={setEmploymentType}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Key skills required</Label>
            <div className="flex items-center gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a skill and press Enter"
              />
              <Button type="button" variant="outline" size="icon" onClick={addSkill} className="shrink-0">
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add skill</span>
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1">
                    {skill}
                    <button type="button" onClick={() => setSkills(skills.filter((s) => s !== skill))} className="ml-0.5 hover:text-destructive" aria-label={`Remove ${skill}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="jdesc">Job description</Label>
            <Textarea id="jdesc" rows={5} placeholder="Responsibilities, requirements..." value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="salary">Salary range</Label>
              <Input id="salary" placeholder="e.g. 45,000 - 60,000 EUR" value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="deadline">Application deadline</Label>
              <Input id="deadline" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" className="flex-1 gap-2" onClick={() => handleSave("draft")} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save as draft
        </Button>
        <Button className="flex-1 gap-2 bg-stc-purple text-white hover:bg-stc-purple/90" onClick={() => handleSave("published")} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Publish position
        </Button>
      </div>
    </div>
  );
}
