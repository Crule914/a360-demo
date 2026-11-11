import {
  FileText,
  TrendingUp,
  DollarSign,
  PieChart,
  Users,
  Target,
  Calendar,
  BookOpen,
  BarChart3,
  LineChart,
  Activity,
  Folder,
  CreditCard,
  Receipt,
  FileBarChart,
  ClipboardList,
  ArrowLeftRight,
  FileSpreadsheet,
  Home,
} from "lucide-react";

export interface Report {
  id: string;
  icon: any;
  title: string;
  description: string;
  category:
    | "allocation-holdings"
    | "income-expense"
    | "performance"
    | "activity-operations"
    | "planning"
    | "contacts";
  starred: boolean;
  parentReportId?: string;
  isCustom?: boolean;
}

export const CATEGORY_LABELS: Record<Report["category"], string> = {
  "allocation-holdings": "Allocation & Holdings",
  "income-expense": "Income & Expense",
  performance: "Performance",
  "activity-operations": "Activity & Operations",
  planning: "Planning",
  contacts: "Contacts",
};

export const REPORTS: Report[] = [
  { id: "allocation-holdings-summary", icon: PieChart, title: "Allocation and Holdings Summary", description: "Top holdings and asset categories with visual breakdown", category: "allocation-holdings", starred: true },
  { id: "estimated-realized-gain-loss", icon: TrendingUp, title: "Estimated Realized Gain and Loss", description: "Estimated gains, losses, and capital distributions by period", category: "allocation-holdings", starred: true },
  { id: "financial-summary", icon: FileBarChart, title: "Financial Summary", description: "Complete household net worth and account values snapshot", category: "allocation-holdings", starred: false },
  { id: "portfolio-holdings", icon: Folder, title: "Portfolio Holdings", description: "Detailed positions with gains, yields, costs, etc.", category: "allocation-holdings", starred: false },
  { id: "portfolio-summary", icon: FileText, title: "Portfolio Summary", description: "Customizable 4-quadrant report with summaries, history, and asset options", category: "allocation-holdings", starred: false },
  { id: "q4-holdings-review", icon: Folder, title: "Q4 Holdings Review", description: "Quarterly holdings analysis with tax-lot detail for year-end planning", category: "allocation-holdings", starred: false, parentReportId: "portfolio-holdings", isCustom: true },
  { id: "tax-lot-detail-view", icon: Folder, title: "Tax Lot Detail View", description: "Detailed tax lot analysis with cost basis and holding periods", category: "allocation-holdings", starred: false, parentReportId: "portfolio-holdings", isCustom: true },
  { id: "monthly-performance-client", icon: LineChart, title: "Monthly Client Performance", description: "Simplified monthly performance summary for client presentations", category: "performance", starred: false, parentReportId: "performance-history-twr", isCustom: true },
  { id: "annual-review-summary", icon: FileBarChart, title: "Annual Review Summary", description: "Condensed financial summary for annual client review meetings", category: "allocation-holdings", starred: false, parentReportId: "financial-summary", isCustom: true },
  { id: "estimated-cash-flow", icon: DollarSign, title: "Estimated Cash Flow", description: "Twelve-month income projections for all portfolio securities", category: "income-expense", starred: false },
  { id: "calendar-market-value-performance", icon: Calendar, title: "Calendar Market Value and Performance", description: "Six-year annual returns with benchmark comparisons included", category: "performance", starred: false },
  { id: "change-market-value-register", icon: Activity, title: "Change in Market Value Register", description: "Portfolio value changes with time-weighted return calculations", category: "performance", starred: false },
  { id: "historical-market-value-performance", icon: LineChart, title: "Historical Market Value and Performance Summary", description: "Dual-period performance with market value comparison graphs", category: "performance", starred: false },
  { id: "performance-attribution-summary", icon: BarChart3, title: "Performance Attribution Summary", description: "Best and worst performers by security category", category: "performance", starred: false },
  { id: "performance-by-security", icon: Target, title: "Performance by Security", description: "Individual security returns within specified date ranges", category: "performance", starred: false },
  { id: "performance-change-market-value", icon: TrendingUp, title: "Performance Change in Market Value", description: "Activity summary with customizable performance calculation methods", category: "performance", starred: false },
  { id: "performance-history-twr", icon: LineChart, title: "Performance History (TWR)", description: "Time-weighted returns compared against up to six benchmarks", category: "performance", starred: false },
  { id: "performance-summary-twr", icon: BarChart3, title: "Performance Summary (TWR)", description: "Multi-period performance with graphical benchmark comparisons and activity summary", category: "performance", starred: false },
  { id: "performance-summary-account-detail", icon: FileSpreadsheet, title: "Performance Summary with Account Detail", description: "Account-level and group-level performance visualizations", category: "performance", starred: false },
  { id: "account-register", icon: BookOpen, title: "Account Register", description: "Complete account details including objectives and beneficiaries", category: "activity-operations", starred: false },
  { id: "beneficiary-review", icon: Users, title: "Beneficiary Review", description: "Beneficiary designations with life insurance policy details", category: "activity-operations", starred: false },
  { id: "historical-market-value", icon: Activity, title: "Historical Market Value", description: "Market value trends versus contributions and withdrawals", category: "activity-operations", starred: false },
  { id: "pip-swp-bep", icon: ArrowLeftRight, title: "PIP/SWP/BEP", description: "Systematic investment and withdrawal plan activity", category: "activity-operations", starred: false },
  { id: "required-minimum-distribution", icon: CreditCard, title: "Required Minimum Distribution", description: "RMD estimates for retirement account compliance", category: "activity-operations", starred: false },
  { id: "transaction-activity", icon: Receipt, title: "Transaction Activity", description: "Complete transaction history for specified time periods", category: "activity-operations", starred: false },
  { id: "goal-projections", icon: Target, title: "Goal Projections", description: "Future goal achievement probability with funding gap analysis", category: "planning", starred: false },
  { id: "wealthguide-executive-summary", icon: ClipboardList, title: "WealthGuide Executive Summary", description: "Client notes summary from WealthGuide with topic review reminders", category: "planning", starred: false },
  { id: "household-summary", icon: Home, title: "Household Summary", description: "Printable client activities and notes with filters", category: "contacts", starred: false },
];
