import { useEffect, useRef, useState } from "react";
import { X, Send } from "lucide-react";
import vidaIcon from "@/assets/nav/vida.png.asset.json";
import { getMeetingPrepClients } from "@/lib/meetingPrepClients";

const VIDA_EVENT = "lovable:open-vida";

export function openVida(initialQuery?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(VIDA_EVENT, { detail: { initialQuery } }));
}

type Msg = { id: string; role: "user" | "assistant"; text: string };

const QUICK_REPLIES = [
  "What can you do?",
  "How big is my book?",
  "Who are my top households by AUM?",
  "Which households need attention?",
  "How many accounts are in my book?",
];

export function VidaPanel() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [showHouseholds, setShowHouseholds] = useState(false);
  const [thinking, setThinking] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { initialQuery?: string } | undefined;
      setOpen(true);
      if (detail?.initialQuery) setInput(detail.initialQuery);
      setTimeout(() => inputRef.current?.focus(), 80);
    };
    window.addEventListener(VIDA_EVENT, handler);
    return () => window.removeEventListener(VIDA_EVENT, handler);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  function send(text: string) {
    const t = text.trim();
    if (!t) return;
    const userMsg: Msg = { id: `u-${Date.now()}`, role: "user", text: t };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);
    const delay = 700 + Math.min(1800, t.length * 25);
    window.setTimeout(() => {
      const reply: Msg = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: synthesizeReply(t),
      };
      setMessages((prev) => [...prev, reply]);
      setThinking(false);
    }, delay);
  }

  function newChat() {
    setMessages([]);
    setInput("");
    setShowHouseholds(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  const households = getMeetingPrepClients();

  if (!open) return null;

  return (
    <>
      <button
        aria-label="Close ViDA"
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-[60] bg-black/20"
      />
      <aside
        className="fixed top-0 bottom-0 right-0 w-[420px] bg-white z-[61] shadow-[-8px_0_24px_rgba(0,0,0,0.18)] flex flex-col"
        style={{ animation: "vidaSlideIn 200ms ease-out" }}
      >
        <header className="flex items-center justify-between px-4 pt-3 pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9">
              <img src={vidaIcon.url} alt="" className="w-9 h-9 object-contain" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#22C55E] border-2 border-white" />
            </div>
            <div className="leading-tight">
              <div className="text-[15px] font-semibold text-[#0F172A]">ViDA</div>
              <div className="text-[12px] text-[#16A34A] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                Online · <span className="text-[#6B7280]">Wealth assistant</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-[12px] text-[#6B7280]">
              <input type="checkbox" className="accent-[#2563EB]" />
              prod view
            </label>
            <button
              onClick={newChat}
              className="text-[13px] text-[#2563EB] hover:underline font-medium"
            >
              New Chat
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-[#9CA3AF] hover:text-[#374151]"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-full bg-[#B7CBE8] shrink-0 mt-0.5" />
            <div className="bg-[#F1F5FB] rounded-xl px-4 py-3 max-w-[320px]">
              <p className="text-[13.5px] text-[#0F172A] leading-relaxed">
                Hi, I'm ViDA — your wealth assistant. Ask me about a household or your whole book.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {QUICK_REPLIES.map((q, i) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className={`text-[12.5px] px-3 py-1.5 rounded-full border transition-colors ${
                      i === QUICK_REPLIES.length - 1
                        ? "border-[#2563EB] text-[#2563EB]"
                        : "border-[#C7D6EE] text-[#2563EB] hover:bg-[#EAF1FB]"
                    }`}
                  >
                    {q}
                  </button>
                ))}
                <button
                  onClick={() => setShowHouseholds((s) => !s)}
                  className="text-[12.5px] px-3 py-1.5 rounded-full border border-[#C7D6EE] text-[#2563EB] hover:bg-[#EAF1FB]"
                >
                  {showHouseholds ? "Hide households" : "Browse households"}
                </button>
              </div>
              {showHouseholds && (
                <div className="mt-3 border-t border-[#D8E2F1] pt-2 max-h-56 overflow-y-auto">
                  {households.map((h) => (
                    <button
                      key={h.clientId}
                      onClick={() => send(`Tell me about ${h.clientName}`)}
                      className="block w-full text-left text-[12.5px] px-2 py-1.5 rounded hover:bg-[#E4ECF8] text-[#0F172A]"
                    >
                      {h.clientName}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {messages.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="flex justify-end">
                <div className="bg-[#2563EB] text-white rounded-xl px-3.5 py-2 max-w-[320px] text-[13.5px] leading-relaxed">
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-[#B7CBE8] shrink-0 mt-0.5" />
                <div className="bg-[#F1F5FB] rounded-xl px-3.5 py-2 max-w-[320px] text-[13.5px] text-[#0F172A] leading-relaxed">
                  {m.text}
                </div>
              </div>
            )
          )}
          {thinking && (
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-[#B7CBE8] shrink-0 mt-0.5" />
              <div className="bg-[#F1F5FB] rounded-xl px-4 py-3 max-w-[320px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] animate-bounce" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-[#E5E7EB] px-3 pt-3 pb-2">
          <div className="flex items-end gap-2 border border-[#D1D5DB] rounded-full px-4 py-1.5">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Message ViDA…"
              rows={1}
              className="flex-1 resize-none outline-none text-[13.5px] py-1.5 bg-transparent text-[#0F172A] placeholder:text-[#9CA3AF] max-h-28"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || thinking}
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                input.trim() && !thinking
                  ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                  : "bg-[#D1D5DB] text-white"
              }`}
              aria-label="Send"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-[#9CA3AF] text-center mt-2">
            ViDA can make mistakes — verify important figures. Practice data may be delayed.
          </p>
        </div>
      </aside>
      <style>{`
        @keyframes vidaSlideIn {
          from { transform: translateX(24px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}

function synthesizeReply(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes("what can you")) {
    return "I can summarize households, surface meeting prep insights, pull AUM and account data across your book, and flag households that need attention.";
  }
  if (lower.includes("big") || lower.includes("aum")) {
    return "Your book currently manages $412M across 184 households. Top quartile households contribute ~62% of AUM.";
  }
  if (lower.includes("top households")) {
    return "Top 5 households by AUM: Sweets Family ($14.2M), Carlos & Elena Rodriguez ($11.8M), Steven & Julia Parker ($9.4M), David & Carol Williams ($8.7M), Robert Martinez ($7.9M).";
  }
  if (lower.includes("attention")) {
    return "3 households need attention: Lisa Anderson (overdue RMD), David Thompson (cash drag > 15%), Maria Gonzalez (beneficiary missing).";
  }
  if (lower.includes("accounts")) {
    return "You have 612 accounts across 184 households — 421 brokerage, 138 retirement, 53 advisory.";
  }
  return `Here's what I found for "${q}". (Connect ViDA to live data to get real-time answers.)`;
}
