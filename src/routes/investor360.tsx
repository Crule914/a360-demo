import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useWedgeProducts, WEDGE_PRODUCTS } from "@/lib/demoConfig";

export const Route = createFileRoute("/investor360")({
  head: () => ({
    meta: [
      { title: "Investor360° Client Portal | Advisor360" },
      {
        name: "description",
        content:
          "Investor360° client portal view with portfolio holdings and shared documents for the Sweets household.",
      },
      { property: "og:title", content: "Investor360° Client Portal" },
      {
        property: "og:description",
        content:
          "Client-facing Investor360° portal showing portfolio holdings and documents.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Investor360Page,
});

const ALL_TABS = [
  "Overview",
  "Portfolio",
  "Documents",
  "Statements",
  "Profile",
] as const;

const HOLDINGS = [
  { acct: "JAV032164", name: "Richard Sweets Individual — Brokerage", sym: "VTSAX", desc: "Vanguard Total Stock Market Index", qty: "1,240.552", price: "$118.42", value: "$146,906.16" },
  { acct: "JAV032164", name: "Richard Sweets Individual — Brokerage", sym: "AAPL", desc: "Apple Inc.", qty: "310.000", price: "$228.19", value: "$70,738.90" },
  { acct: "EEP000907", name: "Richard & Karen Sweets Joint — Mutual Fund", sym: "FCNTX", desc: "Fidelity Contrafund", qty: "2,105.870", price: "$19.88", value: "$41,864.69" },
  { acct: "JAV033209", name: "Karen Sweets Traditional IRA", sym: "VBTLX", desc: "Vanguard Total Bond Market Index", qty: "3,988.104", price: "$9.71", value: "$38,724.49" },
  { acct: "JAV033211", name: "Karen Sweets Roth IRA", sym: "SCHD", desc: "Schwab U.S. Dividend Equity ETF", qty: "860.000", price: "$81.06", value: "$69,711.60" },
  { acct: "B3200564", name: "Sweets Trust — Brokerage", sym: "SPY", desc: "SPDR S&P 500 ETF Trust", qty: "225.000", price: "$548.31", value: "$123,369.75" },
];

const DOCUMENTS = [
  { name: "2025 Consolidated 1099", type: "Tax Document", account: "JAV032164", date: "02/12/2026" },
  { name: "Q2 2026 Performance Report", type: "Report", account: "All Accounts", date: "07/06/2026" },
  { name: "New Account Application — Individual Brokerage", type: "Account Form", account: "345678", date: "06/24/2026" },
  { name: "Investment Policy Statement", type: "Advisory", account: "IWS500221", date: "05/18/2026" },
  { name: "June 2026 Statement", type: "Statement", account: "EEP000907", date: "07/02/2026" },
  { name: "Beneficiary Designation Form", type: "Account Form", account: "JAV033209", date: "04/09/2026" },
];

function Investor360Page() {
  const wedge = useWedgeProducts();
  const enabled = WEDGE_PRODUCTS.filter((w) => wedge.state[w]);
  const doOnly =
    enabled.includes("Digital Onboarding") && !enabled.includes("CRM+");
  const tabs = doOnly
    ? (["Portfolio", "Documents"] as const)
    : ALL_TABS;
  const [active, setActive] = useState<string>(tabs[0]);
  const current = tabs.includes(active as never) ? active : tabs[0];

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <header className="bg-header text-white">
        <div className="px-6 pt-3">
          <div className="text-[11px] uppercase text-[#7FB3E8]">
            Investor360°
          </div>
          <h1 className="text-[18px] font-medium leading-tight mt-0.5">
            Rick &amp; Karen Sweets
          </h1>
          <nav className="flex items-end gap-1 mt-3">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={`relative px-4 py-2.5 text-[14px] ${
                  current === t ? "text-white" : "text-white/85 hover:text-white"
                }`}
              >
                {t}
                {current === t && (
                  <span className="absolute left-2 right-2 bottom-0 h-[3px] bg-[#7FB3E8] rounded-t-sm" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="p-6">
        {current === "Portfolio" && (
          <Card title="Portfolio Holdings" subtitle="As of 08/03/2026">
            <Table
              head={["Account", "Symbol", "Description", "Quantity", "Price", "Market Value"]}
            >
              {HOLDINGS.map((h, i) => (
                <tr key={i} className="border-t border-[#E3E6EA]">
                  <td className="px-4 py-2.5 text-[#1f6fb8]">{h.name}</td>
                  <td className="px-4 py-2.5 font-medium">{h.sym}</td>
                  <td className="px-4 py-2.5">{h.desc}</td>
                  <td className="px-4 py-2.5 text-right">{h.qty}</td>
                  <td className="px-4 py-2.5 text-right">{h.price}</td>
                  <td className="px-4 py-2.5 text-right">{h.value}</td>
                </tr>
              ))}
            </Table>
          </Card>
        )}

        {current === "Documents" && (
          <Card title="Documents" subtitle="Shared with you">
            <Table head={["Document", "Type", "Account", "Date Shared", ""]}>
              {DOCUMENTS.map((d, i) => (
                <tr key={i} className="border-t border-[#E3E6EA]">
                  <td className="px-4 py-2.5 text-[#1f6fb8]">{d.name}</td>
                  <td className="px-4 py-2.5">{d.type}</td>
                  <td className="px-4 py-2.5">{d.account}</td>
                  <td className="px-4 py-2.5">{d.date}</td>
                  <td className="px-4 py-2.5 text-right text-[#1f6fb8]">View</td>
                </tr>
              ))}
            </Table>
          </Card>
        )}

        {current !== "Portfolio" && current !== "Documents" && (
          <Card title={current} subtitle="Client portal">
            <div className="px-4 py-6 text-[14px] text-[#6b7280]">
              {current} content is not available in this demo view.
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white border border-[#E3E6EA] rounded-md">
      <div className="px-4 py-3 border-b border-[#E3E6EA] flex items-baseline gap-3">
        <h2 className="text-[14px] font-semibold text-[#17447B]">{title}</h2>
        {subtitle && (
          <span className="text-[12px] text-[#6b7280]">{subtitle}</span>
        )}
      </div>
      {children}
    </section>
  );
}

function Table({
  head,
  children,
}: {
  head: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[14px] text-[#28313B]">
        <thead>
          <tr className="bg-[#F7F8FA] text-[12px] uppercase tracking-wide text-[#6b7280]">
            {head.map((h, i) => (
              <th
                key={i}
                className={`px-4 py-2 font-semibold ${
                  i > 2 ? "text-right" : "text-left"
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
