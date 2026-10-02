import type { Action, DataRow } from "./types";
import { DATE_COLUMNS } from "./columns";

const STATUS_LABELS: Record<string, string> = {
  PendingApproval: "Soumis",
  NotSubmitted: "Non soumis",
};

export type CellVariant =
  | "normal"
  | "empty"
  | "empty-data"
  | "pending"
  | "not-submitted"
  | "previsionnel"
  | "reel";

export interface FormattedCell {
  text: string;
  variant: CellVariant;
}

const isEmpty = (value: string | null | undefined) =>
  value == null || value === "" || value === "N/A";

/** Reformat a dd/mm/yyyy string to yyyy-mm-dd, leaving other values untouched. */
function reformatDate(value: string): string {
  const parts = value.split("/");
  if (parts.length !== 3) return value;
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

/**
 * Compute the display text and visual variant for a single cell, mirroring the
 * original dashboard rules (status labels, date reformatting, empty markers).
 */
export function formatCell(
  action: Action,
  column: string,
  value: string | null | undefined,
): FormattedCell {
  if (isEmpty(value)) {
    if (action === "DATASIRH" || action === "DATASI") {
      return { text: "no data", variant: "empty-data" };
    }
    // FINCONTRAT may legitimately be empty, so it is not flagged.
    return {
      text: "non renseigné",
      variant: column === "FINCONTRAT" ? "normal" : "empty",
    };
  }

  const raw = value as string;

  if (column === "STATUS" && STATUS_LABELS[raw]) {
    return {
      text: STATUS_LABELS[raw],
      variant: raw === "PendingApproval" ? "pending" : "not-submitted",
    };
  }

  if (column === "type") {
    if (raw === "Previsionnel") return { text: raw, variant: "previsionnel" };
    if (raw === "Reel") return { text: raw, variant: "reel" };
  }

  if (DATE_COLUMNS.includes(column)) {
    return { text: reformatDate(raw), variant: "normal" };
  }

  return { text: raw, variant: "normal" };
}

/** Rows carrying a CreationDate are metadata headers and never displayed. */
export function isMetadataRow(row: DataRow): boolean {
  return Boolean(row.CreationDate);
}

/**
 * Turn a file name such as `202505161430_DataCompareResult.json` into a
 * readable `16/05/2025 14h30` label.
 */
export function extractDateFromFileName(filename: string): string {
  const match = filename.match(/(\d{8})(\d{4})/);
  if (!match) return filename;
  const [, yyyymmdd, hhmm] = match;
  return `${yyyymmdd.slice(6, 8)}/${yyyymmdd.slice(4, 6)}/${yyyymmdd.slice(
    0,
    4,
  )} ${hhmm.slice(0, 2)}h${hhmm.slice(2)}`;
}
