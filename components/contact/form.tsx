"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Send, CheckCircle } from "lucide-react";

const subjects = [
  "General Inquiry",
  "Study Abroad Application",
  "Job Seeker Support",
  "Enterprise Services",
  "Technical Issue",
  "Payment / Billing",
  "Partnership Opportunity",
];

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [userType, setUserType] = useState("student");

  if (submitted) {
    return (
      <Card>
        <CardContent className="p-8 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stc-success/10">
            <CheckCircle className="h-8 w-8 text-stc-success" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-foreground">Message Sent!</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm leading-relaxed">
            {"Thank you for reaching out. Our team will review your message and get back to you within 24-48 hours."}
          </p>
          <Button
            variant="outline"
            className="mt-6 text-foreground"
            onClick={() => setSubmitted(false)}
          >
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Send Us a Message</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cname">Your Name</Label>
            <Input id="cname" placeholder="Full name" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cemail">Email Address</Label>
            <Input id="cemail" type="email" placeholder="your@email.com" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cphone">Phone Number (optional)</Label>
          <Input id="cphone" type="tel" placeholder="+1 234 567 8900" />
        </div>

        <div className="flex flex-col gap-2">
          <Label>I am a:</Label>
          <RadioGroup value={userType} onValueChange={setUserType} className="flex flex-wrap gap-4">
            {[
              { value: "student", label: "Student / Applicant" },
              { value: "jobseeker", label: "Job Seeker" },
              { value: "company", label: "Company Representative" },
              { value: "other", label: "Other" },
            ].map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <RadioGroupItem value={option.value} id={`type-${option.value}`} />
                <Label htmlFor={`type-${option.value}`} className="text-sm text-foreground cursor-pointer font-normal">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Subject</Label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Select a topic" /></SelectTrigger>
            <SelectContent>
              {subjects.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cmessage">Message</Label>
          <Textarea id="cmessage" rows={6} placeholder="How can we help you?" />
        </div>

        <Button
          onClick={() => setSubmitted(true)}
          className="w-full bg-stc-orange text-white hover:bg-stc-orange/90 gap-2"
          size="lg"
        >
          <Send className="h-4 w-4" />
          Send Message
        </Button>
      </CardContent>
    </Card>
  );
}
