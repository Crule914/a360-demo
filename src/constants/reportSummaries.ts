import {
  Home,
  PieChart,
  TrendingUp,
  DollarSign,
  Users,
  FileBarChart,
  LineChart,
  Calendar,
  Activity,
  Heart,
} from "lucide-react";

export interface ReportSummaryMetric {
  label: string;
  value: string;
  description: string;
  valueColor?: "default" | "success" | "danger" | "warning";
}

export interface AvailableReport {
  id: string;
  icon: any;
  title: string;
  category: string;
  frequency: string;
  description: string;
}

export interface ReportSummaryData {
  id: string;
  icon: any;
  title: string;
  metrics: ReportSummaryMetric[];
  aiInsight: string;
}

// Reports surfaced on the landing/overview view. Data tuned to the Sweets
// household at Schwab so the dashboard tells one coherent story.
export const AVAILABLE_LANDING_REPORTS: AvailableReport[] = [
  { id: "household-summary", icon: Home, title: "Household Summary", category: "Contacts", frequency: "daily", description: "Sweets household members, beneficiaries, and trusted contacts" },
  { id: "portfolio-summary", icon: PieChart, title: "Portfolio Summary", category: "Holdings", frequency: "daily", description: "Sweets portfolio value, cash position, and Schwab account mix" },
  { id: "risk-assessment", icon: TrendingUp, title: "Risk Assessment", category: "Analysis", frequency: "weekly", description: "Asset allocation, portfolio beta, and risk metrics" },
  { id: "estimated-cash-flow", icon: DollarSign, title: "Cash Flow & Distribution", category: "Income", frequency: "daily", description: "Projected Schwab income, distributions, and cash flow summary" },
  { id: "healthcare-planning", icon: Heart, title: "Healthcare Planning Report", category: "Planning", frequency: "monthly", description: "Healthcare proxy designations and medical directives" },
  { id: "beneficiary-review", icon: Users, title: "Estate & Beneficiary Review", category: "Planning", frequency: "quarterly", description: "Sweets beneficiary designations and estate planning status" },
  { id: "financial-summary", icon: FileBarChart, title: "Financial Summary", category: "Holdings", frequency: "daily", description: "Complete Sweets household net worth and Schwab account values" },
  { id: "performance-history-twr", icon: LineChart, title: "Performance History TWR", category: "Performance", frequency: "daily", description: "Time-weighted returns with Schwab benchmark comparisons" },
  { id: "calendar-market-value-performance", icon: Calendar, title: "Calendar Market Value Performance", category: "Performance", frequency: "monthly", description: "Annual returns with six-year history" },
  { id: "allocation-holdings-summary", icon: Activity, title: "Allocation Holdings Summary", category: "Holdings", frequency: "daily", description: "Top Schwab holdings and asset category breakdown" },
];

export const REPORT_SUMMARY_DATA: Record<string, ReportSummaryData> = {
  "household-summary": {
    id: "household-summary",
    icon: Home,
    title: "Household Summary",
    metrics: [
      { label: "Members", value: "2", description: "Rick & Karen Sweets" },
      { label: "Beneficiaries", value: "4", description: "Named beneficiaries" },
      { label: "Healthcare Proxy", value: "Yes", description: "Proxy designated", valueColor: "success" },
      { label: "Trusted Contacts", value: "2", description: "On file at Schwab" },
    ],
    aiInsight:
      "Sweets household documentation is current. Consider confirming beneficiary designations during the upcoming annual review.",
  },
  "portfolio-summary": {
    id: "portfolio-summary",
    icon: PieChart,
    title: "Portfolio Summary",
    metrics: [
      { label: "Portfolio Value", value: "$3.4M", description: "Total Schwab market value" },
      { label: "Cash Position", value: "$186K", description: "Schwab money market" },
      { label: "Risk Score", value: "Moderate", description: "Current risk level", valueColor: "warning" },
      { label: "Rebalancing Alert", value: "Yes", description: "Equity drift > 3%", valueColor: "danger" },
    ],
    aiInsight:
      "Sweets portfolio is 3% overweight in domestic equities (SCHB/SCHX). Consider trimming to target allocation before quarter-end.",
  },
  "risk-assessment": {
    id: "risk-assessment",
    icon: TrendingUp,
    title: "Risk Assessment",
    metrics: [
      { label: "Asset Allocation", value: "65/35", description: "Equity/Fixed ratio" },
      { label: "Portfolio Beta", value: "0.94", description: "vs. S&P 500" },
      { label: "Max Drawdown Risk", value: "-13%", description: "Stress-test scenario", valueColor: "danger" },
      { label: "Standard Deviation", value: "8.7%", description: "Trailing 3-yr volatility" },
    ],
    aiInsight:
      "Risk metrics align with the Sweets' moderate-growth objective. Beta slightly below market consistent with SCHZ/SCHF tilt.",
  },
  "estimated-cash-flow": {
    id: "estimated-cash-flow",
    icon: DollarSign,
    title: "Cash Flow & Distribution",
    metrics: [
      { label: "Est. Annual Income", value: "$98K", description: "Projected 12-month" },
      { label: "Next Distribution", value: "$8.1K", description: "SCHD dividend, 12 days" },
      { label: "Yield", value: "3.4%", description: "Schwab portfolio yield" },
      { label: "Coverage Ratio", value: "118%", description: "Income vs. withdrawals", valueColor: "success" },
    ],
    aiInsight:
      "Projected Schwab income comfortably covers Rick & Karen's planned distributions. Dividend income up 4% YoY.",
  },
  "healthcare-planning": {
    id: "healthcare-planning",
    icon: Heart,
    title: "Healthcare Planning Report",
    metrics: [
      { label: "Healthcare Proxy", value: "Active", description: "Karen designated", valueColor: "success" },
      { label: "Living Will", value: "On File", description: "Last updated 2024" },
      { label: "HIPAA Auth", value: "2", description: "Authorized contacts" },
      { label: "Review Due", value: "8 mo", description: "Next review date" },
    ],
    aiInsight: "Healthcare documents are current. Suggest reviewing living will preferences at the next annual meeting.",
  },
  "beneficiary-review": {
    id: "beneficiary-review",
    icon: Users,
    title: "Estate & Beneficiary Review",
    metrics: [
      { label: "Total Beneficiaries", value: "4", description: "Named individuals" },
      { label: "Contingent", value: "2", description: "Backup designations" },
      { label: "Schwab Accounts", value: "5", description: "With beneficiaries" },
      { label: "Review Status", value: "Current", description: "Last verified Q1", valueColor: "success" },
    ],
    aiInsight:
      "Sweets beneficiary designations align with their estate plan. IRA TOD forms were refreshed in the last review cycle.",
  },
  "financial-summary": {
    id: "financial-summary",
    icon: FileBarChart,
    title: "Financial Summary",
    metrics: [
      { label: "Net Worth", value: "$4.6M", description: "Sweets household" },
      { label: "Liquid Assets", value: "$3.4M", description: "Schwab investable" },
      { label: "Liabilities", value: "$385K", description: "Mortgage balance" },
      { label: "Debt Ratio", value: "8%", description: "Debt to assets", valueColor: "success" },
    ],
    aiInsight:
      "Sweets net worth is up 6.4% YTD. Debt-to-asset ratio well inside the comfort threshold for retirement income planning.",
  },
  "performance-history-twr": {
    id: "performance-history-twr",
    icon: LineChart,
    title: "Performance History TWR",
    metrics: [
      { label: "YTD Return", value: "+8.6%", description: "Time-weighted", valueColor: "success" },
      { label: "1-Year", value: "+12.9%", description: "Trailing 12 months", valueColor: "success" },
      { label: "vs. Benchmark", value: "+0.7%", description: "vs. Schwab 60/40 blend", valueColor: "success" },
      { label: "Sharpe Ratio", value: "1.21", description: "Risk-adjusted return" },
    ],
    aiInsight:
      "Sweets portfolio outperforming the Schwab 60/40 blended benchmark by 70 bps. Strong risk-adjusted returns.",
  },
  "calendar-market-value-performance": {
    id: "calendar-market-value-performance",
    icon: Calendar,
    title: "Calendar Market Value Performance",
    metrics: [
      { label: "2026 YTD", value: "+8.6%", description: "Current year", valueColor: "success" },
      { label: "2025", value: "+15.2%", description: "Prior year", valueColor: "success" },
      { label: "2022", value: "-11.7%", description: "Drawdown year", valueColor: "danger" },
      { label: "5-Yr Avg", value: "+9.4%", description: "Annualized", valueColor: "success" },
    ],
    aiInsight:
      "5-year annualized return of 9.4% exceeds the Sweets' 7% planning assumption. 2026 tracking ahead of pace.",
  },
  "allocation-holdings-summary": {
    id: "allocation-holdings-summary",
    icon: Activity,
    title: "Allocation Holdings Summary",
    metrics: [
      { label: "Equities", value: "63%", description: "SCHB / SCHX / SCHF" },
      { label: "Fixed Income", value: "29%", description: "SCHZ / SCMB" },
      { label: "Alternatives", value: "5%", description: "SCHH real estate" },
      { label: "Cash", value: "3%", description: "Schwab money market" },
    ],
    aiInsight:
      "Equity allocation slightly above the 60% target. Trim SCHX gains to rebalance and harvest losses in SCHZ.",
  },
};

export const DEFAULT_SELECTED_REPORTS = [
  "household-summary",
  "portfolio-summary",
  "risk-assessment",
  "estimated-cash-flow",
  "beneficiary-review",
];
