/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/page.tsx
"use client"; // This becomes a client component

import React, { useState, useMemo } from "react";
import { parseAllGroupsData, ParsedBerlitzData } from "@/lib/dataParser";
import { rawBerlitzGroups } from "@/data/berlitzData";

// Import client components
import OverviewDashboard from "@/components/OverviewDashboard";
import StudentListAndReports from "@/components/StudentListAndReports";
import AIChatInterface from "@/components/AIChatInterface";
import { Card } from "@/components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

export default function Home() {
  // Parse all data once when the component mounts using useMemo for efficiency
  const allParsedData: ParsedBerlitzData[] = useMemo(() => {
    return parseAllGroupsData(rawBerlitzGroups);
  }, []); // Empty dependency array means it runs once on mount

  // Initialize selected group with the first group found, or an empty string
  const [selectedGroup, setSelectedGroup] = useState<string>(
    allParsedData.length > 0 ? allParsedData[0].groupName : ""
  );

  // Find the currently selected group's data whenever selectedGroup changes
  const currentGroupData = useMemo(() => {
    return allParsedData.find((group) => group.groupName === selectedGroup);
  }, [selectedGroup, allParsedData]); // Re-runs if selectedGroup or allParsedData changes

  if (allParsedData.length === 0) {
    return (
      <main className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-foreground">
          No Berlitz Class Data Available
        </h1>
        <p>Please ensure data is correctly loaded in src/data/berlitzData.ts</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-foreground">
        Berlitz Class Report Dashboard
      </h1>

      {/* Group Selection Dropdown */}
      <Card className="mb-8 p-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <label
          htmlFor="group-select"
          className="font-semibold text-lg whitespace-nowrap"
        >
          Select Group:
        </label>
        <Select
          id="group-select"
          value={selectedGroup}
          // The onChange event for <select> element
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="w-full sm:max-w-xs"
        >
          {allParsedData.map((group) => (
            <SelectItem key={group.groupName} value={group.groupName}>
              {group.groupName}
            </SelectItem>
          ))}
        </Select>
      </Card>

      {/* Display data for the selected group */}
      {currentGroupData ? (
        <>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground text-center">
            {currentGroupData.metadata.groupName}
          </h2>

          {/* Overview Dashboard */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
              Class Overview
            </h2>
            <OverviewDashboard parsedData={currentGroupData} />
          </section>

          {/* Student Reports Section */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
              Student Performance Reports
            </h2>
            <StudentListAndReports
              groupId={currentGroupData.groupName} // Pass group ID for linking
              studentNames={currentGroupData.metadata.studentNames}
              attendanceData={currentGroupData.attendance}
            />
          </section>

          {/* AI Q&A Section */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
              Ask the AI Assistant
            </h2>
            <AIChatInterface selectedGroup={currentGroupData.groupName} />{" "}
            {/* Pass selected group to AI */}
          </section>
        </>
      ) : (
        <div className="text-center text-lg text-muted-foreground">
          No data available for the selected group. Please select one from the
          dropdown.
        </div>
      )}
    </main>
  );
}
