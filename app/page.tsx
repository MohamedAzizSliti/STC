import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HomeHero } from "@/components/home/hero";
import { HomePortals } from "@/components/home/portals";
import { HomeStats } from "@/components/home/stats";
import { HomeTrust } from "@/components/home/trust";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HomeHero />
        <HomePortals />
        <HomeStats />
        <HomeTrust />
      </main>
      <Footer />
    </div>
  );
}
