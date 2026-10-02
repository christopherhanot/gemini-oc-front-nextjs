"use client";

import { useCallback, useEffect, useState } from "react";
import type { Action, DataRow } from "@/lib/types";
import { ACTIONS, ACTION_COLUMNS, ACTION_SOURCES } from "@/lib/columns";
import { isMetadataRow } from "@/lib/format";
import InfoBoard from "@/components/InfoBoard";
import DataTable from "@/components/DataTable";
import HistoricalPanel from "@/components/HistoricalPanel";
import Windmill from "@/components/Windmill";
import styles from "./page.module.css";

export default function Home() {
  const [action, setAction] = useState<Action>("ONBOARDING");
  const [rows, setRows] = useState<DataRow[]>([]);
  const [creationDate, setCreationDate] = useState<string | null>(null);
  const [historicalDate, setHistoricalDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spinKey, setSpinKey] = useState(0);

  const selectAction = (next: Action) => {
    setSpinKey((k) => k + 1);
    setAction(next);
  };

  const applyData = useCallback(
    (data: DataRow[], target: Action, filtered: boolean) => {
      const relevant = filtered
        ? data.filter((row) => row.Action === target)
        : data.filter((row) => !isMetadataRow(row));
      setRows(relevant);
    },
    [],
  );

  const loadCurrent = useCallback(
    async (target: Action) => {
      const source = ACTION_SOURCES[target];
      setLoading(true);
      setError(null);
      setHistoricalDate(null);
      try {
        const res = await fetch(source.url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: DataRow[] = await res.json();
        setCreationDate(data[0]?.CreationDate ?? null);
        applyData(data, target, source.filtered);
      } catch {
        setError("Impossible de charger les données.");
        setRows([]);
        setCreationDate(null);
      } finally {
        setLoading(false);
      }
    },
    [applyData],
  );

  useEffect(() => {
    loadCurrent(action);
  }, [action, loadCurrent]);

  const loadHistorical = useCallback(
    async (fileUrl: string, dateLabel: string) => {
      const source = ACTION_SOURCES[action];
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(fileUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: DataRow[] = await res.json();
        setCreationDate(null);
        setHistoricalDate(dateLabel);
        applyData(data, action, source.filtered);
      } catch {
        setError("Impossible de charger le fichier historique.");
      } finally {
        setLoading(false);
      }
    },
    [action, applyData],
  );

  const columns = ACTION_COLUMNS[action];
  const isHistorical = historicalDate !== null;

  return (
    <>
      <header className={styles.header}>
        <div className={styles.brandRow}>
          <span className={styles.logo}>
            <Windmill spinKey={spinKey} />
          </span>
          <h1 className={styles.title}>Gemini OneClick V2</h1>
        </div>
        <nav className={styles.nav}>
          {ACTIONS.map((item) => (
            <button
              key={item.value}
              className={`${styles.navButton} ${
                action === item.value ? styles.navButtonActive : ""
              }`}
              onClick={() => selectAction(item.value)}
            >
              <i className={`fa ${item.icon}`} aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className={styles.main}>
        <InfoBoard
          action={action}
          historical={isHistorical}
          historicalDate={historicalDate}
        />

        <div className={styles.meta}>
          {isHistorical ? (
            <span className={styles.badge}>
              <i className="fa fa-history" aria-hidden="true" /> Historique :{" "}
              {historicalDate}
            </span>
          ) : (
            <span className={styles.creationDate}>
              Dernière exécution : {creationDate ?? "non trouvée"}
            </span>
          )}
          <HistoricalPanel action={action} onLoad={loadHistorical} />
        </div>

        {error && <p className={styles.error}>{error}</p>}
        {loading ? (
          <p className={styles.loading}>Chargement…</p>
        ) : (
          <DataTable action={action} columns={columns} rows={rows} />
        )}
      </main>
    </>
  );
}
