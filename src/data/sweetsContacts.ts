export type Person = {
  name: string;
  nickname?: string;
  relationship: string;
  dob: string;
  age: number | "";
  ssn: string;
  email?: string;
  emailLabel?: string;
  emailPrimary?: boolean;
  home?: string;
  mobile?: string;
  work?: string;
};

export const PEOPLE: Person[] = [
  {
    name: "Richard Sweets",
    nickname: "Rick",
    relationship: "Father",
    dob: "08/19/1976",
    age: 49,
    ssn: "***-**-9511",
    email: "rsweets@eml.com",
    emailLabel: "Personal",
    emailPrimary: true,
    home: "(382) 444-8054",
    mobile: "(382) 444-8750",
  },
  {
    name: "Karen Sweets",
    nickname: "Karen",
    relationship: "Wife",
    dob: "06/03/1985",
    age: 41,
    ssn: "***-**-0442",
    email: "spollard@advisor360.com",
    emailLabel: "Personal",
    emailPrimary: true,
    home: "(382) 444-8054",
    mobile: "382-444-6347",
  },
  {
    name: "Wayne Sweets",
    relationship: "Son",
    dob: "05/11/2022",
    age: 4,
    ssn: "—",
  },
  {
    name: "Ben Sweets",
    relationship: "—",
    dob: "—",
    age: "",
    ssn: "—",
    email: "davisbwd@gmail.com",
    emailLabel: "Personal",
    mobile: "(781) 724-4715",
  },
];

export type Connection = {
  name: string;
  role: string;
  connectedTo: string;
  connectedRel: string;
  email: string;
  emailLabel: string;
  emailPrimary?: boolean;
  phone: string;
  description: string;
};

export const CONNECTIONS: Connection[] = [
  {
    name: "CRAWFORD, ANDREA",
    role: "CPA",
    connectedTo: "THE SWEETS FAMILY",
    connectedRel: "CPA Client",
    email: "780364223897608@a360fakedomain.com",
    emailLabel: "Personal",
    emailPrimary: true,
    phone: "(144) 444-8765",
    description: "Andrea has been the Sweets family CPA …",
  },
  {
    name: "Natalie Jones",
    role: "POA (Rick)",
    connectedTo: "Richard Sweets (Rick)",
    connectedRel: "Sibling",
    email: "njones@fakeemail.com",
    emailLabel: "Personal",
    phone: "(978) 256-4567",
    description: "Power of attorney for Rick.",
  },
  {
    name: "JONES, ED + CARRIE",
    role: "Niece (Karen)",
    connectedTo: "Karen Sweets (Karen)",
    connectedRel: "Aunt",
    email: "4481666130627@a360fakedomain.com",
    emailLabel: "Personal",
    phone: "376450297",
    description: "Karen's niece and her husband.",
  },
];

export type Activity = {
  type: "Appointment" | "Note" | "Task" | "Phone Call" | "Life Event";
  subject: string;
  date: string;
  status: "complete" | "open";
  owner: string;
  warning?: boolean;
  attachment?: boolean;
  pinned?: boolean;
  hasChildren?: boolean;
  /** Set when the row is an Investor360° client message (Client Portal wedge). */
  investor360?: boolean;
};

export const ACTIVITIES: Activity[] = [
  { type: "Note", subject: "Investor360° Message: Karen Sweets — Question about June statement", date: "07/08/2026", status: "open", owner: "Reva Rudy", investor360: true, pinned: true },
  { type: "Note", subject: "Investor360° Message: Rick Sweets — Document shared: Q2 2026 Performance Report", date: "07/06/2026", status: "complete", owner: "Reva Rudy", investor360: true, attachment: true },
  { type: "Note", subject: "Investor360° Message: Rick Sweets — Request to update beneficiary", date: "06/30/2026", status: "complete", owner: "Sean Pollard", investor360: true },
  { type: "Note", subject: "AI Generated Note: Annual Review with The Sweets Family", date: "06/24/2026", status: "complete", owner: "Reva Rudy", attachment: true, pinned: true },
  { type: "Appointment", subject: "Annual Review with The Sweets Family", date: "06/24/2026", status: "open", owner: "Reva Rudy" },
  { type: "Task", subject: "Open New Account — Individual Brokerage", date: "06/24/2026", status: "open", owner: "Reva Rudy" },
  { type: "Task", subject: "Send 529 illustration to Rick & Karen", date: "06/25/2026", status: "open", owner: "Reva Rudy" },
  { type: "Life Event", subject: "Birthday — Karen Sweets (41)", date: "06/03/2026", status: "complete", owner: "Reva Rudy" },
  { type: "Life Event", subject: "Anniversary — Rick & Karen Sweets (18 years)", date: "09/12/2026", status: "open", owner: "Sean Pollard" },
];

export const ACTIVITY_TOTAL = ACTIVITIES.length;


export type Opportunity = {
  name: string;
  stage: string;
  amount: string;
  closeDate: string;
  owner: string;
  probability: string;
};

export const OPPORTUNITIES: Opportunity[] = [
  { name: "529 Plan for Grandchild", stage: "Discovery", amount: "$25,000", closeDate: "08/15/2026", owner: "Reva Rudy", probability: "40%" },
  { name: "Roth Conversion Strategy", stage: "Proposal", amount: "$150,000", closeDate: "07/30/2026", owner: "Reva Rudy", probability: "65%" },
  { name: "Life Insurance Review", stage: "Negotiation", amount: "$500,000", closeDate: "07/15/2026", owner: "Sean Pollard", probability: "80%" },
];

export type Workflow = {
  name: string;
  status: string;
  mainDate: string;
  nextActivity: string;
  nextDate: string;
  warning?: boolean;
  owner: string;
};

export const WORKFLOWS: Workflow[] = [
  { name: "Review meeting for the sweets", status: "1 out of 10 completed", mainDate: "06/30/2026", nextActivity: "Confirmation - Phone call", nextDate: "06/29/2026", owner: "Reva Rudy" },
  { name: "New Life Insurance Application", status: "1 out of 19 completed", mainDate: "06/09/2026", nextActivity: "Run Illustrations for Preferred Product (Need)", nextDate: "06/02/2026", warning: true, owner: "Sean Pollard" },
  { name: "Brokerage New Business for the SWEETS", status: "1 out of 15 completed", mainDate: "06/17/2026", nextActivity: "Establish Investor360 Access (if applicable)", nextDate: "06/02/2026", warning: true, owner: "Reva Rudy" },
];
