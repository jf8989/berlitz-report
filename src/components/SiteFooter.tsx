// src/components/SiteFooter.tsx
import React from "react";
import { Github, Linkedin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="py-6 md:px-8 md:py-8 border-t">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{" "}
          <a
            href="https://github.com/jf8989"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Juan Francisco Marcenaro Arellano
          </a>
          .
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/jf8989"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-6 w-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/jfmarcenaroa/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Linkedin className="h-6 w-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}
