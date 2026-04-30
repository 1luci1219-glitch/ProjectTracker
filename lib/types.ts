export type ProgrammeType = "fm" | "pnrr";
export type PnrrComponent = "A" | "B" | null;

export type Priority = "Ridicată" | "Medie" | "Scăzută";
export type ClarificationStatus = "În așteptare" | "În lucru" | "Răspuns trimis" | "Închis";
export type TransmissionStatus = "Netransmis" | "În lucru" | "Transmis" | "Acceptat" | "N/A";
export type FmDosarStatus = "Încărcat" | "În lucru" | "Neprelucrat" | "N/A";
export type FmDosarType =
  | "Audit financiar"
  | "SF + Consultanță"
  | "Lucrări (CEF)"
  | "Publicitate"
  | "Dirigenție de șantier";

export type Company = {
  id: string;
  name: string;
  fiscalCode?: string;
  county?: string;
};

export type Project = {
  id: string;
  companyId: string;
  programmeType: ProgrammeType;
  projectName: string;
  projectLabel: string;
  rueCode?: string;
  component?: PnrrComponent;
  callCode?: string;
  generalStatus: "Activ" | "În implementare" | "Monitorizare" | "Închis";
  notes?: string;
  updatedAt: string;
};

export type PnrrClarification = {
  id: string;
  projectId: string;
  companyId: string;
  subject: string;
  requestType: "Solicitare documente" | "Cerere transfer" | "Contestație" | "Altul";
  priority: Priority;
  dateReceived: string;
  responseDeadline: string;
  status: ClarificationStatus;
  dateSent?: string | null;
  isAnswerSent: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type FmActionType =
  | "CR1"
  | "Cerere prefinanțare"
  | "CR Aferent Prefinanțare"
  | "CR Finală"
  | "Act adițional"
  | "Alte acțiuni";

export type FmDosar = {
  id: string;
  projectId: string;
  companyId: string;
  dosarType: FmDosarType;
  status: FmDosarStatus;
  notes?: string;
  updatedAt: string;
};

export type FmAction = {
  id: string;
  projectId: string;
  companyId: string;
  actionType: FmActionType;
  label: string;
  transmittedStatus: TransmissionStatus;
  dateSent?: string | null;
  notes?: string;
  updatedAt: string;
};

export type FmAddendum = {
  id: string;
  projectId: string;
  companyId: string;
  requiresAddendum: boolean;
  reason: string;
  budgetChangeNeeded: TransmissionStatus;
  procurementPlanChangeNeeded: TransmissionStatus;
  activitiesTermChangeNeeded: TransmissionStatus;
  documentsPrepared: TransmissionStatus;
  platformStatus: TransmissionStatus;
  dateSent?: string | null;
  notes?: string;
  updatedAt: string;
};

export type ProjectNote = {
  id: string;
  projectId: string;
  body: string;
  createdAt: string;
};

export type ActivityLog = {
  id: string;
  module: ProgrammeType;
  label: string;
  description: string;
  createdAt: string;
};
