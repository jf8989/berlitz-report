// src/app/groups/[groupId]/students/[studentName]/page.tsx
import React from "react";

import { parseAllGroupsData } from "@/lib/dataParser";
import { rawBerlitzGroups } from "@/data/berlitzData";
import StudentReportClient from "@/components/StudentReportClient";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────
type Params = {
  groupId: string;
  studentName: string;
};

type SearchParams = { [key: string]: string | string[] | undefined };

// ────────────────────────────────────────────────────────────
// Static params for SSG
// ────────────────────────────────────────────────────────────
export function generateStaticParams() {
  const allParsedData = parseAllGroupsData(rawBerlitzGroups);
  const params: Params[] = [];

  allParsedData.forEach((group) => {
    group.metadata.studentNames.forEach((studentName) => {
      params.push({
        groupId: group.groupName,
        studentName,
      });
    });
  });

  return params;
}

// ────────────────────────────────────────────────────────────
// Page component (async — params is a Promise in Next v15)
// ────────────────────────────────────────────────────────────
export default async function StudentReportPage({
  params,
}: {
  params: Promise<Params>;
  searchParams?: SearchParams;
}) {
  const { groupId, studentName } = await params;

  const decodedGroupId = decodeURIComponent(groupId);
  const decodedStudentName = decodeURIComponent(studentName);

  const allParsedData = parseAllGroupsData(rawBerlitzGroups);
  const currentGroupData = allParsedData.find(
    (group) => group.groupName === decodedGroupId
  );

  if (!currentGroupData) {
    return (
      <main className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Error</h1>
        <Card className="p-6">
          <p className="text-lg">
            Group &quot;{decodedGroupId}&quot; not found.
          </p>
          <Link href="/" className="button button-secondary mt-8">
            Back to Dashboard
          </Link>
        </Card>
      </main>
    );
  }

  const studentRecords = currentGroupData.attendance.filter(
    (rec) => rec.student === decodedStudentName
  );

  if (studentRecords.length === 0) {
    return (
      <main className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Error</h1>
        <Card className="p-6">
          <p className="text-lg">
            No attendance data for student: &quot;{decodedStudentName}&quot; in
            group &quot;{decodedGroupId}&quot;.
          </p>
          <Link href="/" className="button button-secondary mt-8">
            Back to Dashboard
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <StudentReportClient
      studentName={decodedStudentName}
      groupData={currentGroupData}
      studentRecords={studentRecords}
    />
  );
}
