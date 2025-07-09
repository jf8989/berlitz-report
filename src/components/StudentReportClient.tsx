/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/StudentReportClient.tsx
"use client";

import React from "react";
import {
  ParsedBerlitzData,
  AttendanceRecord,
  ProgressRecord,
} from "@/lib/dataParser";
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

// Define the props for our new client component
interface StudentReportClientProps {
  studentName: string;
  groupData: ParsedBerlitzData;
  studentRecords: AttendanceRecord[];
}

const StudentReportClient = ({
  studentName,
  groupData,
  studentRecords,
}: StudentReportClientProps) => {
  // All the logic and JSX from the original page now lives here.
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

  const attendanceMinMatch = groupData.metadata.attendanceMin.match(/(\d+)%/);
  const requiredMinAttendance = attendanceMinMatch
    ? parseInt(attendanceMinMatch[1], 10)
    : 0;
  const complianceStatus =
    parseFloat(attendanceRate) >= requiredMinAttendance
      ? "Meets Requirement"
      : "Does Not Meet Requirement";

  // --- FIX: Changed color definitions to match the dashboard's theme variables ---
  const studentAttendanceData = [
    { name: "On-time", value: onTimeCount, fill: "var(--primary)" },
    { name: "Late", value: lateCount, fill: "var(--warning)" },
    { name: "Absent", value: absentCount, fill: "var(--destructive)" },
  ];

  const tooltipStyle = {
    backgroundColor: "hsl(var(--background))",
    color: "hsl(var(--foreground))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "var(--radius)",
  };

  return (
    <main className="container mx-auto max-w-6xl py-8 px-4">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
            {studentName}
          </h1>
          <p className="text-xl text-muted-foreground">
            Student Report for {groupData.metadata.groupName}
          </p>
        </div>
        <Link
          href="/"
          className="button button-secondary hidden md:inline-flex"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Performance Summary
          </h2>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between">
              <strong>Course:</strong>
              <span>
                {groupData.metadata.name} {groupData.metadata.level}
              </span>
            </p>
            <p className="flex justify-between">
              <strong>Total Sessions Tracked:</strong>
              <span>{totalSessionsTrackedForStudent}</span>
            </p>
            <p className="flex justify-between">
              <strong>On-time / Late / Absent:</strong>
              <span>{`${onTimeCount} / ${lateCount} / ${absentCount}`}</span>
            </p>
            <p className="flex justify-between">
              <strong>Total Minutes Late:</strong>
              <span>{totalMinutesLate} min</span>
            </p>
          </div>
          <div className="border-t my-4"></div>
          <p className="text-lg flex justify-between">
            <strong>Attendance Rate:</strong>
            <span className="font-bold">{attendanceRate}%</span>
          </p>
          <p
            className={`font-bold text-sm mt-2 flex justify-between items-center ${
              complianceStatus === "Meets Requirement"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            <strong>Compliance Status:</strong>
            <span>{complianceStatus}</span>
          </p>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            Attendance Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={200}>
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Detailed Attendance Log
          </h2>
          <div className="overflow-auto max-h-96">
            <table className="min-w-full divide-y">
              <thead className="bg-muted sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                    Day
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                    Late (min)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {studentRecords.map((record, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {record.day}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-muted-foreground">
                      {record.date}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          record.status === "On-time"
                            ? "bg-green-100 text-green-800"
                            : record.status === "Late"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-muted-foreground">
                      {record.minutesLate > 0 ? record.minutesLate : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* --- NEW: AVANCE NOTES SECTION --- */}
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Group Progress Log (&quot;Avance&quot;)
          </h2>
          <div className="overflow-auto max-h-96 space-y-4">
            {groupData.progress.map((note, index) => (
              <div key={index} className="text-sm">
                <p className="font-semibold text-foreground">
                  Day {note.day} - {note.date}
                </p>
                <p className="text-muted-foreground pl-2 border-l-2 ml-1">
                  {note.note}
                </p>
              </div>
            ))}
          </div>
        </Card>
        {/* --- END OF NEW SECTION --- */}
      </div>
      <div className="mt-8 text-center">
        <Link href="/" className="button button-secondary md:hidden">
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
};

export default StudentReportClient;
