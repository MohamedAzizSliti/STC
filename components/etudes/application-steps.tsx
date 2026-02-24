import { ClipboardList, UserCircle, Upload, LayoutGrid, FileEdit, CreditCard, Send } from "lucide-react";

const steps = [
  { number: 1, label: "Registration", icon: ClipboardList, description: "Create your STC account" },
  { number: 2, label: "Profile Setup", icon: UserCircle, description: "Complete your personal info" },
  { number: 3, label: "Document Upload", icon: Upload, description: "Upload required documents" },
  { number: 4, label: "Platform Selection", icon: LayoutGrid, description: "Choose application platform" },
  { number: 5, label: "Application Form", icon: FileEdit, description: "Fill in application details" },
  { number: 6, label: "Payment", icon: CreditCard, description: "Pay application fees" },
  { number: 7, label: "Submit", icon: Send, description: "Review and submit" },
];

export function ApplicationSteps() {
  return (
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Application Process
          </h2>
          <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Follow our streamlined 7-step process to submit your study abroad application.
          </p>
        </div>

        {/* Desktop steps */}
        <div className="mt-12 hidden lg:flex items-start justify-between">
          {steps.map((step, i) => (
            <div key={step.number} className="flex flex-1 items-start">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stc-blue text-white shadow-md">
                  <step.icon className="h-6 w-6" />
                </div>
                <span className="mt-3 text-xs font-bold text-stc-blue">Step {step.number}</span>
                <h3 className="mt-1 text-sm font-semibold text-foreground">{step.label}</h3>
                <p className="mt-1 max-w-[120px] text-xs text-muted-foreground">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="mt-7 flex-1 border-t-2 border-dashed border-stc-blue/30 mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* Mobile steps */}
        <div className="mt-10 flex flex-col gap-4 lg:hidden">
          {steps.map((step, i) => (
            <div key={step.number} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stc-blue text-white">
                  <step.icon className="h-5 w-5" />
                </div>
                {i < steps.length - 1 && (
                  <div className="mt-1 h-8 w-px border-l-2 border-dashed border-stc-blue/30" />
                )}
              </div>
              <div className="pt-1.5">
                <span className="text-xs font-bold text-stc-blue">Step {step.number}</span>
                <h3 className="text-sm font-semibold text-foreground">{step.label}</h3>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
