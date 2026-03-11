"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { countries } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import {
  Upload,
  FileText,
  Check,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Shield,
  Loader2,
} from "lucide-react";

const TOTAL_STEPS = 4;

const documentTypes = [
  "Academic Transcripts",
  "Passport/ID",
  "Language Certificate",
  "Recommendation Letters",
  "Personal Statement",
  "CV/Resume",
  "Financial Proof",
];

const platforms = [
  { name: "Uni-Assist", desc: "Centralized application service for German universities", time: "4-6 weeks processing" },
  { name: "Campus France", desc: "Official application portal for French institutions", time: "3-5 weeks processing" },
  { name: "Direct University Application", desc: "Apply directly to the university of your choice", time: "2-8 weeks processing" },
];

type StudentProfile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  nationality: string | null;
  passport_number: string | null;
  phone: string | null;
  address: string | null;
  education_level: string | null;
  target_country: string | null;
  application_platform: string | null;
};

function ApplyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const countryId = searchParams.get("country") || "portugal";
  const country = countries.find((c) => c.id === countryId) || countries[0];

  const [authChecked, setAuthChecked] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [step, setStep] = useState(1);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [platform, setPlatform] = useState("");
  const [motivation, setMotivation] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        const returnUrl = `/etudes/apply?country=${countryId}`;
        router.replace(`/login?redirect=${encodeURIComponent(returnUrl)}`);
        return;
      }
      setAuthChecked(true);
    });
  }, [countryId, router]);

  useEffect(() => {
    if (!authChecked) return;
    fetch("/api/students/me")
      .then((res) => {
        if (res.status === 401) {
          router.replace(`/login?redirect=${encodeURIComponent(`/etudes/apply?country=${countryId}`)}`);
          return null;
        }
        if (res.status === 403) {
          router.replace("/etudes");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setProfile(data);
          setFirstName(data.first_name ?? "");
          setLastName(data.last_name ?? "");
          setPhone(data.phone ?? "");
          setNationality(data.nationality ?? "");
          setDob(data.date_of_birth ?? "");
          setAddress(data.address ?? "");
          setEducationLevel(data.education_level ?? "");
          setPlatform(data.application_platform ?? "");
        }
        setProfileLoaded(true);
      });
  }, [authChecked, countryId, router]);

  const saveProfile = async () => {
    setSaving(true);
    const res = await fetch("/api/students/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: firstName || null,
        last_name: lastName || null,
        phone: phone || null,
        nationality: nationality || null,
        date_of_birth: dob || null,
        address: address || null,
        education_level: educationLevel || null,
        target_country: countryId,
        application_platform: platform || null,
        profile_completed: true,
      }),
    });
    setSaving(false);
    return res.ok;
  };

  const handleNext = async () => {
    if (step === 1) {
      await saveProfile();
    }
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };

  const handleSubmitApplication = async () => {
    setSubmitError(null);
    setSaving(true);
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        target_country: countryId,
        application_platform: platform || null,
        notes: motivation || null,
        submit: true,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setSubmitError(err.message || "Failed to submit application.");
      return;
    }
    router.push("/etudes/dashboard");
    router.refresh();
  };

  const progress = (step / TOTAL_STEPS) * 100;

  const triggerUpload = (documentType: string) => {
    setUploadingType(documentType);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = uploadingType;
    setUploadingType(null);
    const file = e.target.files?.[0];
    if (!file || !type) return;
    e.target.value = "";
    const formData = new FormData();
    formData.set("file", file);
    formData.set("document_type", type);
    const res = await fetch("/api/documents/upload", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      setUploadedDocs((prev) => (prev.includes(type) ? prev : [...prev, type]));
    }
  };

  if (!authChecked || !profileLoaded || (profileLoaded && !profile)) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-secondary">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-secondary">
        <div className="mx-auto max-w-3xl px-4 py-8 lg:py-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl" role="img" aria-label={`${country.name} flag`}>{country.flag}</span>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Apply to Study in {country.name}</h1>
                <p className="text-sm text-muted-foreground">Step {step} of {TOTAL_STEPS}</p>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter your first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter your last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="your@email.com" value={profile ? "(from your account)" : ""} readOnly disabled className="bg-muted" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+1 234 567 8900" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input id="nationality" placeholder="Your nationality" value={nationality} onChange={(e) => setNationality(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="City, Country" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="educationLevel">Education Level</Label>
                  <Input id="educationLevel" placeholder="e.g. High school, Bachelor" value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)} />
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Document Upload</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                />
                <div className="rounded-lg border-2 border-dashed border-border bg-secondary/50 p-8 text-center">
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-3 text-sm font-medium text-foreground">Upload required documents (PDF, DOCX, JPG up to 10MB)</p>
                  <p className="mt-1 text-xs text-muted-foreground">Click the Upload button next to each document type below.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-foreground">Required Documents:</p>
                  {documentTypes.map((doc) => {
                    const isUploaded = uploadedDocs.includes(doc);
                    const isUploading = uploadingType === doc;
                    return (
                      <div
                        key={doc}
                        className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">{doc}</span>
                        </div>
                        {isUploaded ? (
                          <Badge className="bg-stc-success text-white">
                            <Check className="mr-1 h-3 w-3" /> Uploaded
                          </Badge>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={!!uploadingType}
                            onClick={() => triggerUpload(doc)}
                            className="text-foreground"
                          >
                            {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Upload"}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Application Platform</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">Choose the platform through which your application will be processed:</p>
                {platforms.map((p) => (
                  <label
                    key={p.name}
                    className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-colors ${platform === p.name ? "border-stc-blue bg-stc-blue/5" : "border-border bg-background hover:bg-secondary/50"}`}
                  >
                    <input
                      type="radio"
                      name="platform"
                      className="mt-1 accent-[#2980B9]"
                      checked={platform === p.name}
                      onChange={() => setPlatform(p.name)}
                    />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{p.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{p.desc}</p>
                      <p className="mt-1 text-xs text-stc-blue font-medium">{p.time}</p>
                    </div>
                  </label>
                ))}
                <div className="flex flex-col gap-1.5 mt-4">
                  <Label htmlFor="motivation">Motivation Letter</Label>
                  <Textarea
                    id="motivation"
                    rows={5}
                    placeholder="Tell us why you want to study in this country and what you hope to achieve..."
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Minimum 200 characters recommended</p>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Application Fee</span>
                    <span className="font-medium text-foreground">75.00 EUR</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span className="font-medium text-foreground">150.00 EUR</span>
                  </div>
                  <div className="border-t border-border pt-3 flex items-center justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-xl font-bold text-stc-blue">225.00 EUR</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {[
                    { name: "Credit/Debit Card", icon: CreditCard },
                    { name: "PayPal", icon: Shield },
                    { name: "Bank Transfer", icon: FileText },
                  ].map((method) => (
                    <label
                      key={method.name}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-4 hover:bg-secondary/50 transition-colors"
                    >
                      <input type="radio" name="payment" className="accent-[#2980B9]" />
                      <method.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{method.name}</span>
                    </label>
                  ))}
                  <div className="flex items-start gap-2 mt-2">
                    <Checkbox id="terms" checked={agreed} onCheckedChange={(c) => setAgreed(c === true)} />
                    <Label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
                      I agree to the Terms & Conditions and understand that the application fee is non-refundable.
                    </Label>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-4 w-4 text-stc-success" />
                    Secure payment processed by our trusted payment partner
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {submitError && (
            <p className="mt-4 text-sm text-destructive" role="alert">{submitError}</p>
          )}

          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1 || saving}
              className="gap-2 text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            {step < TOTAL_STEPS ? (
              <Button onClick={handleNext} disabled={saving} className="gap-2 bg-stc-blue text-white hover:bg-stc-blue/90">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Next Step
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                disabled={!agreed || saving}
                onClick={handleSubmitApplication}
                className="gap-2 bg-stc-success text-white hover:bg-stc-success/90"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Submit Application
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <ApplyContent />
    </Suspense>
  );
}
