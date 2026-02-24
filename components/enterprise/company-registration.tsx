"use client";

import { industries } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Building2, Globe, Users, Info } from "lucide-react";

export function CompanyRegistration() {
  return (
    <div className="flex flex-col gap-6">
      {/* Company Info */}
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
              <Input id="cname" placeholder="Legal company name" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tname">Trading Name</Label>
              <Input id="tname" placeholder="If different from legal name" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="regnum">Registration Number</Label>
              <Input id="regnum" placeholder="Business registration #" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Industry Sector</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label>Company Size</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-500">201-500 employees</SelectItem>
                  <SelectItem value="500+">500+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="founded">Founded Year</Label>
              <Input id="founded" placeholder="e.g. 2010" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="website">Website URL</Label>
              <Input id="website" type="url" placeholder="https://..." />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Company Logo</Label>
            <div className="rounded-lg border-2 border-dashed border-border bg-secondary/50 p-6 text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Drop your logo here or click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, SVG or JPG (max 2MB)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Details */}
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
              <Input id="hrname" placeholder="Full name" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="hremail">HR Email</Label>
              <Input id="hremail" type="email" placeholder="hr@company.com" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="hrphone">HR Phone Number</Label>
              <Input id="hrphone" type="tel" placeholder="+1 234 567 8900" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="linkedin">LinkedIn Company Page</Label>
              <Input id="linkedin" placeholder="https://linkedin.com/company/..." />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Globe className="h-5 w-5 text-stc-purple" />
            Company Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="mission">Mission Statement</Label>
            <Textarea id="mission" rows={3} placeholder="What drives your company..." />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="culture">Culture Description</Label>
            <Textarea id="culture" rows={3} placeholder="Describe your work environment and culture..." />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Employee Benefits</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {["Health Insurance", "Pension Plan", "Remote Work", "Professional Development", "Relocation Support", "Stock Options", "Bonus Structure", "Flexible Hours", "Gym Membership"].map((b) => (
                <label key={b} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input type="checkbox" className="accent-[#8E44AD] rounded" />
                  {b}
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification */}
      <div className="rounded-lg border border-stc-purple/20 bg-stc-purple/5 p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-stc-purple shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">Verification Required</p>
          <p className="text-sm text-muted-foreground mt-1">After registration, please upload your business registration documents and Tax ID/VAT number. Verification typically takes 2-3 business days.</p>
        </div>
      </div>

      <Button className="w-full bg-stc-purple text-white hover:bg-stc-purple/90" size="lg">
        Register Company
      </Button>
    </div>
  );
}
