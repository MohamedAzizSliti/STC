import Link from "next/link";
import { GraduationCap, Briefcase, Building2, Phone, Linkedin, Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stc-blue">
                <span className="text-sm font-bold text-white">STC</span>
              </div>
              <div>
                <p className="text-sm font-bold leading-none">STC</p>
                <p className="text-[10px] leading-tight text-background/60 tracking-wider">STEAM CONSULTING</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-background/60 leading-relaxed">
              Your gateway to international education and career opportunities. Connecting students, professionals, and enterprises worldwide.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a href="#" className="text-background/40 hover:text-background transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/40 hover:text-background transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/40 hover:text-background transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/40 hover:text-background transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Studies */}
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-stc-blue" />
              Studies
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {["Portugal", "Spain", "France", "Germany", "USA"].map((country) => (
                <li key={country}>
                  <Link href="/etudes" className="text-sm text-background/60 hover:text-background transition-colors">
                    Study in {country}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-stc-green" />
              Services
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <Link href="/jobs" className="text-sm text-background/60 hover:text-background transition-colors">
                  Job Seekers
                </Link>
              </li>
              <li>
                <Link href="/enterprise" className="text-sm text-background/60 hover:text-background transition-colors">
                  For Enterprises
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-background/60 hover:text-background transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Phone className="h-4 w-4 text-stc-orange" />
              Contact
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              <li className="text-sm text-background/60">info@steamconsulting.com</li>
              <li className="text-sm text-background/60">support@steamconsulting.com</li>
              <li className="text-sm text-background/60">Mon - Fri: 9:00 - 18:00</li>
              <li className="text-sm text-background/60">Sat: 10:00 - 14:00</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-background/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40">
            {new Date().getFullYear()} STC - STEAM CONSULTING. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-background/40 hover:text-background transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-background/40 hover:text-background transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-background/40 hover:text-background transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
