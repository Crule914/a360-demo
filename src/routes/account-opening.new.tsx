import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useCurrentUser } from "@/lib/currentUser";
import { AppShell } from "@/components/AppShell";

import {
  HOUSEHOLD_NAME,
  REGISTRATION_TYPES,
  SWEETS_OWNERS,
  SWEETS_PARTY_PROFILES,
  resolveRegistration,
  saveSubmission,
  type BundleAccount,
} from "@/lib/accountOpening";

import selectionActive from "@/assets/account-opening/selection-active.png.asset.json";
import selectionInactive from "@/assets/account-opening/selection-inactive.png.asset.json";
import partiesActive from "@/assets/account-opening/parties-active.png.asset.json";
import partiesInactive from "@/assets/account-opening/parties-inactive.png.asset.json";
import infoActive from "@/assets/account-opening/info-active.png.asset.json";
import infoInactive from "@/assets/account-opening/info-inactive.png.asset.json";
import reviewActive from "@/assets/account-opening/review-active.png.asset.json";
import reviewInactive from "@/assets/account-opening/review-inactive.png.asset.json";

const RAIL_ICONS: Record<string, { active: string; inactive: string }> = {
  selection: { active: selectionActive.url, inactive: selectionInactive.url },
  parties: { active: partiesActive.url, inactive: partiesInactive.url },
  info: { active: infoActive.url, inactive: infoInactive.url },
  review: { active: reviewActive.url, inactive: reviewInactive.url },
};

export const Route = createFileRoute("/account-opening/new")({
  component: AccountOpeningWizard,
});

type StepKey = "selection" | "parties" | "info" | "review";
type PartyTab = "profile" | "affiliations" | "trusted";

function AccountOpeningWizard() {
  const me = useCurrentUser();
  const navigate = useNavigate();
  const advisorId = "321654987";
  const advisorLabel = `${advisorId} - ${me.fullName}`;

  const [bundle, setBundle] = useState<BundleAccount[]>([]);
  const [step, setStep] = useState<StepKey>("selection");
  const [selectedCustodian, setSelectedCustodian] = useState<string | null>(null);
  const [activeAccountIdx, setActiveAccountIdx] = useState(0);
  const [activeSubStep, setActiveSubStep] = useState<"details" | "optional">("details");
  const [bundleOpen, setBundleOpen] = useState(true);
  const [railOpen, setRailOpen] = useState(true);
  const [createAll, setCreateAll] = useState<"all" | "none" | null>(null);
  const [activePartyIdx, setActivePartyIdx] = useState(0);
  const [activePartyTab, setActivePartyTab] = useState<PartyTab>("profile");

  // Track sub-step completion per account
  const [completedSubSteps, setCompletedSubSteps] = useState<Record<string, Set<string>>>({});

  function addAccount(label: string) {
    if (bundle.length >= 10) return;
    const reg = resolveRegistration(label);
    const owner = SWEETS_OWNERS[bundle.length % SWEETS_OWNERS.length];
    setBundle((b) => [
      ...b,
      {
        id: `acc-${Date.now()}-${b.length}`,
        registrationType: reg,
        custodian: "Schwab",
        primaryOwner: owner,
      },
    ]);
  }

  function removeAccount(id: string) {
    setBundle((b) => b.filter((a) => a.id !== id));
  }

  function markSubStepComplete(accId: string, sub: string) {
    setCompletedSubSteps((prev) => {
      const next = { ...prev };
      next[accId] = new Set(next[accId] ?? []);
      next[accId].add(sub);
      return next;
    });
  }

  function handleNext() {
    if (step === "selection") {
      if (bundle.length === 0) return;
      setStep("info");
      setActiveAccountIdx(0);
      setActiveSubStep("details");
      return;
    }
    if (step === "parties") {
      setStep("info");
      setActiveAccountIdx(0);
      setActiveSubStep("details");
      return;
    }
    if (step === "info") {
      const acc = bundle[activeAccountIdx];
      markSubStepComplete(acc.id, activeSubStep);
      if (activeSubStep === "details") {
        setActiveSubStep("optional");
        return;
      }
      // optional → next account or review
      if (activeAccountIdx < bundle.length - 1) {
        setActiveAccountIdx(activeAccountIdx + 1);
        setActiveSubStep("details");
      } else {
        setStep("review");
      }
      return;
    }
    if (step === "review") {
      // Submit
      saveSubmission({
        id: `bundle-${Date.now()}`,
        household: HOUSEHOLD_NAME,
        accounts: bundle,
        submittedAt: new Date().toISOString(),
        advisor: advisorLabel,
      });
      navigate({ to: "/account-opening" });
    }
  }

  function handlePrev() {
    if (step === "review") {
      setStep("info");
      setActiveAccountIdx(bundle.length - 1);
      setActiveSubStep("optional");
      return;
    }
    if (step === "info") {
      if (activeSubStep === "optional") {
        setActiveSubStep("details");
        return;
      }
      if (activeAccountIdx > 0) {
        setActiveAccountIdx(activeAccountIdx - 1);
        setActiveSubStep("optional");
      } else {
        setStep("selection");
      }
      return;
    }
    if (step === "parties") {
      setStep("selection");
      return;
    }
  }

  const selectionDone = bundle.length > 0 && step !== "selection";
  const partiesDone = bundle.length > 0 && step !== "selection";
  const accountInfoDone = step === "review";

  const topBar = (
    <>
      <div className="bg-[#1A4D8F] text-white px-6 h-10 flex items-center gap-3">
        <span className="text-[13px] tracking-wide">
          <span className="font-semibold">ACCOUNT</span> OPENING
        </span>
      </div>
      <div className="bg-[#2E73C0] text-white h-14 px-6 flex items-center justify-between">
        <h1 className="text-[22px] font-light uppercase tracking-wide">{HOUSEHOLD_NAME}</h1>
        <button className="text-white text-[13px] flex items-center gap-1.5 hover:underline">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.6" />
            <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7M12 17h.01" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Help
        </button>
      </div>
    </>
  );

  return (
    <AppShell topBar={topBar}>
      <div className="bg-[#F5F7FA] min-h-full flex flex-col">


      {/* Body */}
      <div className="flex-1 flex">
        {/* Left progress rail */}
        <ProgressRail
          open={railOpen}
          onToggle={() => setRailOpen(!railOpen)}
          step={step}
          bundle={bundle}
          activeAccountIdx={activeAccountIdx}
          activeSubStep={activeSubStep}
          completedSubSteps={completedSubSteps}
          selectionDone={selectionDone}
          partiesDone={partiesDone}
          accountInfoDone={accountInfoDone}
          activePartyIdx={activePartyIdx}
          activePartyTab={activePartyTab}
          onPartyClick={(idx, tab) => {
            setStep("parties");
            setActivePartyIdx(idx);
            setActivePartyTab(tab);
          }}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 pr-0">
            {step === "selection" && (
              <SelectionStep
                bundle={bundle}
                addAccount={addAccount}
                selectedCustodian={selectedCustodian}
                setSelectedCustodian={setSelectedCustodian}
              />
            )}
            {step === "parties" && (
              <PartyStep
                owner={SWEETS_OWNERS[activePartyIdx]}
                tab={activePartyTab}
                onTabChange={setActivePartyTab}
              />
            )}
            {step === "info" && (
              <InfoStep
                account={bundle[activeAccountIdx]}
                advisorId={advisorId}
                subStep={activeSubStep}
              />
            )}
            {step === "review" && (
              <ReviewStep
                bundle={bundle}
                removeAccount={removeAccount}
                createAll={createAll}
                setCreateAll={setCreateAll}
              />
            )}
          </div>
        </div>

        {/* Right bundle panel */}
        {(step === "selection") && (
          <BundlePanel
            bundle={bundle}
            advisorId={advisorId}
            advisorLabel={advisorLabel}
            open={bundleOpen}
            onClose={() => setBundleOpen(false)}
          />
        )}
      </div>

      {/* Footer */}
      <div className="bg-[#5C6470] text-white h-14 px-6 flex items-center justify-between">
        <button
          onClick={() => navigate({ to: "/account-opening" })}
          className="text-[13px] hover:underline"
        >
          Save draft and go to dashboard
        </button>
        <div className="flex items-center gap-3">
          {step !== "selection" && (
            <button
              onClick={handlePrev}
              className="bg-white text-[#2E73C0] px-5 py-1.5 text-[13px] font-medium hover:bg-gray-100"
            >
              Previous
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={bundle.length === 0 || (step === "review" && !createAll)}
            className="bg-[#2E73C0] text-white px-5 py-1.5 text-[13px] font-medium hover:bg-[#256AB0] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step === "review" ? "Submit" : "Next"}
          </button>
        </div>
      </div>
      </div>
    </AppShell>
  );
}


/* ───────────────────────────── Progress Rail ───────────────────────────── */

function StatusDot({ done }: { done: boolean }) {
  if (done) {
    return (
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#1F7A3D] text-white text-[10px]">✓</span>
    );
  }
  return <span className="inline-block w-4 h-4 rounded-full border border-[#9CA3AF]" />;
}

function StatusIcon({ status }: { status: "done" | "warn" | "none" }) {
  if (status === "done") {
    return (
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#1F7A3D] text-white text-[10px]">✓</span>
    );
  }
  if (status === "warn") {
    return (
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#F0B429] text-white text-[10px] font-bold">!</span>
    );
  }
  return <span className="inline-block w-4 h-4 rounded-full border border-[#9CA3AF]" />;
}

function ProgressRail({
  open,
  onToggle,
  step,
  bundle,
  activeAccountIdx,
  activeSubStep,
  completedSubSteps,
  selectionDone,
  partiesDone,
  accountInfoDone,
  activePartyIdx,
  activePartyTab,
  onPartyClick,
}: {
  open: boolean;
  onToggle: () => void;
  step: StepKey;
  bundle: BundleAccount[];
  activeAccountIdx: number;
  activeSubStep: "details" | "optional";
  completedSubSteps: Record<string, Set<string>>;
  selectionDone: boolean;
  partiesDone: boolean;
  accountInfoDone: boolean;
  activePartyIdx: number;
  activePartyTab: PartyTab;
  onPartyClick: (idx: number, tab: PartyTab) => void;
}) {
  if (!open) {
    return (
      <div className="w-10 bg-white border-r border-[#E1E5EA] flex flex-col items-center py-3 gap-4">
        <button onClick={onToggle} className="text-[#2E73C0]">›</button>
        <RailIcon kind="selection" active={step === "selection"} />
        <RailIcon kind="parties" active={step === "parties"} />
        <RailIcon kind="info" active={step === "info"} />
        <RailIcon kind="review" active={step === "review"} />
      </div>
    );
  }
  return (
    <div className="w-72 bg-white border-r border-[#E1E5EA] py-2 text-[13px] text-[#222]">
      <div className="flex justify-end px-2 pb-1">
        <button onClick={onToggle} className="text-[#2E73C0]">‹</button>
      </div>

      <RailStage
        icon="selection"
        label="Account Selection"
        active={step === "selection"}
        done={selectionDone}
      />

      <RailStage
        icon="parties"
        label="Parties"
        active={step === "parties"}
        done={partiesDone}
      />
      {bundle.length > 0 && step !== "selection" && (
        <div>
          {SWEETS_OWNERS.map((o, idx) => {
            const isActiveParty = step === "parties" && idx === activePartyIdx;
            return (
              <div key={o.name}>
                <button
                  onClick={() => onPartyClick(idx, "profile")}
                  className={`w-full pl-12 pr-4 py-1.5 flex items-center justify-between hover:bg-[#F5F7FA] ${isActiveParty ? "bg-[#EAF1F8]" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#9CA3AF] text-white text-[10px] font-semibold flex items-center justify-center">
                      {o.initials}
                    </span>
                    <span className="uppercase font-semibold text-[12px]">{o.name}</span>
                  </div>
                </button>
                {isActiveParty && (
                  <div className="pl-[72px] pr-4">
                    {([
                      { key: "profile", label: "Profile", status: "none" as const },
                      { key: "affiliations", label: "Affiliations", status: "none" as const },
                      { key: "trusted", label: "Trusted Contact", status: "none" as const },
                    ]).map((t) => (
                      <button
                        key={t.key}
                        onClick={() => onPartyClick(idx, t.key as PartyTab)}
                        className={`w-full py-1.5 flex items-center justify-between text-[12px] ${
                          activePartyTab === t.key ? "text-[#2E73C0] font-semibold" : "text-[#222]"
                        }`}
                      >
                        <span>{t.label}</span>
                        <StatusIcon status={t.status} />
                      </button>
                    ))}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      <RailStage
        icon="info"
        label="Account Information"
        active={step === "info"}
        done={accountInfoDone}
      />
      {step === "info" || step === "review" ? (
        <div>
          {bundle.map((acc, i) => {
            const isActive = step === "info" && i === activeAccountIdx;
            const subs = completedSubSteps[acc.id] ?? new Set<string>();
            const accDone = subs.has("details") && subs.has("optional");
            return (
              <div key={acc.id}>
                <div className={`pl-12 pr-4 py-1.5 flex items-center justify-between ${isActive ? "bg-[#EAF1F8]" : ""}`}>
                  <div>
                    <div className="uppercase font-semibold text-[12px]">{acc.registrationType}</div>
                    <div className="text-[11px] text-[#6b7280]">{acc.primaryOwner.name}</div>
                  </div>
                  <StatusDot done={accDone} />
                </div>
                {isActive && (
                  <div className="pl-16 pr-4">
                    <SubItem label="Account Details" active={activeSubStep === "details"} done={subs.has("details")} />
                    <SubItem label="Optional Features" active={activeSubStep === "optional"} done={subs.has("optional")} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : null}

      <RailStage icon="review" label="Review & Submit" active={step === "review"} done={false} muted />
      {step === "review" && (
        <div className="pl-12 pr-4 pt-2">
          <div className="text-[12px] font-semibold tracking-wide text-[#222] uppercase pb-1">Account Completion</div>
          <SubItem label="Summary" done={false} />
          <SubItem label="Sign & Submit" done={false} />
        </div>
      )}

    </div>
  );
}

function RailIcon({ kind, active }: { kind: string; active: boolean }) {
  const icon = RAIL_ICONS[kind];
  if (!icon) return null;
  return (
    <img
      src={active ? icon.active : icon.inactive}
      alt=""
      className="w-7 h-7 object-contain"
    />
  );
}


function RailStage({
  icon,
  label,
  active,
  done,
  muted,
}: {
  icon: string;
  label: string;
  active: boolean;
  done: boolean;
  muted?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between px-4 py-2.5 ${active ? "bg-[#EAF1F8]" : ""}`}>
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 flex items-center justify-center">
          <RailIcon kind={icon} active={active} />
        </span>
        <span className={`font-semibold ${active ? "text-[#2E73C0]" : muted ? "text-[#6b7280]" : "text-[#222]"}`}>
          {label}
        </span>
      </div>
      {!muted && <StatusDot done={done} />}
    </div>
  );
}

function SubItem({ label, active, done }: { label: string; active?: boolean; done?: boolean }) {
  return (
    <div className={`py-1.5 flex items-center justify-between text-[12px] ${active ? "text-[#2E73C0] font-medium" : "text-[#222]"}`}>
      <span>{label}</span>
      <StatusDot done={!!done} />
    </div>
  );
}

/* ───────────────────────────── Step 1: Selection ───────────────────────────── */

function SelectionStep({
  bundle,
  addAccount,
  selectedCustodian,
  setSelectedCustodian,
}: {
  bundle: BundleAccount[];
  addAccount: (label: string) => void;
  selectedCustodian: string | null;
  setSelectedCustodian: (c: string | null) => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = REGISTRATION_TYPES.filter((r) =>
    r.label.toLowerCase().includes(search.toLowerCase()),
  );
  const nonRet = filtered.filter((r) => r.category === "NON-RETIREMENT");
  const ret = filtered.filter((r) => r.category === "RETIREMENT");

  return (
    <div className="bg-white border border-[#E1E5EA] p-8 mr-6 min-h-[500px]">
      <h2 className="text-[20px] font-light mb-6">Account Selection</h2>
      <h3 className="text-[15px] font-semibold mb-2">Add Items to Your Bundle</h3>
      <p className="text-[13px] text-[#6b7280] mb-4">
        Select a business line to see available registration types
      </p>

      <div className="flex gap-3 mb-6">
        {["Schwab", "IWS", "Direct Sponsor"].map((c) => {
          const active = selectedCustodian === c;
          return (
            <button
              key={c}
              onClick={() => setSelectedCustodian(c)}
              className={`px-6 py-2.5 text-[13px] font-medium border ${
                active
                  ? "bg-[#2E73C0] text-white border-[#2E73C0]"
                  : "bg-white text-[#222] border-[#D1D5DB] hover:border-[#2E73C0]"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {selectedCustodian === "Schwab" && (
        <div>
          <p className="text-[13px] text-[#3F3F46] mb-2">
            Search registration types, or select from the list
          </p>
          <div className="border border-[#D1D5DB] rounded-sm px-2 h-8 flex items-center gap-2 w-96 mb-6">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#6b7280" strokeWidth="1.5" />
              <path d="m20 20-3-3" stroke="#6b7280" strokeWidth="1.5" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-[13px] bg-transparent"
            />
          </div>

          <div className="grid grid-cols-[1fr_1px_2fr] gap-6 max-w-2xl">
            <div>
              {nonRet.length > 0 && (
                <>
                  <div className="text-[12px] font-semibold uppercase tracking-wide mb-2">Non-Retirement</div>
                  {nonRet.map((r) => (
                    <button
                      key={r.label}
                      onClick={() => addAccount(r.label)}
                      disabled={bundle.length >= 10}
                      className="block text-[13px] text-[#2E73C0] hover:underline py-1 disabled:opacity-50"
                    >
                      {r.label}
                    </button>
                  ))}
                </>
              )}
              {ret.length > 0 && (
                <>
                  <div className="text-[12px] font-semibold uppercase tracking-wide mt-6 mb-2">Retirement</div>
                  {ret.map((r) => (
                    <button
                      key={r.label}
                      onClick={() => addAccount(r.label)}
                      disabled={bundle.length >= 10}
                      className="block text-[13px] text-[#2E73C0] hover:underline py-1 disabled:opacity-50"
                    >
                      {r.label}
                    </button>
                  ))}
                </>
              )}
            </div>
            <div className="bg-[#E1E5EA]" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────────── Right Bundle Panel ───────────────────────────── */

function BundlePanel({
  bundle,
  advisorId,
  advisorLabel,
  open,
  onClose,
}: {
  bundle: BundleAccount[];
  advisorId: string;
  advisorLabel: string;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="w-80 bg-[#F5F7FA] border-l border-[#E1E5EA] p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-semibold">Bundle ({bundle.length})</h3>
        <button onClick={onClose} className="text-[#6b7280] hover:text-[#222]">✕</button>
      </div>
      {bundle.length === 0 ? (
        <p className="text-[12px] text-[#6b7280]">
          Your bundle is empty. You can add up to 10 accounts.
        </p>
      ) : (
        <div className="space-y-3">
          {bundle.map((acc) => (
            <div key={acc.id} className="bg-white border border-[#E1E5EA] p-3 text-[12px]">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-[14px]">{acc.registrationType}</div>
                  <div className="text-[#6b7280]">{acc.custodian}</div>
                </div>
                <button className="text-[#6b7280]">⋮</button>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div>
                  <div className="text-[#6b7280] text-[11px]">Advisor ID</div>
                  <div>{advisorLabel}</div>
                </div>
                <div>
                  <div className="text-[#6b7280] text-[11px]">Account Prefill</div>
                  <div>--</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[#6b7280] text-[11px]">Primary Owner</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-6 h-6 rounded-full bg-[#9CA3AF] text-white text-[10px] font-semibold flex items-center justify-center">
                    {acc.primaryOwner.initials}
                  </span>
                  <span>{acc.primaryOwner.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────────── Step 3: Account Info ───────────────────────────── */

function InfoStep({
  account,
  advisorId,
  subStep,
}: {
  account: BundleAccount;
  advisorId: string;
  subStep: "details" | "optional";
}) {
  if (subStep === "optional") {
    return (
      <div className="bg-white border border-[#E1E5EA] p-8 mr-6 min-h-[500px]">
        <h2 className="text-[20px] font-light mb-6">Optional Features</h2>
        <p className="text-[13px] text-[#6b7280]">
          No optional features required for this Schwab {account.registrationType} account.
          Click Next to continue.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E1E5EA] mr-6 min-h-[500px]">
      <div className="p-8">
        <h2 className="text-[20px] font-light mb-6">Account Details</h2>

        <Section title="Account Basic Profile">
          <div className="grid grid-cols-2 gap-6">
            <Field label="Business Line - Registration Type" value={`Schwab - ${account.registrationType}`} />
            <Field label="Advisor ID" value={advisorId} />
          </div>
        </Section>

        <Section title="Advisor Authorizations">
          <div className="mb-4">
            <label className="block text-[12px] text-[#6b7280] mb-1">Advisor Authorization*</label>
            <select className="w-96 border border-[#D1D5DB] rounded-sm px-2 h-8 text-[13px] bg-white">
              <option>Trading and disbursement authorization for checks an...</option>
              <option>Trading authorization only</option>
              <option>Limited authorization</option>
            </select>
          </div>
          <YesNo
            label="Do you want to be able to use funds from the client's account to pay investment advisory and related fees?"
            defaultValue="yes"
          />
        </Section>

        <Section title="Firm Account Ownership">
          <YesNo
            label="Is your firm (or a principal, employee, or related person of your firm) an owner, trustee, executor, guardian, conservator, or custodian of this account?"
            defaultValue="no"
          />
          <YesNo
            label="Will this account hold assets belonging to persons or entities other than your firm, your firm employees or yourself, or relatives of you or your firm members?"
            defaultValue="no"
          />
        </Section>
      </div>

      <div className="bg-[#F5F7FA] p-8 border-t border-[#E1E5EA]">
        <h3 className="text-[16px] font-semibold mb-6">Issuer Communications and Related Actions</h3>
        <div className="space-y-6 max-w-4xl">
          {/* Proxy voting */}
          <div className="flex items-start gap-8">
            <div className="flex-1">
              <label className="block text-[12px] text-[#6b7280] mb-2">Proxy voting</label>
              <div className="flex gap-6 text-[13px]">
                <label className="flex items-center gap-2">
                  <input type="radio" name="proxy" className="w-4 h-4" />
                  Account Holder
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="proxy" defaultChecked className="w-4 h-4" />
                  Advisor
                </label>
              </div>
            </div>
            <div className="w-80">
              <label className="block text-[12px] text-[#6b7280] mb-1">Proxy Voting: Informational copies*</label>
              <select className="w-full border border-[#D1D5DB] rounded-sm px-2 h-8 text-[13px] bg-white">
                <option></option>
                <option>Account Holder</option>
                <option>Advisor</option>
                <option>Both</option>
              </select>
            </div>
          </div>

          {/* Corporate Actions */}
          <div className="flex items-start gap-8">
            <div className="flex-1">
              <label className="block text-[12px] text-[#6b7280] mb-2">Corporate Actions</label>
              <div className="flex gap-6 text-[13px]">
                <label className="flex items-center gap-2">
                  <input type="radio" name="corp" className="w-4 h-4" />
                  Account Holder
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="corp" defaultChecked className="w-4 h-4" />
                  Advisor
                </label>
              </div>
            </div>
            <div className="w-80">
              <label className="block text-[12px] text-[#6b7280] mb-1">Corporate Actions: Informational copies*</label>
              <select className="w-full border border-[#D1D5DB] rounded-sm px-2 h-8 text-[13px] bg-white">
                <option></option>
                <option>Account Holder</option>
                <option>Advisor</option>
                <option>Both</option>
              </select>
            </div>
          </div>

          {/* Interim Mailings */}
          <div>
            <label className="block text-[12px] text-[#6b7280] mb-2">Interim Mailings</label>
            <div className="space-y-3 text-[13px]">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 border border-[#D1D5DB] rounded-sm" />
                Account Holder
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 border border-[#D1D5DB] rounded-sm" />
                Advisor
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-[15px] font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[12px] text-[#6b7280]">{label}</div>
      <div className="text-[14px] mt-0.5">{value}</div>
    </div>
  );
}

function YesNo({ label, defaultValue }: { label: string; defaultValue: "yes" | "no" }) {
  const name = useMemo(() => `yn-${Math.random().toString(36).slice(2, 8)}`, []);
  return (
    <div className="mb-4">
      <div className="text-[13px] mb-2">{label}</div>
      <div className="flex gap-6 text-[13px]">
        <label className="flex items-center gap-2"><input type="radio" name={name} defaultChecked={defaultValue === "yes"} /> Yes</label>
        <label className="flex items-center gap-2"><input type="radio" name={name} defaultChecked={defaultValue === "no"} /> No</label>
      </div>
    </div>
  );
}

/* ───────────────────────────── Step 4: Review ───────────────────────────── */

function ReviewStep({
  bundle,
  removeAccount,
  createAll,
  setCreateAll,
}: {
  bundle: BundleAccount[];
  removeAccount: (id: string) => void;
  createAll: "all" | "none" | null;
  setCreateAll: (v: "all" | "none") => void;
}) {
  return (
    <div className="bg-white border border-[#E1E5EA] p-8 mr-6 min-h-[500px]">
      <h2 className="text-[20px] font-light mb-6">Sign & Submit</h2>

      <h3 className="text-[15px] font-semibold mb-4">Account Specific Forms</h3>
      <div className="space-y-4 mb-8">
        {bundle.map((acc) => (
          <div key={acc.id} className="border border-[#E1E5EA] p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-[14px] uppercase">
                Schwab - {acc.registrationType}
              </h4>
              <div className="text-[13px] flex items-center gap-3">
                <button onClick={() => removeAccount(acc.id)} className="text-[#2E73C0] hover:underline">Delete</button>
                <span className="text-[#D1D5DB]">|</span>
                <button className="text-[#2E73C0] hover:underline">Separate from Bundle</button>
              </div>
            </div>
            <div className="text-[12px] text-[#6b7280]">Primary Owner</div>
            <div className="text-[14px] mb-3">{acc.primaryOwner.name}</div>
            <div className="text-[13px] text-[#6b7280]">No account specific forms.</div>
          </div>
        ))}
      </div>

      <h3 className="text-[15px] font-semibold mb-4">Account Creation</h3>
      <div className="border border-[#E1E5EA] p-5">
        <div className="text-[13px] mb-3">Create all accounts in this bundle?*</div>
        <div className="flex gap-8 text-[13px]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="create-all"
              checked={createAll === "all"}
              onChange={() => setCreateAll("all")}
            />
            Create All
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="create-all"
              checked={createAll === "none"}
              onChange={() => setCreateAll("none")}
            />
            Do Not Create All
          </label>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────── Party Profile ───────────────────────────── */

function PartyStep({
  owner,
  tab,
}: {
  owner: { initials: string; name: string };
  tab: PartyTab;
  onTabChange: (t: PartyTab) => void;
}) {
  const profile = SWEETS_PARTY_PROFILES[owner.name];

  return (
    <div className="mr-6">
      {tab === "profile" && profile && <PartyProfileForm profile={profile} />}
      {tab === "affiliations" && <AffiliationsForm />}
      {tab === "trusted" && <TrustedContactForm />}
    </div>
  );
}

function AffiliationsForm() {
  return (
    <div className="space-y-4">
      <h2 className="text-[20px] font-light text-[#13294B]">Affiliations</h2>

      {/* Personal Affiliations */}
      <section className="bg-white border border-[#E1E5EA] p-6">
        <h3 className="text-[16px] font-semibold text-[#13294B] mb-4">Personal Affiliations</h3>
        <div className="max-w-sm">
          <label className="block text-[12px] text-[#6b7280] mb-1">
            Affiliation Type<span className="text-[#C0392B]">*</span>
          </label>
          <select
            defaultValue="None"
            className="w-full border border-[#9CA3AF] rounded-sm px-2 h-9 text-[13px] bg-white"
          >
            <option>None</option>
            <option>Spouse</option>
            <option>Child</option>
            <option>Parent</option>
            <option>Other</option>
          </select>
        </div>
      </section>

      {/* Industry Affiliations */}
      <section className="bg-white border border-[#E1E5EA] p-6">
        <h3 className="text-[16px] font-semibold text-[#13294B] mb-4">Industry Affiliations</h3>
        <div className="space-y-4">
          <CheckRow
            label="Security Industry Affiliation"
            help="Affiliated or employed by stock exchange, member firm, FINRA, or municipal broker-dealer."
          />
          <CheckRow
            label="Public Company Affiliation(s)"
            help="Control person or affiliate of public company (SEC Rule 144). Includes (but is not limited to) 10% shareholders, policy-making executives, and members of the board."
          />
        </div>
      </section>

      {/* Customer Types */}
      <section className="bg-white border border-[#E1E5EA] p-6">
        <h3 className="text-[16px] font-semibold text-[#13294B] mb-4">Customer Types</h3>
        <div className="space-y-4">
          <CheckRow
            label="Accredited Investor"
            help="The person is an accredited investor, as defined in Rule 501(a) of the Securities Act of 1933."
          />
          <CheckRow
            label="U.S. Registered Investment Adviser"
            help="The person is associated with a U.S. Registered Investment Adviser."
          />
        </div>
      </section>
    </div>
  );
}

function CheckRow({ label, help }: { label: string; help: string }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-[14px] text-[#1f2937]">
        <input type="checkbox" className="w-4 h-4 accent-[#2E73C0]" />
        <span>{label}</span>
        <span className="text-[#2E73C0] text-[12px] cursor-help" title={help}>ⓘ</span>
      </label>
      <p className="text-[13px] text-[#4b5563] mt-1 ml-6 max-w-3xl">{help}</p>
    </div>
  );
}

function TrustedContactForm() {
  const [wantsContact, setWantsContact] = useState<"yes" | "no">("no");
  return (
    <div className="bg-white border border-[#E1E5EA] p-8 min-h-[400px]">
      <h2 className="text-[20px] font-light mb-6">Trusted Contact</h2>

      <div className="border border-[#E1E5EA] p-6">
        <h3 className="text-[16px] font-semibold mb-4">Trusted Contact</h3>
        <div className="text-[13px] text-[#6b7280] mb-4 flex items-start gap-1">
          <span>
            Does this client wish to add a trusted contact? (You must ask the client if he or she wishes to provide a trusted contact)
          </span>
          <span className="text-[#2E73C0] cursor-help" title="A trusted contact is someone the firm may contact if there are concerns about the client's health, welfare, or possible financial exploitation.">ⓘ</span>
          <span className="text-[#C0392B]">*</span>
        </div>
        <div className="flex gap-6 text-[13px]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="trusted-contact"
              checked={wantsContact === "yes"}
              onChange={() => setWantsContact("yes")}
            />
            Yes
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="trusted-contact"
              checked={wantsContact === "no"}
              onChange={() => setWantsContact("no")}
            />
            No
          </label>
        </div>
      </div>
    </div>
  );
}

function TextField({
  label,
  defaultValue,
  required,
  className = "",
}: {
  label: string;
  defaultValue?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-[12px] text-[#6b7280] mb-1">
        {label}
        {required && <span className="text-[#C0392B]">*</span>}
      </label>
      <input
        defaultValue={defaultValue ?? ""}
        className="w-full border border-[#9CA3AF] rounded-sm px-2 h-8 text-[13px] bg-white"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  required,
}: {
  label: string;
  value: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[12px] text-[#6b7280] mb-1">
        {label}
        {required && <span className="text-[#C0392B]">*</span>}
      </label>
      <select
        defaultValue={value}
        className="w-full border border-[#9CA3AF] rounded-sm px-2 h-8 text-[13px] bg-white"
      >
        <option>{value}</option>
      </select>
    </div>
  );
}

function PartyProfileForm({ profile }: { profile: import("@/lib/accountOpening").PartyProfile }) {
  return (
    <div className="bg-white border border-[#E1E5EA] border-t-0 p-8 min-h-[500px]">
      <h2 className="text-[20px] font-light mb-6">Profile</h2>

      {/* Party Details */}
      <h3 className="text-[16px] font-semibold mb-5">Party Details</h3>
      <div className="grid grid-cols-3 gap-5 mb-5">
        <TextField label="Prefix" defaultValue={profile.prefix} />
        <TextField label="First Name" defaultValue={profile.firstName} required />
        <TextField label="Middle Name or Initial" defaultValue={profile.middle} />
        <TextField label="Last Name" defaultValue={profile.lastName} required />
        <TextField label="Suffix" defaultValue={profile.suffix} />
        <div />
        <TextField label="SSN/TIN" defaultValue={profile.ssn} required />
        <TextField label="Date of Birth" defaultValue={profile.dob} required />
        <div />
      </div>
      <div className="grid grid-cols-3 gap-5 mb-5">
        <SelectField label="Citizenship Status" value={profile.citizenship} required />
        <div />
        <div />
        <TextField label="Primary Phone" defaultValue={profile.primaryPhone} required />
        <TextField label="Secondary Phone" defaultValue={profile.secondaryPhone} />
        <TextField label="Email Address" defaultValue={profile.email} required />
      </div>

      {/* Mailing Address */}
      <h3 className="text-[13px] font-semibold uppercase tracking-wide text-[#222] mt-10 mb-2 pb-2 border-b border-[#E1E5EA]">
        Mailing Address
      </h3>
      <div className="mb-5">
        <SelectField label="Pre-fill with Existing Address" value="" />
      </div>
      <div className="grid grid-cols-2 gap-5 mb-5">
        <TextField label="Address" defaultValue={profile.mailing.address1} required />
        <TextField label="Address 2" defaultValue={profile.mailing.address2} />
      </div>
      <div className="grid grid-cols-3 gap-5 mb-5">
        <TextField label="City" defaultValue={profile.mailing.city} required />
        <TextField label="State or Territory" defaultValue={profile.mailing.state} required />
        <TextField label="Zip Code" defaultValue={profile.mailing.zip} required />
      </div>
      <div className="mb-5 max-w-md">
        <TextField label="Attention" />
      </div>

      {/* Legal Address */}
      <h3 className="text-[13px] font-semibold uppercase tracking-wide text-[#222] mt-8 mb-3 pb-2 border-b border-[#E1E5EA]">
        Legal Address
      </h3>
      <label className="flex items-center gap-2 text-[13px] mb-6">
        <input type="checkbox" defaultChecked={profile.legalSameAsMailing} className="accent-[#2E73C0] w-4 h-4" />
        Same as mailing address
      </label>

      {/* Employer */}
      <h3 className="text-[13px] font-semibold uppercase tracking-wide text-[#222] mt-2 mb-3 pb-2 border-b border-[#E1E5EA]">
        Employer Address
      </h3>
      <div className="mb-5 max-w-md">
        <TextField label="Employer Name" defaultValue={profile.employerName} />
      </div>
      <div className="mb-5">
        <SelectField label="Pre-fill with Existing Address" value="" />
      </div>
      <div className="grid grid-cols-2 gap-5 mb-5">
        <TextField label="Address" defaultValue={profile.employerAddress.address1} />
        <TextField label="Address 2" defaultValue={profile.employerAddress.address2} />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <TextField label="City" defaultValue={profile.employerAddress.city} />
        <TextField label="State or Territory" defaultValue={profile.employerAddress.state} />
        <TextField label="Zip Code" defaultValue={profile.employerAddress.zip} />
      </div>
    </div>
  );
}
