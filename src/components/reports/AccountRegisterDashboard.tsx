import { useState } from "react";
import { DashboardCard } from "@/components/DashboardCard";
import { AISummarySection } from "./AISummarySection";

interface AccountRegisterDashboardProps {
  onOpenChat?: (question: string) => void;
  className?: string;
  isAISummaryVisible?: boolean;
  onToggleAISummary?: () => void;
  [key: string]: any;
}

export const AccountRegisterDashboard = ({
  onOpenChat,
  className = "flex-1",
  isAISummaryVisible: externalAISummaryVisible,
  onToggleAISummary,
}: AccountRegisterDashboardProps) => {
  const [highlightedMetric] = useState<string | null>(null);
  const [internalAISummaryVisible] = useState(true);
  const showAISummary = externalAISummaryVisible ?? internalAISummaryVisible;

  const accountData = [
    {
      account: "xxxx6508",
      accountName: "Rick & Karen Sweets — Joint Brokerage",
      firstName: "Rick",
      lastName: "Sweets",
      taxId: "XXXXX6931",
      openDate: "01/01/2018",
      status: "OPEN",
      closedDate: "",
      value: "$1,628,750.40",
      cash: "$72,150.00",
      businessLine: "Schwab Brokerage",
      regType: "Joint w/ Survivor",
      address: "84 Linden Hill Rd.",
      advisorName: "Schwab Advisor",
    },
    {
      account: "xxxx7886",
      accountName: "Rick Sweets — Schwab IRA",
      firstName: "Rick",
      lastName: "Sweets",
      taxId: "XXXXX6931",
      openDate: "01/28/2012",
      status: "OPEN",
      closedDate: "",
      value: "$894,210.18",
      cash: "$28,400.00",
      businessLine: "Schwab IRA",
      regType: "Traditional IRA",
      address: "84 Linden Hill Rd.",
      advisorName: "Schwab Advisor",
    },
    {
      account: "xxxx7319",
      accountName: "Karen Sweets — Schwab Roth IRA",
      firstName: "Karen",
      lastName: "Sweets",
      taxId: "XXXXX1080",
      openDate: "11/04/2014",
      status: "OPEN",
      closedDate: "",
      value: "$612,488.92",
      cash: "$18,250.00",
      businessLine: "Schwab IRA",
      regType: "Roth IRA",
      address: "84 Linden Hill Rd.",
      advisorName: "Schwab Advisor",
    },
    {
      account: "xxxx4902",
      accountName: "Sweets Family Trust",
      firstName: "Rick",
      lastName: "Sweets",
      taxId: "XXXXX1080",
      openDate: "06/14/2020",
      status: "OPEN",
      closedDate: "",
      value: "$284,915.30",
      cash: "$10,000.00",
      businessLine: "Schwab Trust",
      regType: "Revocable Living Trust",
      address: "84 Linden Hill Rd.",
      advisorName: "Schwab Advisor",
    },
  ];

  return (
    <div className={`overflow-y-auto bg-background ${className}`}>
      <div className="p-8 space-y-6 px-[20px] pb-[20px] pt-0">
        {showAISummary && (
          <AISummarySection
            onOpenChat={onOpenChat}
            onClose={onToggleAISummary}
            title="Account Register"
            summary={
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Sweets household has <span className="font-bold">4 active Schwab accounts</span>{" "}
                  with combined market value of <span className="font-bold">$3,420,364.80</span>.
                </li>
                <li>
                  Account mix: Joint brokerage, two IRAs, and the Sweets Family Trust — all custodied
                  at Schwab.
                </li>
                <li>
                  Total available cash:{" "}
                  <span className="font-bold">$128,800.00</span> in Schwab money market.
                </li>
              </ul>
            }
          />
        )}

        <DashboardCard title="Sweets Household — Schwab Accounts">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 text-xs font-semibold">Account</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold">Account Name</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold">First Name</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold">Last Name</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold">Tax ID</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold">Open Date</th>
                  <th className="text-right py-3 px-2 text-xs font-semibold">Value</th>
                  <th className="text-right py-3 px-2 text-xs font-semibold">Cash</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold">Business Line</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold">Reg Type</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {accountData.map((account, index) => (
                  <tr
                    key={index}
                    className={`border-b hover:bg-accent/20 transition-colors ${
                      account.status === "CLOSED" ? "opacity-60" : ""
                    } ${
                      highlightedMetric === "cash" && account.cash !== "$0.00"
                        ? "bg-[hsl(var(--warning)/0.1)] ring-2 ring-[hsl(var(--warning))]"
                        : ""
                    }`}
                  >
                    <td className="py-3 px-2 font-mono text-xs">{account.account}</td>
                    <td className="py-3 px-2 text-xs">{account.accountName}</td>
                    <td className="py-3 px-2 text-xs">{account.firstName || "-"}</td>
                    <td className="py-3 px-2 text-xs">{account.lastName || "-"}</td>
                    <td className="py-3 px-2 font-mono text-xs">{account.taxId}</td>
                    <td className="py-3 px-2 text-xs">{account.openDate || "-"}</td>
                    <td className="py-3 px-2 text-xs text-right font-semibold">{account.value}</td>
                    <td className="py-3 px-2 text-xs text-right">{account.cash}</td>
                    <td className="py-3 px-2 text-xs">{account.businessLine || "-"}</td>
                    <td className="py-3 px-2 text-xs">{account.regType || "-"}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          account.status === "OPEN"
                            ? "bg-[hsl(var(--success)/0.2)] text-[hsl(var(--success))]"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {account.status}
                        {account.closedDate && ` (${account.closedDate})`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        <DashboardCard title="Important Disclosures">
          <div className="text-xs text-muted-foreground space-y-3 leading-relaxed">
            <p>
              The information displayed is provided by Charles Schwab & Co., Inc. ("Schwab"), Member
              FINRA/SIPC. It is provided for informational purposes only, should not be relied upon
              for tax or legal purposes, and is based upon sources believed to be reliable. Past
              performance is not indicative of future results.
            </p>
            <p>
              Position and account values shown are based on trade date and do not necessarily
              reflect actual current market prices or the value you would receive upon sale of such
              assets.
            </p>
            <p>
              An investment in a money market fund is not insured or guaranteed by the FDIC or any
              other governmental agency. Although the fund seeks to preserve the value of the
              investment at $1 per share, it is possible to lose money.
            </p>
            <p>All returns are shown net of fees unless otherwise indicated.</p>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};
