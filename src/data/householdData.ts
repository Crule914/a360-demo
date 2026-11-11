// Mock data for Advisor360° prototype.
// Single advisor: Carla Reyes (CR). Single household: The Sweets Family.
// Schwab-oriented (no NFS, no insurance, no annuities).

export const advisor = {
  firstName: "Carla",
  lastName: "Reyes",
  middle: "",
  initials: "CR",
  fullName: "Reyes, Carla",
};

export const businessSnapshot = {
  trades: 0,
  cashAvailable: 6167,
  totalAssets: 428_118_932,
};

// Asset breakdown used on the Home dashboard "Assets" card.
export const assetBreakdown = {
  schwabBalance: 103_142_370.23,
  heldAwayBalance: 2_054_950_778.83,
  feeBased: 1_755_433.08,
  nonFeeBased: 2_156_337_715.98,
  totalAssets: 2_158_093_149.06,
  coreMoneyBalance: 0,
};

export const businessGoals = {
  asOf: "06/16/2026",
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
  ],
};

export const dayAtAGlance = {
  weekOf: "June 2026",
  selectedDay: 25,
  days: [
    { d: 21, label: "Sun" },
    { d: 22, label: "Mon" },
    { d: 23, label: "Tue" },
    { d: 24, label: "Wed" },
    { d: 25, label: "Thu" },
    { d: 26, label: "Fri" },
    { d: 27, label: "Sat" },
  ],
  appointments: [
    {
      title: "Annual review",
      household: "The Sweets Family",
      time: "5:30 PM",
    },
  ],
};

export const marketSummary = [
  { name: "DJI", value: "51,962.13", change: "+0.56%", up: true },
  { name: "NASDAQ", value: "26,754.17", change: "+0.26%", up: true },
  { name: "S&P500", value: "7,562.30", change: "+0.11%", up: true },
  { name: "10Yr Treasury", value: "4.46", change: "-0.27%", up: false },
  { name: "30Yr Treasury", value: "4.96", change: "-0.32%", up: false },
];

export const lastHouseholdsViewed = [
  "MEDOR HOUSEHOLD",
  "GEGHAM",
  "THE SWEETS FAMILY",
  "MARTA",
  "GARRETT HH TEST",
];

export const statistics = {
  repId: "All",
  numberOfHouseholds: 18,
  averageHouseholdBalance: 20_468_506.75,
  schwabBalances: 103_142_370.23,
  heldAwayBalances: 2_054_950_778.83,
  totalAssets: 2_158_093_149.06,
  averageAccountBalance: 2_188_735.45,
  totalFeeBasedBalance: 1_755_433.08,
  coreMoneyBalance: 0,
  numberOfAccounts: 986,
  nonRetirement: 936,
  retirement: 50,
};

// --- Sweets Household ---

export const estradaHousehold = {
  name: "THE SWEETS FAMILY",
  formalName: "The Sweets Family",
  assignedTo: "Timothy Horne",
  stickyNote: "Don't call after 7pm.",
  members: [
    { initials: "TS", name: "Tonja O Sweet", short: "Tonja O Sweet (Tonja)" },
    { initials: "GS", name: "Ginger Q Sweet", short: "Ginger Q Sweet (Ginger)" },
  ],
  totalValue: 48_567_980.24,
  meeting: {
    title: "Annual review with The Sweets Family",
    when: "Wednesday June 24 2026 at 5:30 PM",
  },
};

// Schwab-only account list shown on the household card and elsewhere.
export const estradaAccounts = [
  "Sweet Joint Brokerage",
  "Tonja Sweet Roth IRA",
  "Ginger Sweet Traditional IRA",
  "Sweet Family Trust",
];


export const popularApplications = [
  "Yahoo Finance",
  "Investment News",
  "Social Security Administration",
  "MyRepChat",
  "Kitces & Carl Advisor Podcast",
];

export const shortcuts = [
  "Yahoo Finance",
  "Investment News",
  "Social Security Administration",
  "Add Household",
  "MyRepChat",
  "NTSA",
  "Kitces & Carl Advisor Podcast",
  "Google Finance",
  "DST Vision",
  "Add Opportunity",
  "Add Person",
];

export const allocationCategories = [
  { name: "Large-Cap Blend", value: 43_403_683.76, pct: 89.37, color: "#13294B" },
  { name: "Technology", value: 2_179_521.54, pct: 4.49, color: "#1A5FA8" },
  { name: "Utilities", value: 1_574_306.24, pct: 3.24, color: "#1D9E75" },
  { name: "Intermediate Core Bond", value: 556_920.0, pct: 1.15, color: "#5BBF7F" },
  { name: "Cash and Equivalents", value: 327_998.59, pct: 0.68, color: "#A8C957" },
  { name: "Mid-Cap Growth", value: 215_400.0, pct: 0.44, color: "#E5C53B" },
  { name: "Small-Cap Value", value: 152_180.0, pct: 0.31, color: "#EE8A00" },
  { name: "International Equity", value: 98_220.0, pct: 0.2, color: "#D64545" },
  { name: "High Yield Bond", value: 35_400.0, pct: 0.07, color: "#C04B8A" },
  { name: "Other", value: 24_350.11, pct: 0.05, color: "#7A4FB5" },
];

export const topHoldings = [
  { name: "Microsoft Corp", value: 24_811_990.0, pct: 51.09 },
  { name: "Apple Inc", value: 18_341_190.0, pct: 37.76 },
  { name: "Global X Funds Cybersecurity ETF", value: 2_148_930.0, pct: 4.42 },
  { name: "Telecom Utility", value: 1_574_306.37, pct: 3.24 },
  { name: "Total Bond Market Index Portfolio", value: 556_920.0, pct: 1.15 },
  { name: "Core Money Market CASH", value: 261_869.84, pct: 0.54 },
  { name: "iShares Core S&P 500 ETF", value: 0, pct: 0 },
  { name: "iShares ESG Aware MSCI USA ETF", value: 0, pct: 0 },
  { name: "American Funds New Perspective Cl A", value: 0, pct: 0 },
  { name: "Zurich Money Market", value: 0, pct: 0 },
];

export const topHoldingsTotal = 48_567_980.36;

export const defaultReports = [
  { name: "Account Register" },
  { name: "Allocation and Holdings Summary", selected: true, starred: true },
  { name: "Beneficiary Review" },
  { name: "Financial Summary" },
  { name: "Performance Summary (TWR)" },
  { name: "Portfolio Holdings" },
  { name: "Required Minimum Distribution" },
  { name: "Transaction Activity" },
];

export const schwabAccountTypes = [
  "Individual brokerage",
  "Joint brokerage",
  "Trust",
  "Traditional IRA",
  "Roth IRA",
  "Rollover IRA",
  "SEP IRA",
  "SIMPLE IRA",
  "Inherited IRA",
  "Custodial UTMA/UGMA",
  "529 education",
  "Entity",
  "Estate",
];

export const formatCurrency = (n: number, opts?: { decimals?: number }) => {
  const decimals = opts?.decimals ?? 0;
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};
