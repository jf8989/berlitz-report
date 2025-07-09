// src/app/groups/[groupId]/students/[studentName]/page.tsx
import React from "react"; // Explicitly import React for React.ReactElement
import { parseAllGroupsData } from "@/lib/dataParser";
import { rawBerlitzGroups } from "@/data/berlitzData";
import StudentReportClient from "@/components/StudentReportClient";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

interface StudentReportPageProps {
  params: {
    groupId: string;
    studentName: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// --- FIX 1: Removed the unnecessary `async` keyword ---
// The function does not use `await`, so making it synchronous simplifies type inference.
export function generateStaticParams() {
  const allParsedData = parseAllGroupsData(rawBerlitzGroups);
  const params: { groupId: string; studentName: string }[] = [];

  allParsedData.forEach((group) => {
    group.metadata.studentNames.forEach((studentName) => {
      params.push({
        groupId: group.groupName,
        studentName: studentName,
      });
    });
  });
  return params;
}

// --- FIX 2: Added an explicit return type for the async component ---
// This clarifies to TypeScript what the function returns, resolving ambiguity about its props.
const StudentReportPage = async (
  props: StudentReportPageProps
): Promise<React.ReactElement> => {
  const { params } = props;
  const decodedGroupId = decodeURIComponent(params.groupId);
  const decodedStudentName = decodeURIComponent(params.studentName);

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
};

export default StudentReportPage;
