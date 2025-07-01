/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/groups/[groupId]/students/[studentName]/page.tsx
"use client"; // This component uses recharts which requires client-side rendering

import React from "react";
import {
  parseAllGroupsData,
  ParsedBerlitzData,
  AttendanceRecord,
} from "@/lib/dataParser";
import { rawBerlitzGroups } from "@/data/berlitzData";
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
    groupId: string;
    studentName: string;
  };
}

// Function to generate static paths for all students across all groups
export async function generateStaticParams() {
  const allParsedData: ParsedBerlitzData[] =
    parseAllGroupsData(rawBerlitzGroups);
  const params: { groupId: string; studentName: string }[] = [];

  allParsedData.forEach((group) => {
    group.metadata.studentNames.forEach((studentName) => {
      params.push({
        groupId: encodeURIComponent(group.groupName),
        studentName: encodeURIComponent(studentName),
      });
    });
  });
  return params;
}

const StudentReportPage = ({ params }: StudentReportPageProps) => {
  const { groupId, studentName } = params;
  const decodedGroupId = decodeURIComponent(groupId);
  const decodedStudentName = decodeURIComponent(studentName);

  // Note: For a client component, data fetching would ideally use a hook like `useSWR` or `react-query`.
  // Since our data is static, we can parse it directly here.
  const allParsedData: ParsedBerlitzData[] = React.useMemo(
    () => parseAllGroupsData(rawBerlitzGroups),
    []
  );
  const currentGroupData = React.useMemo(
    () => allParsedData.find((group) => group.groupName === decodedGroupId),
    [allParsedData, decodedGroupId]
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
            No attendance data for student:{" "}
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

  const onTimeCount = studentRecords.filter(
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
  const totalSessionsTrackedForStudent = studentRecords.length;

  const attendanceRate =
    totalSessionsTrackedForStudent > 0
      ? (
          ((onTimeCount + lateCount) / totalSessionsTrackedForStudent) *
          100
        ).toFixed(1)
      : "N/A";

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
    { name: "On-time", value: onTimeCount, fill: "var(--primary)" },
    { name: "Late", value: lateCount, fill: "var(--warning)" },
    { name: "Absent", value: absentCount, fill: "var(--destructive)" },
  ];

  const tooltipStyle = {
    backgroundColor: "var(--background)",
    color: "var(--foreground)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
  };

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
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Course:</strong>{" "}
              {currentGroupData.metadata.name} {currentGroupData.metadata.level}
            </p>
            {currentGroupData.metadata.additionalInfo.length > 0 && (
              <p>
                <strong className="text-foreground">Additional Info:</strong>{" "}
                {currentGroupData.metadata.additionalInfo.join(", ")}
              </p>
            )}
            {/* CHANGED: "Classes" to "Sessions" */}
            <p>
              <strong className="text-foreground">
                Total Sessions Tracked:
              </strong>{" "}
              {totalSessionsTrackedForStudent}
            </p>
            <p>
              <strong className="text-foreground">On-time:</strong>{" "}
              {onTimeCount} sessions
            </p>
            <p>
              <strong className="text-foreground">Late:</strong> {lateCount}{" "}
              sessions ({totalMinutesLate} total minutes late)
            </p>
            <p>
              <strong className="text-foreground">Absent:</strong> {absentCount}{" "}
              sessions
            </p>
          </div>
          <p className="text-lg mt-4">
            <strong className="text-foreground">
              Overall Attendance Rate:
            </strong>{" "}
            <span className="font-bold text-foreground">{attendanceRate}%</span>
          </p>
          <p
            className={`font-bold text-lg mt-2 ${
              complianceStatus === "Meets Requirement"
                ? "text-success-600"
                : "text-destructive"
            }`}
          >
            Compliance: {complianceStatus} (Min: {requiredMinAttendance}%)
          </p>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            Attendance Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={studentAttendanceData}
                cx="50%"
                cy="50%"
                outerRadius="80%"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {studentAttendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
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
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Day
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Minutes Late
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {studentRecords.map((record, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {record.day}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${
                        record.status === "On-time"
                          ? "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-100"
                          : record.status === "Late"
                          ? "bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-100"
                          : "bg-destructive/20 text-destructive dark:bg-destructive/30"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
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
};

export default StudentReportPage;
