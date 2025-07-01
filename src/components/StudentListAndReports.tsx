// src/components/StudentListAndReports.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Card } from "./ui/Card";
import { AttendanceRecord } from "@/lib/dataParser";

interface StudentListAndReportsProps {
  groupId: string; // New prop for the group ID
  studentNames: string[];
  attendanceData: AttendanceRecord[]; // To potentially show summary or pass down
}

const StudentListAndReports: React.FC<StudentListAndReportsProps> = ({
  groupId,
  studentNames,
  attendanceData,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {studentNames.map((student) => {
        // Calculate a simple attendance summary for display on the card
        const studentRecords = attendanceData.filter(
          (rec) => rec.student === student
        );
        const presentCount = studentRecords.filter(
          (rec) => rec.status === "On-time"
        ).length;
        const totalClasses = studentRecords.length;
        const attendancePercentage =
          totalClasses > 0
            ? (
                ((presentCount +
                  studentRecords.filter((rec) => rec.status === "Late")
                    .length) /
                  totalClasses) *
                100
              ).toFixed(0)
            : "N/A";
        const absentCount = studentRecords.filter(
          (rec) => rec.status === "Absent"
        ).length;

        return (
          <Card
            key={student}
            className="p-4 flex flex-col items-center text-center"
          >
            <h3 className="text-xl font-semibold mb-2">{student}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Classes Attended (P/L/A): {presentCount}/
              {studentRecords.filter((rec) => rec.status === "Late").length}/
              {absentCount}
            </p>
            <p className="text-lg font-bold mt-1 text-primary">
              {attendancePercentage}% Attendance
            </p>
            {/* Update Link href to include groupId */}
            {/* Use encodeURIComponent for both group and student names to handle spaces and special characters */}
            <Link
              href={`/groups/${encodeURIComponent(
                groupId
              )}/students/${encodeURIComponent(student)}`}
              passHref
              className="button button-primary mt-4"
            >
              View Full Report
            </Link>
          </Card>
        );
      })}
    </div>
  );
};

export default StudentListAndReports;
