import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { Container } from "@/components/ui";

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/haighd",
    icon: Github,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/danhaight",
    icon: Linkedin,
  },
  {
    name: "Email",
    href: "mailto:dan@danalytics.info",
    icon: Mail,
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Dan Haight. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={link.name}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    link.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </footer>
  );
}
