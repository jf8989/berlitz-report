/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/OverviewDashboard.tsx
"use client"; // This is a client component as it uses useState and charting libraries

import React from "react";
import { ParsedBerlitzData } from "@/lib/dataParser";
import { Card } from "./ui/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface OverviewDashboardProps {
  parsedData: ParsedBerlitzData;
}

// Define consistent colors for charts, matching your CSS variables if possible
const COLORS = ["var(--primary)", "var(--destructive)", "var(--accent)"]; // Using CSS variables

const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  parsedData,
}) => {
  const { metadata, attendance, progress } = parsedData;

  // Calculate overall attendance summary
  const totalClassesTracked = metadata.allDays.length;
  const totalStudentInstances =
    totalClassesTracked * metadata.studentNames.length;

  const presentCount = attendance.filter(
    (rec) => rec.status === "Present"
  ).length;
  const absentCount = attendance.filter(
    (rec) => rec.status === "Absent"
  ).length;
  const lateCount = attendance.filter((rec) => rec.status === "Late").length;
  const totalMinutesLate = attendance.reduce(
    (sum, rec) => sum + rec.minutesLate,
    0
  );

  const overallAttendanceData = [
    { name: "Present", value: presentCount, fill: "var(--primary)" },
    { name: "Late", value: lateCount, fill: "var(--accent)" },
    { name: "Absent", value: absentCount, fill: "var(--destructive)" },
  ];

  // Calculate student-wise attendance for a stacked bar chart
  const studentAttendanceSummary = metadata.studentNames.map((studentName) => {
    const studentRecords = attendance.filter(
      (rec) => rec.student === studentName
    );
    const studentPresent = studentRecords.filter(
      (rec) => rec.status === "Present"
    ).length;
    const studentAbsent = studentRecords.filter(
      (rec) => rec.status === "Absent"
    ).length;
    const studentLate = studentRecords.filter(
      (rec) => rec.status === "Late"
    ).length;
    return {
      student: studentName,
      Present: studentPresent,
      Late: studentLate,
      Absent: studentAbsent,
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <h3 className="text-xl font-semibold mb-2">Course Information</h3>
        <p>
          <strong>Name:</strong> {metadata.name} {metadata.level}
        </p>
        <p>
          <strong>Min Attendance:</strong> {metadata.attendanceMin}
        </p>
        <p>
          <strong>Duration:</strong> {metadata.duration}
        </p>
        <p>
          <strong>Frequency:</strong> {metadata.frequency}
        </p>
        {metadata.materialsLink !== "N/A" && (
          <p>
            <strong>Materials:</strong>{" "}
            <a
              href={metadata.materialsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Link
            </a>
          </p>
        )}
      </Card>

      <Card>
        <h3 className="text-xl font-semibold mb-2">Overall Class Attendance</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={overallAttendanceData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
            >
              {overallAttendanceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <p className="text-sm text-center mt-2">
          Total Classes Monitored: {totalClassesTracked} days
        </p>
        <p className="text-sm text-center">
          Total Observed Instances: {totalStudentInstances} (students * days)
        </p>
        <p className="text-sm text-center">
          Total Lateness Minutes: {totalMinutesLate}
        </p>
      </Card>

      <Card className="md:col-span-2 lg:col-span-1">
        {" "}
        {/* This chart might need more width */}
        <h3 className="text-xl font-semibold mb-2">Unit Progress Overview</h3>
        <ul className="list-disc list-inside text-sm max-h-48 overflow-y-auto">
          {progress.length > 0 ? (
            progress.map((item, index) => (
              <li key={index} className="mb-1">
                <strong>
                  {item.day} ({item.date}):
                </strong>{" "}
                {item.note}
              </li>
            ))
          ) : (
            <li>No progress notes available.</li>
          )}
        </ul>
      </Card>

      <Card className="lg:col-span-3">
        {" "}
        {/* Full width for student attendance bar chart */}
        <h3 className="text-xl font-semibold mb-2">
          Student Attendance Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={studentAttendanceSummary}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="student" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Present" stackId="a" fill="var(--primary)" />
            <Bar dataKey="Late" stackId="a" fill="var(--accent)" />
            <Bar dataKey="Absent" stackId="a" fill="var(--destructive)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default OverviewDashboard;
