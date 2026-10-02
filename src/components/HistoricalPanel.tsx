"use client";

import { useEffect, useState } from "react";
import type { Action } from "@/lib/types";
import { HISTORICAL_BASE, HISTORICAL_INDEX } from "@/lib/columns";
import { extractDateFromFileName } from "@/lib/format";
import styles from "./HistoricalPanel.module.css";

interface HistoricalPanelProps {
  action: Action;
  onLoad: (fileUrl: string, dateLabel: string) => void;
}

export default function HistoricalPanel({
  action,
  onLoad,
}: HistoricalPanelProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setError(null);

    fetch(HISTORICAL_INDEX[action])
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((list: string[]) => {
        if (cancelled) return;
        const sorted = list
          .filter((f) => f.toLowerCase() !== "index.json")
          .sort()
          .reverse();
        setFiles(sorted);
      })
      .catch(() => {
        if (!cancelled) setError("Aucun historique disponible.");
      });

    return () => {
      cancelled = true;
    };
  }, [open, action]);

  return (
    <div className={styles.panel}>
      <button className={styles.toggle} onClick={() => setOpen((o) => !o)}>
        <i className="fa fa-history" aria-hidden="true" />
        {open ? "Masquer l'historique" : "Afficher l'historique"}
      </button>

      {open && (
        <div className={styles.body}>
          {error ? (
            <p className={styles.error}>{error}</p>
          ) : (
            <label className={styles.field}>
              Fichier historique
              <select
                defaultValue=""
                onChange={(e) => {
                  const file = e.target.value;
                  if (!file) return;
                  onLoad(
                    HISTORICAL_BASE[action] + file,
                    extractDateFromFileName(file),
                  );
                }}
              >
                <option value="">-- Sélectionnez un fichier --</option>
                {files.map((file) => (
                  <option key={file} value={file}>
                    {extractDateFromFileName(file)}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      )}
    </div>
  );
}
