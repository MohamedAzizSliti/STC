"use client";

import { useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X, Save, Eye, Send } from "lucide-react";

const benefits = [
  "Health Insurance", "Pension Plan", "Remote Work Options",
  "Professional Development", "Relocation Assistance", "Stock Options", "Bonus Structure"
];

export function JobPostingForm() {
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); addSkill(); }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Post a New Position</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ptitle">Position Title</Label>
              <Input id="ptitle" placeholder="e.g. Senior Software Engineer" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dept">Department</Label>
              <Input id="dept" placeholder="e.g. Engineering" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label>Number of Openings</Label>
              <Select defaultValue="1">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5].map(n => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Experience Level</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                  <SelectItem value="lead">Lead / Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Education Level</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Minimum education" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="bachelor">Bachelor{"'"}s</SelectItem>
                  <SelectItem value="master">Master{"'"}s</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Employment Type</Label>
            <div className="flex flex-wrap gap-4">
              {["Full-time", "Part-time", "Contract", "Internship"].map(type => (
                <label key={type} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <Checkbox />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-col gap-2">
            <Label>Key Skills Required</Label>
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
                  <Badge key={skill} variant="secondary" className="gap-1 bg-secondary text-secondary-foreground">
                    {skill}
                    <button onClick={() => setSkills(skills.filter(s => s !== skill))} className="ml-0.5 hover:text-destructive" aria-label={`Remove ${skill}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="jdesc">Job Description</Label>
            <Textarea id="jdesc" rows={5} placeholder="Describe the role responsibilities, requirements, and what makes this opportunity unique..." />
          </div>

          {/* Compensation */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="salFrom">Salary From</Label>
              <Input id="salFrom" type="number" placeholder="e.g. 50000" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="salTo">Salary To</Label>
              <Input id="salTo" type="number" placeholder="e.g. 80000" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Currency</Label>
              <Select defaultValue="EUR">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Benefits */}
          <div className="flex flex-col gap-2">
            <Label>Benefits Package</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {benefits.map(b => (
                <label key={b} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <Checkbox />
                  {b}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="deadline">Application Deadline</Label>
            <Input id="deadline" type="date" />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" className="flex-1 gap-2 text-foreground">
          <Save className="h-4 w-4" /> Save as Draft
        </Button>
        <Button variant="outline" className="flex-1 gap-2 text-foreground">
          <Eye className="h-4 w-4" /> Preview
        </Button>
        <Button className="flex-1 gap-2 bg-stc-purple text-white hover:bg-stc-purple/90">
          <Send className="h-4 w-4" /> Publish Position
        </Button>
      </div>
    </div>
  );
}
