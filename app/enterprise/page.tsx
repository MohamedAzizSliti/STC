"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { EnterpriseHero } from "@/components/enterprise/hero";
import { CompanyRegistration } from "@/components/enterprise/company-registration";
import { CandidateSearch } from "@/components/enterprise/candidate-search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Search, FileText } from "lucide-react";
import { JobPostingForm } from "@/components/enterprise/job-posting";

export default function EnterprisePage() {
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
                  Register
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
