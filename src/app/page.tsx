// src/app/page.tsx
import React from "react";
import ProjectBrief from "@/components/client-brief/projectBrief";
import { projectDataMain } from "@/components/client-brief/projectDataMain";
import { projectDataTemplate } from "@/components/client-brief/projectDataTemplate";

export default function Home() {
  // Toggle between main data and dummy data for testing
  const isTesting = true; // Set this to TRUE to use the TEMPLATE project data.  Set to FALSE to use the MAIN project data.

  return (
    <main>
      {/* Render the ProjectBrief, passing in either the main or dummy data */}
      <ProjectBrief data={isTesting ? projectDataTemplate : projectDataMain} />
    </main>
  );
}
