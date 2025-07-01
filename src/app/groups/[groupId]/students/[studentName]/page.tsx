/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/groups/[groupId]/students/[studentName]/page.tsx
// This is a Server Component that will dynamically generate reports.

import React from "react";
import {
  parseAllGroupsData,
  ParsedBerlitzData,
  AttendanceRecord,
} from "@/lib/dataParser";
import { rawBerlitzGroups } from "@/data/berlitzData"; // Import all raw group data
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface StudentReportPageProps {
  params: {
    groupId: string; // Matches [groupId] in the path
    studentName: string; // Matches [studentName] in the path
  };
}

// Color scheme for charts
const COLORS = ["var(--primary)", "var(--accent)", "var(--destructive)"];

// Function to generate static paths for all students across all groups
// This is for Static Site Generation (SSG) in Next.js.
// It tells Next.js which paths to pre-render at build time.
export async function generateStaticParams() {
  const allParsedData: ParsedBerlitzData[] =
    parseAllGroupsData(rawBerlitzGroups);
  const params: { groupId: string; studentName: string }[] = [];

  allParsedData.forEach((group) => {
    group.metadata.studentNames.forEach((studentName) => {
      params.push({
        groupId: encodeURIComponent(group.groupName), // URL-encode the group name
        studentName: encodeURIComponent(studentName), // URL-encode the student name
      });
    });
  });
  return params;
}

export default function StudentReportPage({ params }: StudentReportPageProps) {
  const { groupId, studentName } = params;
  const decodedGroupId = decodeURIComponent(groupId); // Decode URL-encoded parts
  const decodedStudentName = decodeURIComponent(studentName);

  // Parse all data to find the specific group and student
  const allParsedData: ParsedBerlitzData[] =
    parseAllGroupsData(rawBerlitzGroups);
  const currentGroupData = allParsedData.find(
    (group) => group.groupName === decodedGroupId
  );

  if (!currentGroupData) {
    return (
      <main className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Error</h1>
        <Card className="p-6">
          <p className="text-lg text-muted-foreground">
            Group &quot;
            <span className="font-semibold text-foreground">
              {decodedGroupId}
            </span>
            &quot; not found.
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
        <h1 className="text-3xl font-bold mb-6 text-foreground">
          Student Report
        </h1>
        <Card className="p-6">
          <p className="text-lg text-muted-foreground">
            No attendance data found for student:{" "}
            <span className="font-semibold text-foreground">
              {decodedStudentName}
            </span>{" "}
            in group{" "}
            <span className="font-semibold text-foreground">
              {decodedGroupId}
            </span>
            .
          </p>
          <Link href="/" className="button button-secondary mt-8">
            Back to Dashboard
          </Link>
        </Card>
      </main>
    );
  }

  // Calculate student-specific attendance stats
  const totalClassesTrackedForStudent = studentRecords.length;
  const presentCount = studentRecords.filter(
    (rec) => rec.status === "On-time"
  ).length;
  const absentCount = studentRecords.filter(
    (rec) => rec.status === "Absent"
  ).length;
  const lateCount = studentRecords.filter(
    (rec) => rec.status === "Late"
  ).length;
  const totalMinutesLate = studentRecords.reduce(
    (sum, rec) => sum + rec.minutesLate,
    0
  );

  const attendanceRate =
    totalClassesTrackedForStudent > 0
      ? (
          ((presentCount + lateCount) / totalClassesTrackedForStudent) *
          100
        ).toFixed(2)
      : "N/A";

  // Parse attendance minimum from string, e.g., "60% attendance min to pass" -> 60
  const attendanceMinMatch =
    currentGroupData.metadata.attendanceMin.match(/(\d+)%/);
  const requiredMinAttendance = attendanceMinMatch
    ? parseInt(attendanceMinMatch[1], 10)
    : 0;

  const complianceStatus =
    parseFloat(attendanceRate) >= requiredMinAttendance
      ? "Meets Requirement"
      : "Does Not Meet Requirement";

  const studentAttendanceData = [
    { name: "On-time", value: presentCount, fill: COLORS[0] },
    { name: "Late", value: lateCount, fill: COLORS[1] },
    { name: "Absent", value: absentCount, fill: COLORS[2] },
  ];

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-foreground text-center">
        Report for {decodedStudentName} <br />
        <span className="text-xl text-muted-foreground">
          in {decodedGroupId}
        </span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            Summary
          </h2>
          <p className="text-muted-foreground">
            <strong>Course:</strong> {currentGroupData.metadata.name}{" "}
            {currentGroupData.metadata.level}
          </p>
          {currentGroupData.metadata.additionalInfo.length > 0 && (
            <p className="text-muted-foreground">
              <strong>Additional Info:</strong>{" "}
              {currentGroupData.metadata.additionalInfo.join(", ")}
            </p>
          )}
          <p className="text-muted-foreground">
            <strong>Total Classes Tracked:</strong>{" "}
            {totalClassesTrackedForStudent}
          </p>
          <p className="text-muted-foreground">
            <strong>On-time:</strong> {presentCount} classes
          </p>
          <p className="text-muted-foreground">
            <strong>Late:</strong> {lateCount} classes ({totalMinutesLate} total
            minutes late)
          </p>
          <p className="text-muted-foreground">
            <strong>Absent:</strong> {absentCount} classes
          </p>
          <p className="text-muted-foreground text-lg mt-4">
            <strong>Overall Attendance Rate (P+L):</strong>{" "}
            <span className="font-bold text-foreground">{attendanceRate}%</span>
          </p>
          <p
            className={`font-bold text-lg mt-2 ${
              complianceStatus === "Meets Requirement"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            Compliance: {complianceStatus} (Minimum:{" "}
            {currentGroupData.metadata.attendanceMin})
          </p>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            Attendance Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={studentAttendanceData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {studentAttendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-foreground">
          Detailed Attendance Log
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Day
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Minutes Late
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {studentRecords.map((record, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {record.day}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${
                        record.status === "On-time"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : record.status === "Late"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {record.minutesLate > 0 ? record.minutesLate : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Link href="/" className="button button-secondary">
        Back to All Groups
      </Link>
    </main>
  );
}
