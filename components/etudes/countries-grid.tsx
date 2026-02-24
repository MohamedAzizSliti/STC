"use client";

import { useState } from "react";
import { countries } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CountryDetail } from "./country-detail";

export function CountriesGrid() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const selected = countries.find((c) => c.id === selectedCountry);

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Choose Your Destination
          </h2>
          <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Select a country to explore universities, costs, requirements, and student life.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((country) => (
            <Card
              key={country.id}
              className="group cursor-pointer border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden py-0"
              onClick={() => setSelectedCountry(country.id)}
            >
              {/* Country image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={country.image}
                  alt={`${country.name} study destination`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <span className="text-2xl" role="img" aria-label={`${country.name} flag`}>{country.flag}</span>
                  <h3 className="text-lg font-semibold text-white">{country.name}</h3>
                </div>
              </div>

              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{country.description}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 gap-1 px-0 text-stc-blue hover:text-stc-blue/80 hover:bg-transparent"
                >
                  Learn More <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Country Detail Modal */}
      {selected && (
        <CountryDetail
          country={selected}
          open={!!selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </section>
  );
}
