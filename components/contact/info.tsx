import { Card, CardContent } from "@/components/ui/card";
import { Mail, Clock, Linkedin, Facebook, Twitter, Instagram } from "lucide-react";

export function ContactInfo() {
  return (
    <div className="flex flex-col gap-6">
      {/* Email */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stc-orange/10">
              <Mail className="h-5 w-5 text-stc-orange" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Email Us</h3>
              <p className="mt-1 text-sm text-muted-foreground">info@steamconsulting.com</p>
              <p className="text-sm text-muted-foreground">support@steamconsulting.com</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Office Hours */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stc-orange/10">
              <Clock className="h-5 w-5 text-stc-orange" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Office Hours</h3>
              <div className="mt-1 flex flex-col gap-1 text-sm text-muted-foreground">
                <p>Monday - Friday: 9:00 - 18:00</p>
                <p>Saturday: 10:00 - 14:00</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold text-foreground">Follow Us</h3>
          <p className="mt-1 text-sm text-muted-foreground">Stay updated with our latest news and opportunities.</p>
          <div className="mt-4 flex items-center gap-3">
            {[
              { icon: Linkedin, label: "LinkedIn", href: "#" },
              { icon: Facebook, label: "Facebook", href: "#" },
              { icon: Twitter, label: "Twitter", href: "#" },
              { icon: Instagram, label: "Instagram", href: "#" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:bg-stc-orange hover:text-white transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick help */}
      <div className="rounded-lg border border-stc-orange/20 bg-stc-orange/5 p-4">
        <h3 className="text-sm font-semibold text-foreground">Need Urgent Help?</h3>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          For urgent inquiries, please use our AI chatbot in the bottom-right corner for instant assistance, available 24/7.
        </p>
      </div>
    </div>
  );
}
