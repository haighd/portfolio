import type { Metadata } from "next";
import { Github, Linkedin, Mail } from "lucide-react";
import { Section } from "@/components/layout";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Dan Haight. Open to discussing analytics, data science, and potential opportunities.",
};

const contactMethods = [
  {
    name: "Email",
    description: "Best for detailed inquiries",
    href: "mailto:dan@danalytics.info",
    icon: Mail,
    label: "dan@danalytics.info",
  },
  {
    name: "LinkedIn",
    description: "Connect professionally",
    href: "https://linkedin.com/in/danhaight",
    icon: Linkedin,
    label: "linkedin.com/in/danhaight",
    external: true,
  },
  {
    name: "GitHub",
    description: "See my code",
    href: "https://github.com/haighd",
    icon: Github,
    label: "github.com/haighd",
    external: true,
  },
];

export default function ContactPage() {
  return (
    <>
      <Section className="pt-24 md:pt-32">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight">Get in Touch</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            I&apos;m always interested in discussing analytics, data science, or
            potential opportunities. Feel free to reach out through any of the
            channels below.
          </p>
        </div>
      </Section>

      <Section className="border-t border-border">
        <div className="mx-auto max-w-2xl">
          <div className="space-y-6">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <a
                  key={method.name}
                  href={method.href}
                  target={method.external ? "_blank" : undefined}
                  rel={method.external ? "noopener noreferrer" : undefined}
                  className="flex items-start gap-4 rounded-lg border border-border p-6 transition-colors hover:border-foreground/20 hover:bg-muted/50"
                >
                  <div className="rounded-full bg-muted p-3">
                    <Icon
                      className="h-5 w-5 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold">{method.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {method.description}
                    </p>
                    <p className="mt-2 text-sm">{method.label}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </Section>

      <Section className="bg-muted/30">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-semibold tracking-tight">
            What I&apos;m Open To
          </h2>
          <ul className="mt-6 space-y-3 text-muted-foreground">
            <li>Conversations about analytics strategy and team building</li>
            <li>Technical discussions on ML/AI implementation</li>
            <li>Collaboration on interesting data projects</li>
            <li>Speaking opportunities on analytics leadership</li>
          </ul>
          <div className="mt-8">
            <Button asChild size="lg">
              <a href="mailto:dan@danalytics.info">
                <Mail className="h-4 w-4" aria-hidden="true" />
                Send an Email
              </a>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
