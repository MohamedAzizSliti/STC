import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { EtudesHero } from "@/components/etudes/hero";
import { CountriesGrid } from "@/components/etudes/countries-grid";
import { ApplicationSteps } from "@/components/etudes/application-steps";

export default function EtudesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <EtudesHero />
        <CountriesGrid />
        <ApplicationSteps />
      </main>
      <Footer />
    </div>
  );
}
