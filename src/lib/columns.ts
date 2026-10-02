import type { Action, DataSource } from "./types";

/** Columns displayed for each action, in order. */
export const ACTION_COLUMNS: Record<Action, string[]> = {
  OFFBOARDING: [
    "STATUS",
    "LASTDAY",
    "FINCONTRAT",
    "IDNIBELIS",
    "MATRICULE",
    "FULLNAME",
    "SHARETO",
  ],
  UPDATE: ["IDNIBELIS", "FULLNAME", "SIRHATTRIBUTE", "ADVALUE", "SIRHVALUE"],
  ONBOARDING: [
    "STATUS",
    "DATEDEBUTCONTRAT",
    "FINCONTRAT",
    "IDNIBELIS",
    "TITRE",
    "PRENOM",
    "NOM",
    "NOMNAISSANCE",
    "NAISSANCEDATE",
    "COMMUNENAISSANCE",
    "TYPECONTRAT",
    "SERVICE",
    "EMPLOI",
    "RESPONSABLE",
    "DIVISION",
    "ROLEHIERARCHIQUE",
    "ETABLISSEMENTLIBE",
  ],
  DATASIRH: [
    "type",
    "date_embauche",
    "id_nibelis",
    "matricule",
    "titr",
    "nom",
    "nom_naissance",
    "prenom",
    "date_naissance",
    "commune_naissance",
    "type_contrat",
    "type_contrat_code",
    "service",
    "emploi_sexe",
    "resp_hier_matricule",
    "resp_cong_matricule",
    "libelle_societe",
    "division",
    "hierarchic_role",
    "libelle_etablissement",
    "Batiment",
    "date_debut_contrat",
    "date_fin_contrat",
    "date_fin_periode_essai",
    "LastDayinOffice",
    "date_depart",
    "ShareTo",
    "Renewed",
    "listemanager",
  ],
  DATASI: [
    "ID_NIBELIS",
    "MATR",
    "PRENOM",
    "NOM",
    "TYPE_CONTRAT",
    "SERVICE",
    "EMPLOI",
    "DIVISION",
    "ROLE_HIERARCHIQUE",
    "DATE_FIN_CONTRAT",
    "ETABLISSEMENT_LIBE",
  ],
};

/** Columns holding a dd/mm/yyyy date that is reformatted to ISO. */
export const DATE_COLUMNS = ["DATEDEBUTCONTRAT", "LASTDAY", "FINCONTRAT"];

/** Where the live data for each action comes from. */
export const ACTION_SOURCES: Record<Action, DataSource> = {
  ONBOARDING: { url: "/data/output/DataCompareResult.json", filtered: true },
  OFFBOARDING: { url: "/data/output/DataCompareResult.json", filtered: true },
  UPDATE: { url: "/data/output/DataCompareResult.json", filtered: true },
  DATASIRH: { url: "/data/nibelis/workersfields.json", filtered: false },
  DATASI: { url: "/data/data_ad/OU_enabled_0.json", filtered: false },
};

/** Index listing available historical files for each action. */
export const HISTORICAL_INDEX: Record<Action, string> = {
  ONBOARDING: "/data/output/historique/index.json",
  OFFBOARDING: "/data/output/historique/index.json",
  UPDATE: "/data/output/historique/index.json",
  DATASIRH: "/data/nibelis/historique/index.json",
  DATASI: "/data/nibelis/historique/index.json",
};

/** Base folder that historical file names are resolved against. */
export const HISTORICAL_BASE: Record<Action, string> = {
  ONBOARDING: "/data/output/historique/",
  OFFBOARDING: "/data/output/historique/",
  UPDATE: "/data/output/historique/",
  DATASIRH: "/data/nibelis/historique/",
  DATASI: "/data/nibelis/historique/",
};

export const ACTIONS: { value: Action; label: string; icon: string }[] = [
  { value: "ONBOARDING", label: "Onboarding", icon: "fa-user-plus" },
  { value: "UPDATE", label: "Update", icon: "fa-edit" },
  { value: "OFFBOARDING", label: "Offboarding", icon: "fa-user-times" },
  { value: "DATASIRH", label: "Data SIRH", icon: "fa-database" },
  { value: "DATASI", label: "Data SI", icon: "fa-database" },
];
