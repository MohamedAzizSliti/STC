"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { EnterpriseHero } from "@/components/enterprise/hero";
import { CompanyRegistration } from "@/components/enterprise/company-registration";
import { CandidateSearch } from "@/components/enterprise/candidate-search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Search, FileText, Loader2 } from "lucide-react";
import { JobPostingForm } from "@/components/enterprise/job-posting";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EnterprisePage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace("/login?redirect=" + encodeURIComponent("/enterprise"));
        setAllowed(false);
        return;
      }
      fetch("/api/enterprises/me")
        .then((r) => {
          if (r.status === 403 || r.status === 404) {
            setAllowed(false);
            return;
          }
          setAllowed(r.ok);
        })
        .catch(() => setAllowed(false));
    });
  }, [router]);

  if (allowed === null) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-24 px-4">
          <div className="text-center max-w-md">
            <p className="text-muted-foreground mb-4">You must be logged in with an enterprise account to access this section.</p>
            <div className="flex gap-3 justify-center">
              <Button asChild variant="outline"><Link href="/login?redirect=/enterprise">Log in</Link></Button>
              <Button asChild><Link href="/signup">Sign up as Enterprise</Link></Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <EnterpriseHero />
        <section className="py-8 lg:py-12 bg-secondary">
          <div className="mx-auto max-w-5xl px-4">
            <Tabs defaultValue="register" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-8">
                <TabsTrigger value="register" className="gap-2">
                  <Building2 className="h-4 w-4 hidden sm:block" />
                  Company Profile
                </TabsTrigger>
                <TabsTrigger value="post" className="gap-2">
                  <FileText className="h-4 w-4 hidden sm:block" />
                  Post Jobs
                </TabsTrigger>
                <TabsTrigger value="search" className="gap-2">
                  <Search className="h-4 w-4 hidden sm:block" />
                  Find Talent
                </TabsTrigger>
              </TabsList>
              <TabsContent value="register">
                <CompanyRegistration />
              </TabsContent>
              <TabsContent value="post">
                <JobPostingForm />
              </TabsContent>
              <TabsContent value="search">
                <CandidateSearch />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
