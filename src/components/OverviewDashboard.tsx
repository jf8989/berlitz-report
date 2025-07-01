// src/components/OverviewDashboard.tsx
"use client";

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

// Custom Pie Chart Label Rendering Function
const renderCustomizedLabel = ({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  percent = 0,
  name = "",
}: Partial<{
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
}>) => {
  const RADIAN = Math.PI / 180;
  // Position the label outside the pie chart
  const radius = innerRadius + (outerRadius - innerRadius) * 1.1;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const percentage = (percent * 100).toFixed(0);

  // Determine text anchor based on label position
  const textAnchor = x > cx ? "start" : "end";

  // Determine text color based on the status name for better contrast
  let textColor = "var(--foreground)"; // Default text color
  if (name === "Late") {
    textColor = "var(--warning)";
  } else if (name === "Absent") {
    textColor = "var(--destructive)";
  } else if (name === "On-time") {
    textColor = "var(--primary)";
  }

  return (
    <text
      x={x}
      y={y}
      fill={textColor}
      textAnchor={textAnchor}
      dominantBaseline="central"
      className="text-xs font-semibold" // Use Tailwind classes for styling
    >
      {`${name} ${percentage}%`}
    </text>
  );
};

const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  parsedData,
}) => {
  const { metadata, attendance, progress } = parsedData;

  const totalClassesTracked = metadata.allDays.length;
  const onTimeCount = attendance.filter(
    (rec) => rec.status === "On-time"
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
    { name: "On-time", value: onTimeCount, fill: "var(--primary)" },
    { name: "Late", value: lateCount, fill: "var(--warning)" }, // CHANGED: Use warning color for better contrast
    { name: "Absent", value: absentCount, fill: "var(--destructive)" },
  ];

  const studentAttendanceSummary = metadata.studentNames.map((studentName) => {
    const studentRecords = attendance.filter(
      (rec) => rec.student === studentName
    );
    return {
      student: studentName,
      "On-time": studentRecords.filter((rec) => rec.status === "On-time")
        .length,
      Late: studentRecords.filter((rec) => rec.status === "Late").length,
      Absent: studentRecords.filter((rec) => rec.status === "Absent").length,
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
        <ResponsiveContainer width="100%" height={250}>
          <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <Pie
              data={overallAttendanceData}
              cx="50%"
              cy="50%"
              outerRadius="80%" // Make radius responsive
              dataKey="value"
              labelLine={true} // Re-enable label lines to prevent overlap
              label={renderCustomizedLabel} // Use our custom label renderer
            >
              {overallAttendanceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
            />
            <Legend iconSize={12} />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center mt-2 space-y-1">
          <p className="text-sm text-muted-foreground">
            Total Classes Monitored: {totalClassesTracked} days
          </p>
          {/* REMOVED: "Total Observed Instances" line is gone */}
          <p className="text-sm text-muted-foreground">
            Total Lateness Minutes: {totalMinutesLate}
          </p>
        </div>
      </Card>

      <Card className="md:col-span-2 lg:col-span-1">
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
        <h3 className="text-xl font-semibold mb-2">
          Student Attendance Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={studentAttendanceSummary}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="student" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
            />
            <Legend />
            <Bar dataKey="On-time" stackId="a" fill="var(--primary)" />
            <Bar dataKey="Late" stackId="a" fill="var(--warning)" />{" "}
            {/* CHANGED: Use warning color */}
            <Bar dataKey="Absent" stackId="a" fill="var(--destructive)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default OverviewDashboard;
