import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ContactHero } from "@/components/contact/hero";
import { ContactForm } from "@/components/contact/form";
import { ContactInfo } from "@/components/contact/info";
import { ContactFaq } from "@/components/contact/faq";
import { Chatbot } from "@/components/contact/chatbot";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <ContactHero />
        <section className="py-12 lg:py-20 bg-background">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <ContactForm />
              </div>
              <div className="lg:col-span-2">
                <ContactInfo />
              </div>
            </div>
          </div>
        </section>
        <ContactFaq />
      </main>
      <Chatbot />
      <Footer />
    </div>
  );
}
