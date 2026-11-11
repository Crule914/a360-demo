import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  Mail,
  MapPin,
  Minus,
  MoreVertical,
  Pencil,
  Plus,
  Star,
  GripVertical,
  Paperclip,
  Pin,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Filter,
  Settings,
  LayoutList,
  LayoutGrid,
  CalendarCheck,
  StickyNote,
  ListChecks,
  Phone,
  ArrowDown,
  Sparkles,
  Printer,
  Calendar as CalendarIcon,
  Mic,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import shortcutsIcon from "@/assets/shortcuts-icon.png.asset.json";
import couplePhoto from "@/assets/sweets-couple.jpg";
import { AppShell } from "@/components/AppShell";
import { CanEdit } from "@/components/CanEdit";
import { PageHeader } from "@/components/PageHeader";
import { useFilteredHouseholdTabs, useContactsMenuAllowed, useCrmReadOnly } from "@/lib/navVisibility";
import { sweetsMembers } from "@/data/sweetsOverview";
import { pushRecentHousehold } from "@/lib/recentHouseholds";
import { useCurrentUser } from "@/lib/currentUser";

export const Route = createFileRoute("/household/sweets/contacts/")({
  component: ContactsPage,
});

const HOUSEHOLD_NAME = "THE SWEETS FAMILY";

const TABS = [
  { label: "Overview", caret: false, to: "/household/sweets" },
  { label: "Trading/Holdings", caret: true, menuItems: [{ label: "Trading/Holdings", to: "/household/sweets/trading-holdings" }, { label: "Account Activity", to: "/household/sweets/account-activity" }, { label: "PIP/SWP/BEP", to: "/household/sweets/pip-swp-bep" }, { label: "Account Profile", to: "/household/sweets/account-profile" }] },
  { label: "Insurance", caret: false },
  { label: "Reports", caret: false, to: "/household/sweets/reports" },
  { label: "Documents", caret: true, menuItems: [{ label: "Documents", to: "/household/sweets/documents" }, { label: "Statements", to: "/household/sweets/statements" }, { label: "Tax Documents", to: "/household/sweets/tax-documents" }, { label: "Customer Correspondence", to: "/household/sweets/customer-correspondence" }, { label: "Confirms", to: "/household/sweets/confirms" }] },
  { label: "Contacts", caret: true, to: "/household/sweets/contacts" },
  { label: "Planning", caret: true },
  { label: "Administration", caret: true },
];

function ContactsPage() {
  useEffect(() => {
    pushRecentHousehold({ id: "sweets", name: HOUSEHOLD_NAME });
  }, []);

  const user = useCurrentUser();
  const contactsAllowed = useContactsMenuAllowed();
  const showSection = (label: string) =>
    !contactsAllowed || contactsAllowed.includes(label);

  return (
    <AppShell
      topBar={
        <PageHeader
          eyebrow="CLIENTS"
          title={HOUSEHOLD_NAME}
          titleExtra={
            <>
              <button className="text-white/90 hover:text-white" aria-label="Email">
                <Mail className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <div className="flex items-center gap-1.5">
                {sweetsMembers.map((m) => (
                  <div
                    key={m.initials}
                    title={m.name}
                    className="w-8 h-8 rounded-full border border-white/70 flex items-center justify-center text-[11px] font-semibold tracking-wide"
                  >
                    {m.initials}
                  </div>
                ))}
              </div>
            </>
          }
          tabs={useFilteredHouseholdTabs(TABS)}
          rightActions={
            <>
              <AppLauncherDropdown />
              <button aria-label="Open" className="hover:text-white">
                <ExternalLink className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </>
          }
        />
      }
    >
      <SubHeader />
      <div className="px-6 pb-8 space-y-4">
        <HouseholdSummary assignedTo={user.fullName} />
        {showSection("People") && <PeopleSection />}
        {showSection("Connections") && <ConnectionsSection />}
        {showSection("Activities") && <ActivitiesSection ownerName={user.fullName} />}
        <p className="text-[12px] text-[#6b7280] pt-2">
          For financial professional use only. Not for use with the public.
        </p>
      </div>
    </AppShell>
  );
}

function AppLauncherDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const readOnly = useCrmReadOnly();
  if (readOnly) return null;
  return (
    <div ref={containerRef} className="relative">
      <button
        aria-label="App launcher"
        onClick={() => setOpen((v) => !v)}
        className="hover:text-white"
      >
        <img src={shortcutsIcon.url} alt="" className="w-5 h-5 object-contain" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[270px] bg-white rounded-md shadow-lg z-50 py-2">
          <div className="px-4 pt-2">
            <div className="text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide mb-2">
              Add Activity
            </div>
            {["Add Task", "Add Phone Call", "Add Appointment", "Add Note"].map(
              (l) => (
                <a key={l} className="block text-[14px] text-[#1A5FA8] py-1.5 hover:underline cursor-pointer">
                  {l}
                </a>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SubHeader() {
  return (
    <div className="bg-[#F0F2F5] border-b border-[#E3E6EA] px-6 py-3 flex items-center">
      <h2 className="text-[18px] text-[#13294B]">Overview</h2>
      <div className="ml-auto flex items-center gap-3 text-[14px]">
        <CanEdit>
          <a className="text-[#1A5FA8] hover:underline cursor-pointer">Create Mail Merge</a>
          <span className="text-[#D1D5DB]">|</span>
        </CanEdit>
        <a className="text-[#1A5FA8] hover:underline cursor-pointer">Summary Report</a>
        <button className="text-[#6b7280] hover:text-[#13294B] ml-1" aria-label="More">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function HouseholdSummary({ assignedTo }: { assignedTo: string }) {
  return (
    <section>
      <div className="flex items-start gap-6 mb-3">
        <div className="flex items-center gap-4">
          <h3 className="text-[20px] font-semibold text-[#13294B]">
            Rick and Karen Sweets
          </h3>
          <span className="text-[#D1D5DB]">|</span>
          <a className="text-[14px] text-[#1A5FA8] hover:underline cursor-pointer">More Details</a>
          <CanEdit>
            <span className="text-[#D1D5DB]">|</span>
            <a className="text-[14px] text-[#1A5FA8] hover:underline cursor-pointer">Edit</a>
          </CanEdit>
        </div>
        <div className="flex-1 min-w-0 bg-[#FFFBEA] border-l-4 border-[#F5C518] rounded-sm px-4 py-3 flex items-center gap-3">
          <p className="flex-1 text-[14px] text-[#13294B]">
            Karen's mom is sick, and she's been the primary caretaker.
          </p>
          <CanEdit>
            <button className="text-[#6b7280] hover:text-[#13294B]" aria-label="Edit note">
              <Pencil className="w-4 h-4" />
            </button>
          </CanEdit>
        </div>
      </div>

      <div className="bg-white border border-[#E3E6EA]">
        <div className="grid grid-cols-12 gap-6 p-5">
          <div className="col-span-12 md:col-span-2 flex justify-start">
            <img
              src={couplePhoto}
              alt="Sweets family"
              width={112}
              height={112}
              loading="lazy"
              className="w-28 h-28 rounded-full object-cover border border-[#E3E6EA]"
            />
          </div>

          <div className="col-span-12 md:col-span-3">
            <SectionTitle>Household Details</SectionTitle>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              <Field label="Type" value="Client" />
              <Field label="Category" value="--" />
              <Field label="Assigned To" value={assignedTo} />
              <Field label="Advisor ID" value="620959" />
              <Field label="Client Since" value="04/01/2020 (6 years)" />
              <Field label="Source" value="Referral" />
              <Field label="Accountant" value={<span className="italic text-[#9097A2]">Accountant</span>} />
            </div>
          </div>

          <div className="col-span-12 md:col-span-3 border-l border-[#E3E6EA] pl-6">
            <SectionTitle>Contact Info</SectionTitle>
            <div className="space-y-3">
              <div>
                <div className="text-[13px] text-[#6b7280] flex items-center gap-1">
                  <a className="text-[#1A5FA8] hover:underline cursor-pointer">Phone - Rick's Home</a>
                  <Star className="w-3.5 h-3.5 text-[#1D9E75] fill-[#1D9E75]" />
                </div>
                <div className="text-[14px] text-[#13294B]">(382) 444-8054</div>
              </div>
              <div>
                <div className="text-[13px] text-[#6b7280]">Address - Home</div>
                <div className="text-[14px] text-[#13294B]">321 SE Bay Oak Ave</div>
                <div className="text-[14px] text-[#13294B]">Pensacola, NH 098765</div>
                <a className="text-[13px] text-[#1A5FA8] hover:underline cursor-pointer inline-flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" /> Google Maps
                </a>
              </div>
              <div>
                <div className="text-[13px] text-[#6b7280]">E-Mail - Rick's Personal</div>
                <a className="text-[14px] text-[#1A5FA8] hover:underline cursor-pointer">rsweets@a360fakedomain.com</a>
              </div>
              <div>
                <div className="text-[13px] text-[#6b7280]">Salutation</div>
                <div className="text-[14px] text-[#13294B]">Dear Rick and Karen</div>
                <div className="text-[14px] text-[#13294B]">--</div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 border-l border-[#E3E6EA] pl-6">
            <SectionTitle>Custom Fields</SectionTitle>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <Field label="Risk Tolerance" value="High" />
              <Field label="Investment Experience" value="Limited" />
              <Field label="Investments Interests" value="Retirement" />
              <Field label="Hobbies" value="Golf, Horse-riding, Competitive Scrabble" />
              <Field label="Market Sensitive?" value="No" />
              <Field label="Young Children?" value="Johnnie and Suzie" />
              <Field label="Favorite Vacation Spot" value="Aruba" />
              <Field label="Planning Client?" value="Yes" />
              <Field label="Managed Accounts?" value="Yes" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-[16px] font-semibold text-[#13294B] mb-3">{children}</h4>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[13px] text-[#6b7280]">{label}</div>
      <div className="text-[14px] text-[#13294B]">{value}</div>
    </div>
  );
}

function CollapsibleSection({
  title,
  count,
  rightActions,
  children,
}: {
  title: string;
  count?: string;
  rightActions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <section className="bg-white border border-[#E3E6EA]">
      <header className="flex items-center bg-[#F0F2F5] px-4 py-2 border-b border-[#E3E6EA]">
        <button
          className="text-[#1A5FA8] mr-2"
          aria-label="Toggle"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="inline-flex w-4 h-4 border border-[#1A5FA8] rounded-full items-center justify-center">
            <Minus className="w-3 h-3" />
          </span>
        </button>
        <h3 className="text-[16px] font-semibold text-[#13294B]">{title}</h3>
        <span className="mx-3 text-[#D1D5DB]">|</span>
        <a className="text-[14px] text-[#1A5FA8] hover:underline cursor-pointer">View All</a>
        <div className="ml-auto flex items-center gap-3">{rightActions}</div>
      </header>
      {open && (
        <>
          {count && (
            <div className="px-4 py-2 text-[13px] text-[#13294B] border-b border-[#F0F2F5]">
              {count}
            </div>
          )}
          {children}
        </>
      )}
    </section>
  );
}

function ViewToggle() {
  return (
    <div className="flex items-center border border-[#D1D5DB] rounded-sm">
      <button className="px-1.5 py-1 bg-[#1A5FA8] text-white" aria-label="List view">
        <LayoutList className="w-4 h-4" />
      </button>
      <button className="px-1.5 py-1 text-[#6b7280]" aria-label="Grid view">
        <LayoutGrid className="w-4 h-4" />
      </button>
    </div>
  );
}

type Person = {
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

const PEOPLE: Person[] = [
  {
    name: "Richard Sweets",
    nickname: "Rick",
    relationship: "Father",
    dob: "08/19/1976",
    age: 49,
    ssn: "***-**-9511",
    email: "rsweets@a360fakedomain.com",
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
    email: "ksweets@a360fakedomain.com",
    emailLabel: "Personal",
    emailPrimary: true,
    home: "(382) 444-8054",
    mobile: "(382) 444-6347",
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
    email: "bsweets@a360fakedomain.com",
    emailLabel: "Personal",
    home: "(781) 724-4715",
  },
];

function PeopleSection() {
  return (
    <CollapsibleSection
      title="People"
      count={`${PEOPLE.length} people`}
      rightActions={
        <>
          <CanEdit>
            <a className="text-[14px] text-[#1A5FA8] hover:underline cursor-pointer inline-flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Person
            </a>
            <span className="text-[#D1D5DB]">|</span>
          </CanEdit>
          <ViewToggle />
        </>
      }
    >
      <div className="px-4 py-2 flex justify-end">
        <a className="text-[13px] text-[#1A5FA8] hover:underline cursor-pointer inline-flex items-center gap-1">
          <Settings className="w-3.5 h-3.5" /> Manage Columns
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-[11px] uppercase text-[#6b7280] border-b border-[#E3E6EA]">
              <th className="w-8"></th>
              <th className="w-8"></th>
              <th className="text-left font-medium py-2 px-3">Name</th>
              <th className="text-left font-medium py-2 px-3">Relationship</th>
              <th className="text-left font-medium py-2 px-3">DOB (Age)</th>
              <th className="text-left font-medium py-2 px-3">SSN</th>
              <th className="text-left font-medium py-2 px-3">Email</th>
              <th className="text-left font-medium py-2 px-3">Home Phone</th>
              <th className="text-left font-medium py-2 px-3">Mobile Phone</th>
              <th className="text-left font-medium py-2 px-3">Work Phone</th>
            </tr>
          </thead>
          <tbody>
            {PEOPLE.map((p) => (
              <tr key={p.name} className="border-b border-[#F0F2F5] align-top">
                <td className="px-2 py-3 text-[#B5BAC2]">
                  <GripVertical className="w-3.5 h-3.5 cursor-grab" />
                </td>
                <td className="px-1 py-3 text-[#6b7280]">
                  <MoreVertical className="w-4 h-4" />
                </td>
                <td className="px-3 py-3">
                  <a className="text-[#1A5FA8] hover:underline cursor-pointer">{p.name}</a>
                  {p.nickname && (
                    <span className="text-[#13294B] ml-1">({p.nickname})</span>
                  )}
                </td>
                <td className="px-3 py-3 text-[#13294B]">{p.relationship}</td>
                <td className="px-3 py-3 text-[#13294B]">
                  {p.dob}{p.age !== "" && p.dob !== "—" ? ` (${p.age})` : ""}
                </td>
                <td className="px-3 py-3 text-[#13294B]">{p.ssn}</td>
                <td className="px-3 py-3">
                  {p.email ? (
                    <>
                      <a className="text-[#1A5FA8] hover:underline cursor-pointer block">{p.email}</a>
                      <div className="text-[12px] text-[#6b7280] flex items-center gap-1">
                        ({p.emailLabel})
                        {p.emailPrimary && (
                          <Star className="w-3 h-3 text-[#1D9E75] fill-[#1D9E75]" />
                        )}
                      </div>
                    </>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-3 text-[#13294B]">{p.home ?? "—"}</td>
                <td className="px-3 py-3 text-[#13294B]">{p.mobile ?? "—"}</td>
                <td className="px-3 py-3 text-[#13294B]">{p.work ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CollapsibleSection>
  );
}

type Connection = {
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

const CONNECTIONS: Connection[] = [
  {
    name: "CRAWFORD, ANDREA",
    role: "CPA",
    connectedTo: "THE SWEETS FAMILY",
    connectedRel: "CPA Client",
    email: "acrawford@a360fakedomain.com",
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
    email: "njones@a360fakedomain.com",
    emailLabel: "Personal",
    phone: "(978) 256-4567",
    description: "Power of attorney for Rick.",
  },
  {
    name: "JONES, ED + CARRIE",
    role: "Niece (Karen)",
    connectedTo: "Karen Sweets (Karen)",
    connectedRel: "Aunt",
    email: "ejones@a360fakedomain.com",
    emailLabel: "Personal",
    phone: "(376) 450-2970",
    description: "Karen's niece and her husband.",
  },
];

function ConnectionsSection() {
  return (
    <CollapsibleSection
      title="Connections"
      count={`${CONNECTIONS.length} connections`}
      rightActions={
        <>
          <CanEdit>
            <a className="text-[14px] text-[#1A5FA8] hover:underline cursor-pointer inline-flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Connection
            </a>
            <span className="text-[#D1D5DB]">|</span>
          </CanEdit>
          <ViewToggle />
        </>
      }
    >
      <div className="px-4 py-2 flex justify-end">
        <a className="text-[13px] text-[#1A5FA8] hover:underline cursor-pointer inline-flex items-center gap-1">
          <Settings className="w-3.5 h-3.5" /> Manage Columns
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-[11px] uppercase text-[#6b7280] border-b border-[#E3E6EA]">
              <th className="w-8"></th>
              <th className="text-left font-medium py-2 px-3">Name</th>
              <th className="text-left font-medium py-2 px-3">Connected To</th>
              <th className="text-left font-medium py-2 px-3">Email</th>
              <th className="text-left font-medium py-2 px-3">Phone</th>
              <th className="text-left font-medium py-2 px-3">Description</th>
            </tr>
          </thead>
          <tbody>
            {CONNECTIONS.map((c) => (
              <tr key={c.name} className="border-b border-[#F0F2F5] align-top">
                <td className="px-1 py-3 text-[#6b7280]">
                  <MoreVertical className="w-4 h-4" />
                </td>
                <td className="px-3 py-3">
                  <a className="text-[#1A5FA8] hover:underline cursor-pointer">{c.name}</a>
                  <span className="text-[#13294B] ml-1">({c.role})</span>
                </td>
                <td className="px-3 py-3 text-[#13294B]">
                  {c.connectedTo}
                  <span className="text-[#6b7280] ml-1">({c.connectedRel})</span>
                </td>
                <td className="px-3 py-3">
                  <a className="text-[#1A5FA8] hover:underline cursor-pointer block">{c.email}</a>
                  <div className="text-[12px] text-[#6b7280] flex items-center gap-1">
                    ({c.emailLabel})
                    {c.emailPrimary && (
                      <Star className="w-3 h-3 text-[#1D9E75] fill-[#1D9E75]" />
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 text-[#13294B]">{c.phone}</td>
                <td className="px-3 py-3 text-[#13294B] truncate max-w-[260px]">
                  {c.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CollapsibleSection>
  );
}

type Activity = {
  type: "Appointment" | "Note" | "Task" | "Phone Call";
  subject: string;
  date: string;
  complete: boolean;
  owner: string;
  attachment?: boolean;
  transcript?: boolean;
};

function ActivitiesSection({ ownerName }: { ownerName: string }) {
  const me = ownerName;
  const [noteOpen, setNoteOpen] = useState(false);
  const [tasksOpen, setTasksOpen] = useState(false);
  const activities: Activity[] = [
    { type: "Note", subject: "AI Generated Note: Annual Review with The Sweets Family", date: "06/24/2026", complete: true, owner: me, attachment: true, transcript: true },
  ];
  const transcriptActivities = activities.filter((a) => a.transcript);

  return (
    <>
      <CollapsibleSection
        title="Activities"
        rightActions={
          <CanEdit>
            <a className="text-[14px] text-[#1A5FA8] hover:underline cursor-pointer inline-flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Activity
            </a>
          </CanEdit>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-x divide-[#E3E6EA]">
          <ReviewPanel
            title="Reviews"
            items={[
              { label: "Last Review", value: "11/25/2025" },
              { label: "Next Projected Review", value: "06/25/2026", warning: true },
              { label: "Next Scheduled Review", value: "--" },
            ]}
          />
          <ReviewPanel
            title="Touch Points"
            items={[
              { label: "Last Touch Point", value: "03/16/2026" },
              { label: "Next Projected Touch Point", value: "06/16/2026", warning: true },
              { label: "Next Scheduled Touch Point", value: "06/29/2026" },
            ]}
          />
        </div>
      </CollapsibleSection>

      <section className="bg-white border border-[#E3E6EA] mt-4">
        <header className="flex items-center bg-[#F0F2F5] px-4 py-2 border-b border-[#E3E6EA]">
          <h3 className="text-[16px] font-semibold text-[#13294B]">Activities at a Glance</h3>
          <div className="ml-auto flex items-center gap-3">
            <a className="text-[13px] text-[#1A5FA8] hover:underline cursor-pointer inline-flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter by Tags
            </a>
            <span className="text-[#D1D5DB]">|</span>
            <a className="text-[13px] text-[#1A5FA8] hover:underline cursor-pointer inline-flex items-center gap-1">
              <Settings className="w-3.5 h-3.5" /> Manage Columns
            </a>
          </div>
        </header>
        <div className="px-4 py-2 text-[13px] text-[#13294B] border-b border-[#F0F2F5]">
          {transcriptActivities.length} activities
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-[11px] uppercase text-[#6b7280] border-b border-[#E3E6EA]">
                <th className="w-8"></th>
                <th className="w-8"></th>
                <th className="w-8"></th>
                <th className="w-8"></th>
                <th className="text-left font-medium py-2 px-3">
                  <span className="inline-flex items-center gap-1">Activity <Filter className="w-3 h-3" /></span>
                </th>
                <th className="text-left font-medium py-2 px-3">Subject</th>
                <th className="text-left font-medium py-2 px-3">
                  <span className="inline-flex items-center gap-1">Regarding <Filter className="w-3 h-3" /></span>
                </th>
                <th className="text-left font-medium py-2 px-3">
                  <span className="inline-flex items-center gap-1">Date <ArrowDown className="w-3 h-3" /> <Filter className="w-3 h-3" /></span>
                </th>
                <th className="text-left font-medium py-2 px-3">
                  <span className="inline-flex items-center gap-1">Status <Filter className="w-3 h-3" /></span>
                </th>
                <th className="text-left font-medium py-2 px-3">
                  <span className="inline-flex items-center gap-1">Owner <Filter className="w-3 h-3" /></span>
                </th>
              </tr>
            </thead>
            <tbody>
              {transcriptActivities.map((a, i) => (
                <tr key={i} className="border-b border-[#F0F2F5]">
                  <td className="px-2 py-2 text-[#1A5FA8]">
                    <Plus className="w-4 h-4" />
                  </td>
                  <td className="px-1 py-2">
                    <input type="checkbox" className="accent-[#1A5FA8]" />
                  </td>
                  <td className="px-1 py-2 text-[#B5BAC2]">
                    <Pin className="w-3.5 h-3.5" />
                  </td>
                  <td className="px-1 py-2 text-[#1A5FA8]">
                    <ActivityIcon type={a.type} />
                  </td>
                  <td className="px-3 py-2 text-[#13294B]">{a.type}</td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-1">
                      <a
                        className="text-[#1A5FA8] hover:underline cursor-pointer"
                        onClick={() => a.type === "Note" && setNoteOpen(true)}
                      >
                        {a.subject}
                      </a>
                      {a.attachment && <Paperclip className="w-3.5 h-3.5 text-[#6b7280]" />}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <a className="text-[#1A5FA8] hover:underline cursor-pointer">{HOUSEHOLD_NAME}</a>
                  </td>
                  <td className="px-3 py-2 text-[#13294B]">{a.date}</td>
                  <td className="px-3 py-2">
                    {a.complete ? (
                      <CheckCircle2 className="w-4 h-4 text-[#1D9E75] fill-[#1D9E75]/15" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#9097A2]" />
                    )}
                  </td>
                  <td className="px-3 py-2 text-[#13294B]">{a.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <NoteModal
        open={noteOpen}
        onOpenChange={setNoteOpen}
        ownerName={ownerName}
        onOpenSuggestedTasks={() => setTasksOpen(true)}
      />
      <SuggestedTasksModal
        open={tasksOpen}
        onOpenChange={setTasksOpen}
        ownerName={ownerName}
      />
    </>
  );
}

function ActivityIcon({ type }: { type: Activity["type"] }) {
  if (type === "Appointment") return <CalendarCheck className="w-4 h-4" />;
  if (type === "Note") return <StickyNote className="w-4 h-4" />;
  if (type === "Phone Call") return <Phone className="w-4 h-4" />;
  return <ListChecks className="w-4 h-4" />;
}

function ReviewPanel({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: string; warning?: boolean }[];
}) {
  return (
    <div className="p-4">
      <div className="flex items-start">
        <h4 className="text-[16px] font-semibold text-[#13294B] mr-6">{title}</h4>
        <div className="flex-1 grid grid-cols-3 gap-3">
          {items.map((it) => (
            <div key={it.label}>
              <div className="text-[12px] text-[#6b7280]">{it.label}</div>
              <div className="text-[14px] text-[#13294B] inline-flex items-center gap-1">
                {it.value}
                {it.warning && (
                  <AlertTriangle className="w-3.5 h-3.5 text-[#E0A800] fill-[#FFF3B0]" />
                )}
              </div>
            </div>
          ))}
        </div>
        <CanEdit>
          <button className="text-[#6b7280] hover:text-[#13294B] ml-2" aria-label="Edit">
            <Pencil className="w-4 h-4" />
          </button>
        </CanEdit>
      </div>
    </div>
  );
}

// ============================================================
// Note Modal — full-screen-ish modal mirroring the CRM Note UI
// ============================================================
function NoteModal({
  open,
  onOpenChange,
  ownerName,
  onOpenSuggestedTasks,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  ownerName: string;
  onOpenSuggestedTasks: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[min(1100px,95vw)] h-[min(900px,92vh)] bg-white shadow-xl rounded-md flex flex-col overflow-hidden focus:outline-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3E6EA] bg-white">
            <h2 className="text-[22px] font-semibold text-[#13294B]">Note</h2>
            <div className="flex items-center gap-5 text-[14px]">
              <CanEdit>
                <button
                  onClick={onOpenSuggestedTasks}
                  className="inline-flex items-center gap-1.5 text-[#1A5FA8] hover:underline"
                >
                  <Sparkles className="w-4 h-4" /> Review Suggested Tasks
                </button>
                <span className="text-[#D1D5DB]">|</span>
                <button className="inline-flex items-center gap-1.5 text-[#1A5FA8] hover:underline">
                  <Plus className="w-4 h-4" /> Add Follow Up Activity
                </button>
                <span className="text-[#D1D5DB]">|</span>
                <button className="inline-flex items-center gap-1.5 text-[#1A5FA8] hover:underline">
                  <Pin className="w-4 h-4" /> Unpin
                </button>
                <span className="text-[#D1D5DB]">|</span>
              </CanEdit>
              <button className="text-[#6b7280] hover:text-[#13294B]" aria-label="Print">
                <Printer className="w-4 h-4" />
              </button>
              <DialogPrimitive.Close
                className="ml-2 text-[#6b7280] hover:text-[#13294B]"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </DialogPrimitive.Close>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4 bg-white">
            {/* Top fields */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-7">
                <label className="text-[12px] text-[#6b7280]">Subject*</label>
                <input
                  type="text"
                  defaultValue="AI Generated Note: Annual Review with The Sweets Family"
                  className="mt-1 w-full border border-[#1A5FA8] rounded px-3 py-2 text-[14px] text-[#13294B]"
                />
              </div>
              <div className="col-span-3">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] text-[#6b7280]">Regarding</label>
                  <a className="text-[12px] text-[#1A5FA8] hover:underline cursor-pointer">
                    View Household
                  </a>
                </div>
                <input
                  type="text"
                  defaultValue="THE SWEETS FAMILY"
                  className="mt-1 w-full border border-[#D1D5DB] rounded px-3 py-2 text-[14px] text-[#13294B]"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[12px] text-[#6b7280]">Date*</label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    defaultValue="06/24/2026"
                    className="w-full border border-[#D1D5DB] rounded px-3 py-2 pr-8 text-[14px] text-[#13294B]"
                  />
                  <CalendarIcon className="w-4 h-4 text-[#1A5FA8] absolute right-2 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Owner */}
            <div className="grid grid-cols-12 gap-4 mt-4">
              <div className="col-span-5">
                <label className="text-[12px] text-[#6b7280]">Owner</label>
                <div className="mt-1 relative">
                  <select
                    defaultValue={ownerName}
                    className="w-full appearance-none border border-[#D1D5DB] rounded px-3 py-2 pr-8 text-[14px] text-[#13294B] bg-white"
                  >
                    <option>{ownerName}</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#6b7280] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div className="col-span-7 flex items-end">
                <label className="inline-flex items-center gap-2 text-[14px] text-[#13294B]">
                  <input type="checkbox" className="accent-[#1A5FA8] w-4 h-4" />
                  Only Owner Can View/Edit
                </label>
              </div>
            </div>

            {/* Details */}
            <div className="mt-4">
              <label className="text-[12px] text-[#6b7280]">Details</label>
              <div className="mt-1 border border-[#D1D5DB] rounded">
                {/* Toolbar */}
                <div className="flex items-center gap-4 px-3 py-2 border-b border-[#E3E6EA] text-[#6b7280] text-[14px]">
                  <button className="hover:text-[#13294B]">↶</button>
                  <div className="inline-flex items-center gap-1 border border-[#E3E6EA] rounded px-2 py-0.5">
                    12pt <ChevronDown className="w-3 h-3" />
                  </div>
                  <button className="font-bold hover:text-[#13294B]">B</button>
                  <button className="italic hover:text-[#13294B]">I</button>
                  <button className="underline hover:text-[#13294B]">U</button>
                  <span className="text-[#E3E6EA]">|</span>
                  <button className="hover:text-[#13294B]">•≡</button>
                  <button className="hover:text-[#13294B]">1≡</button>
                  <span className="text-[#E3E6EA]">|</span>
                  <button className="hover:text-[#13294B]">⇤</button>
                  <button className="hover:text-[#13294B]">⇥</button>
                  <span className="text-[#E3E6EA]">|</span>
                  <button className="hover:text-[#13294B]">🔗</button>
                  <button className="hover:text-[#13294B] text-[13px]">Insert Date</button>
                  <Mic className="w-4 h-4 ml-auto" />
                </div>

                {/* Note content */}
                <div className="px-4 py-4 text-[14px] text-[#13294B] leading-relaxed space-y-4 max-h-[420px] overflow-y-auto">
                  <p className="italic text-[#6b7280]">
                    Generated by Parrot AI. Be sure to check for accuracy.
                  </p>
                  <div>
                    <div><strong>Organizer:</strong> {ownerName}</div>
                    <div><strong>Attendees:</strong> Rick and Karen Sweets &lt;rickandkarensweets@gmail.com&gt;</div>
                    <div><strong>Subject:</strong> Annual Review [CRM: SWEETS, RICK &amp; KAREN]</div>
                    <div><strong>When:</strong> Wednesday, June 24, 2026 5:30 PM-06:00 PM (UTC-05:00) Eastern Time (New York)</div>
                    <div><strong>Where:</strong> Microsoft Teams Meeting</div>
                  </div>

                  <div>
                    <h3 className="text-[20px] font-bold text-[#13294B] mb-2">Summary</h3>
                    <p>
                      The client indicated they want to <strong>open a new Individual brokerage account</strong> — this
                      is the primary action item out of today's conversation. We also discussed opening a new 529
                      account for the Sweets' grandchild, revisited portfolio performance, a third-party asset
                      trading arrangement, and walked through consulting agreement options and fees.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-[20px] font-bold text-[#13294B] mb-2">Topics Discussed</h3>
                    <h4 className="font-bold mt-3 mb-1">New Account Request</h4>
                    <ul className="list-disc ml-6 space-y-1">
                      <li>Client wants to open a new <strong>Individual brokerage account</strong></li>
                      <li>Confirmed account owner, funding source, and initial deposit amount to be captured at open</li>
                      <li>Cost-basis method and dividend election (reinvest vs. cash) to be set on the new account</li>
                    </ul>
                    <h4 className="font-bold mt-4 mb-1">Portfolio Performance &amp; Asset Allocation</h4>
                    <ul className="list-disc ml-6 space-y-1">
                      <li>Year-to-date return: 8.2% vs. benchmark 7.8%</li>
                      <li>International equity exposure slightly underweight; discussed rebalancing options</li>
                      <li>Bond ladder performing as expected with upcoming maturities in Q1 2026</li>
                    </ul>
                    <h4 className="font-bold mt-4 mb-1">Retirement Planning Updates</h4>
                    <ul className="list-disc ml-6 space-y-1">
                      <li>Rick's 401(k) contribution increased to maximize employer match after promotion</li>
                      <li>Reviewed Roth conversion strategy for 2026 tax year</li>
                      <li>Projected retirement timeline: 2032 (Rick age 65, Karen age 63)</li>
                      <li>Current trajectory suggests 87% probability of meeting retirement income goal of $180,000/year</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-[20px] font-bold text-[#13294B] mb-2">Follow-up Tasks</h3>
                    <ol className="list-decimal ml-6 space-y-1">
                      <li>[Financial Advisor]: Open new Individual brokerage account (top recommended task).</li>
                      <li>[Financial Advisor]: Open new 529 account for grandchild.</li>
                      <li>[Financial Advisor]: Discuss the possibility of a third party handling asset trading.</li>
                      <li>[Financial Advisor]: Provide details on consulting agreement options and fees.</li>
                    </ol>
                  </div>

                </div>
              </div>
            </div>

            {/* Uploader */}
            <CanEdit>
              <div className="mt-4 border border-dashed border-[#D1D5DB] rounded py-4 text-center text-[14px] text-[#13294B]">
                Drag files here or <a className="text-[#1A5FA8] hover:underline cursor-pointer">Browse</a> to upload.
                <div className="text-[12px] text-[#6b7280] mt-1">
                  Maximum 15 files. 30 MB max upload size. 25 MB max per document.
                </div>
              </div>
            </CanEdit>
            <div className="mt-2 text-[14px]">
              <a className="text-[#1A5FA8] hover:underline cursor-pointer inline-flex items-center gap-1">
                <Paperclip className="w-3.5 h-3.5" />
                Parrot AI Transcript - Q1 Touch Point [CRM: SWEETS, RICK &amp; KAREN].txt
              </a>
              <span className="text-[#6b7280] ml-2">(827 B)</span>
            </div>

            {/* Tags */}
            <div className="mt-4">
              <div className="text-[12px] text-[#6b7280]">Tags</div>
              <CanEdit>
                <a className="mt-1 inline-flex items-center gap-1 text-[#1A5FA8] hover:underline cursor-pointer text-[14px]">
                  <Plus className="w-4 h-4" /> Add Tag
                </a>
              </CanEdit>
            </div>

            <div className="mt-4 text-[12px] italic text-[#6b7280]">
              Created on March 16, 2026 at 3:21 PM by Parrot AI; Last edited on March 17, 2026 at 2:16 PM by Administrator
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center px-6 py-3 border-t border-[#E3E6EA] bg-[#F0F2F5]">
            <CanEdit>
              <button className="text-[14px] text-[#1A5FA8] hover:underline">Delete Note</button>
            </CanEdit>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => onOpenChange(false)}
                className="px-4 py-1.5 border border-[#1A5FA8] text-[#1A5FA8] rounded text-[14px] hover:bg-[#1A5FA8]/5"
              >
                Close
              </button>
              <CanEdit>
                <button className="px-4 py-1.5 border border-[#1A5FA8] text-[#1A5FA8] rounded text-[14px] hover:bg-[#1A5FA8]/5">
                  Save
                </button>
                <button className="px-4 py-1.5 border border-[#1A5FA8] text-[#1A5FA8] rounded text-[14px] hover:bg-[#1A5FA8]/5">
                  Save &amp; Close
                </button>
              </CanEdit>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

// ============================================================
// Suggested Tasks Modal
// ============================================================
function SuggestedTasksModal({
  open,
  onOpenChange,
  ownerName,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  ownerName: string;
}) {
  const tasks = [
    { title: "Open New Account — Individual Brokerage" },
    { title: "Open New 529 Account for Grandchild" },
    { title: "Discuss Third Party Asset Trading" },
    { title: "Provide Consulting Agreement Options and Fees" },
  ];

  const [selected, setSelected] = useState<boolean[]>(tasks.map(() => true));
  const selectedCount = selected.filter(Boolean).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] p-0 gap-0 bg-white">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3E6EA]">
          <h2 className="text-[20px] font-semibold text-[#13294B]">
            Suggested Tasks from Note ({tasks.length})
          </h2>
        </div>
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          <p className="text-[14px] text-[#13294B]">
            Tasks suggested by AI can be reviewed or edited. Only selected tasks will be created.
          </p>
          <p className="text-[14px] text-[#13294B] mt-3">
            From Note: AI Generated Note: Annual Review with The Sweets Family
          </p>

          <div className="mt-4 space-y-4">
            {tasks.map((t, i) => (
              <div key={i} className="border border-[#E3E6EA] rounded">
                <div className="flex items-center px-4 py-3 border-b border-[#E3E6EA]">
                  <label className="inline-flex items-center gap-3 text-[15px] text-[#13294B] font-medium">
                    <input
                      type="checkbox"
                      checked={selected[i]}
                      onChange={(e) =>
                        setSelected((prev) => prev.map((v, idx) => (idx === i ? e.target.checked : v)))
                      }
                      className="w-4 h-4 accent-[#1A5FA8]"
                    />
                    {t.title}
                  </label>
                  <a className="ml-auto text-[14px] text-[#1A5FA8] hover:underline cursor-pointer">Edit</a>
                </div>
                <div className="grid grid-cols-4 gap-4 px-4 py-3 text-[13px]">
                  <div>
                    <div className="text-[#6b7280]">Regarding</div>
                    <div className="text-[#13294B] mt-1">THE SWEETS FAMILY</div>
                  </div>
                  <div>
                    <div className="text-[#6b7280]">Date Range</div>
                    <div className="text-[#13294B] mt-1">6/22/2026 - 6/29/2026</div>
                  </div>
                  <div>
                    <div className="text-[#6b7280]">Priority</div>
                    <div className="text-[#13294B] mt-1">Normal</div>
                  </div>
                  <div>
                    <div className="text-[#6b7280]">Owner</div>
                    <div className="text-[#13294B] mt-1">{ownerName}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center px-6 py-4 border-t border-[#E3E6EA] bg-[#F0F2F5]">
          <div className="ml-auto flex items-center gap-3">
            <span className="text-[13px] text-[#13294B]">
              <strong>{selectedCount} tasks</strong> will be created
            </span>
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-1.5 border border-[#1A5FA8] text-[#1A5FA8] rounded text-[14px] hover:bg-[#1A5FA8]/5"
            >
              Cancel
            </button>
            <button className="px-4 py-1.5 border border-[#1A5FA8] text-[#1A5FA8] rounded text-[14px] hover:bg-[#1A5FA8]/5">
              Create Selected &amp; Add Another
            </button>
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-1.5 bg-[#1A5FA8] text-white rounded text-[14px] hover:bg-[#13294B]"
            >
              Create Selected Tasks
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
