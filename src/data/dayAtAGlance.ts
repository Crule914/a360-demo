// Practice-level Day at a Glance placeholder data.
// Appointments / To Do's / Life Events span multiple households and are
// mirrored into household Contacts > Activities where relevant.

export type DagAppointment = {
  id: string;
  household: string;
  time: string;
  subject: string;
  regarding: string;
  status: "complete" | "open";
  owner: string;
};

export type DagTodo = {
  id: string;
  household: string;
  subject: string;
  detail?: string;
  status: "complete" | "open";
  owner: string;
  due: string;
};

export type DagLifeEvent = {
  id: string;
  household: string;
  name: string;
  kind: "Birthday" | "Anniversary";
  detail: string;
  phone?: string;
};

export const DAG_APPOINTMENTS: DagAppointment[] = [
  {
    id: "appt-sweets",
    household: "THE SWEETS FAMILY",
    time: "5:30 PM",
    subject: "Annual Review with The Sweets Family",
    regarding: "ACCOUNTS SWEETS, RICHARD & KAREN",
    status: "open",
    owner: "Reva Rudy",
  },
  {
    id: "appt-martinez",
    household: "THE MARTINEZ FAMILY",
    time: "9:00 AM",
    subject: "Portfolio Check-in — Robert Martinez",
    regarding: "ACCOUNTS MARTINEZ, ROBERT",
    status: "complete",
    owner: "Sean Pollard",
  },
  {
    id: "appt-chen",
    household: "THE CHEN HOUSEHOLD",
    time: "11:15 AM",
    subject: "Retirement Income Planning — Linda Chen",
    regarding: "ACCOUNTS CHEN, LINDA",
    status: "open",
    owner: "Reva Rudy",
  },
  {
    id: "appt-williams",
    household: "THE WILLIAMS FAMILY",
    time: "2:00 PM",
    subject: "Prospect Intro Call — David & Carol Williams",
    regarding: "PROSPECT WILLIAMS, DAVID & CAROL",
    status: "open",
    owner: "Sean Pollard",
  },
];

export const DAG_TODOS: DagTodo[] = [
  {
    id: "todo-sweets-1",
    household: "THE SWEETS FAMILY",
    subject: "Open New Account — Individual Brokerage",
    detail: "HCRM_ACCOUNT_OPENING",
    status: "open",
    owner: "Reva Rudy",
    due: "06/24/2026",
  },
  {
    id: "todo-sweets-2",
    household: "THE SWEETS FAMILY",
    subject: "Send 529 illustration to Rick & Karen",
    detail: "HCRM_FOLLOW_UP",
    status: "open",
    owner: "Reva Rudy",
    due: "06/25/2026",
  },
  {
    id: "todo-martinez",
    household: "THE MARTINEZ FAMILY",
    subject: "Collect missing required documents",
    detail: "HCRM_DOCUMENTS",
    status: "complete",
    owner: "Sean Pollard",
    due: "06/24/2026",
  },
  {
    id: "todo-anderson",
    household: "THE ANDERSON HOUSEHOLD",
    subject: "Confirm RMD distribution election",
    detail: "HCRM_AUTO_DASHBOARD",
    status: "open",
    owner: "Reva Rudy",
    due: "06/26/2026",
  },
];

export const DAG_LIFE_EVENTS: DagLifeEvent[] = [
  {
    id: "life-karen",
    household: "THE SWEETS FAMILY",
    name: "Karen Sweets",
    kind: "Birthday",
    detail: "41 years old",
    phone: "(382) 444-6347",
  },
  {
    id: "life-sweets-anniv",
    household: "THE SWEETS FAMILY",
    name: "Rick & Karen Sweets",
    kind: "Anniversary",
    detail: "18 year anniversary",
    phone: "(382) 444-8054",
  },
  {
    id: "life-robert",
    household: "THE MARTINEZ FAMILY",
    name: "Robert Martinez",
    kind: "Birthday",
    detail: "62 years old",
    phone: "(617) 555-0134",
  },
  {
    id: "life-linda",
    household: "THE CHEN HOUSEHOLD",
    name: "Linda Chen",
    kind: "Birthday",
    detail: "58 years old",
    phone: "(415) 555-0192",
  },
  {
    id: "life-williams",
    household: "THE WILLIAMS FAMILY",
    name: "David & Carol Williams",
    kind: "Anniversary",
    detail: "30 year anniversary",
    phone: "(781) 555-0110",
  },
];
