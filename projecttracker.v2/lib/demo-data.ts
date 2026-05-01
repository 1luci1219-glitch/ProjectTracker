import type {
  ActivityLog,
  Company,
  FmAction,
  FmAddendum,
  FmDosar,
  PnrrClarification,
  Project,
  ProjectNote
} from "@/lib/types";

export const companies: Company[] = [
  { id: "c-cgs", name: "CONTROL GENERAL SERVICE SRL" },
  { id: "c-stil", name: "STIL ELECTRO MAX SRL" },
  { id: "c-elsaco", name: "Elsaco Solutions SRL" },
  { id: "c-amur", name: "AMUR SOLAR ENERGY SRL" },
  { id: "c-nisempra", name: "NISEMPRA ELECTRO SRL" },
  { id: "c-datacor", name: "DATACOR SRL" },
  { id: "c-vinjulet", name: "UAT Vânjuleț, MH", county: "MH" },
  { id: "c-clinceni", name: "UAT Clinceni, IF", county: "IF" },
  { id: "c-gradistea", name: "UAT Grădiștea, VL", county: "VL" },
  { id: "c-ostrov", name: "UAT Ostrov" },
  { id: "c-bicles", name: "UAT Bicleș, MH", county: "MH" },
  { id: "c-chiojdu", name: "UAT Chiojdu, BZ", county: "BZ" },
  { id: "c-bertea", name: "UAT Bertea, PH", county: "PH" },
  { id: "c-azil-cujmir", name: "Azil Cujmir CS, MH", county: "MH" },
  { id: "c-rogova", name: "UAT Rogova, MH", county: "MH" },
  { id: "c-magurele", name: "UAT Măgurele" },
  { id: "c-punghina", name: "UAT Punghina, MH", county: "MH" },
  { id: "c-fulga", name: "UAT Fulga, PH", county: "PH" },
  { id: "c-floresti", name: "UAT Florești, MH", county: "MH" },
  { id: "c-luica", name: "UAT Luica" },
  { id: "c-posta-calnau", name: "UAT Poșta Câlnău" },
  { id: "c-alexeni", name: "UAT Alexeni, IL", county: "IL" },
  { id: "c-cislau", name: "UAT Cislău, BZ", county: "BZ" },
  { id: "c-bucovat", name: "UAT Bucovăț, DJ", county: "DJ" },
  { id: "c-bala", name: "UAT Bala, MH", county: "MH" },
  { id: "c-balacita", name: "UAT Balacița, MH", county: "MH" },
  { id: "c-maglavit", name: "UAT Maglavit" },
  { id: "c-sovarna", name: "UAT Sovarna" },
  { id: "c-brosteni", name: "UAT Broșteni, MH", county: "MH" },
  { id: "c-prigor", name: "UAT Prigor, CS", county: "CS" },
  { id: "c-catunele", name: "UAT Cătunele" },
  { id: "c-draganesti", name: "UAT Drăgănești" }
];

const FM1_PROJECTS: Array<[string, string, string]> = [
  ["p-vinjulet", "c-vinjulet", "VÂNJULEȚ, MH"],
  ["p-clinceni", "c-clinceni", "CLINCENI, IF"],
  ["p-gradistea", "c-gradistea", "GRĂDIȘTEA, VL"],
  ["p-ostrov", "c-ostrov", "OSTROV"],
  ["p-bicles", "c-bicles", "BICLEȘ, MH"],
  ["p-chiojdu", "c-chiojdu", "CHIOJDU, BZ"],
  ["p-bertea", "c-bertea", "BERTEA, PH"],
  ["p-azil-cujmir", "c-azil-cujmir", "AZIL CUJMIR CS, MH"],
  ["p-rogova", "c-rogova", "ROGOVA, MH"],
  ["p-magurele", "c-magurele", "MĂGURELE"],
  ["p-punghina", "c-punghina", "PUNGHINA, MH"],
  ["p-fulga", "c-fulga", "FULGA, PH"],
  ["p-floresti", "c-floresti", "FLOREȘTI, MH"],
  ["p-luica", "c-luica", "LUICA"],
  ["p-posta-calnau", "c-posta-calnau", "POȘTA CÂLNĂU"],
  ["p-alexeni", "c-alexeni", "ALEXENI, IL"],
  ["p-cislau", "c-cislau", "CISLĂU, BZ"],
  ["p-bucovat", "c-bucovat", "BUCOVĂȚ, DJ"],
  ["p-bala", "c-bala", "BALA, MH"],
  ["p-balacita", "c-balacita", "BALACIȚA, MH"],
  ["p-maglavit", "c-maglavit", "MAGLAVIT"],
  ["p-sovarna", "c-sovarna", "SOVARNA"],
  ["p-brosteni", "c-brosteni", "BROȘTENI, MH"],
  ["p-prigor", "c-prigor", "PRIGOR, CS"],
  ["p-catunele", "c-catunele", "CĂTUNELE"],
  ["p-draganesti", "c-draganesti", "DRĂGĂNEȘTI"]
];

export const projects: Project[] = [
  {
    id: "p-cgs-b",
    companyId: "c-cgs",
    programmeType: "pnrr",
    projectName: "REPowerEU I4 - componenta B",
    projectLabel: "CONTROL GENERAL SERVICE – RUE 57 (1.B)",
    rueCode: "RUE 57",
    component: "B",
    callCode: "PNRR/2024/C16RePowerEU/I4/1.B",
    generalStatus: "Activ",
    updatedAt: "2026-04-30"
  },
  {
    id: "p-cgs-a",
    companyId: "c-cgs",
    programmeType: "pnrr",
    projectName: "REPowerEU I4 - componenta A",
    projectLabel: "CONTROL GENERAL SERVICE – RUE 08 (1.A)",
    rueCode: "RUE 08",
    component: "A",
    callCode: "PNRR/2024/C16RePowerEU/I4/1.A",
    generalStatus: "Activ",
    updatedAt: "2026-04-30"
  },
  {
    id: "p-stil-b",
    companyId: "c-stil",
    programmeType: "pnrr",
    projectName: "REPowerEU I4 - componenta B",
    projectLabel: "STIL ELECTRO MAX – RUE 37 (1.B)",
    rueCode: "RUE 37",
    component: "B",
    callCode: "PNRR/2024/C16RePowerEU/I4/1.B",
    generalStatus: "Activ",
    updatedAt: "2026-04-30"
  },
  {
    id: "p-stil-a",
    companyId: "c-stil",
    programmeType: "pnrr",
    projectName: "REPowerEU I4 - componenta A",
    projectLabel: "STIL ELECTRO MAX – RUE 29 (1.A)",
    rueCode: "RUE 29",
    component: "A",
    callCode: "PNRR/2024/C16RePowerEU/I4/1.A",
    generalStatus: "Activ",
    updatedAt: "2026-04-30"
  },
  {
    id: "p-elsaco-b",
    companyId: "c-elsaco",
    programmeType: "pnrr",
    projectName: "REPowerEU I4 - componenta B",
    projectLabel: "Elsaco Solutions – RUE 134 (1.B)",
    rueCode: "RUE 134",
    component: "B",
    callCode: "PNRR/2024/C16RePowerEU/I4/1.B",
    generalStatus: "Activ",
    updatedAt: "2026-04-30"
  },
  {
    id: "p-amur-a",
    companyId: "c-amur",
    programmeType: "pnrr",
    projectName: "REPowerEU I4 - componenta A",
    projectLabel: "AMUR SOLAR ENERGY – RUE 79 (1.A)",
    rueCode: "RUE 79",
    component: "A",
    callCode: "PNRR/2024/C16RePowerEU/I4/1.A",
    generalStatus: "Activ",
    updatedAt: "2026-04-30"
  },
  {
    id: "p-nisempra-a",
    companyId: "c-nisempra",
    programmeType: "pnrr",
    projectName: "REPowerEU I4 - componenta A",
    projectLabel: "NISEMPRA ELECTRO – RUE 07 (1.A)",
    rueCode: "RUE 07",
    component: "A",
    callCode: "PNRR/2024/C16RePowerEU/I4/1.A",
    generalStatus: "Activ",
    updatedAt: "2026-04-30"
  },
  {
    id: "p-datacor-a",
    companyId: "c-datacor",
    programmeType: "pnrr",
    projectName: "REPowerEU I4 - componenta A",
    projectLabel: "DATACOR – RUE 32 (1.A)",
    rueCode: "RUE 32",
    component: "A",
    callCode: "PNRR/2024/C16RePowerEU/I4/1.A",
    generalStatus: "Activ",
    updatedAt: "2026-04-30"
  },
  ...FM1_PROJECTS.map(([id, companyId, label]) => ({
    id,
    companyId,
    programmeType: "fm" as const,
    projectName: "Fondul de Modernizare – FM1",
    projectLabel: label,
    generalStatus: "În implementare" as const,
    updatedAt: "2026-04-30"
  }))
];

export const pnrrClarifications: PnrrClarification[] = [
  {
    id: "cl-cgs-1",
    projectId: "p-cgs-b",
    companyId: "c-cgs",
    subject: "Calcul capacitate netă sistem fotovoltaic – G2026-36888/24.03.2026",
    requestType: "Solicitare documente",
    priority: "Ridicată",
    dateReceived: "2026-03-24",
    responseDeadline: "2026-03-26",
    status: "Răspuns trimis",
    dateSent: "2026-03-26",
    isAnswerSent: true,
    notes: "Incarcat Calcul 26.03 ora 6:31.",
    createdAt: "2026-03-24",
    updatedAt: "2026-03-26"
  },
  {
    id: "cl-cgs-2",
    projectId: "p-cgs-b",
    companyId: "c-cgs",
    subject: "Scrisoare solicitare informații suplimentare CT13",
    requestType: "Solicitare documente",
    priority: "Scăzută",
    dateReceived: "2026-03-25",
    responseDeadline: "2026-03-27",
    status: "Răspuns trimis",
    dateSent: "2026-03-26",
    isAnswerSent: true,
    notes: "26.03.2026 ora 20",
    createdAt: "2026-03-25",
    updatedAt: "2026-03-26"
  },
  {
    id: "cl-cgs-3",
    projectId: "p-cgs-b",
    companyId: "c-cgs",
    subject: "Documente suplimentare verificare Raport Progres nr. 13",
    requestType: "Solicitare documente",
    priority: "Ridicată",
    dateReceived: "2026-03-26",
    responseDeadline: "2026-03-30",
    status: "Răspuns trimis",
    dateSent: "2026-03-30",
    isAnswerSent: true,
    notes: "",
    createdAt: "2026-03-26",
    updatedAt: "2026-03-30"
  },
  {
    id: "cl-cgs-4",
    projectId: "p-cgs-b",
    companyId: "c-cgs",
    subject: "CT14 RUE 57 – cerere transfer",
    requestType: "Cerere transfer",
    priority: "Medie",
    dateReceived: "2026-03-24",
    responseDeadline: "2026-03-26",
    status: "Răspuns trimis",
    dateSent: "2026-03-26",
    isAnswerSent: true,
    notes: "26.03.2026",
    createdAt: "2026-03-24",
    updatedAt: "2026-03-26"
  },
  {
    id: "cl-cgs-5",
    projectId: "p-cgs-a",
    companyId: "c-cgs",
    subject: "CT6 RUE 08 – cerere transfer",
    requestType: "Cerere transfer",
    priority: "Medie",
    dateReceived: "2026-03-24",
    responseDeadline: "2026-03-26",
    status: "Răspuns trimis",
    dateSent: "2026-03-26",
    isAnswerSent: true,
    notes: "26.03.2026",
    createdAt: "2026-03-24",
    updatedAt: "2026-03-26"
  },
  {
    id: "cl-cgs-6",
    projectId: "p-cgs-b",
    companyId: "c-cgs",
    subject: "Marica Nicolae – I4B-RUE57-2002 eliminat, cerere reexaminare",
    requestType: "Altul",
    priority: "Medie",
    dateReceived: "2026-04-01",
    responseDeadline: "2026-05-15",
    status: "În lucru",
    dateSent: null,
    isAnswerSent: false,
    notes: "",
    createdAt: "2026-04-01",
    updatedAt: "2026-04-30"
  },
  {
    id: "cl-stil-1",
    projectId: "p-stil-a",
    companyId: "c-stil",
    subject: "Scrisoare solicitare informații suplimentare CT2",
    requestType: "Solicitare documente",
    priority: "Ridicată",
    dateReceived: "2026-03-26",
    responseDeadline: "2026-04-02",
    status: "Răspuns trimis",
    dateSent: "2026-04-02",
    isAnswerSent: true,
    notes: "",
    createdAt: "2026-03-26",
    updatedAt: "2026-04-02"
  },
  {
    id: "cl-stil-2",
    projectId: "p-stil-a",
    companyId: "c-stil",
    subject: "Contestație notificare autorizare plată",
    requestType: "Contestație",
    priority: "Medie",
    dateReceived: "2026-03-24",
    responseDeadline: "2026-04-24",
    status: "În lucru",
    dateSent: null,
    isAnswerSent: false,
    notes: "",
    createdAt: "2026-03-24",
    updatedAt: "2026-04-30"
  },
  {
    id: "cl-stil-3",
    projectId: "p-stil-b",
    companyId: "c-stil",
    subject: "Clarificări eșantion etapa III (4)",
    requestType: "Solicitare documente",
    priority: "Ridicată",
    dateReceived: "2026-03-24",
    responseDeadline: "2026-03-31",
    status: "Răspuns trimis",
    dateSent: "2026-03-31",
    isAnswerSent: true,
    notes: "",
    createdAt: "2026-03-24",
    updatedAt: "2026-03-31"
  },
  {
    id: "cl-amur-1",
    projectId: "p-amur-a",
    companyId: "c-amur",
    subject: "CT4",
    requestType: "Altul",
    priority: "Ridicată",
    dateReceived: "2026-03-27",
    responseDeadline: "2026-04-01",
    status: "În așteptare",
    dateSent: null,
    isAnswerSent: false,
    notes: "",
    createdAt: "2026-03-27",
    updatedAt: "2026-04-30"
  }
];

type DosarRow = [string, string, string, string, string];

const FM1_DOSARE_DATA: Array<[string, DosarRow[]]> = [
  ["p-vinjulet", [
    ["d-vinjulet-1", "Audit financiar", "Încărcat", "", "2026-04-30"],
    ["d-vinjulet-2", "SF + Consultanță", "Încărcat", "", "2026-04-30"],
    ["d-vinjulet-3", "Lucrări (CEF)", "Încărcat", "", "2026-04-30"],
    ["d-vinjulet-4", "Publicitate", "Încărcat", "", "2026-04-30"],
    ["d-vinjulet-5", "Dirigenție de șantier", "Încărcat", "", "2026-04-30"]
  ]],
  ["p-clinceni", [
    ["d-clinceni-1", "Audit financiar", "Încărcat", "", "2026-04-30"],
    ["d-clinceni-2", "SF + Consultanță", "Încărcat", "", "2026-04-30"],
    ["d-clinceni-3", "Lucrări (CEF)", "Încărcat", "", "2026-04-30"],
    ["d-clinceni-4", "Publicitate", "Neprelucrat", "s-au intocmit doc 03.02.2026, le asteptam de la uat", "2026-04-30"],
    ["d-clinceni-5", "Dirigenție de șantier", "Neprelucrat", "", "2026-04-30"]
  ]],
  ["p-gradistea", [
    ["d-gradistea-1", "Audit financiar", "Încărcat", "", "2026-04-30"],
    ["d-gradistea-2", "SF + Consultanță", "Încărcat", "", "2026-04-30"],
    ["d-gradistea-3", "Lucrări (CEF)", "Încărcat", "", "2026-04-30"],
    ["d-gradistea-4", "Publicitate", "Neprelucrat", "", "2026-04-30"],
    ["d-gradistea-5", "Dirigenție de șantier", "Încărcat", "s-au transmis toate doc de la instalator", "2026-04-30"]
  ]],
  ["p-ostrov", [
    ["d-ostrov-1", "Audit financiar", "Încărcat", "", "2026-04-30"],
    ["d-ostrov-2", "SF + Consultanță", "Încărcat", "", "2026-04-30"],
    ["d-ostrov-3", "Lucrări (CEF)", "Încărcat", "", "2026-04-30"],
    ["d-ostrov-4", "Publicitate", "Neprelucrat", "", "2026-04-30"],
    ["d-ostrov-5", "Dirigenție de șantier", "Încărcat", "de verificat daca avem doc de la instaltor", "2026-04-30"]
  ]],
  ["p-bicles", [
    ["d-bicles-1", "Audit financiar", "Încărcat", "", "2026-04-30"],
    ["d-bicles-2", "SF + Consultanță", "Încărcat", "", "2026-04-30"],
    ["d-bicles-3", "Lucrări (CEF)", "Încărcat", "", "2026-04-30"],
    ["d-bicles-4", "Publicitate", "Încărcat", "", "2026-04-30"],
    ["d-bicles-5", "Dirigenție de șantier", "Încărcat", "avem toate doc de la instalator", "2026-04-30"]
  ]],
  ["p-chiojdu", [
    ["d-chiojdu-1", "Audit financiar", "Încărcat", "", "2026-04-30"],
    ["d-chiojdu-2", "SF + Consultanță", "Încărcat", "", "2026-04-30"],
    ["d-chiojdu-3", "Lucrări (CEF)", "Încărcat", "", "2026-04-30"],
    ["d-chiojdu-4", "Publicitate", "Neprelucrat", "", "2026-04-30"],
    ["d-chiojdu-5", "Dirigenție de șantier", "Încărcat", "de verificat daca avem doc de la instalator", "2026-04-30"]
  ]],
  ["p-bertea", [
    ["d-bertea-1", "Audit financiar", "Încărcat", "", "2026-04-30"],
    ["d-bertea-2", "SF + Consultanță", "Încărcat", "", "2026-04-30"],
    ["d-bertea-3", "Lucrări (CEF)", "Încărcat", "", "2026-04-30"],
    ["d-bertea-4", "Publicitate", "Neprelucrat", "", "2026-04-30"],
    ["d-bertea-5", "Dirigenție de șantier", "Neprelucrat", "se vor transmite de catre cms lista de doc necesare", "2026-04-30"]
  ]],
  ["p-azil-cujmir", [
    ["d-azil-1", "Audit financiar", "Încărcat", "", "2026-04-30"],
    ["d-azil-2", "SF + Consultanță", "Încărcat", "", "2026-04-30"],
    ["d-azil-3", "Lucrări (CEF)", "Încărcat", "", "2026-04-30"],
    ["d-azil-4", "Publicitate", "Încărcat", "", "2026-04-30"],
    ["d-azil-5", "Dirigenție de șantier", "Încărcat", "avem toate doc de la instalator", "2026-04-30"]
  ]],
  ["p-rogova", [
    ["d-rogova-1", "Audit financiar", "Încărcat", "", "2026-04-30"],
    ["d-rogova-2", "SF + Consultanță", "Încărcat", "", "2026-04-30"],
    ["d-rogova-3", "Lucrări (CEF)", "Încărcat", "", "2026-04-30"],
    ["d-rogova-4", "Publicitate", "Neprelucrat", "", "2026-04-30"],
    ["d-rogova-5", "Dirigenție de șantier", "Încărcat", "lucrare finalizata octombrie, se va face AA", "2026-04-30"]
  ]],
  ["p-magurele", [
    ["d-magurele-1", "Audit financiar", "Încărcat", "", "2026-04-30"],
    ["d-magurele-2", "SF + Consultanță", "Încărcat", "", "2026-04-30"],
    ["d-magurele-3", "Lucrări (CEF)", "Încărcat", "", "2026-04-30"],
    ["d-magurele-4", "Publicitate", "Neprelucrat", "", "2026-04-30"],
    ["d-magurele-5", "Dirigenție de șantier", "Neprelucrat", "ordin de sistare al lucrarilor; solicitare catre instalator", "2026-04-30"]
  ]],
  ["p-punghina", [
    ["d-punghina-1", "Audit financiar", "Încărcat", "", "2026-04-30"],
    ["d-punghina-2", "SF + Consultanță", "Încărcat", "", "2026-04-30"],
    ["d-punghina-3", "Lucrări (CEF)", "Încărcat", "", "2026-04-30"],
    ["d-punghina-4", "Publicitate", "Neprelucrat", "", "2026-04-30"],
    ["d-punghina-5", "Dirigenție de șantier", "Încărcat", "termen transmitere platforma 06.02.2026", "2026-04-30"]
  ]],
  ["p-fulga", [
    ["d-fulga-1", "Audit financiar", "Încărcat", "", "2026-04-30"],
    ["d-fulga-2", "SF + Consultanță", "Încărcat", "", "2026-04-30"],
    ["d-fulga-3", "Lucrări (CEF)", "Încărcat", "", "2026-04-30"],
    ["d-fulga-4", "Publicitate", "Neprelucrat", "", "2026-04-30"],
    ["d-fulga-5", "Dirigenție de șantier", "Încărcat", "prelungire pvrtl prin solicitare uat catre instalator", "2026-04-30"]
  ]],
  ["p-floresti", [
    ["d-floresti-1", "Audit financiar", "Încărcat", "", "2026-04-30"],
    ["d-floresti-2", "SF + Consultanță", "Încărcat", "", "2026-04-30"],
    ["d-floresti-3", "Lucrări (CEF)", "Încărcat", "", "2026-04-30"],
    ["d-floresti-4", "Publicitate", "Neprelucrat", "", "2026-04-30"],
    ["d-floresti-5", "Dirigenție de șantier", "Încărcat", "prelungire pvrtl, propune aa 31.03.2026", "2026-04-30"]
  ]],
  ["p-luica", [
    ["d-luica-1", "Audit financiar", "Încărcat", "", "2026-04-30"],
    ["d-luica-2", "SF + Consultanță", "Încărcat", "", "2026-04-30"],
    ["d-luica-3", "Lucrări (CEF)", "Încărcat", "", "2026-04-30"],
    ["d-luica-4", "Publicitate", "Încărcat", "", "2026-04-30"],
    ["d-luica-5", "Dirigenție de șantier", "Încărcat", "amplasari multiple; se face aa la contractul cef", "2026-04-30"]
  ]],
  ["p-posta-calnau", [
    ["d-posta-1", "Audit financiar", "Încărcat", "", "2026-04-30"],
    ["d-posta-2", "SF + Consultanță", "Încărcat", "", "2026-04-30"],
    ["d-posta-3", "Lucrări (CEF)", "Încărcat", "", "2026-04-30"],
    ["d-posta-4", "Publicitate", "Încărcat", "", "2026-04-30"],
    ["d-posta-5", "Dirigenție de șantier", "Încărcat", "fara prevederi referitoare la durata contractului", "2026-04-30"]
  ]],
  ["p-alexeni", [
    ["d-alexeni-1", "Audit financiar", "Încărcat", "", "2026-04-30"],
    ["d-alexeni-2", "SF + Consultanță", "Încărcat", "", "2026-04-30"],
    ["d-alexeni-3", "Lucrări (CEF)", "Încărcat", "", "2026-04-30"],
    ["d-alexeni-4", "Publicitate", "Neprelucrat", "", "2026-04-30"],
    ["d-alexeni-5", "Dirigenție de șantier", "Încărcat", "de transmis documente si situatia platilor ramase", "2026-04-30"]
  ]],
  ["p-cislau", [
    ["d-cislau-1", "Audit financiar", "Neprelucrat", "daca CJ nu accepta cofinantare pt post trafo se va schimba solutia tehnica", "2026-04-30"],
    ["d-cislau-2", "SF + Consultanță", "Neprelucrat", "", "2026-04-30"],
    ["d-cislau-3", "Lucrări (CEF)", "Neprelucrat", "", "2026-04-30"],
    ["d-cislau-4", "Publicitate", "Neprelucrat", "", "2026-04-30"],
    ["d-cislau-5", "Dirigenție de șantier", "Neprelucrat", "", "2026-04-30"]
  ]],
  ["p-bucovat", [
    ["d-bucovat-1", "Audit financiar", "Încărcat", "", "2026-04-30"],
    ["d-bucovat-2", "SF + Consultanță", "Încărcat", "", "2026-04-30"],
    ["d-bucovat-3", "Lucrări (CEF)", "Încărcat", "", "2026-04-30"],
    ["d-bucovat-4", "Publicitate", "Încărcat", "", "2026-04-30"],
    ["d-bucovat-5", "Dirigenție de șantier", "Încărcat", "uat ne va pune la dispozitie aa; transmitem lista documente", "2026-04-30"]
  ]],
  ["p-bala", [
    ["d-bala-1", "Audit financiar", "Încărcat", "", "2026-04-30"],
    ["d-bala-2", "SF + Consultanță", "Încărcat", "", "2026-04-30"],
    ["d-bala-3", "Lucrări (CEF)", "Încărcat", "", "2026-04-30"],
    ["d-bala-4", "Publicitate", "Neprelucrat", "", "2026-04-30"],
    ["d-bala-5", "Dirigenție de șantier", "Neprelucrat", "prelungire cu solicitare uat, pana la 31.10.2026", "2026-04-30"]
  ]],
  ["p-balacita", [
    ["d-balacita-1", "Audit financiar", "Încărcat", "", "2026-04-30"],
    ["d-balacita-2", "SF + Consultanță", "Încărcat", "", "2026-04-30"],
    ["d-balacita-3", "Lucrări (CEF)", "Încărcat", "", "2026-04-30"],
    ["d-balacita-4", "Publicitate", "Neprelucrat", "", "2026-04-30"],
    ["d-balacita-5", "Dirigenție de șantier", "Neprelucrat", "prelungire cu solicitare uat, pana la 31.10.2026", "2026-04-30"]
  ]],
  ["p-maglavit", [
    ["d-maglavit-1", "Audit financiar", "Neprelucrat", "", "2026-04-30"],
    ["d-maglavit-2", "SF + Consultanță", "Încărcat", "", "2026-04-30"],
    ["d-maglavit-3", "Lucrări (CEF)", "Neprelucrat", "", "2026-04-30"],
    ["d-maglavit-4", "Publicitate", "Neprelucrat", "", "2026-04-30"],
    ["d-maglavit-5", "Dirigenție de șantier", "Neprelucrat", "", "2026-04-30"]
  ]],
  ["p-sovarna", [
    ["d-sovarna-1", "Audit financiar", "Încărcat", "", "2026-04-30"],
    ["d-sovarna-2", "SF + Consultanță", "Încărcat", "", "2026-04-30"],
    ["d-sovarna-3", "Lucrări (CEF)", "Încărcat", "", "2026-04-30"],
    ["d-sovarna-4", "Publicitate", "Neprelucrat", "", "2026-04-30"],
    ["d-sovarna-5", "Dirigenție de șantier", "Încărcat", "nu este cazul", "2026-04-30"]
  ]],
  ["p-brosteni", [
    ["d-brosteni-1", "Audit financiar", "Încărcat", "", "2026-04-30"],
    ["d-brosteni-2", "SF + Consultanță", "Încărcat", "", "2026-04-30"],
    ["d-brosteni-3", "Lucrări (CEF)", "Încărcat", "", "2026-04-30"],
    ["d-brosteni-4", "Publicitate", "Neprelucrat", "", "2026-04-30"],
    ["d-brosteni-5", "Dirigenție de șantier", "Încărcat", "trimitem aa, termen 31.10.2026", "2026-04-30"]
  ]],
  ["p-prigor", [
    ["d-prigor-1", "Audit financiar", "Neprelucrat", "ordin incepere servicii proiectare 05.02.2026", "2026-04-30"],
    ["d-prigor-2", "SF + Consultanță", "Neprelucrat", "", "2026-04-30"],
    ["d-prigor-3", "Lucrări (CEF)", "Neprelucrat", "", "2026-04-30"],
    ["d-prigor-4", "Publicitate", "Neprelucrat", "", "2026-04-30"],
    ["d-prigor-5", "Dirigenție de șantier", "Neprelucrat", "", "2026-04-30"]
  ]],
  ["p-catunele", [
    ["d-catunele-1", "Audit financiar", "Neprelucrat", "", "2026-04-30"],
    ["d-catunele-2", "SF + Consultanță", "Încărcat", "", "2026-04-30"],
    ["d-catunele-3", "Lucrări (CEF)", "Încărcat", "", "2026-04-30"],
    ["d-catunele-4", "Publicitate", "Neprelucrat", "", "2026-04-30"],
    ["d-catunele-5", "Dirigenție de șantier", "Neprelucrat", "nu este cazul", "2026-04-30"]
  ]],
  ["p-draganesti", [
    ["d-draganesti-1", "Audit financiar", "Neprelucrat", "", "2026-04-30"],
    ["d-draganesti-2", "SF + Consultanță", "Neprelucrat", "", "2026-04-30"],
    ["d-draganesti-3", "Lucrări (CEF)", "Neprelucrat", "", "2026-04-30"],
    ["d-draganesti-4", "Publicitate", "Neprelucrat", "", "2026-04-30"],
    ["d-draganesti-5", "Dirigenție de șantier", "Neprelucrat", "", "2026-04-30"]
  ]]
];

export const fmDosare: FmDosar[] = FM1_DOSARE_DATA.flatMap(([projectId, dosare]) => {
  const project = projects.find((p) => p.id === projectId)!;
  return dosare.map(([id, dosarType, status, notes, updatedAt]) => ({
    id,
    projectId,
    companyId: project.companyId,
    dosarType: dosarType as FmDosar["dosarType"],
    status: status as FmDosar["status"],
    notes: notes || undefined,
    updatedAt
  }));
});

const CR1_STATUSES: Record<string, string> = {
  "p-vinjulet": "Transmis", "p-clinceni": "Transmis", "p-gradistea": "Transmis",
  "p-ostrov": "Transmis", "p-bicles": "Transmis", "p-chiojdu": "Transmis",
  "p-bertea": "Transmis", "p-azil-cujmir": "Transmis", "p-rogova": "Transmis",
  "p-magurele": "Transmis", "p-punghina": "Transmis", "p-fulga": "N/A",
  "p-floresti": "Transmis", "p-luica": "Transmis", "p-posta-calnau": "Transmis",
  "p-alexeni": "Transmis", "p-cislau": "Netransmis", "p-bucovat": "Transmis",
  "p-bala": "Transmis", "p-balacita": "Transmis", "p-maglavit": "Netransmis",
  "p-sovarna": "Transmis", "p-brosteni": "Transmis", "p-prigor": "Netransmis",
  "p-catunele": "N/A", "p-draganesti": "Netransmis"
};

const PREF_STATUSES: Record<string, string> = {
  "p-vinjulet": "Transmis", "p-clinceni": "Transmis", "p-gradistea": "Transmis",
  "p-ostrov": "Transmis", "p-bicles": "Transmis", "p-chiojdu": "Transmis",
  "p-bertea": "Transmis", "p-azil-cujmir": "Transmis", "p-rogova": "Transmis",
  "p-magurele": "Transmis", "p-punghina": "Netransmis", "p-fulga": "Transmis",
  "p-floresti": "Transmis", "p-luica": "Transmis", "p-posta-calnau": "Transmis",
  "p-alexeni": "Netransmis", "p-cislau": "Netransmis", "p-bucovat": "Transmis",
  "p-bala": "Netransmis", "p-balacita": "Transmis", "p-maglavit": "Netransmis",
  "p-sovarna": "Netransmis", "p-brosteni": "Transmis", "p-prigor": "Netransmis",
  "p-catunele": "Transmis", "p-draganesti": "Netransmis"
};

export const fmActions: FmAction[] = FM1_PROJECTS.flatMap(([projectId, companyId]) => [
  {
    id: `fa-cr1-${projectId}`,
    projectId,
    companyId,
    actionType: "CR1" as const,
    label: "CR1",
    transmittedStatus: (CR1_STATUSES[projectId] ?? "Netransmis") as FmAction["transmittedStatus"],
    updatedAt: "2026-04-30"
  },
  {
    id: `fa-pref-${projectId}`,
    projectId,
    companyId,
    actionType: "Cerere prefinanțare" as const,
    label: "Cerere prefinanțare",
    transmittedStatus: (PREF_STATUSES[projectId] ?? "Netransmis") as FmAction["transmittedStatus"],
    updatedAt: "2026-04-30"
  }
]);

export const fmAddenda: FmAddendum[] = FM1_PROJECTS.map(([projectId, companyId]) => ({
  id: `aa-${projectId}`,
  projectId,
  companyId,
  requiresAddendum: true,
  reason: "Actualizare TVA 19% → 21%",
  budgetChangeNeeded: "Netransmis" as const,
  procurementPlanChangeNeeded: "Netransmis" as const,
  activitiesTermChangeNeeded: "Netransmis" as const,
  documentsPrepared: "Netransmis" as const,
  platformStatus: "Netransmis" as const,
  updatedAt: "2026-04-30"
}));

export const projectNotes: ProjectNote[] = [];

export const activityLogs: ActivityLog[] = [
  {
    id: "log-1",
    module: "fm",
    label: "Dosare actualizate",
    description: "FM1 – actualizare status dosare achiziții pentru 26 de beneficiari.",
    createdAt: "2026-04-30T09:00:00"
  },
  {
    id: "log-2",
    module: "pnrr",
    label: "Cerere transfer procesată",
    description: "CONTROL GENERAL SERVICE – CT14 RUE 57 marcată ca Răspuns trimis.",
    createdAt: "2026-03-26T20:00:00"
  },
  {
    id: "log-3",
    module: "pnrr",
    label: "Contestație în lucru",
    description: "STIL ELECTRO MAX – Contestație notificare autorizare plată, în lucru.",
    createdAt: "2026-04-30T08:00:00"
  }
];
