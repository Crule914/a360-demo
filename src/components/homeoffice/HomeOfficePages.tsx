import { Card } from "@/components/AppShell";
import { AccountOpeningDashboardBody } from "@/components/account-opening/AccountOpeningDashboardBody";
export { AdvisorInformationPage } from "./AdvisorInformationPage";

const fmt = (n: number) => n.toLocaleString("en-US");

export function HomeDashboardPage() {
  const advisors = [
    ["Riva Threatt", "24,280,128,692,945", 1, 1],
    ["Aniya Kutz", "24,280,113,500,502", 2, 2],
    ["Reuven Reiss", "7,803,869,595,690", 3, 3],
    ["Nani Poole", "7,803,865,108,519", 4, 4],
    ["Javi Uhl", "7,803,225,438,587", 5, 5],
    ["Amaziah Haven", "6,509,840,505,148", 6, 6],
    ["Adin Witherspoon", "5,909,277,546,280", 7, 7],
    ["Desirae Winkle", "5,707,108,276,996", 8, 8],
    ["Surah Luther", "5,261,997,271,911", 9, 9],
    ["Maci Hilton", "4,733,676,135,309", 10, 10],
  ] as const;

  return (
    <div className="px-6 py-5 grid grid-cols-2 gap-4">
      <Card title="Assets Trends">
        <div className="p-4">
          <div className="text-[12px] text-[#6b7280] mb-2">
            Date Range:{" "}
            <span className="inline-flex items-center gap-2 px-2 py-1 border border-[#E0B84A] bg-[#FFF7DC] rounded-sm text-[#13294B]">
              Prior 12 Months 07/16/2025 – 07/15/2026 ▾
            </span>
          </div>
          <div className="flex gap-6 border-b border-[#E3E6EA] text-[13px] pt-2">
            <div className="pb-2 border-b-2 border-[#1A5FA8] text-[#1A5FA8] font-semibold">Assets</div>
            <div className="pb-2 text-[#6b7280]">Households &amp; Accounts</div>
            
          </div>
          <div className="pt-4">
            <div className="flex items-center justify-between text-[13px]">
              <div className="font-semibold text-[#13294B]">Total Assets</div>
              <div className="text-[#1A5FA8]">Total Assets ▾</div>
            </div>
            <MiniLineChart />
          </div>
        </div>
      </Card>

      <Card title="Top Statistics">
        <div className="p-4">
          <div className="flex items-center gap-4 text-[12px] text-[#6b7280] mb-2">
            <span>
              Date as of:{" "}
              <span className="inline-flex items-center gap-2 px-2 py-1 border border-[#E0B84A] bg-[#FFF7DC] rounded-sm text-[#13294B]">
                Most Recent 07/15/2026 ▾
              </span>
            </span>
            <span className="ml-auto">
              View Top Ranked:
              <span className="ml-2"><input type="radio" defaultChecked readOnly className="mr-1" />10</span>
              <span className="ml-3"><input type="radio" readOnly className="mr-1" />25</span>
            </span>
          </div>
          <div className="flex gap-6 border-b border-[#E3E6EA] text-[13px]">
            <div className="pb-2 border-b-2 border-[#1A5FA8] text-[#1A5FA8] font-semibold">Advisors</div>
            <div className="pb-2 text-[#6b7280]">Accounts</div>
            <div className="pb-2 text-[#6b7280]">Households</div>
            <div className="pb-2 text-[#6b7280]">Holdings</div>
          </div>
          <div className="pt-3">
            <div className="text-[14px] font-semibold text-[#13294B] mb-2">Top Advisors by Assets</div>
            <table className="w-full text-[12px]">
              <thead className="text-[#6b7280] text-left">
                <tr>
                  <th className="py-1 pr-2 font-medium">RANK</th>
                  <th className="py-1 pr-2 font-medium">ADVISOR NAME</th>
                  <th className="py-1 pr-2 font-medium text-right">ASSETS ($)</th>
                  <th className="py-1 pr-2 font-medium">PRIOR MONTH RANK</th>
                  <th className="py-1 pr-2 font-medium">PRIOR YEAR RANK</th>
                </tr>
              </thead>
              <tbody className="text-[#13294B]">
                {advisors.map(([name, assets, pm, py], i) => (
                  <tr key={name} className="border-t border-[#E3E6EA]">
                    <td className="py-1 pr-2">{i + 1}</td>
                    <td className="py-1 pr-2">{name}</td>
                    <td className="py-1 pr-2 text-right tabular-nums">{assets}</td>
                    <td className="py-1 pr-2">{pm}</td>
                    <td className="py-1 pr-2">{py}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <Card title="Top Business Lines & Registration Types">
        <div className="p-4">
          <div className="flex gap-6 border-b border-[#E3E6EA] text-[13px] mb-3">
            <div className="pb-2 border-b-2 border-[#1A5FA8] text-[#1A5FA8] font-semibold">Business Lines</div>
            <div className="pb-2 text-[#6b7280]">Registration Types</div>
          </div>
          <div className="flex items-center justify-between text-[13px] mb-2">
            <div className="font-semibold text-[#13294B]">Top Business Lines</div>
            <div className="text-[#1A5FA8]">View By: Market Value ▾</div>
          </div>
          <table className="w-full text-[12px]">
            <thead className="text-[#6b7280] text-left">
              <tr>
                <th className="py-1 pr-2 font-medium">BUSINESS LINE</th>
                <th className="py-1 pr-2 font-medium text-right">ASSETS ($)</th>
                <th className="py-1 pr-2 font-medium text-right">PCT ASSETS (%)</th>
                <th className="py-1 pr-2 font-medium">2 YEAR TREND</th>
                <th className="py-1 pr-2 font-medium text-right">CHANGE</th>
              </tr>
            </thead>
            <tbody className="text-[#13294B]">
              <tr className="border-t border-[#E3E6EA]">
                <td className="py-1 pr-2">Unknown</td>
                <td className="py-1 pr-2 text-right tabular-nums">135,873,793,094,837</td>
                <td className="py-1 pr-2 text-right">99.9</td>
                <td className="py-1 pr-2 text-[#8FB4D8]">▁▂▂▁▂▃▂▁▂▂▁▁</td>
                <td className="py-1 pr-2 text-right">0.0</td>
              </tr>
              <tr className="border-t border-[#E3E6EA]">
                <td className="py-1 pr-2">Advisor PM</td>
                <td className="py-1 pr-2 text-right tabular-nums">41,219,574,983</td>
                <td className="py-1 pr-2 text-right">0.0</td>
                <td className="py-1 pr-2 text-[#8FB4D8]">▂▃▂▂▃▂▁▂▂▁▂▁</td>
                <td className="py-1 pr-2 text-right text-[#D64545]">-16.2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Net Flows">
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <div className="text-[12px] text-[#6b7280]">Total Net Flows</div>
              <div className="text-[22px] font-semibold text-[#13294B] tabular-nums">
                ${fmt(30_115_313_119)}
              </div>
            </div>
            <div>
              <div className="text-[12px] text-[#6b7280]">Total Assets</div>
              <div className="text-[22px] font-semibold text-[#13294B] tabular-nums">
                ${fmt(136_000_601_954_647)}
              </div>
            </div>
          </div>
          <div className="text-[14px] font-semibold text-[#13294B]">
            Net Flows Trends (last 13 months)
          </div>
          <MiniBarChart />
        </div>
      </Card>
    </div>
  );
}

function MiniLineChart() {
  const pts = [136.02, 136.04, 136.03, 136.03, 136.01, 135.99, 136.02, 136.03, 135.97, 135.99, 136.02, 136.01];
  const min = 135.95;
  const max = 136.05;
  const w = 560;
  const h = 180;
  const step = w / (pts.length - 1);
  const y = (v: number) => h - ((v - min) / (max - min)) * (h - 20) - 10;
  const path = pts.map((v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${y(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[200px] mt-2">
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={0}
          x2={w}
          y1={(h / 4) * i + 5}
          y2={(h / 4) * i + 5}
          stroke="#E3E6EA"
          strokeDasharray="3 3"
        />
      ))}
      <path d={path} stroke="#17447B" strokeWidth={2} fill="none" />
    </svg>
  );
}

function MiniBarChart() {
  const bars = [1, 2, 1.5, 30, 3, 2, 1, 1.5, 1, 2, 1, 1, 1.5];
  const max = 32;
  return (
    <svg viewBox="0 0 560 200" className="w-full h-[200px] mt-2">
      <line x1={0} x2={560} y1={180} y2={180} stroke="#E3E6EA" />
      {bars.map((v, i) => {
        const h = (v / max) * 160;
        const x = i * 42 + 10;
        return (
          <g key={i}>
            <rect x={x} y={180 - h} width={22} height={h} fill={v > 10 ? "#7ec78a" : "#7c6cd4"} />
            <circle cx={x + 11} cy={180 - h} r={3} fill="#4b3fa8" />
          </g>
        );
      })}
      <polyline
        points={bars.map((v, i) => `${i * 42 + 21},${180 - (v / max) * 160}`).join(" ")}
        stroke="#4b3fa8"
        strokeWidth={1.5}
        fill="none"
      />
    </svg>
  );
}

// ---------- Simple placeholder pages ----------

function TitledPage({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="px-6 py-5">
      <h1 className="text-[20px] font-semibold text-[#13294B] mb-4">{title}</h1>
      <Card>
        <div className="p-6 text-[13px] text-[#374151]">{children}</div>
      </Card>
    </div>
  );
}

export function AccountOpeningDashboardPage() {
  return <AccountOpeningDashboardBody />;
}

export function OpenNewAccountPage() {
  return (
    <TitledPage title="Open New Account">
      <div className="grid grid-cols-2 gap-6">
        {[
          "Individual (Schwab)",
          "Joint (Schwab)",
          "Traditional IRA (IWS)",
          "Roth IRA (IWS)",
          "Trust (Schwab)",
          "529 Plan",
        ].map((t) => (
          <button
            key={t}
            className="border border-[#E3E6EA] rounded-sm p-4 text-left hover:border-[#1A5FA8] hover:bg-[#F5F8FC]"
          >
            <div className="font-semibold text-[#13294B]">{t}</div>
            <div className="text-[12px] text-[#6b7280] mt-1">Start a new application</div>
          </button>
        ))}
      </div>
    </TitledPage>
  );
}

export function CrmUserManagementPage() {
  return (
    <TitledPage title="CRM User Management">
      <table className="w-full text-[13px]">
        <thead className="text-[#6b7280] text-left border-b border-[#E3E6EA]">
          <tr>
            <th className="py-2 pr-3 font-medium">User</th>
            <th className="py-2 pr-3 font-medium">Email</th>
            <th className="py-2 pr-3 font-medium">Role</th>
            <th className="py-2 pr-3 font-medium">Last Login</th>
          </tr>
        </thead>
        <tbody className="text-[#13294B]">
          {[
            ["P. Malouf", "pmalouf@advisor360.com", "Advisor", "Today, 8:12 AM"],
            ["K. Condon", "kcondon@advisor360.com", "Advisor", "Yesterday"],
            ["A. Reyes", "areyes@advisor360.com", "Support", "07/18/2026"],
            ["S. Whitfield", "swhitfield@advisor360.com", "Admin", "07/17/2026"],
          ].map((r) => (
            <tr key={r[0]} className="border-b border-[#E3E6EA]">
              {r.map((c, i) => (
                <td key={i} className="py-2 pr-3">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </TitledPage>
  );
}

export function EntitlementsPage() {
  return (
    <TitledPage title="Entitlements">
      <table className="w-full text-[13px]">
        <thead className="text-[#6b7280] text-left border-b border-[#E3E6EA]">
          <tr>
            <th className="py-2 pr-3 font-medium">Entitlement</th>
            <th className="py-2 pr-3 font-medium">Description</th>
            <th className="py-2 pr-3 font-medium">Assigned Users</th>
          </tr>
        </thead>
        <tbody className="text-[#13294B]">
          {[
            ["Trading — Execute", "Place trades on client accounts", 42],
            ["Reports — Export", "Export practice-level reports", 118],
            ["Account Opening — Approve", "Principal approval on new accounts", 6],
            ["Compliance — Review", "Access to compliance queues", 11],
          ].map((r) => (
            <tr key={r[0] as string} className="border-b border-[#E3E6EA]">
              <td className="py-2 pr-3 font-medium">{r[0]}</td>
              <td className="py-2 pr-3">{r[1]}</td>
              <td className="py-2 pr-3">{r[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TitledPage>
  );
}

export function IntegrationsPage() {
  return (
    <TitledPage title="Integrations">
      <div className="grid grid-cols-2 gap-4">
        {[
          ["RightCapital", "Financial planning", "Connected"],
          ["Texting (Twilio)", "Client SMS", "Connected"],
          ["CRM Exchange Sync Log", "CRM sync monitor", "Healthy"],
          ["eMoney", "Financial planning", "Not connected"],
        ].map(([name, desc, status]) => (
          <div key={name} className="border border-[#E3E6EA] rounded-sm p-4 flex items-start justify-between">
            <div>
              <div className="font-semibold text-[#13294B]">{name}</div>
              <div className="text-[12px] text-[#6b7280] mt-1">{desc}</div>
            </div>
            <span
              className={`text-[11px] px-2 py-1 rounded-sm ${
                status === "Not connected"
                  ? "bg-[#FDECEC] text-[#D64545]"
                  : "bg-[#E7F3EA] text-[#2C7A3F]"
              }`}
            >
              {status}
            </span>
          </div>
        ))}
      </div>
    </TitledPage>
  );
}

export function BulkOnboardingPage() {
  const imports = [
    ["Bulk_import_111223.xlsm", "None", "Complete", "10/12/2023", false, false],
    ["Bulk_import_100223.xlsm", "Failed Rows (11)", "989/1000 Complete", "10/02/2023", false, false],
    ["Bulk_import_091823.xlsm", "None", "Cancelled", "09/18/2023", true, false],
    ["Bulk_import_091423.xlsm", "None", "Failed - Try Again", "--", false, true],
  ] as const;

  return (
    <div className="px-6 py-5">
      <div className="bg-white border border-[#E3E6EA] rounded-sm p-6">
        <h2 className="text-[18px] font-semibold text-[#13294B]">Upload Data Collection</h2>
        <p className="text-[13px] text-[#4b5563] mt-3">
          Upload data collection template. The file name must be unique.
        </p>

        <div className="mt-3 border border-dashed border-[#C7CCD3] bg-[#F5F6F8] rounded-sm py-4 text-center max-w-[620px]">
          <div className="text-[13px] text-[#13294B]">
            Drag files here or{" "}
            <button className="text-[#1A5FA8] hover:underline">Browse</button> to upload.
          </div>
          <div className="text-[11px] italic text-[#6b7280] mt-1">
            File type .xls, .xlsx or xlsm. Maximum 1 file. 20 MB max per document
          </div>
        </div>

        <h3 className="text-[16px] font-semibold text-[#13294B] mt-6">Recent Imports</h3>
        <table className="mt-3 w-full max-w-[620px] text-[12px]">
          <thead>
            <tr className="text-[#6b7280] text-left border-b border-[#C7CCD3]">
              <th className="py-1.5 pr-3 font-medium tracking-wide">FILE NAME</th>
              <th className="py-1.5 px-3 font-medium tracking-wide border-l border-[#E3E6EA]">ERRORS</th>
              <th className="py-1.5 px-3 font-medium tracking-wide border-l border-[#E3E6EA]">STATUS ⓘ</th>
              <th className="py-1.5 pl-3 font-medium tracking-wide border-l border-[#E3E6EA]">IMPORT DATE</th>
            </tr>
          </thead>
          <tbody>
            {imports.map(([file, errors, status, date, muted, failed]) => (
              <tr key={file} className="border-b border-[#EDEFF2]">
                <td className={`py-1.5 pr-3 ${muted ? "text-[#9CA3AF]" : "text-[#1A5FA8]"}`}>{file}</td>
                <td className={`py-1.5 px-3 border-l border-[#F0F2F5] ${muted ? "text-[#9CA3AF]" : errors !== "None" ? "text-[#1A5FA8]" : "text-[#13294B]"}`}>
                  {errors}
                </td>
                <td className={`py-1.5 px-3 border-l border-[#F0F2F5] ${failed ? "text-[#D64545]" : muted ? "text-[#9CA3AF]" : "text-[#13294B]"}`}>
                  {status}
                </td>
                <td className={`py-1.5 pl-3 border-l border-[#F0F2F5] ${muted ? "text-[#9CA3AF]" : "text-[#13294B]"}`}>{date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TOP_FORMS: [string, string][] = [
  ["529 Plan/ABLE Plan Addendum", "07/21"],
  ["Account Maintenance Online Request", "03/20"],
  ["Breakpoint Worksheet", "08/24"],
  ["Brokerage Account Application", "08/24"],
  ["Business Reassignment Form", "10/17"],
  ["Cash Management Application", "05/24"],
  ["Cash Management MSA Application", "05/24"],
  ["Change of Broker Dealer Form", "08/22"],
  ["Change of Representative Form", "11/17"],
  ["Check and Security Remittance Form", "03/17"],
  ["Check Request Form (Non-Retirement)", "12/23"],
  ["Client Verification Form", "02/23"],
  ["CRIA Asset Transition Form", "1/24"],
  ["Direct Advisory New Account Form", "01/24"],
  ["EFT Request - Online Request", "03/20"],
  ["Fed Funds Wire Request Form (Non-Retirement)", "05/24"],
  ["IRA Beneficiary and Successor Beneficiary Designation", "08/20"],
  ["IRA Distribution Request Form", "01/23"],
  ["Journal Request Form", "11/24"],
  ["Master Services Agreement", "05/24"],
];

export function FormsPage() {
  return (
    <div className="p-4 bg-[#F0F2F5] min-h-full">
      <div className="bg-[#EDEFF2] border border-[#C7CCD3] rounded-sm p-4">
        <div className="grid grid-cols-2 gap-8 max-w-[900px]">
          <div>
            <div className="text-[13px] font-semibold text-[#B4541F]">Search</div>
            <div className="flex items-center gap-3 text-[12px] text-[#13294B] mt-1">
              <label className="flex items-center gap-1">
                <input type="radio" name="formsrc" defaultChecked /> Schwab
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" name="formsrc" /> Sponsor
              </label>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <input
                className="h-[22px] w-[190px] border border-[#8FA0B4] bg-white px-1 text-[12px]"
                aria-label="Search forms"
              />
              <button className="h-[22px] px-3 text-[12px] bg-[#E8B45A] border border-[#B4894A] text-[#13294B]">
                Search
              </button>
            </div>

            <div className="text-[12px] text-[#13294B] mt-4">OR Select a category:</div>
            <div className="flex items-center gap-2 mt-1">
              <select className="h-[22px] w-[190px] border border-[#8FA0B4] bg-white text-[12px]">
                <option>My Top Forms</option>
                <option>Account Opening</option>
                <option>Account Maintenance</option>
                <option>Transfers</option>
              </select>
              <button className="h-[22px] px-3 text-[12px] bg-[#E8B45A] border border-[#B4894A] text-[#13294B]">
                Show Category
              </button>
            </div>
          </div>

          <div>
            <div className="text-[13px] font-semibold text-[#B4541F]">EasyFill</div>
            <div className="flex items-center gap-3 text-[12px] text-[#13294B] mt-1">
              <span className="w-[100px]">Client/Account:</span>
              <span className="text-[#4b5563]">(None Selected)</span>
              <button className="text-[#1A5FA8] hover:underline">Clear</button>
              <button className="text-[#1A5FA8] hover:underline">Find</button>
            </div>
            <div className="flex items-center gap-3 text-[12px] mt-1">
              <span className="w-[100px]">Advisor:</span>
              <select className="h-[22px] w-[200px] border border-[#8FA0B4] bg-white text-[12px]">
                <option>Select</option>
              </select>
            </div>
            <p className="text-[12px] text-[#4b5563] mt-3">
              Please select an advisor before launching the DocuSign Dashboard.
            </p>
            <div className="mt-3 w-[150px] border border-[#8FA0B4] bg-[#DDE3EA] text-center py-2">
              <div className="text-[13px] font-semibold italic text-[#13294B]">DocuSign</div>
              <div className="text-[11px] text-[#13294B]">Dashboard</div>
              <div className="mt-1 mx-3 text-[11px] bg-white border border-[#8FA0B4]">Launch</div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-[#DDE3EA] border border-[#C7CCD3] px-3 py-1.5 text-[12px] font-semibold text-[#13294B]">
          ⊟ My Top Forms
        </div>
        <ul className="mt-2 pl-6 space-y-1.5">
          {TOP_FORMS.map(([name, date]) => (
            <li key={name} className="text-[12px]">
              <button className="text-[#1A5FA8] hover:underline">{name}</button>
              <span className="mx-1 text-[#B4541F]">▣ ▤</span>
              <span className="text-[#13294B]">{date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export { CaseManagerPage } from "./CaseManagerPage";
