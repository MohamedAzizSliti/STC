"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { countries } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Check, ArrowLeft, ArrowRight, CreditCard, Shield } from "lucide-react";

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

function ApplyContent() {
  const searchParams = useSearchParams();
  const countryId = searchParams.get("country") || "portugal";
  const country = countries.find((c) => c.id === countryId) || countries[0];

  const [step, setStep] = useState(1);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);

  const progress = (step / TOTAL_STEPS) * 100;

  const toggleDoc = (doc: string) => {
    setUploadedDocs((prev) =>
      prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-secondary">
        <div className="mx-auto max-w-3xl px-4 py-8 lg:py-12">
          {/* Header */}
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

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter your first name" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter your last name" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+1 234 567 8900" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input id="nationality" placeholder="Your nationality" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Document Upload */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Document Upload</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="rounded-lg border-2 border-dashed border-border bg-secondary/50 p-8 text-center">
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-3 text-sm font-medium text-foreground">Drag & drop files here</p>
                  <p className="mt-1 text-xs text-muted-foreground">or click to browse (PDF, DOCX, JPG up to 10MB)</p>
                  <Button variant="outline" size="sm" className="mt-4 text-foreground">
                    Browse Files
                  </Button>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-foreground">Required Documents:</p>
                  {documentTypes.map((doc) => {
                    const isUploaded = uploadedDocs.includes(doc);
                    return (
                      <div
                        key={doc}
                        className="flex items-center justify-between rounded-lg border border-border bg-background p-3 cursor-pointer hover:bg-secondary/50 transition-colors"
                        onClick={() => toggleDoc(doc)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === "Enter") toggleDoc(doc); }}
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
                          <Badge variant="outline" className="text-muted-foreground">Pending</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Platform Selection */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Application Platform</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">Choose the platform through which your application will be processed:</p>
                {[
                  { name: "Uni-Assist", desc: "Centralized application service for German universities", time: "4-6 weeks processing" },
                  { name: "Campus France", desc: "Official application portal for French institutions", time: "3-5 weeks processing" },
                  { name: "Direct University Application", desc: "Apply directly to the university of your choice", time: "2-8 weeks processing" },
                ].map((platform) => (
                  <label
                    key={platform.name}
                    className="flex cursor-pointer items-start gap-4 rounded-lg border border-border bg-background p-4 hover:bg-secondary/50 transition-colors has-[:checked]:border-stc-blue has-[:checked]:bg-stc-blue/5"
                  >
                    <input type="radio" name="platform" className="mt-1 accent-[#2980B9]" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{platform.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{platform.desc}</p>
                      <p className="mt-1 text-xs text-stc-blue font-medium">{platform.time}</p>
                    </div>
                  </label>
                ))}

                <div className="flex flex-col gap-1.5 mt-4">
                  <Label htmlFor="motivation">Motivation Letter</Label>
                  <Textarea
                    id="motivation"
                    rows={5}
                    placeholder="Tell us why you want to study in this country and what you hope to achieve..."
                  />
                  <p className="text-xs text-muted-foreground">Minimum 200 characters recommended</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Payment & Review */}
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
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-4 hover:bg-secondary/50 transition-colors has-[:checked]:border-stc-blue has-[:checked]:bg-stc-blue/5"
                    >
                      <input type="radio" name="payment" className="accent-[#2980B9]" />
                      <method.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{method.name}</span>
                    </label>
                  ))}

                  <div className="flex items-start gap-2 mt-2">
                    <Checkbox
                      id="terms"
                      checked={agreed}
                      onCheckedChange={(c) => setAgreed(c === true)}
                    />
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

          {/* Navigation Buttons */}
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="gap-2 text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            {step < TOTAL_STEPS ? (
              <Button
                onClick={() => setStep((s) => Math.min(TOTAL_STEPS, s + 1))}
                className="gap-2 bg-stc-blue text-white hover:bg-stc-blue/90"
              >
                Next Step
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                disabled={!agreed}
                className="gap-2 bg-stc-success text-white hover:bg-stc-success/90"
              >
                Submit Application
                <Check className="h-4 w-4" />
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
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    }>
      <ApplyContent />
    </Suspense>
  );
}
