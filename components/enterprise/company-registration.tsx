"use client";

import { useState, useEffect } from "react";
import { industries } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"] as const;

export function CompanyRegistration() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [headquartersLocation, setHeadquartersLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  useEffect(() => {
    fetch("/api/enterprises/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setCompanyName(data.company_name ?? "");
          setRegistrationNumber(data.registration_number ?? "");
          setIndustry(data.industry ?? "");
          setCompanySize(data.company_size ?? "");
          setHeadquartersLocation(data.headquarters_location ?? "");
          setWebsite(data.website ?? "");
          setDescription(data.description ?? "");
          setLogoUrl(data.logo_url ?? "");
          setContactPerson(data.contact_person ?? "");
          setContactEmail(data.contact_email ?? "");
          setContactPhone(data.contact_phone ?? "");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/enterprises/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName.trim() || null,
          registration_number: registrationNumber.trim() || null,
          industry: industry.trim() || null,
          company_size: companySize || null,
          headquarters_location: headquartersLocation.trim() || null,
          website: website.trim() || null,
          description: description.trim() || null,
          logo_url: logoUrl.trim() || null,
          contact_person: contactPerson.trim() || null,
          contact_email: contactEmail.trim() || null,
          contact_phone: contactPhone.trim() || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || "Failed to save.");
        return;
      }
      toast.success("Company profile saved.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Building2 className="h-5 w-5 text-stc-purple" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cname">Company Name (Legal)</Label>
              <Input id="cname" placeholder="Legal company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="regnum">Registration Number</Label>
              <Input id="regnum" placeholder="Business registration #" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label>Industry Sector</Label>
              <Select value={industry || undefined} onValueChange={setIndustry}>
                <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Company Size</Label>
              <Select value={companySize || undefined} onValueChange={setCompanySize}>
                <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                <SelectContent>
                  {COMPANY_SIZES.map((s) => (
                    <SelectItem key={s} value={s}>{s} employees</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="location">Headquarters Location</Label>
              <Input id="location" placeholder="City, Country" value={headquartersLocation} onChange={(e) => setHeadquartersLocation(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="website">Website URL</Label>
              <Input id="website" type="url" placeholder="https://..." value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="logo">Logo URL</Label>
            <Input id="logo" placeholder="https://... (image URL)" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Users className="h-5 w-5 text-stc-purple" />
            Contact Details
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="hrname">HR Contact Person</Label>
              <Input id="hrname" placeholder="Full name" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="hremail">HR Email</Label>
              <Input id="hremail" type="email" placeholder="hr@company.com" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hrphone">HR Phone Number</Label>
            <Input id="hrphone" type="tel" placeholder="+1 234 567 8900" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Company Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Mission / Description</Label>
            <Textarea id="description" rows={4} placeholder="Company mission, values, culture, benefits..." value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border border-stc-purple/20 bg-stc-purple/5 p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-stc-purple shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">Verification</p>
          <p className="text-sm text-muted-foreground mt-1">Upload business registration documents and Tax ID/VAT to complete verification. Verified enterprises get full access to candidate search. Verification typically takes 2-3 business days.</p>
        </div>
      </div>

      <Button type="submit" className="w-full bg-stc-purple text-white hover:bg-stc-purple/90" size="lg" disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Company Profile"}
      </Button>
    </form>
  );
}
