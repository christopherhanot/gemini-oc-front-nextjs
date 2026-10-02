export type Action =
  | "ONBOARDING"
  | "OFFBOARDING"
  | "UPDATE"
  | "DATASIRH"
  | "DATASI";

export type DataRow = Record<string, string | null | undefined>;

export interface DataSource {
  /** Static JSON file served from /public. */
  url: string;
  /** When true, rows are filtered on their `Action` field. */
  filtered: boolean;
}
