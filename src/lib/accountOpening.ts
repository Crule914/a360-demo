// Shared types & seed data for Account Opening flow.

export type Owner = { initials: string; name: string };

export type RegistrationType = {
  label: string;
  category: "NON-RETIREMENT" | "RETIREMENT";
};

export const REGISTRATION_TYPES: RegistrationType[] = [
  { label: "Individual & Joint", category: "NON-RETIREMENT" },
  { label: "Trust", category: "NON-RETIREMENT" },
  { label: "Education & Custodial", category: "NON-RETIREMENT" },
  { label: "IRA (including SEP & SIMPLE)", category: "RETIREMENT" },
  { label: "Inherited IRA", category: "RETIREMENT" },
];

export type BundleAccount = {
  id: string;
  registrationType: string; // e.g. "Individual", "Traditional IRA"
  custodian: "Schwab";
  primaryOwner: Owner;
};

export const SWEETS_OWNERS: Owner[] = [
  { initials: "RS", name: "Rick Sweets" },
  { initials: "KS", name: "Karen Sweets" },
];

export type PartyAddress = {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
};

export type PartyProfile = {
  prefix: string;
  firstName: string;
  middle: string;
  lastName: string;
  suffix: string;
  ssn: string;
  dob: string;
  citizenship: string;
  primaryPhone: string;
  secondaryPhone: string;
  email: string;
  mailing: PartyAddress;
  legalSameAsMailing: boolean;
  employerName: string;
  employerAddress: PartyAddress;
};

export const SWEETS_PARTY_PROFILES: Record<string, PartyProfile> = {
  "Rick Sweets": {
    prefix: "Mr.",
    firstName: "Rick",
    middle: "A",
    lastName: "Sweets",
    suffix: "",
    ssn: "412-58-7790",
    dob: "03/14/1968",
    citizenship: "U.S. Citizen",
    primaryPhone: "(415) 555-2014",
    secondaryPhone: "",
    email: "rick.sweets@sweetsfamily.com",
    mailing: { address1: "248 Marina Boulevard", address2: "Apt 4", city: "San Francisco", state: "CA", zip: "94123" },
    legalSameAsMailing: true,
    employerName: "Sweets & Co. Confectionery",
    employerAddress: { address1: "100 Industrial Way", city: "Oakland", state: "CA", zip: "94607" },
  },
  "Karen Sweets": {
    prefix: "Mrs.",
    firstName: "Karen",
    middle: "L",
    lastName: "Sweets",
    suffix: "",
    ssn: "523-46-1188",
    dob: "07/22/1970",
    citizenship: "U.S. Citizen",
    primaryPhone: "(415) 555-2018",
    secondaryPhone: "",
    email: "karen.sweets@sweetsfamily.com",
    mailing: { address1: "248 Marina Boulevard", address2: "Apt 4", city: "San Francisco", state: "CA", zip: "94123" },
    legalSameAsMailing: true,
    employerName: "Bay Area Unified School District",
    employerAddress: { address1: "1000 Broadway", city: "Oakland", state: "CA", zip: "94607" },
  },
};

export const HOUSEHOLD_NAME = "The Sweets Family";

// Maps a chosen registration list label -> the displayed bundle registration name
export function resolveRegistration(label: string): string {
  switch (label) {
    case "Individual & Joint":
      return "Individual";
    case "IRA (including SEP & SIMPLE)":
      return "Traditional IRA";
    case "Inherited IRA":
      return "Inherited IRA";
    case "Trust":
      return "Trust";
    case "Education & Custodial":
      return "UTMA";
    default:
      return label;
  }
}

// Seed dashboard rows beyond the Sweets bundle
export type DashboardAccount = {
  household: string;
  holder: string;
  registration: string; // e.g. "Schwab - Individual"
  productType: string;
  signature: string;
  advisor: string;
  lastUpdated: string;
  accountNumber?: string; // XXXX-XXXX when completed
  status: "creating" | "pending" | "completed";
};

function rand4(prefix: string) {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export const SEED_DASHBOARD: DashboardAccount[] = [
  {
    household: "The Whitman Trust",
    holder: "Eleanor Whitman",
    registration: "Schwab - Trust",
    productType: "Brokerage",
    signature: "Completed",
    advisor: "321654987 - Christopher Condon",
    lastUpdated: "Jun 18, 2026",
    accountNumber: "8421-3398",
    status: "completed",
  },
  {
    household: "The Whitman Trust",
    holder: "Eleanor Whitman",
    registration: "Schwab - Roth IRA",
    productType: "Retirement",
    signature: "Completed",
    advisor: "321654987 - Christopher Condon",
    lastUpdated: "Jun 18, 2026",
    accountNumber: "7762-1045",
    status: "completed",
  },
  {
    household: "The Alvarez Household",
    holder: "Miguel Alvarez",
    registration: "Schwab - Individual",
    productType: "Brokerage",
    signature: "Awaiting investor signature",
    advisor: "321654987 - Christopher Condon",
    lastUpdated: "Jun 20, 2026",
    status: "pending",
  },
  {
    household: "The Alvarez Household",
    holder: "Sofia Alvarez",
    registration: "Schwab - Joint",
    productType: "Brokerage",
    signature: "Awaiting investor signature",
    advisor: "321654987 - Christopher Condon",
    lastUpdated: "Jun 20, 2026",
    status: "pending",
  },
  {
    household: "The Okafor Family",
    holder: "Adaeze Okafor",
    registration: "Schwab - Traditional IRA",
    productType: "Retirement",
    signature: "Completed",
    advisor: "321654987 - Christopher Condon",
    lastUpdated: "Jun 15, 2026",
    accountNumber: "5530-8814",
    status: "completed",
  },
  {
    household: "The Bennett Household",
    holder: "Hugh Bennett",
    registration: "Schwab - UTMA",
    productType: "Custodial",
    signature: "Awaiting investor signature",
    advisor: "321654987 - Christopher Condon",
    lastUpdated: "Jun 22, 2026",
    status: "pending",
  },
  {
    household: "The Bennett Household",
    holder: "Marcia Bennett",
    registration: "Schwab - Inherited IRA",
    productType: "Retirement",
    signature: "Completed",
    advisor: "321654987 - Christopher Condon",
    lastUpdated: "Jun 12, 2026",
    accountNumber: "9104-2267",
    status: "completed",
  },
];

const STORAGE_KEY = "a360.accountOpening.submissions.v1";

export type SubmittedBundle = {
  id: string;
  household: string;
  accounts: BundleAccount[];
  submittedAt: string; // ISO
  advisor: string;
};

export function loadSubmissions(): SubmittedBundle[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveSubmission(b: SubmittedBundle) {
  if (typeof window === "undefined") return;
  const all = loadSubmissions();
  all.unshift(b);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

// ---------------------------------------------------------------------------
// Grouped dashboard model (household -> bundle -> accounts)
// ---------------------------------------------------------------------------

export type BundleRow = {
  status: string; // "In Progress" | "Completed - JAB1234" ...
  holder: string;
  registration: string; // "Brokerage - Individual"
  registrationLink?: boolean;
  productType: string; // "Variable Annuity" or ""
  signature: string; // "--" typically
  advisor: string; // "3M9 - Valle, Rudy"
  action?: string; // "Submit via VAOE"
};

export type DashboardBundle = {
  id: string;
  label: string; // "THE SWEETS FAMILY - Bundle ( 2 Accounts )"
  signature?: string; // "PDF (Print)" | "DocuSign Delivery (eSign)" | "--"
  lastUpdated: string; // "Aug 3, 2026 - Paul Malouf"
  accounts: BundleRow[];
};

export type DashboardGroup = {
  household: string;
  bundles: DashboardBundle[];
};

const VALLE = "321654987 - Malouf, Paul";
const SPONSOR = "884301992 - Walker, David";

export const DASHBOARD_GROUPS: DashboardGroup[] = [
  {
    household: "THE SWEETS FAMILY",
    bundles: [
      {
        id: "sw-1",
        label: "THE SWEETS FAMILY - Bundle ( 2 Accounts )",
        signature: "PDF (Print)",
        lastUpdated: "Aug 3, 2026 - Paul Malouf",
        accounts: [
          { status: "IN PROGRESS", holder: "Karen Sweets", registration: "Brokerage - Individual", registrationLink: true, productType: "--", signature: "", advisor: VALLE },
          { status: "IN PROGRESS", holder: "Richard Sweets", registration: "Brokerage - Traditional IRA", registrationLink: true, productType: "--", signature: "", advisor: VALLE },
        ],
      },
      {
        id: "sw-2",
        label: "THE SWEETS FAMILY - Bundle ( 2 Accounts )",
        signature: "--",
        lastUpdated: "Jul 29, 2026 - Karen Condon",
        accounts: [
          { status: "IN PROGRESS", holder: "RICHARD SWEETS", registration: "Brokerage - Individual", registrationLink: true, productType: "--", signature: "", advisor: VALLE },
          { status: "IN PROGRESS", holder: "KAREN SWEETS", registration: "Brokerage - Individual", registrationLink: true, productType: "--", signature: "", advisor: VALLE },
        ],
      },
      {
        id: "sw-3",
        label: "THE SWEETS FAMILY - Bundle ( 2 Accounts )",
        signature: "DocuSign Delivery (eSign)",
        lastUpdated: "Jul 17, 2026 - Karen Condon",
        accounts: [
          { status: "COMPLETED - JAB4417", holder: "Richard Sweets", registration: "Brokerage - Individual", productType: "--", signature: "", advisor: VALLE },
          { status: "COMPLETED - JAB4418", holder: "Richard Sweets", registration: "Brokerage - Traditional IRA", productType: "--", signature: "", advisor: VALLE },
        ],
      },
      {
        id: "sw-4",
        label: "THE SWEETS FAMILY - Bundle ( 2 Accounts )",
        signature: "--",
        lastUpdated: "Jul 16, 2026 - Riva Threatt",
        accounts: [
          { status: "COMPLETED - NAQ2210", holder: "KAREN SWEETS", registration: "Direct Sponsor - Individual", productType: "Variable Annuity", signature: "", advisor: SPONSOR, action: "Submit via VAOE" },
          { status: "COMPLETED - NAQ2211", holder: "KAREN SWEETS", registration: "Direct Sponsor - Traditional IRA", productType: "Variable Annuity", signature: "", advisor: SPONSOR, action: "Submit via VAOE" },
        ],
      },
    ],
  },
  {
    household: "THE ALVAREZ HOUSEHOLD",
    bundles: [
      {
        id: "al-1",
        label: "THE ALVAREZ HOUSEHOLD - Bundle ( 2 Accounts )",
        signature: "DocuSign Delivery (eSign)",
        lastUpdated: "Aug 1, 2026 - Paul Malouf",
        accounts: [
          { status: "IN PROGRESS", holder: "Miguel Alvarez", registration: "Brokerage - Joint WROS", registrationLink: true, productType: "--", signature: "", advisor: VALLE },
          { status: "IN PROGRESS", holder: "Sofia Alvarez", registration: "Brokerage - Roth IRA", registrationLink: true, productType: "--", signature: "", advisor: VALLE },
        ],
      },
      {
        id: "al-2",
        label: "THE ALVAREZ HOUSEHOLD - Bundle ( 1 Account )",
        signature: "PDF (Print)",
        lastUpdated: "Jul 24, 2026 - Karen Condon",
        accounts: [
          { status: "COMPLETED - JAB3901", holder: "MIGUEL ALVAREZ", registration: "Brokerage - Individual", productType: "--", signature: "", advisor: VALLE },
        ],
      },
    ],
  },
  {
    household: "THE WHITMAN TRUST",
    bundles: [
      {
        id: "wh-1",
        label: "THE WHITMAN TRUST - Bundle ( 2 Accounts )",
        signature: "--",
        lastUpdated: "Jul 30, 2026 - Riva Threatt",
        accounts: [
          { status: "IN PROGRESS", holder: "Eleanor Whitman", registration: "Brokerage - Revocable Trust", registrationLink: true, productType: "--", signature: "", advisor: VALLE },
          { status: "COMPLETED - NAQ1188", holder: "ELEANOR WHITMAN", registration: "Direct Sponsor - Roth IRA", productType: "Variable Annuity", signature: "", advisor: SPONSOR, action: "Submit via VAOE" },
        ],
      },
    ],
  },
  {
    household: "THE BENNETT HOUSEHOLD",
    bundles: [
      {
        id: "bn-1",
        label: "THE BENNETT HOUSEHOLD - Bundle ( 3 Accounts )",
        signature: "DocuSign Delivery (eSign)",
        lastUpdated: "Jul 22, 2026 - Paul Malouf",
        accounts: [
          { status: "IN PROGRESS", holder: "Hugh Bennett", registration: "Brokerage - UTMA", registrationLink: true, productType: "--", signature: "", advisor: VALLE },
          { status: "IN PROGRESS", holder: "Marcia Bennett", registration: "Brokerage - Inherited IRA", registrationLink: true, productType: "--", signature: "", advisor: VALLE },
          { status: "COMPLETED - JAB2274", holder: "MARCIA BENNETT", registration: "Brokerage - Individual", productType: "--", signature: "", advisor: VALLE },
        ],
      },
    ],
  },
];

export function countAccounts(groups: DashboardGroup[]) {
  return groups.reduce(
    (n, g) => n + g.bundles.reduce((m, b) => m + b.accounts.length, 0),
    0,
  );
}
