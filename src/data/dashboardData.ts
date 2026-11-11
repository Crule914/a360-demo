// Practice-level dashboard data for the logged-in advisor.
// All figures are Schwab-only. The advisor's name is sourced from useCurrentUser.

export const practiceStatistics = {
  repId: "All",
  numberOfHouseholds: 268,
  averageHouseholdBalance: 206_754.89,
  schwabBalances: 58_512_878.82,
  nonSchwabBalances: 0.0,
  totalAssets: 58_512_878.82,
  averageAccountBalance: 150_418.71,
  totalFeeBasedBalance: 49_225_394.77,
  coreMoneyBalance: 453_002.41,
  numberOfAccounts: 389,
  nonRetirement: 109,
  retirement: 280,
};

export const businessSnapshotData = {
  trades: 0,
  cashAvailable: 20_970,
  totalAssets: 49_305_033,
  assetBreakdown: {
    feeBased: 42_774_005,
    schwabNonFeeBased: 6_531_028,
    nonSchwab: 0,
  },
  goalsAsOf: "06/20/2026",
  legend: [
    { label: "Year-End Realistic Goal", color: "#13294B" },
    { label: "Year-End Stretch Goal", color: "#1D9E75" },
    { label: "Current Progress", color: "#7FD0B5" },
    { label: "Beyond Stretch Goal", color: "#EE8A00" },
  ],
  bars: [
    { label: "YTD Production", progress: 62, realistic: 75, stretch: 90 },
    { label: "Total Assets", progress: 78, realistic: 70, stretch: 95 },
    { label: "Fee Based Assets", progress: 55, realistic: 65, stretch: 85 },
    { label: "Introduction Referrals Assets", progress: 28, realistic: 50, stretch: 75 },
    { label: "New Clients Assets", progress: 42, realistic: 60, stretch: 80 },
  ],
};

export const assetsData = {
  schwabBalance: 58_512_878.82,
  nonSchwabBalance: 0.0,
  feeBasedBalance: 49_225_394.77,
  nonFeeBasedBalance: 9_287_484.04,
  totalAssets: 58_512_878.82,
  coreMoneyBalance: 453_002.41,
};

export const favoriteReports = [
  "Performance (Default)",
  "Account Activity (Default)",
  "Books And Records (Default)",
  "Advisor Manually Entered Assets (Default)",
  "Top Holdings (Default)",
  "Transaction Activity (Default)",
];

export const lastHouseholds = [
  { id: "sweets", name: "THE SWEETS FAMILY" },
];

export const sweetsHouseholdDetail = {
  id: "sweets",
  name: "THE SWEETS FAMILY",
  formalName: "Rick and Karen Sweets",
  note: "Karen's mom is sick, and she's been the primary caretaker.",
  people: [
    { name: "Richard Sweets", short: "Richard Sweets (Rick)" },
    { name: "Karen Sweets", short: "Karen Sweets (Karen)" },
  ],
  accounts: [
    "Richard Sweets Individual Schwab - Brokerage",
    "Richard & Karen Sweets Joint Schwab - Brokerage",
    "Rick Sweets Rollover Schwab - Traditional IRA",
    "Karen Sweets Roth Schwab - Roth IRA",
    "Sweets Family Trust Schwab - Trust",
    "Rick Sweets - UMA",
  ],
};

export const popularApplicationsList = [
  "Morningstar Categories",
  "Open New Account",
  "Asset-Map",
  "RegEd",
  "Account Opening Dashboard",
  "Bulk Account Onboarding",
  "Calendly",
  "Create Household(s)",
  "eMoney",
  "Envestnet Desktop",
  "Envestnet Models",
  "Envestnet Proposals",
  "Insurance Workbench",
  "Morningstar Advisor Workstation",
  "Salesforce",
  "Schwab Advisor Center",
];

export const notificationsData = {
  receivingFor: "All",
  totals: { unread: 5913, flagged: 4, important: 0, all: 6000 },
  groups: [
    {
      name: "Account Management",
      unread: 5880,
      total: 5964,
      types: [
        { name: "Invalid Beneficiary Account", unread: 31, total: 32 },
        { name: "Missing Required Account", unread: 5849, total: 5932 },
      ],
    },
    {
      name: "Client Management",
      unread: 2,
      total: 5,
      types: [
        { name: "Investor360° Document", unread: 0, total: 3 },
        { name: "Investor360° Message", unread: 2, total: 2 },
      ],
    },
    {
      name: "Money Movement",
      unread: 31,
      total: 31,
      types: [{ name: "Required Minimum Distribution", unread: 31, total: 31 }],
    },
  ],
  updatedAt: "Updated 06/20/2026 9:14 AM",
};

export const clientActivityData = {
  tiles: [
    { label: "Households", value: 268 },
    { label: "People", value: 612 },
    { label: "Activities", value: 47 },
    { label: "Workflows", value: 12 },
  ],
  unreadInvestorMessages: 3,
  reviews: { overdue: 12, scheduleWithin4Weeks: 0 },
  touchPoints: { overdue: 3, scheduleWithin2Weeks: 0 },
};

export const dayAtAGlanceData = {
  monthLabel: "June 2026",
  selectedDay: 10,
  days: [
    { d: 7, label: "S" },
    { d: 8, label: "M" },
    { d: 9, label: "T" },
    { d: 10, label: "W" },
    { d: 11, label: "T" },
    { d: 12, label: "F" },
    { d: 13, label: "S" },
  ],
  appointments: [{ time: "9:51 AM", title: "Prospect intro call" }],
  todos: 3,
  lifeEvents: 0,
};

export const marketSummaryRows = [
  { name: "DIA", last: 515.52, chg: -0.78, pct: -0.15, up: false },
  { name: "NASDAQ", last: 26_517.93, chg: 496.28, pct: 1.91, up: true },
  { name: "S&P500", last: 7_500.58, chg: 80.48, pct: 1.08, up: true },
  { name: "10Yr Treasury", last: 4.45, chg: -0.01, pct: -0.27, up: false },
];

export const financialCalculatorGroups = [
  { name: "Mortgage", items: ["Adjustable Rate Mortgage"] },
  {
    name: "Retirement Distribution",
    items: [
      "72(t) Distribution Impact",
      "Beneficiary RMD - Eligible Designated Beneficiary",
      "Company Stock Distribution Analysis Calculator",
      "How long will my Retirement Savings Last",
    ],
  },
  {
    name: "Retirement Savings",
    items: ["Retirement Planner", "Roth IRA Conversion"],
  },
  { name: "Savings", items: ["College Savings Plan", "Emergency Savings"] },
];

export const insuranceData = {
  inforce: 599,
  pending: 10,
  byType: [
    { name: "Life", value: 250, color: "#1A5FA8" },
    { name: "Annuity", value: 320, color: "#13294B" },
    { name: "Disability Income", value: 27, color: "#1D9E75" },
    { name: "Long Term Care", value: 2, color: "#7FD0B5" },
  ],
  anniversaries: [
    { owner: "Charles Mulkey", policy: "400031870", type: "TRM", date: "02/19" },
    { owner: "Jenson Morse", policy: "8894770", type: "DIS", date: "05/15" },
    { owner: "Eesa Daly", policy: "24361542", type: "TRM", date: "05/22" },
    { owner: "Nirvana Pilcher", policy: "8526052", type: "DIS", date: "06/14" },
    { owner: "Venus Goulet", policy: "4400718777", type: "VAR", date: "06/20" },
    { owner: "Venus Goulet", policy: "4400718751", type: "VAR", date: "06/20" },
    { owner: "Tiffany Anne Roach", policy: "1100500217", type: "TRM", date: "06/20" },
    { owner: "Matchline Design Group Llc", policy: "24383840", type: "TRM", date: "06/21" },
    { owner: "Summer E Betz", policy: "8766023", type: "DIS", date: "06/21" },
    { owner: "Terence Kruze Gilley Sigman", policy: "4400195521", type: "VAR", date: "06/21" },
  ],
};

export const casesData = {
  followUpRequired: 3,
  workInProgress: 213,
  workCompleted: 0,
  newAccounts: 3,
};
