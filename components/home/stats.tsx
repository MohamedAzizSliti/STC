import { GraduationCap, Users, Building2, Globe } from "lucide-react";

const stats = [
  { label: "Students Placed", value: "5,000+", icon: GraduationCap, color: "text-stc-blue" },
  { label: "Active Job Seekers", value: "12,000+", icon: Users, color: "text-stc-green" },
  { label: "Partner Companies", value: "1,200+", icon: Building2, color: "text-stc-purple" },
  { label: "Countries Covered", value: "9+", icon: Globe, color: "text-stc-orange" },
];

export function HomeStats() {
  return (
    <section className="bg-secondary py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-background">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <p className="mt-3 text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
