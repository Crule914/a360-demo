import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SweetsContactsShell } from "@/components/sweets/SweetsContactsShell";
import { sweetsMembers } from "@/data/sweetsOverview";
import { Filter, X } from "lucide-react";

export const Route = createFileRoute("/household/sweets/contacts/client-connect")({
  component: ClientConnectPage,
  head: () => ({
    meta: [
      { title: "ClientConnect — The Sweets Family" },
      {
        name: "description",
        content:
          "Send and track FactFinders through ClientConnect for The Sweets Family household.",
      },
      { property: "og:title", content: "ClientConnect — The Sweets Family" },
      {
        property: "og:description",
        content:
          "Send and track FactFinders through ClientConnect for The Sweets Family household.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

type FactFinderRow = {
  id: string;
  contact: string;
  loginId: string;
  template: string;
  status: "SENT" | "IN PROGRESS" | "COMPLETED" | "EXPIRED";
  dateSent: string;
  dateCompleted: string;
  syncStatus: "PENDING" | "SYNCED" | "NOT SYNCED";
};

const COLUMNS: { key: keyof FactFinderRow; label: string }[] = [
  { key: "contact", label: "Contact" },
  { key: "loginId", label: "Investor360° Login ID" },
  { key: "template", label: "FactFinder Template" },
  { key: "status", label: "Status" },
  { key: "dateSent", label: "Date Sent" },
  { key: "dateCompleted", label: "Date Completed" },
  { key: "syncStatus", label: "Sync Status" },
];

const DEFAULT_TEMPLATES = [
  "Standard Household FactFinder",
  "Retirement Planning FactFinder",
  "Education Planning (529) FactFinder",
  "Risk Tolerance Questionnaire",
];

const CONTACTS = sweetsMembers.map((m, i) => ({
  name: m.name,
  loginId:
    i === 0
      ? "rsweets01"
      : i === 1
        ? "ksweets01"
        : `${m.name.split(" ")[0].toLowerCase()}sweets`,
  email:
    i <= 1
      ? "rickandkarensweets@gmail.com"
      : `${m.name.split(" ")[0].toLowerCase()}.sweets@gmail.com`,
}));

function today() {
  return new Date().toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

function ClientConnectPage() {
  const [rows, setRows] = useState<FactFinderRow[]>([]);
  const [templates, setTemplates] = useState<string[]>(DEFAULT_TEMPLATES);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [showSend, setShowSend] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const visible = useMemo(
    () =>
      rows.filter((r) =>
        COLUMNS.every((c) => {
          const f = filters[c.key]?.trim().toLowerCase();
          return !f || String(r[c.key]).toLowerCase().includes(f);
        }),
      ),
    [rows, filters],
  );

  function sendFactFinder(contactName: string, template: string) {
    const c = CONTACTS.find((x) => x.name === contactName);
    setRows((prev) => [
      {
        id: `${Date.now()}`,
        contact: contactName,
        loginId: c?.loginId ?? "—",
        template,
        status: "SENT",
        dateSent: today(),
        dateCompleted: "—",
        syncStatus: "PENDING",
      },
      ...prev,
    ]);
    setShowSend(false);
  }

  function advance(row: FactFinderRow) {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== row.id) return r;
        if (r.status === "SENT") return { ...r, status: "IN PROGRESS" };
        if (r.status === "IN PROGRESS")
          return {
            ...r,
            status: "COMPLETED",
            dateCompleted: today(),
            syncStatus: "SYNCED",
          };
        return r;
      }),
    );
  }

  return (
    <SweetsContactsShell>
      <div className="px-6 py-4 flex items-center">
        <h1 className="text-[18px] font-semibold text-[#13294B]">ClientConnect</h1>
        <div className="ml-auto flex items-center gap-3 text-[14px]">
          <button
            onClick={() => setShowTemplates(true)}
            className="text-[#1A5FA8] hover:underline"
          >
            Manage Templates
          </button>
          <span className="text-[#D5D9DE]">|</span>
          <button
            onClick={() => setShowSend(true)}
            className="text-[#1A5FA8] hover:underline"
          >
            Send FactFinder
          </button>
        </div>
      </div>

      <div className="mx-6 mb-6 bg-white border border-[#E3E6EA]">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="border-b border-[#E3E6EA]">
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  className="text-left align-middle py-4 px-4 border-l first:border-l-0 border-[#E3E6EA]"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-[13px] font-semibold uppercase tracking-wide text-[#4A5568]">
                      {c.label}
                    </span>
                    <div className="relative ml-auto">
                      <button
                        aria-label={`Filter ${c.label}`}
                        onClick={() =>
                          setOpenFilter((o) => (o === c.key ? null : c.key))
                        }
                        className={
                          filters[c.key]
                            ? "text-[#1A5FA8]"
                            : "text-[#B5BAC2] hover:text-[#13294B]"
                        }
                      >
                        <Filter className="w-3.5 h-3.5" />
                      </button>
                      {openFilter === c.key && (
                        <div className="absolute right-0 top-6 z-20 bg-white border border-[#E3E6EA] shadow-lg p-2 w-52">
                          <input
                            autoFocus
                            value={filters[c.key] ?? ""}
                            onChange={(e) =>
                              setFilters((f) => ({ ...f, [c.key]: e.target.value }))
                            }
                            placeholder={`Filter ${c.label}`}
                            className="w-full border border-[#D5D9DE] px-2 py-1 text-[13px] font-normal normal-case"
                          />
                          <div className="flex justify-between mt-2">
                            <button
                              className="text-[12px] text-[#6b7280] hover:underline font-normal"
                              onClick={() =>
                                setFilters((f) => ({ ...f, [c.key]: "" }))
                              }
                            >
                              Clear
                            </button>
                            <button
                              className="text-[12px] text-[#1A5FA8] hover:underline font-normal"
                              onClick={() => setOpenFilter(null)}
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-6 py-8">
                  <p className="text-[15px] text-[#13294B] mb-3">
                    {rows.length === 0
                      ? "You haven't sent any FactFinders to this household."
                      : "No FactFinders match the current filters."}
                  </p>
                  <button
                    onClick={() =>
                      rows.length === 0 ? setShowSend(true) : setFilters({})
                    }
                    className="text-[15px] text-[#1A5FA8] hover:underline"
                  >
                    {rows.length === 0 ? "Send FactFinder" : "Clear filters"}
                  </button>
                </td>
              </tr>
            ) : (
              visible.map((r) => (
                <tr key={r.id} className="border-b border-[#F0F2F5]">
                  <td className="px-4 py-3 text-[#1A5FA8]">{r.contact}</td>
                  <td className="px-4 py-3 text-[#13294B]">{r.loginId}</td>
                  <td className="px-4 py-3 text-[#13294B]">{r.template}</td>
                  <td className="px-4 py-3 text-[#13294B]">
                    <button
                      onClick={() => advance(r)}
                      title="Advance status"
                      className="uppercase hover:underline"
                    >
                      {r.status}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-[#13294B]">{r.dateSent}</td>
                  <td className="px-4 py-3 text-[#13294B]">{r.dateCompleted}</td>
                  <td className="px-4 py-3 text-[#13294B]">{r.syncStatus}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showSend && (
        <SendFactFinderModal
          templates={templates}
          onClose={() => setShowSend(false)}
          onSend={sendFactFinder}
        />
      )}

      {showTemplates && (
        <ManageTemplatesModal
          templates={templates}
          setTemplates={setTemplates}
          onClose={() => setShowTemplates(false)}
        />
      )}

      <p className="px-6 pb-6 text-[12px] text-[#6b7280]">
        For financial professional use only. Not for use with the public.
      </p>
    </SweetsContactsShell>
  );
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-24">
      <div className="bg-white border border-[#E3E6EA] w-[520px] max-w-[92vw] shadow-xl">
        <div className="flex items-center px-4 py-3 border-b border-[#E3E6EA]">
          <h2 className="text-[15px] font-semibold text-[#13294B]">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="ml-auto text-[#6b7280]">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function SendFactFinderModal({
  templates,
  onClose,
  onSend,
}: {
  templates: string[];
  onClose: () => void;
  onSend: (contact: string, template: string) => void;
}) {
  const [contact, setContact] = useState(CONTACTS[0]?.name ?? "");
  const [template, setTemplate] = useState(templates[0] ?? "");

  return (
    <ModalShell title="Send FactFinder" onClose={onClose}>
      <div className="px-4 py-4 space-y-4 text-[14px]">
        <div>
          <label className="block text-[13px] text-[#6b7280] mb-1">Contact</label>
          <select
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full border border-[#D5D9DE] px-2 py-2"
          >
            {CONTACTS.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} — {c.email}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[13px] text-[#6b7280] mb-1">
            FactFinder Template
          </label>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full border border-[#D5D9DE] px-2 py-2"
          >
            {templates.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-3 px-4 py-3 border-t border-[#E3E6EA]">
        <button onClick={onClose} className="text-[14px] text-[#6b7280] hover:underline">
          Cancel
        </button>
        <button
          disabled={!contact || !template}
          onClick={() => onSend(contact, template)}
          className="text-[14px] bg-[#1A5FA8] text-white px-4 py-2 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </ModalShell>
  );
}

function ManageTemplatesModal({
  templates,
  setTemplates,
  onClose,
}: {
  templates: string[];
  setTemplates: React.Dispatch<React.SetStateAction<string[]>>;
  onClose: () => void;
}) {
  const [name, setName] = useState("");

  return (
    <ModalShell title="Manage Templates" onClose={onClose}>
      <div className="px-4 py-4 text-[14px]">
        <ul className="mb-4 divide-y divide-[#F0F2F5] border border-[#E3E6EA]">
          {templates.map((t) => (
            <li key={t} className="flex items-center px-3 py-2">
              <span className="text-[#13294B]">{t}</span>
              <button
                onClick={() => setTemplates((p) => p.filter((x) => x !== t))}
                className="ml-auto text-[13px] text-[#1A5FA8] hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
          {templates.length === 0 && (
            <li className="px-3 py-2 text-[#6b7280]">No templates yet.</li>
          )}
        </ul>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New template name"
            className="flex-1 border border-[#D5D9DE] px-2 py-2"
          />
          <button
            disabled={!name.trim()}
            onClick={() => {
              setTemplates((p) => [...p, name.trim()]);
              setName("");
            }}
            className="bg-[#1A5FA8] text-white px-4 py-2 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>
      <div className="flex justify-end px-4 py-3 border-t border-[#E3E6EA]">
        <button onClick={onClose} className="text-[14px] text-[#1A5FA8] hover:underline">
          Done
        </button>
      </div>
    </ModalShell>
  );
}
