import { Shield, Clock, HeadphonesIcon, Award } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Enterprise-grade encryption and GDPR compliance protect your data at every step.",
  },
  {
    icon: Clock,
    title: "Fast Processing",
    description: "Streamlined application processes with real-time tracking and instant notifications.",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description: "Our multilingual team is available Monday to Saturday to guide you through your journey.",
  },
  {
    icon: Award,
    title: "Trusted Partners",
    description: "We work with verified universities and enterprises to ensure quality opportunities.",
  },
];

export function HomeTrust() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Why Choose STC?
          </h2>
          <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            We are committed to making international education and career transitions seamless and trustworthy.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stc-blue/10">
                <feature.icon className="h-7 w-7 text-stc-blue" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
