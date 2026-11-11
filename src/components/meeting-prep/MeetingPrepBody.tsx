import { useEffect, useMemo, useRef, useState } from "react";
import {
  Download,
  RefreshCw,
  Sparkles,
  Send,
  ChevronDown,
  CheckCircle2,
  Circle,
  Clock,
  Users,
  TrendingUp,
  Shield,
  Target,
  FileText,
} from "lucide-react";

interface MeetingPrepBodyProps {
  householdName?: string;
  meetingTitle?: string;
  meetingTime?: string;
}

const DEFAULT_WELCOME = (household: string, meetingTitle: string, meetingTime: string) =>
  `Hi — I've reviewed <strong>${household}</strong>'s portfolio, last meeting notes, and recent activity in preparation for your <strong>${meetingTitle}</strong> <strong>${meetingTime}</strong>.

The main conversation from the last transcript call was that the client wants to <strong>open a new Individual brokerage account</strong> — this is the top recommended task and should anchor today's agenda. They also asked about opening a <strong>529 account</strong> for the grandchild.

Household assets are <strong>$3.42M</strong>, up <strong>+6.8% YTD</strong>, outpacing the blended benchmark by <strong>+1.2%</strong>. Two additional follow-ups from the transcript:

• Discuss third-party asset trading arrangement.
• Walk through consulting agreement options and fees.

I've drafted an agenda on the right — feel free to ask me to adjust topics, add talking points, or pull supporting data.`;

interface AgendaItem {
  id: string;
  title: string;
  duration: string;
  icon: typeof Users;
  bullets: string[];
  status: "complete" | "ready" | "needs-input";
}

const AGENDA: AgendaItem[] = [
  {
    id: "new-individual-account",
    title: "Open New Account — Individual Brokerage",
    duration: "15 min",
    icon: FileText,
    status: "ready",
    bullets: [
      "Top recommended task from last transcript: open new brokerage account",
      "Confirm account owner, funding source, and initial deposit amount",
      "Set cost-basis method and dividend election (reinvest vs. cash)",
      "Capture e-sign requirements and kick off new-account workflow",
    ],
  },
  {
    id: "new-account",
    title: "Open New Account — 529 for Grandchild",
    duration: "15 min",
    icon: FileText,
    status: "ready",
    bullets: [
      "Follow-up from last transcript: establish 529 account for grandchild",
      "Confirm account type, owner, beneficiary, and initial funding amount",
      "Review state plan vs. direct-sold options and tax considerations",
      "Capture e-sign requirements and kick off new-account workflow",
    ],
  },

  {
    id: "life",
    title: "Life & Family Updates",
    duration: "10 min",
    icon: Users,
    status: "ready",
    bullets: [
      "Check in on Karen's transition into semi-retirement",
      "Confirm Wayne's college enrollment and 529 drawdown timing",
      "Update emergency contact + trusted contact on file",
    ],
  },
  {
    id: "portfolio",
    title: "Portfolio Performance Review",
    duration: "10 min",
    icon: TrendingUp,
    status: "ready",
    bullets: [
      "YTD return +6.8% vs. blended benchmark +5.6%",
      "Walk through Schwab Rollover IRA — 7.04% IRR since 1/1/26",
      "Discuss third-party asset trading arrangement (transcript follow-up)",
    ],
  },
  {
    id: "planning",
    title: "Retirement & Income Planning",
    duration: "10 min",
    icon: Target,
    status: "needs-input",
    bullets: [
      "Karen's RMD: $42,180 remaining — confirm distribution schedule",
      "Social Security claiming strategy for Richard at FRA",
      "Review consulting agreement options and fees (transcript follow-up)",
    ],
  },
  {
    id: "estate",
    title: "Estate & Beneficiary Review",
    duration: "5 min",
    icon: Shield,
    status: "needs-input",
    bullets: [
      "Joint Brokerage beneficiaries — last reviewed 14 months ago",
      "Confirm successor trustee for the Sweets Family Trust",
    ],
  },
  {
    id: "next",
    title: "Next Steps & Action Items",
    duration: "5 min",
    icon: FileText,
    status: "ready",
    bullets: [
      "Submit 529 new-account paperwork this week",
      "Send updated IPS for signature",
      "Coordinate with CPA on Q4 tax-loss harvesting",
    ],
  },
];

export function MeetingPrepBody({
  householdName = "The Sweets Family",
  meetingTitle = "Annual Review",
  meetingTime = "Wednesday, June 24, 2026 at 5:30 PM",
}: MeetingPrepBodyProps) {
  return (
    <>
      <div className="px-6 pt-4 pb-2 flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-[#6b7280] font-semibold">
            Meeting Prep
          </div>
          <h1 className="text-[20px] font-semibold text-[#13294B] mt-0.5">
            {meetingTitle} · {meetingTime}
          </h1>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-[#6b7280]">
          <Clock className="w-4 h-4" />
          Briefing generated just now
        </div>
      </div>

      <div className="px-6 pb-8 grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4 h-[calc(100vh-220px)] min-h-[600px]">
        <ChatPanel
          householdName={householdName}
          welcomeHtml={DEFAULT_WELCOME(householdName, meetingTitle, meetingTime)}
        />
        <AgendaCanvas meetingTitle={meetingTitle} />
      </div>
    </>
  );
}

/* ------------------------------- Chat panel ------------------------------- */

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  streaming?: boolean;
  quickReplies?: { id: string; text: string }[];
}

function ChatPanel({
  householdName,
  welcomeHtml,
}: {
  householdName: string;
  welcomeHtml: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: "", streaming: true },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const tokens = tokenize(welcomeHtml);

    const start = setTimeout(async () => {
      if (cancelled) return;
      setThinking(false);
      let acc = "";
      for (const tok of tokens) {
        if (cancelled) return;
        acc += tok;
        setMessages((prev) =>
          prev.map((m) => (m.id === "welcome" ? { ...m, content: acc } : m)),
        );
        const delay = tok.startsWith("<") || tok.startsWith("&")
          ? 0
          : /^\s+$/.test(tok)
            ? 30
            : 22;
        if (delay) await new Promise((r) => setTimeout(r, delay));
      }
      setMessages((prev) =>
        prev.map((m) =>
          m.id === "welcome"
            ? {
                ...m,
                streaming: false,
                quickReplies: [
                  { id: "qr1", text: "Review last meeting summary" },
                  { id: "qr2", text: "View goals analysis" },
                  { id: "qr3", text: "Check portfolio performance" },
                ],
              }
            : m,
        ),
      );
    }, 1400);

    return () => {
      cancelled = true;
      clearTimeout(start);
    };
  }, [welcomeHtml]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendUserMessage = (text: string) => {
    if (!text.trim()) return;
    const userId = `u-${Date.now()}`;
    const replyId = `a-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", content: text },
      { id: replyId, role: "assistant", content: "", streaming: true },
    ]);
    setInput("");
    const reply = `Got it — pulling that together now. I'll surface the relevant details from <strong>${householdName}</strong>'s records in the canvas on the right.`;
    streamInto(replyId, reply, setMessages);
  };

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-lg flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-[#e5e7eb] flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#13294B] to-[#3B82F6] flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <div className="text-[13px] font-semibold text-[#13294B]">VIDA · Meeting Prep</div>
          <div className="text-[11px] text-[#6b7280]">AI-assisted briefing</div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {thinking && (
          <div className="flex items-center gap-2 text-[13px] text-[#6b7280]">
            <TypingDots />
            <span>
              Reviewing <strong className="text-[#13294B]">{householdName}</strong>'s context to
              prepare your briefing…
            </span>
          </div>
        )}
        {!thinking &&
          messages.map((m) => (
            <MessageBubble key={m.id} message={m} onQuickReply={sendUserMessage} />
          ))}
      </div>

      <form
        className="border-t border-[#e5e7eb] p-3 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          sendUserMessage(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask VIDA to adjust the agenda or pull supporting data…"
          className="flex-1 text-[13px] px-3 py-2 rounded-md border border-[#e5e7eb] focus:outline-none focus:border-[#3B82F6]"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="w-9 h-9 rounded-md bg-[#13294B] text-white flex items-center justify-center disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

function MessageBubble({
  message,
  onQuickReply,
}: {
  message: ChatMessage;
  onQuickReply: (text: string) => void;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] bg-[#13294B] text-white text-[13px] rounded-lg px-3 py-2">
          {message.content}
        </div>
      </div>
    );
  }
  const cursor = message.streaming
    ? '<span class="inline-block w-1.5 h-3.5 ml-0.5 bg-[#3B82F6]/70 align-middle animate-pulse"></span>'
    : "";
  return (
    <div className="space-y-2">
      <div
        className="text-[13px] leading-[1.65] text-[#1f2937] whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: message.content + cursor }}
      />
      {message.quickReplies && (
        <div className="flex flex-wrap gap-2 pt-1">
          {message.quickReplies.map((qr) => (
            <button
              key={qr.id}
              onClick={() => onQuickReply(qr.text)}
              className="text-[12px] px-3 py-1.5 rounded-full border border-[#3B82F6]/40 text-[#13294B] hover:bg-[#3B82F6]/5"
            >
              {qr.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
      <span
        className="inline-block w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse"
        style={{ animationDelay: "0.2s" }}
      />
      <span
        className="inline-block w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse"
        style={{ animationDelay: "0.4s" }}
      />
    </span>
  );
}

/* ------------------------------ Agenda canvas ----------------------------- */

function AgendaCanvas({ meetingTitle }: { meetingTitle: string }) {
  const totalDuration = useMemo(
    () =>
      AGENDA.reduce((sum, item) => {
        const n = parseInt(item.duration);
        return sum + (Number.isFinite(n) ? n : 0);
      }, 0),
    [],
  );

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-lg flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-[#e5e7eb] flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-[#6b7280] font-semibold">
            Meeting Agenda
          </div>
          <div className="text-[15px] font-semibold text-[#13294B] mt-0.5">
            {meetingTitle} · ~{totalDuration} min
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-[12px] px-3 py-1.5 rounded-md border border-[#e5e7eb] text-[#13294B] hover:bg-gray-50 inline-flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate
          </button>
          <button className="text-[12px] px-3 py-1.5 rounded-md border border-[#e5e7eb] text-[#13294B] hover:bg-gray-50 inline-flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {AGENDA.map((item, idx) => (
          <AgendaCard key={item.id} item={item} index={idx + 1} />
        ))}
      </div>
    </div>
  );
}

function AgendaCard({ item, index }: { item: AgendaItem; index: number }) {
  const [open, setOpen] = useState(true);
  const Icon = item.icon;
  return (
    <div className="border border-[#e5e7eb] rounded-lg">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50"
      >
        <div className="w-8 h-8 rounded-md bg-[#13294B]/5 flex items-center justify-center text-[#13294B]">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#6b7280] font-semibold">#{index}</span>
            <span className="text-[14px] font-semibold text-[#13294B]">{item.title}</span>
            <StatusPill status={item.status} />
          </div>
          <div className="text-[11px] text-[#6b7280] mt-0.5">{item.duration}</div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[#6b7280] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 space-y-2">
          {item.bullets.map((b, i) => (
            <div key={i} className="flex gap-2 text-[13px] text-[#1f2937] leading-[1.55]">
              <span className="text-[#3B82F6] mt-1.5">•</span>
              <span>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: AgendaItem["status"] }) {
  if (status === "complete") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3 h-3" /> Complete
      </span>
    );
  }
  if (status === "needs-input") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
        <Circle className="w-3 h-3" /> Needs input
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
      Ready
    </span>
  );
}

/* --------------------------------- Helpers -------------------------------- */

function tokenize(html: string): string[] {
  const re = /<[^>]+>|&[^;]+;|\s+|[^<\s&]+/g;
  const tokens: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) tokens.push(m[0]);
  return tokens;
}

async function streamInto(
  id: string,
  html: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
) {
  await new Promise((r) => setTimeout(r, 600));
  const tokens = tokenize(html);
  let acc = "";
  for (const tok of tokens) {
    acc += tok;
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content: acc } : m)));
    const delay = tok.startsWith("<") || tok.startsWith("&") ? 0 : /^\s+$/.test(tok) ? 30 : 22;
    if (delay) await new Promise((r) => setTimeout(r, delay));
  }
  setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, streaming: false } : m)));
}
