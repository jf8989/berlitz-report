// src/lib/dataParser.ts

export interface AttendanceRecord {
  student: string;
  date: string;
  day: string;
  status: "On-time" | "Absent" | "Late";
  minutesLate: number;
}

export interface ProgressRecord {
  day: string;
  date: string;
  note: string;
}

export interface CourseMetadata {
  name: string;
  level: string;
  groupName: string;
  attendanceMin: string;
  duration: string;
  frequency: string;
  materialsLink: string;
  allDays: { day: string; date: string }[];
  studentNames: string[];
  additionalInfo: string[];
}

export interface ParsedBerlitzData {
  groupName: string;
  metadata: CourseMetadata;
  attendance: AttendanceRecord[];
  progress: ProgressRecord[];
}

export function parseBerlitzData(
  rawData: string,
  groupIdentifier: string
): ParsedBerlitzData {
  const lines = rawData
    .trim()
    .split("\n")
    .map((line) => line.split(","));

  let courseName = "Unknown Course";
  let courseLevel = "Unknown Level";
  let attendanceMin = "N/A";
  let duration = "N/A";
  let frequency = "N/A";
  let materialsLink = "N/A";
  const additionalInfo: string[] = [];

  const dayHeaders: string[] = [];
  const dates: string[] = [];
  const attendanceRaw: { [key: string]: string[] } = {};
  const progressNotesRaw: string[] = [];
  const studentNames: string[] = [];

  const firstLineCells = lines[0];
  if (firstLineCells[0]?.trim()) {
    const fullGroupName = firstLineCells[0].trim();
    const parts = fullGroupName.split(" - ");
    courseName = parts[0]?.trim() || fullGroupName;
    if (parts.length > 1) {
      const lastPart = parts[parts.length - 1];
      if (lastPart.startsWith("Lv") || lastPart.startsWith("LV")) {
        courseLevel = lastPart.trim();
      } else {
        const lvMatch = fullGroupName.match(/LV\s*(\d+)/i);
        if (lvMatch && lvMatch[0]) {
          courseLevel = lvMatch[0];
        } else if (
          lastPart.includes("Reg") ||
          lastPart.includes("Express") ||
          lastPart.includes("Finance")
        ) {
          courseLevel = lastPart;
        }
      }
    } else {
      const lvMatch = fullGroupName.match(/LV\s*(\d+)/i);
      if (lvMatch && lvMatch[0]) {
        courseLevel = lvMatch[0];
      }
    }

    for (let i = 1; i < firstLineCells.length; i++) {
      if (firstLineCells[i]?.startsWith("DAY")) {
        dayHeaders.push(firstLineCells[i].trim());
      }
    }
  }

  lines.forEach((line, index) => {
    if (index === 0) return;
    const firstCell = line[0]?.trim();
    if (!firstCell) return;

    if (firstCell === "Date:") {
      for (let i = 1; i < line.length; i++) {
        if (line[i]?.trim()) dates.push(line[i].trim());
      }
    } else if (firstCell === "Avance:") {
      for (let i = 1; i < line.length; i++) {
        progressNotesRaw.push(line[i]?.trim() || "");
      }
    } else if (firstCell.includes("attendance min to pass")) {
      attendanceMin = firstCell + (line[1]?.trim() ? ` ${line[1].trim()}` : "");
    } else if (firstCell.includes("Link for materials:")) {
      materialsLink = line[1]?.trim() || materialsLink;
    } else if (
      firstCell.match(/^\d+(\.\d+)?h(r)?$/i) ||
      line.some((cell) => cell.match(/^\d+(\.\d+)?h(r)?$/i))
    ) {
      const foundDuration = line.find((cell) =>
        cell.match(/^\d+(\.\d+)?h(r)?$/i)
      );
      if (foundDuration) {
        if (duration === "N/A") {
          duration = foundDuration;
        } else if (!duration.includes(foundDuration)) {
          additionalInfo.push(foundDuration);
        }
      }
    } else if (
      firstCell.toLowerCase().includes("week") ||
      line.some((cell) => cell.toLowerCase().includes("week"))
    ) {
      const foundFrequency = line.find((cell) =>
        cell.toLowerCase().includes("week")
      );
      if (foundFrequency) {
        if (frequency === "N/A") {
          frequency = foundFrequency;
        } else if (!frequency.includes(foundFrequency)) {
          additionalInfo.push(foundFrequency);
        }
      }
      line.slice(1).forEach((cell) => {
        const trimmedCell = cell.trim();
        if (trimmedCell && !additionalInfo.includes(trimmedCell)) {
          additionalInfo.push(trimmedCell);
        }
      });
    } else if (
      (firstCell.toLowerCase().includes("regular") ||
        firstCell.toLowerCase().includes("finance material") ||
        firstCell.toLowerCase().includes("busines 5 express") ||
        firstCell.toLowerCase().includes("social 5 express")) &&
      !attendanceMin.includes(firstCell)
    ) {
      const fullLineContent = line
        .filter((cell) => cell.trim() !== "")
        .join(" ")
        .trim();
      if (
        fullLineContent &&
        !additionalInfo.includes(fullLineContent) &&
        fullLineContent !== groupIdentifier
      ) {
        additionalInfo.push(fullLineContent);
      }
    } else if (
      firstCell &&
      firstCell[0] === firstCell[0]?.toUpperCase() &&
      !dayHeaders.includes(firstCell) &&
      !firstCell.match(/lv/i) &&
      ![
        "Reg",
        "Express",
        "Finance",
        "Business",
        "Terminales",
        "BASF",
        "FRESNO",
        "Omaha",
        "ALUR",
        "BECA",
      ].some((term) => firstCell.includes(term)) &&
      line
        .slice(1)
        .some(
          (cell) =>
            cell.trim() === "x" ||
            cell.includes("min late") ||
            cell.trim() === "-" ||
            /^\d+$/.test(cell.trim())
        )
    ) {
      if (!studentNames.includes(firstCell)) {
        studentNames.push(firstCell);
        attendanceRaw[firstCell] = line.slice(1);
      }
    }
  });

  const validDaysCount = Math.min(dayHeaders.length, dates.length);
  const allDays = dayHeaders.slice(0, validDaysCount).map((day, index) => ({
    day: day,
    date: dates[index],
  }));

  const parsedAttendance: AttendanceRecord[] = [];
  studentNames.forEach((student) => {
    const studentStatuses = attendanceRaw[student] || [];
    allDays.forEach((dayInfo, index) => {
      const statusRaw = studentStatuses[index]?.trim() || "";
      let status: AttendanceRecord["status"] = "Absent";
      let minutesLate = 0;

      if (statusRaw === "x") {
        status = "On-time"; // This is the key change
      } else if (
        statusRaw.includes("min late") ||
        statusRaw.includes("min lte")
      ) {
        status = "Late";
        const match = statusRaw.match(/(\d+)/);
        if (match && match[1]) {
          minutesLate = parseInt(match[1], 10);
        }
      } else if (/^\d+$/.test(statusRaw) && statusRaw !== "") {
        status = "Late";
        minutesLate = parseInt(statusRaw, 10);
      }

      parsedAttendance.push({
        student,
        date: dayInfo.date,
        day: dayInfo.day,
        status,
        minutesLate,
      });
    });
  });

  const parsedProgress: ProgressRecord[] = [];
  allDays.forEach((dayInfo, index) => {
    const note = progressNotesRaw[index];
    if (note && note !== "") {
      parsedProgress.push({
        day: dayInfo.day,
        date: dayInfo.date,
        note: note,
      });
    }
  });

  const metadata: CourseMetadata = {
    name: courseName,
    level: courseLevel,
    groupName: groupIdentifier,
    attendanceMin: attendanceMin,
    duration: duration,
    frequency: frequency,
    materialsLink: materialsLink,
    allDays: allDays,
    studentNames: studentNames,
    additionalInfo: [
      ...new Set(additionalInfo.filter((info) => info && info.length > 0)),
    ],
  };

  return {
    groupName: groupIdentifier,
    metadata,
    attendance: parsedAttendance,
    progress: parsedProgress,
  };
}

export function parseAllGroupsData(rawGroups: {
  [key: string]: string;
}): ParsedBerlitzData[] {
  const allParsedData: ParsedBerlitzData[] = [];
  for (const groupName in rawGroups) {
    if (Object.prototype.hasOwnProperty.call(rawGroups, groupName)) {
      allParsedData.push(parseBerlitzData(rawGroups[groupName], groupName));
    }
  }
  return allParsedData;
}
