import type { SchwabAccount } from "@/data/sweetsOverview";

export type HouseholdMember = { initials: string; name: string };
export type TwrRow = { period: string; portfolio: number; b: number[] };

export type GeneratedHousehold = {
  id: string;
  name: string;
  displayName: string;
  members: HouseholdMember[];
  accounts: SchwabAccount[];
  twrRows: TwrRow[];
};

// Deterministic PRNG so a given household id always renders identical data.
function mulberry(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function membersFromName(name: string): HouseholdMember[] {
  // Split on & to catch joint households like "Carlos & Elena Rodriguez".
  const parts = name.split(/\s*&\s*/);
  const surname = parts[parts.length - 1].split(/\s+/).slice(-1)[0];
  const firsts = parts.map((p) => {
    const tokens = p.split(/\s+/);
    // Drop trailing surname on the last piece so "Elena Rodriguez" -> "Elena".
    return tokens.length > 1 ? tokens.slice(0, -1).join(" ") : tokens[0];
  });
  return firsts.map((first) => ({
    name: `${first} ${surname}`,
    initials: initialsOf(`${first} ${surname}`),
  }));
}

const GROUPS: SchwabAccount["group"][] = [
  "Individual",
  "Joint",
  "Retirement",
  "Retirement",
  "Trust",
];

const REG_LABELS: Record<SchwabAccount["group"], string> = {
  Individual: "Individual Schwab - Brokerage",
  Joint: "Joint w/Survivor Schwab - Brokerage",
  Retirement: "Rollover Schwab - Traditional IRA",
  Trust: "Family Trust Schwab - Trust",
  Closed: "Schwab - Brokerage",
};

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function generateHousehold(
  id: string,
  displayName: string,
): GeneratedHousehold {
  const rand = mulberry(hash(id));
  const members = membersFromName(displayName);
  const primaryFirst = members[0]?.name.split(" ")[0] ?? "Client";
  const surname =
    members[0]?.name.split(" ").slice(-1)[0] ??
    displayName.split(/\s+/).slice(-1)[0];

  const acctCount = 3 + Math.floor(rand() * 3); // 3-5 accounts
  const accounts: SchwabAccount[] = [];
  for (let i = 0; i < acctCount; i++) {
    const group = GROUPS[i % GROUPS.length];
    const number = String(10000000 + Math.floor(rand() * 89999999));
    const value = round2(50_000 + rand() * 2_500_000);
    const cash = round2(rand() * (group === "Retirement" ? 250 : 4_000));
    const ownerFirst =
      group === "Joint" && members.length > 1
        ? `${members[0].name.split(" ")[0]} & ${members[1].name.split(" ")[0]}`
        : primaryFirst;
    const ownerLabel = `${ownerFirst} ${surname} ${REG_LABELS[group]}`;
    accounts.push({
      id: `${id}-${i}`,
      number,
      ownerLabel,
      name: `${ownerLabel} (${number})`,
      value,
      cash,
      group,
      irr: {
        since: "1/1/26",
        portfolio: round2(1 + rand() * 9),
      },
    });
  }

  const periods = [
    "Month to Date",
    "Quarter to Date",
    "Year to Date",
    "1 Year",
    "3 Year",
    "5 Year",
    "Since 07/21/2020",
  ];
  const twrRows: TwrRow[] = periods.map((period) => ({
    period,
    portfolio: round2(-2 + rand() * 12),
    b: [round2(-6 + rand() * 8), round2(-1 + rand() * 4), 0],
  }));

  return { id, name: displayName.toUpperCase(), displayName, members, accounts, twrRows };
}
