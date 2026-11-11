export type NotifKind = "docs" | "investor360" | "shared";

export type Notification = {
  id: string;
  kind: NotifKind;
  title: string;
  account: string;
  body: string;
  showMore?: boolean;
  action: string;
  time: string;
  unread: boolean;
  flagged?: boolean;
  important?: boolean;
};

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    kind: "docs",
    title: "Missing Required Account Docume...",
    account: "Rick Sweets - IRA #D490234934 (THD)",
    body: "The account will be restricted until the required documentation is received and on file within 30 days of its establishment on 9/27/2023 (29 days).",
    showMore: true,
    action: "View Account Documents",
    time: "35 min ago",
    unread: true,
    important: true,
  },
  {
    id: "n2",
    kind: "investor360",
    title: "Investor360° Messages",
    account: "SWEETS, RICK & KAREN (THD)",
    body: "“Following up on your tech stock question”.",
    action: "View Message",
    time: "2 hrs ago",
    unread: true,
    important: true,
  },
  {
    id: "n3",
    kind: "docs",
    title: "Missing Required Account Docume...",
    account: "Karen Sweets - Roth IRA #E490277931 (THD)",
    body: "A signed account application is still outstanding. The account will be restricted until documentation is received.",
    showMore: true,
    action: "View Account Documents",
    time: "5 hrs ago",
    unread: true,
    flagged: true,
  },
  {
    id: "n4",
    kind: "investor360",
    title: "Investor360° Messages",
    account: "FINE, JONATHAN & MEGAN (THD)",
    body: "“Can you send over the latest performance summary before our call?”",
    action: "View Message",
    time: "7 hrs ago",
    unread: true,
  },
  {
    id: "n5",
    kind: "docs",
    title: "Missing Required Account Docume...",
    account: "David Faulkner - Roth IRA #B234234998 (FN9)",
    body: "Trusted contact form has not been returned for this account established on 9/25/2025.",
    showMore: true,
    action: "View Account Documents",
    time: "7 hrs ago",
    unread: false,
  },
  {
    id: "n6",
    kind: "investor360",
    title: "Investor360° Messages",
    account: "GRAHAM, THOMAS (THD)",
    body: "“Thanks for the update — please add my daughter as a beneficiary”.",
    action: "View Message",
    time: "8 hrs ago",
    unread: false,
  },
  {
    id: "n7",
    kind: "docs",
    title: "Missing Required Account Docume...",
    account: "Lee Williams - IRA #D490234934 (THD)",
    body: "Identity verification documents are missing for this account.",
    showMore: true,
    action: "View Account Documents",
    time: "9 hrs ago",
    unread: false,
    flagged: true,
  },
];

export const SHARED_DOC_NOTIFICATIONS: Notification[] = [
  {
    id: "s1",
    kind: "shared",
    title: "Documents Have Been Shared",
    account: "Rick Sweets - Brokerage Individual (New Account)",
    body: "Rick Sweets uploaded 2 documents (Driver's License, Signed Account Application) to the shared document vault.",
    showMore: true,
    action: "View Shared Documents",
    time: "1 hr ago",
    unread: true,
    important: true,
  },
  {
    id: "s2",
    kind: "shared",
    title: "Documents Have Been Shared",
    account: "Karen Sweets - Traditional IRA (New Account)",
    body: "Karen Sweets shared a Trusted Contact Form for the pending account bundle.",
    action: "View Shared Documents",
    time: "4 hrs ago",
    unread: true,
  },
];

export const ALL_NOTIFICATIONS: Notification[] = [
  ...NOTIFICATIONS.slice(0, 1),
  SHARED_DOC_NOTIFICATIONS[0]!,
  ...NOTIFICATIONS.slice(1),
  SHARED_DOC_NOTIFICATIONS[1]!,
];

export const categoryOf = (n: Notification) =>
  n.kind === "investor360" ? "Client Management" : "Account Management";

export const subCategoryOf = (n: Notification) =>
  n.kind === "investor360"
    ? "Investor360° Messages"
    : n.kind === "shared"
      ? "Documents Have Been Shared"
      : "Missing Required Account Documents";
