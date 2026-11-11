export type ProfileAccount = {
  id: string;
  name: string;
  category: string;
  businessLine: string;
  registrationType: string;
  sponsor: string;
  opened: string;
  primaryOwner: string;
  ssn: string;
  dob: string;
  citizenship: string;
  employment: string;
  occupation: string;
  source: string;
  phone: string;
  phone2: string;
  email: string;
  address: string[];
  recommendation: string;
};

const BASE: Omit<ProfileAccount, "id" | "name" | "category" | "businessLine" | "registrationType"> = {
  sponsor: "Schwab",
  opened: "05/06/2026",
  primaryOwner: "RICHARD SWEETS",
  ssn: "***-**-9511",
  dob: "08/19/1976 (age 49)",
  citizenship: "U.S. Citizen",
  employment: "Currently Not Employed",
  occupation: "Currently Not Employed",
  source: "S",
  phone: "(382) 444-8054",
  phone2: "(382) 444-8750",
  email: "RSWEETS@EML.COM",
  address: ["681 E CORGI GULL STREET", "CHARLESTON IL 61920"],
  recommendation: "Client is a buy and hold investor",
};

export const PROFILE_ACCOUNTS: ProfileAccount[] = [
  { id: "JAV032164", name: "Richard Sweets Individual Schwab - Brokerage (JAV032164)", category: "Individual", businessLine: "Brokerage", registrationType: "Individual", ...BASE },
  { id: "EEP000907", name: "Richard Sweets & Karen Sweets Joint w/Survivor Schwab - Mutual Fund Strategist (EEP000907)", category: "Joint", businessLine: "Mutual Fund Strategist", registrationType: "Joint w/Survivor", ...BASE, primaryOwner: "RICHARD & KAREN SWEETS" },
  { id: "52001548", name: "Karen Sweets Brighthouse Life Insurance Co. (52001548)", category: "Other", businessLine: "Insurance", registrationType: "Variable Annuity", ...BASE, primaryOwner: "KAREN SWEETS" },
  { id: "321987", name: "Karen Sweets New England Life Insurance Co. - Variable Annuity (321987)", category: "Other", businessLine: "Insurance", registrationType: "Variable Annuity", ...BASE, primaryOwner: "KAREN SWEETS" },
  { id: "JAV033209", name: "Karen Sweets IRA Schwab - Brokerage (JAV033209)", category: "Retirement", businessLine: "Brokerage", registrationType: "Traditional IRA", ...BASE, primaryOwner: "KAREN SWEETS" },
  { id: "JAV033211", name: "Karen Sweets IRA Schwab - Brokerage (JAV033211)", category: "Retirement", businessLine: "Brokerage", registrationType: "Roth IRA", ...BASE, primaryOwner: "KAREN SWEETS" },
  { id: "EEP000906", name: "Richard Sweets IRA Schwab - Mutual Fund Strategist (EEP000906)", category: "Retirement", businessLine: "Mutual Fund Strategist", registrationType: "Traditional IRA", ...BASE },
  { id: "567890", name: "Rick IRA Rollover Schwab - Brokerage (567890)", category: "Retirement", businessLine: "Brokerage", registrationType: "Rollover IRA", ...BASE },
  { id: "4013332", name: "Sweets Traditional IRA BD Schwab - Mutual Fund Strategist (4013332)", category: "Retirement", businessLine: "Mutual Fund Strategist", registrationType: "Traditional IRA", ...BASE },
  { id: "B3200564", name: "Sweets Trust Schwab Brokerage (B3200564)", category: "Trust", businessLine: "Brokerage", registrationType: "Revocable Trust", ...BASE, primaryOwner: "SWEETS FAMILY TRUST" },
  { id: "22853550", name: "MassMutual CareChoice One (22853550 - TEDLINE PAAAINA)", category: "Insurance", businessLine: "Insurance", registrationType: "Long-Term Care", ...BASE, primaryOwner: "KAREN SWEETS" },
  { id: "00019876", name: "Rick Sweets - UMA (00019876)", category: "Closed", businessLine: "UMA", registrationType: "Individual", ...BASE },
  { id: "123456", name: "Rick Sweets FBO Karen Corp. of America IWS (123456)", category: "Closed", businessLine: "IWS", registrationType: "FBO", ...BASE, sponsor: "IWS" },
  { id: "345678", name: "Rick Sweets Individual Schwab (345678)", category: "Closed", businessLine: "Brokerage", registrationType: "Individual", ...BASE },
  { id: "210262792", name: "FLEXIBLE PREMIUM VAR UNVL LIFE (210262792 - Arlis Laney)", category: "Closed", businessLine: "Insurance", registrationType: "Variable Universal Life", ...BASE, primaryOwner: "ARLIS LANEY" },
  { id: "NFS100234", name: "Richard Sweets Individual NFS - Brokerage (NFS100234)", category: "Individual", businessLine: "Brokerage", registrationType: "Individual", ...BASE, sponsor: "NFS" },
  { id: "NFS100888", name: "Richard Sweets & Karen Sweets Joint NFS - Brokerage (NFS100888)", category: "Joint", businessLine: "Brokerage", registrationType: "Joint w/Survivor", ...BASE, sponsor: "NFS", primaryOwner: "RICHARD & KAREN SWEETS" },
  { id: "NFS200714", name: "Karen Sweets IRA NFS - Brokerage (NFS200714)", category: "Retirement", businessLine: "Brokerage", registrationType: "Traditional IRA", ...BASE, sponsor: "NFS", primaryOwner: "KAREN SWEETS" },
  { id: "IWS500221", name: "Sweets Family Trust IWS - Advisory (IWS500221)", category: "Trust", businessLine: "Advisory", registrationType: "Revocable Trust", ...BASE, sponsor: "IWS", primaryOwner: "SWEETS FAMILY TRUST" },
  { id: "IWS500445", name: "Richard Sweets IRA IWS - Advisory (IWS500445)", category: "Retirement", businessLine: "Advisory", registrationType: "Traditional IRA", ...BASE, sponsor: "IWS" },
];

export function getProfileAccount(id: string) {
  return PROFILE_ACCOUNTS.find((a) => a.id === id);
}
