"use client";

import { useMemo, useState } from "react";
import type { Action, DataRow } from "@/lib/types";
import { formatCell } from "@/lib/format";
import styles from "./DataTable.module.css";

interface DataTableProps {
  action: Action;
  columns: string[];
  rows: DataRow[];
}

type SortDirection = "asc" | "desc";

const PAGE_SIZES = [10, 25, 50, 100];

/** Lightweight sort key: ISO/numeric aware, falls back to case-insensitive text. */
function sortKey(value: string): number | string {
  const isoDate = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (isoDate) {
    const [, d, m, y] = isoDate;
    return Number(`${y}${m}${d}`);
  }
  const num = Number(value);
  if (value !== "" && !Number.isNaN(num)) return num;
  return value.toLowerCase();
}

function toCsv(columns: string[], rows: DataRow[]): string {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const header = columns.map(escape).join(";");
  const lines = rows.map((row) =>
    columns.map((col) => escape(String(row[col] ?? ""))).join(";"),
  );
  return [header, ...lines].join("\r\n");
}

export default function DataTable({ action, columns, rows }: DataTableProps) {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<{ col: string; dir: SortDirection } | null>(
    null,
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) =>
      columns.some((col) =>
        String(row[col] ?? "")
          .toLowerCase()
          .includes(term),
      ),
    );
  }, [rows, columns, search]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const next = [...filtered].sort((a, b) => {
      const ka = sortKey(String(a[sort.col] ?? ""));
      const kb = sortKey(String(b[sort.col] ?? ""));
      if (ka < kb) return -1;
      if (ka > kb) return 1;
      return 0;
    });
    return sort.dir === "asc" ? next : next.reverse();
  }, [filtered, sort]);

  const showAll = pageSize === -1;
  const pageCount = showAll ? 1 : Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const visible = showAll
    ? sorted
    : sorted.slice(safePage * pageSize, safePage * pageSize + pageSize);

  const toggleSort = (col: string) => {
    setPage(0);
    setSort((prev) => {
      if (prev?.col !== col) return { col, dir: "asc" };
      return { col, dir: prev.dir === "asc" ? "desc" : "asc" };
    });
  };

  const exportCsv = () => {
    const blob = new Blob(["\ufeff" + toCsv(columns, sorted)], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Export_${action.toLowerCase()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <label className={styles.lengthControl}>
          Afficher
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
            <option value={-1}>Tous</option>
          </select>
          entrées
        </label>

        <input
          className={styles.search}
          type="search"
          placeholder="Rechercher…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />

        <button
          className={styles.export}
          onClick={exportCsv}
          disabled={sorted.length === 0}
        >
          Export CSV
        </button>
      </div>

      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>
                  <button
                    className={styles.sortButton}
                    onClick={() => toggleSort(col)}
                  >
                    {col}
                    <span className={styles.sortIcon}>
                      {sort?.col === col ? (sort.dir === "asc" ? "▲" : "▼") : "↕"}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={styles.empty}>
                  Aucune donnée à afficher.
                </td>
              </tr>
            ) : (
              visible.map((row, index) => (
                <tr key={index}>
                  {columns.map((col) => {
                    const { text, variant } = formatCell(action, col, row[col]);
                    return (
                      <td
                        key={col}
                        className={styles[`cell-${variant}`] ?? undefined}
                      >
                        {text}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <span className={styles.count}>
          {sorted.length} élément{sorted.length > 1 ? "s" : ""}
        </span>
        {!showAll && pageCount > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
            >
              Précédent
            </button>
            <span>
              Page {safePage + 1} / {pageCount}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={safePage >= pageCount - 1}
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
