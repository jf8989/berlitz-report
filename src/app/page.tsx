// src/app/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { parseAllGroupsData, ParsedBerlitzData } from "@/lib/dataParser";
import { rawBerlitzGroups } from "@/data/berlitzData";
import { handoverReport } from "@/data/handoverReport";

import Image from "next/image";
import { motion } from "framer-motion";

// Import client components
import OverviewDashboard from "@/components/OverviewDashboard";
import StudentListAndReports from "@/components/StudentListAndReports";
import AIChatInterface from "@/components/AIChatInterface";
import { ReportModal } from "@/components/ReportModal";
import { Card } from "@/components/ui/Card";
import { BookText } from "lucide-react";
// --- NEW: Import the WelcomeMessage component ---
import { WelcomeMessage } from "@/components/WelcomeMessage";

export default function Home() {
  const allParsedData: ParsedBerlitzData[] = useMemo(() => {
    return parseAllGroupsData(rawBerlitzGroups);
  }, []);

  const [selectedGroup, setSelectedGroup] = useState<string>(
    allParsedData.length > 0 ? allParsedData[0].groupName : ""
  );

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const currentGroupData = useMemo(() => {
    return allParsedData.find((group) => group.groupName === selectedGroup);
  }, [selectedGroup, allParsedData]);

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
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
          Berlitz Class Report Dashboard
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          by Juan Francisco Marcenaro Arellano
        </p>
      </div>

      <div className="my-10">
        <div className="relative mx-auto w-48 h-48">
          <motion.div
            className="absolute inset-0 rounded-full opacity-60"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{
              background:
                "conic-gradient(from 0deg, #06b6d4, #3b82f6, #8b5cf6, #06b6d4)",
            }}
          />
          <motion.div
            className="absolute inset-2 rounded-full opacity-40"
            style={{
              background:
                "conic-gradient(from 180deg, #14b8a6, #06b6d4, #3b82f6, #14b8a6)",
              filter: "blur(12px)",
            }}
          />
          <motion.div
            className="relative w-full h-full p-2 rounded-full overflow-hidden"
            style={{
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Image
              src="/images/jf-profile-picture3.jpg"
              alt="Juan Francisco Marcenaro Arellano"
              width={224}
              height={224}
              className="rounded-full object-cover w-full h-full shadow-2xl"
              quality={95}
              priority={true}
            />
          </motion.div>
        </div>
      </div>

      {/* --- NEW: Add the WelcomeMessage component here --- */}
      <div className="mb-10">
        <WelcomeMessage />
      </div>
      {/* --- END of new section --- */}

      {/* Control Card */}
      <Card className="mb-8 p-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <label
          htmlFor="group-select"
          className="font-semibold text-lg whitespace-nowrap"
        >
          Select Group:
        </label>

        <select
          id="group-select"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="w-full sm:max-w-xs p-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
        >
          {allParsedData.map((group) => (
            <option key={group.groupName} value={group.groupName}>
              {group.groupName}
            </option>
          ))}
        </select>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="button button-outline w-full sm:w-auto"
        >
          <BookText className="mr-2 h-4 w-4" />
          View Handover Report
        </button>
      </Card>

      {/* Display data for the selected group */}
      {currentGroupData ? (
        <>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground text-center">
            {currentGroupData.metadata.groupName}
          </h2>

          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
              Class Overview
            </h2>
            <OverviewDashboard parsedData={currentGroupData} />
          </section>

          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
              Student Performance Reports
            </h2>
            <StudentListAndReports
              groupId={currentGroupData.groupName}
              studentNames={currentGroupData.metadata.studentNames}
              attendanceData={currentGroupData.attendance}
            />
          </section>

          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
              Ask the AI Assistant
            </h2>
            <AIChatInterface selectedGroup={currentGroupData.groupName} />
          </section>
        </>
      ) : (
        <div className="text-center text-lg text-muted-foreground">
          No data available for the selected group. Please select one from the
          dropdown.
        </div>
      )}

      {/* Render the modal component. It's controlled by our state. */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportContent={handoverReport}
      />
    </main>
  );
}
