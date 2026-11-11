// Schwab-only data for the Sweets household Overview page.
// All figures are internally consistent: account values roll up to group
// subtotals, subtotals roll up to Total Net Worth, and the same accounts
// appear in the IRR table.

export type SchwabAccount = {
  id: string;
  number: string; // 8-digit Schwab account number
  name: string; // "[Owner] [Registration] Schwab - [Type] (number)" rendered separately
  ownerLabel: string; // Owner + Registration + Schwab - Type
  value: number;
  cash: number;
  group: "Individual" | "Joint" | "Retirement" | "Trust" | "Closed";
  closed?: boolean;
  irr: { since: string; portfolio: number };
};

export const sweetsMembers = [
  { initials: "RS", name: "Richard Sweets" },
  { initials: "KS", name: "Karen Sweets" },
  { initials: "WS", name: "Wayne Sweets" },
  { initials: "BS", name: "Ben Sweets" },
];

export const sweetsAccounts: SchwabAccount[] = [
  {
    id: "ind-10245678",
    number: "10245678",
    ownerLabel: "Richard Sweets Individual Schwab - Brokerage",
    name: "Richard Sweets Individual Schwab - Brokerage (10245678)",
    value: 210369.58,
    cash: 0,
    group: "Individual",
    irr: { since: "1/1/26", portfolio: 6.42 },
  },
  {
    id: "jnt-10498012",
    number: "10498012",
    ownerLabel: "Richard & Karen Sweets Joint w/Survivor Schwab - Brokerage",
    name: "Richard & Karen Sweets Joint w/Survivor Schwab - Brokerage (10498012)",
    value: 2570.95,
    cash: 0,
    group: "Joint",
    irr: { since: "1/1/26", portfolio: 3.18 },
  },
  {
    id: "ret-10567890",
    number: "10567890",
    ownerLabel: "Rick Sweets Rollover Schwab - Traditional IRA",
    name: "Rick Sweets Rollover Schwab - Traditional IRA (10567890)",
    value: 211886.62,
    cash: 113.13,
    group: "Retirement",
    irr: { since: "1/1/26", portfolio: 7.04 },
  },
  {
    id: "ret-10433321",
    number: "10433321",
    ownerLabel: "Sweets Traditional Schwab - Traditional IRA",
    name: "Sweets Traditional Schwab - Traditional IRA (10433321)",
    value: 99071.59,
    cash: 0,
    group: "Retirement",
    irr: { since: "1/1/26", portfolio: 5.88 },
  },
  {
    id: "ret-10009061",
    number: "10009061",
    ownerLabel: "Richard Sweets Roth Schwab - Roth IRA",
    name: "Richard Sweets Roth Schwab - Roth IRA (10009061)",
    value: 4665.22,
    cash: 0,
    group: "Retirement",
    irr: { since: "1/1/26", portfolio: 4.21 },
  },
  {
    id: "ret-10332091",
    number: "10332091",
    ownerLabel: "Karen Sweets Roth Schwab - Roth IRA",
    name: "Karen Sweets Roth Schwab - Roth IRA (10332091)",
    value: 0,
    cash: 0,
    group: "Retirement",
    irr: { since: "1/1/26", portfolio: 0 },
  },
  {
    id: "trs-10320056",
    number: "10320056",
    ownerLabel: "Sweets Family Trust Schwab - Trust",
    name: "Sweets Family Trust Schwab - Trust (10320056)",
    value: 265284.27,
    cash: 1541.02,
    group: "Trust",
    irr: { since: "1/1/26", portfolio: 6.73 },
  },
  {
    id: "cls-10019876",
    number: "10019876",
    ownerLabel: "Rick Sweets UMA Schwab - Brokerage",
    name: "Rick Sweets UMA Schwab - Brokerage (10019876)",
    value: 0,
    cash: 0,
    group: "Closed",
    closed: true,
    irr: { since: "1/1/26", portfolio: 0 },
  },
];

export const benchmarkColumns = [
  "FTSE NON-USD WGBI (USD)",
  "BOFA MERRILL LYNCH US CORPORATE (1-3 YR)",
  "DOW JONES UTILITIES",
];

export const twrRows = [
  { period: "Month to Date", portfolio: -0.52, b: [0.0, 0.0, 0.0] },
  { period: "Quarter to Date", portfolio: 7.49, b: [0.0, 0.0, 0.0] },
  { period: "Year to Date", portfolio: 4.83, b: [0.0, 0.0, 0.0] },
  { period: "1 Year", portfolio: 8.27, b: [0.0, 0.0, 0.0] },
  { period: "3 Year", portfolio: 6.96, b: [-0.84, 1.96, 0.0] },
  { period: "5 Year", portfolio: 1.5, b: [-5.69, 0.59, 0.0] },
  { period: "Since 07/21/2020", portfolio: 3.71, b: [-4.63, 0.75, 0.0] },
];
