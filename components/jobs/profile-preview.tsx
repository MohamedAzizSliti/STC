"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Edit, MapPin, Briefcase, Clock, Shield, Eye, Mail, MessageSquare, Bell, User } from "lucide-react";
import { useState } from "react";

interface ProfilePreviewProps {
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
  onEdit: () => void;
}

export function ProfilePreview({ data, onEdit }: ProfilePreviewProps) {
  const [visibility, setVisibility] = useState({
    profile: true,
    contact: false,
    messages: true,
    alerts: true,
  });

  const displayName = `${data.firstName || "John"} ${data.lastName || "Doe"}`;
  const initials = `${(data.firstName || "J")[0]}${(data.lastName || "D")[0]}`.toUpperCase();

  return (
    <section className="py-8 lg:py-12 bg-secondary">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Profile Preview</h2>
          <Button variant="outline" onClick={onEdit} className="gap-2 text-foreground">
            <Edit className="h-4 w-4" /> Edit Profile
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="overflow-hidden">
          <div className="h-2 bg-stc-green" />
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              {/* Avatar */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-stc-green/10 text-stc-green">
                <User className="h-10 w-10" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground">{displayName}</h3>
                <p className="text-sm text-stc-green font-medium">{data.currentTitle || "Job Seeker"}</p>
                {data.currentCompany && <p className="text-sm text-muted-foreground">at {data.currentCompany}</p>}

                <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {data.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {data.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" /> {data.experience} years
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {data.availability}
                  </span>
                </div>
              </div>
            </div>

            {/* Objective */}
            {data.objective && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-foreground">Career Objective</h4>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{data.objective}</p>
              </div>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-foreground">Skills</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-stc-green/10 text-stc-green border-0">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {data.languages.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-foreground">Languages</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.languages.filter(l => l.name).map((lang, i) => (
                    <Badge key={i} variant="outline" className="text-foreground">
                      {lang.name} - {lang.level}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              {data.industry && <span>Industry: <span className="font-medium text-foreground">{data.industry}</span></span>}
              <span>Type: <span className="font-medium text-foreground">{data.employmentType}</span></span>
              <span>Work: <span className="font-medium text-foreground">{data.workArrangement}</span></span>
            </div>

            {data.desiredTitles.length > 0 && (
              <div className="mt-3">
                <span className="text-sm text-muted-foreground">Looking for: </span>
                {data.desiredTitles.map((t) => (
                  <Badge key={t} variant="secondary" className="mr-1 bg-secondary text-secondary-foreground">{t}</Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visibility Controls */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Eye className="h-4 w-4" /> Profile Visibility
            </h3>
            <div className="mt-4 flex flex-col gap-4">
              {[
                { key: "profile" as const, label: "Make profile visible to employers", icon: Eye },
                { key: "contact" as const, label: "Show contact information", icon: Mail },
                { key: "messages" as const, label: "Allow direct messages", icon: MessageSquare },
                { key: "alerts" as const, label: "Receive job alerts", icon: Bell },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <Label htmlFor={item.key} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    {item.label}
                  </Label>
                  <Switch
                    id={item.key}
                    checked={visibility[item.key]}
                    onCheckedChange={(c) => setVisibility((v) => ({ ...v, [item.key]: c }))}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Privacy notice */}
        <div className="mt-6 rounded-lg border border-stc-green/20 bg-stc-green/5 p-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-stc-green shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your profile will only be visible to verified enterprise accounts. Contact information is shared only upon mutual interest.
          </p>
        </div>
      </div>
    </section>
  );
}
