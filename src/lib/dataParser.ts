// src/lib/dataParser.ts

export interface AttendanceRecord {
  student: string;
  date: string; // Stored as string, convert to Date object if needed for calculations
  day: string; // e.g., 'DAY 1'
  status: "Present" | "Absent" | "Late";
  minutesLate: number;
}

export interface ProgressRecord {
  day: string; // e.g., 'DAY 1'
  date: string;
  note: string;
}

export interface CourseMetadata {
  name: string; // e.g., "Megalabs", "FRESNO"
  level: string; // e.g., "Lv7", "Lv5 Reg"
  groupName: string; // The full name from the CSV, e.g., "Megalabs - Lv7"
  attendanceMin: string;
  duration: string;
  frequency: string;
  materialsLink: string;
  allDays: { day: string; date: string }[]; // All recognized days with dates
  studentNames: string[];
  additionalInfo: string[]; // To catch other relevant lines like "thu - fr", "Regular"
}

export interface ParsedBerlitzData {
  groupName: string; // Key to identify this group
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
  const attendanceRaw: { [key: string]: string[] } = {}; // StudentName -> [status1, status2, ...]
  const progressNotesRaw: string[] = [];
  const studentNames: string[] = [];

  // Parse the very first line for group name and day headers
  const firstLineCells = lines[0];
  if (firstLineCells[0]?.trim()) {
    const fullGroupName = firstLineCells[0].trim();
    const parts = fullGroupName.split(" - ");
    courseName = parts[0]?.trim() || fullGroupName;
    // Attempt to extract level, typically from the last part if hyphenated
    if (parts.length > 1) {
      const lastPart = parts[parts.length - 1];
      if (lastPart.startsWith("Lv") || lastPart.startsWith("LV")) {
        courseLevel = lastPart.trim();
      } else {
        // Fallback for cases like "BECA LV1" where no hyphen, or if level is like "Lv5 Reg"
        const lvMatch = fullGroupName.match(/LV\s*(\d+)/i); // e.g., "LV1" or "LV 1"
        if (lvMatch && lvMatch[0]) {
          courseLevel = lvMatch[0];
        } else if (
          lastPart.includes("Reg") ||
          lastPart.includes("Express") ||
          lastPart.includes("Finance")
        ) {
          courseLevel = lastPart; // e.g., "Lv5 Reg", "Lv7 Express", "Lv4 Finance"
        }
      }
    } else {
      // Fallback for cases like "BECA LV1" where no hyphen for level
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
    // Skip the first line as it's handled above
    if (index === 0) return;

    const firstCell = line[0]?.trim();

    if (!firstCell) return; // Skip empty leading cells

    if (firstCell === "Date:") {
      for (let i = 1; i < line.length; i++) {
        if (line[i]?.trim()) {
          dates.push(line[i].trim());
        }
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
      // Look for duration across the line
      const foundDuration = line.find((cell) =>
        cell.match(/^\d+(\.\d+)?h(r)?$/i)
      );
      if (foundDuration) {
        if (duration === "N/A") {
          // Only set if not already set by a more primary line
          duration = foundDuration;
        } else if (!duration.includes(foundDuration)) {
          // If different duration, add to additional info
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
      // Capture other text on the same line as "week" that might be relevant
      line.slice(1).forEach((cell) => {
        const trimmedCell = cell.trim();
        if (trimmedCell && !additionalInfo.includes(trimmedCell)) {
          additionalInfo.push(trimmedCell);
        }
      });
    }
    // Catch other lines that contain specific metadata not caught by the above, but are not student names or already parsed
    else if (
      firstCell.toLowerCase().includes("regular") &&
      !attendanceMin.toLowerCase().includes("regular")
    ) {
      // "Regular" appears on its own line or with other text
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
      firstCell.toLowerCase().includes("finance material") &&
      !attendanceMin.toLowerCase().includes("finance material")
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
      firstCell.toLowerCase().includes("busines 5 express") &&
      !attendanceMin.toLowerCase().includes("busines 5 express")
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
      firstCell.toLowerCase().includes("social 5 express") &&
      !attendanceMin.toLowerCase().includes("social 5 express")
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
    }
    // General catch-all for student rows based on pattern
    else if (
      firstCell &&
      firstCell[0] === firstCell[0]?.toUpperCase() && // Starts with uppercase (basic heuristic)
      !dayHeaders.includes(firstCell) && // Not a DAY header
      !firstCell.includes("Lv") &&
      !firstCell.includes("LV") && // Not a group name fragment
      !firstCell.includes("Reg") &&
      !firstCell.includes("Express") &&
      !firstCell.includes("Finance") && // Not general course type
      !firstCell.includes("Business") &&
      !firstCell.includes("Terminales") && // Not part of a group name
      !firstCell.includes("BASF") &&
      !firstCell.includes("FRESNO") &&
      !firstCell.includes("Omaha") &&
      !firstCell.includes("ALUR") &&
      !firstCell.includes("BECA") && // Not main org names
      !firstCell.includes("Patricia") &&
      !firstCell.includes("Soledad") && // Not specific single-student group names (already handled by groupIdentifier)
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
        // Avoid adding duplicates if a name appears twice
        studentNames.push(firstCell);
        attendanceRaw[firstCell] = line.slice(1);
      }
    }
  });

  // Ensure dates align with dayHeaders length, take the minimum valid count
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
        status = "Present";
      } else if (statusRaw.includes("min late")) {
        status = "Late";
        const match = statusRaw.match(/(\d+)\s*min late/);
        if (match && match[1]) {
          minutesLate = parseInt(match[1], 10);
        }
      } else if (/^\d+$/.test(statusRaw) && statusRaw !== "") {
        // Catches raw numbers like "29" for Pilar
        status = "Late"; // Assume raw number means minutes late if it's in a status column
        minutesLate = parseInt(statusRaw, 10);
      }
      // If statusRaw is '-' or empty, it remains 'Absent' and minutesLate 0

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
  // Ensure progress notes align with actual recorded days
  allDays.forEach((dayInfo, index) => {
    const note = progressNotesRaw[index];
    // Only add if there's an actual note for that day
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
    groupName: groupIdentifier, // Explicitly set the group identifier
    attendanceMin: attendanceMin,
    duration: duration,
    frequency: frequency,
    materialsLink: materialsLink,
    allDays: allDays,
    studentNames: studentNames,
    additionalInfo: [
      ...new Set(additionalInfo.filter((info) => info && info.length > 0)),
    ], // Filter out empty and duplicates
  };

  return {
    groupName: groupIdentifier,
    metadata,
    attendance: parsedAttendance,
    progress: parsedProgress,
  };
}

// New function to parse all groups
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
