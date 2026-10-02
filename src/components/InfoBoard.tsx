import type { ReactNode } from "react";
import type { Action } from "@/lib/types";
import styles from "./InfoBoard.module.css";

interface InfoBoardProps {
  action: Action;
  historical: boolean;
  historicalDate?: string | null;
}

interface BoardContent {
  title: string;
  body: ReactNode;
}

function Warning({ children }: { children: ReactNode }) {
  return <div className={styles.warning}>⚠ {children}</div>;
}

const CONTENT: Record<Action, BoardContent> = {
  OFFBOARDING: {
    title: "Offboarding",
    body: (
      <>
        <p>
          Liste des utilisateurs à offboarder sous <strong>31 jours</strong>.
        </p>
        <p>
          Lancement <strong>J-15</strong> avant la date de dernier jour, si
          présente, ou la date de fin de contrat. Approbation du support IT
          requise pour exécuter la suite de l&apos;offboarding.
        </p>
        <p>
          La colonne <strong>STATUS</strong> indique si l&apos;action
          d&apos;offboarding a déjà été envoyée au support IT.
        </p>
        <p>
          Si le champ <strong>SHARETO</strong> n&apos;est pas récupéré, le
          manager hiérarchique est appliqué par défaut pour le transfert des
          mails.
        </p>
        <Warning>
          Si un utilisateur possède un champ rouge « non renseigné », il ne
          pourra pas être offboardé.
        </Warning>
      </>
    ),
  },
  ONBOARDING: {
    title: "Onboarding",
    body: (
      <>
        <p>Liste des utilisateurs à onboarder.</p>
        <p>
          Lancement <strong>J-31</strong> avant la date d&apos;embauche pour
          préparer les accès et les équipements. Approbation du support IT
          requise pour exécuter la suite de l&apos;onboarding.
        </p>
        <p>
          Le champ <strong>ETABLISSEMENTLIBE</strong> combine{" "}
          <strong>ETABLISSEMENT</strong> et <strong>BATIMENT</strong>. Valeurs
          par défaut : BATIMENT = 188 (Montpellier), ROLEHIERARCHIQUE =
          « COLLABORATEUR », DIVISION = MIXTE.
        </p>
        <Warning>
          Si un utilisateur possède un champ rouge « non renseigné », il ne
          pourra pas être onboardé.
        </Warning>
      </>
    ),
  },
  UPDATE: {
    title: "Mise à jour des données",
    body: (
      <>
        <p>Liste des modifications effectuées sur les utilisateurs.</p>
        <Warning>
          Si un utilisateur possède un champ rouge « non renseigné », il ne
          pourra pas être mis à jour.
        </Warning>
        <p>Assurez-vous que les données sont correctes sur Nibelis.</p>
      </>
    ),
  },
  DATASIRH: {
    title: "Données SIRH",
    body: (
      <p>
        Les données sont récupérées directement depuis Nibelis, avec la
        distinction des salariés prévisionnels et des salariés en paie.
      </p>
    ),
  },
  DATASI: {
    title: "Données SI",
    body: (
      <p>
        Les données sont récupérées directement depuis l&apos;Active Directory.
        Seules les données importées sont affichées.
      </p>
    ),
  },
};

export default function InfoBoard({
  action,
  historical,
  historicalDate,
}: InfoBoardProps) {
  if (historical) {
    return (
      <section className={styles.board}>
        <h3 className={styles.title}>{action}</h3>
        <p>
          <strong>Date :</strong> {historicalDate ?? "Non spécifié"}
        </p>
        <p className={styles.historical}>🕑 Fichier historique</p>
      </section>
    );
  }

  const content = CONTENT[action];
  return (
    <section className={styles.board}>
      <h3 className={styles.title}>{content.title}</h3>
      <div className={styles.description}>{content.body}</div>
    </section>
  );
}
