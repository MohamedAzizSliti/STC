import { Building2, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EnterpriseHero() {
  return (
    <section className="relative overflow-hidden bg-stc-purple text-white">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      <div className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <Building2 className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl text-balance">
            Find Top International Talent
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80 leading-relaxed text-pretty">
            Connect with qualified professionals across multiple industries. Post positions and discover candidates that match your needs.
          </p>
          <Button size="lg" className="mt-8 bg-white text-stc-purple hover:bg-white/90 gap-2">
            Get Started
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
