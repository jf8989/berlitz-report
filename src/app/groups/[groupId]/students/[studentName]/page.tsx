// src/app/groups/[groupId]/students/[studentName]/page.tsx
import React from "react";
import { parseAllGroupsData } from "@/lib/dataParser";
import { rawBerlitzGroups } from "@/data/berlitzData";
import StudentReportClient from "@/components/StudentReportClient"; // Import the new client component
import Link from "next/link";
import { Card } from "@/components/ui/Card";

interface StudentReportPageProps {
  params: {
    groupId: string;
    studentName: string;
  };
}

// This function can stay. It runs on the server at build time.
export async function generateStaticParams() {
  const allParsedData = parseAllGroupsData(rawBerlitzGroups);
  const params: { groupId: string; studentName: string }[] = [];

  allParsedData.forEach((group) => {
    group.metadata.studentNames.forEach((studentName) => {
      params.push({
        // No need to encode here, Next.js handles it.
        groupId: group.groupName,
        studentName: studentName,
      });
    });
  });
  return params;
}

// This is now a Server Component. It's async and doesn't use "use client".
const StudentReportPage = async ({ params }: StudentReportPageProps) => {
  const { groupId, studentName } = params;
  // We can decode here since the component is simpler.
  const decodedGroupId = decodeURIComponent(groupId);
  const decodedStudentName = decodeURIComponent(studentName);

  // Data fetching happens directly on the server.
  const allParsedData = parseAllGroupsData(rawBerlitzGroups);
  const currentGroupData = allParsedData.find(
    (group) => group.groupName === decodedGroupId
  );

  // Error handling for missing group
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

  // Error handling for missing student in the data
  if (studentRecords.length === 0) {
    return (
      <main className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Error</h1>
        <Card className="p-6">
          <p className="text-lg">
            No attendance data for student: &quot;{decodedStudentName}&quot; in
            group &quot;
            {decodedGroupId}&quot;.
          </p>
          <Link href="/" className="button button-secondary mt-8">
            Back to Dashboard
          </Link>
        </Card>
      </main>
    );
  }

  // We pass the fetched data as props to the Client Component.
  return (
    <StudentReportClient
      studentName={decodedStudentName}
      groupData={currentGroupData}
      studentRecords={studentRecords}
    />
  );
};

export default StudentReportPage;
