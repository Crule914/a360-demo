import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/investor360-portal")({
  validateSearch: z.object({ user: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Investor360° Client Dashboard | Advisor360" },
      {
        name: "description",
        content:
          "Investor360° client dashboard with balances, asset allocation and holdings for the Sweets household.",
      },
      { property: "og:title", content: "Investor360° Client Dashboard" },
      {
        property: "og:description",
        content:
          "Client-facing Investor360° dashboard showing balances and holdings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Investor360PortalPage,
});

const CSS = `
.i360{--ink:#222;--muted:#666;--line:#e3e5e8;--page:#f2f3f4;--card:#fff;--link:#1f5fbf;--navbg:#f5f6f7;--ok:#2e8b3d;--warn:#c77700;
 font-family:"Source Sans 3","Source Sans Pro",Arial,sans-serif;color:var(--ink);background:var(--page);font-size:14px;line-height:1.4;min-height:100vh}
.i360 *{box-sizing:border-box}
.i360 a{color:var(--link);text-decoration:none}
.i360 .topbar{background:#000;color:#fff;padding:12px 24px;display:flex;align-items:center;gap:10px}
.i360 .logo{width:22px;height:22px;border-radius:50%;background:conic-gradient(#f39c2b 0 25%,#1f6fbf 25% 55%,#3bb89c 55% 100%);display:inline-block}
.i360 .topbar .name{font-weight:700;letter-spacing:.4px;font-size:14px}
.i360 .topbar .name span{font-weight:400}
.i360 .idbar{background:#fff;padding:14px 24px;display:flex;flex-wrap:wrap;gap:6px 16px;justify-content:space-between;align-items:center;color:#333;font-size:15px}
.i360 .idbar .sep{color:#bbb;margin:0 12px}
.i360 .idbar .right{font-size:14px}
.i360 .idbar .right .lock{margin-left:6px}
.i360 .nav{background:var(--navbg);border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:0 24px;display:flex;flex-wrap:wrap;gap:8px 28px;font-size:15px;align-items:center;position:relative}
.i360 .nav a{color:#222;padding:13px 0;position:relative;white-space:nowrap}
.i360 .nav .help{margin-left:auto;width:26px;height:26px;border-radius:50%;background:#dbe6f5;color:var(--link);display:flex;align-items:center;justify-content:center;font-weight:700}
.i360 .caret{font-size:11px;margin-left:5px;vertical-align:1px}
.i360 .wrap{padding:16px 24px 40px}
.i360 .toolbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:16px;font-size:14px}
.i360 .toolbar .sep{color:#bbb}
.i360 .dd{border:1px solid var(--link);color:var(--link);border-radius:6px;padding:5px 12px;font-size:14px;background:#fff;display:inline-flex;gap:8px;align-items:center}
.i360 .dd i{font-style:italic;color:#5d6068}
.i360 .toolbar .stamp{font-style:italic;color:#555}
.i360 .toolbar .right{margin-left:auto;display:flex;gap:10px;align-items:center;font-size:14px}
.i360 .toolbar .right .sep{margin:0 4px}
.i360 .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.i360 .grid .w{min-width:0;margin-bottom:0}
.i360 .w{min-width:0;background:var(--card);border:1px solid var(--line);border-radius:3px;box-shadow:0 1px 2px rgba(0,0,0,.06)}
.i360 .wh{display:flex;align-items:center;padding:11px 14px;border-bottom:1px solid var(--line)}
.i360 .grip{color:#c2c2c2;font-size:14px;letter-spacing:-2px;margin-right:12px;line-height:1}
.i360 .wh h2{margin:0;font-size:16px;font-weight:700;display:flex;align-items:center;flex-wrap:wrap;gap:2px}
.i360 .kebab{margin-left:auto;color:#555;font-size:18px;line-height:1}
.i360 .wb{padding:10px 14px 14px}
.i360 .sub{color:#666;font-size:12.5px}
.i360 .hdr{font-size:11px;color:#666;text-transform:uppercase;letter-spacing:.3px;display:grid;grid-template-columns:1fr auto;padding:0 0 6px;border-bottom:1px solid var(--line)}
.i360 .acct{display:grid;grid-template-columns:1fr auto;gap:1px 12px;padding:8px 0;border-top:1px solid var(--line);font-size:14px}
.i360 .acct:first-of-type{border-top:0}
.i360 .acct a.nm{font-weight:600}
.i360 .acct .amt{font-weight:600;text-align:right}
.i360 .acct .sub{grid-column:1/-1}
.i360 .addlink{display:inline-flex;align-items:center;gap:7px;font-size:14px;font-weight:600;margin-top:10px}
.i360 .addlink .plus{width:17px;height:17px;border:2px solid var(--link);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:13px;line-height:1}
.i360 .tx{display:grid;grid-template-columns:1fr auto;gap:1px 12px;padding:7px 0;border-top:1px solid var(--line);font-size:13.5px}
.i360 .tx:first-of-type{border-top:0}
.i360 .tx .amt{font-weight:600;text-align:right}
.i360 .tx .who{color:#666;grid-column:1/-1;font-size:12px}
.i360 .linked{font-size:11px;color:#666;border:1px solid var(--line);border-radius:3px;padding:0 5px;margin-left:6px}
.i360 .bl{display:flex;justify-content:space-between;gap:10px;padding:4px 0;font-size:14px;border-bottom:1px solid var(--line)}
.i360 .bl.sm{font-size:13px}
.i360 .blh{font-weight:700;font-size:16px}
.i360 .donut{width:120px;height:120px;border-radius:50%;flex:none;background:conic-gradient(#1f3b73 0 27.93%,#5aa7de 27.93% 55.32%,#3d8b8f 55.32% 76.74%,#5f9a3a 76.74% 87.48%,#a9cf72 87.48% 93.78%,#f2e14b 93.78% 96.92%,#f0b323 96.92% 98.45%,#e5822c 98.45% 99.6%,#d23a2f 99.6% 100%);position:relative}
.i360 .donut:after{content:"";position:absolute;inset:34px;background:#fff;border-radius:50%}
.i360 .leg{display:grid;grid-template-columns:12px 1fr auto;gap:0 8px;align-items:center;padding:3px 0}
.i360 .leg i{width:12px;height:12px;display:inline-block}
.i360 .leg b{text-align:right}
.i360 .hold{display:grid;grid-template-columns:1fr 2fr auto auto;gap:0 10px;padding:6px 0;border-top:1px solid var(--line);font-size:13px}
.i360 .hold:first-of-type{border-top:0}
.i360 .hold span:nth-child(3),.i360 .hold span:nth-child(4){text-align:right}
`;

function body(user: string) {
  return `
<div class="topbar"><span class="logo"></span><span class="name">INVESTOR<span>360&deg;</span></span></div>
<div class="idbar">
  <div>Richard &amp; Karen Sweets<span class="sep">|</span>Advisor360 Wealth<span class="sep">|</span>964-555-1842</div>
  <div class="right">Welcome ${user} <span class="caret">&#9660;</span> &nbsp;&nbsp;&nbsp;&nbsp; Log Out <span class="lock">&#128274;</span></div>
</div>
<div class="nav">
  <a class="on">Dashboard</a>
  <a>Portfolio <span class="caret">&#9660;</span></a>
  
  <a>Statements &amp; Documents <span class="caret">&#9660;</span></a>
  <a>Messages</a>
  <a>ClientConnect</a>
  <span class="help">?</span>
</div>
<div class="wrap">
  <div class="toolbar">
    <span>My Dashboard</span><span class="sep">|</span>
    <span class="dd">Year to Today <i>01/01/2026 - 09/09/2026</i> <span class="caret">&#9660;</span></span>
    <span class="dd">All Accounts <span class="caret">&#9660;</span></span>
    <span class="stamp">Last updated 05:01 PM</span>
    <span class="right"><a href="#">&#128438; Print Report</a><span class="sep">|</span><a href="#">Hide All Content</a><span class="sep">|</span><a href="#">Manage Dashboard</a></span>
  </div>
  <div class="grid">
    <div class="w">
      <div class="wh"><span class="grip">&#8942;&#8942;</span><h2>Additional Accounts</h2><span class="kebab">&#8942;</span></div>
      <div class="wb">
        <div class="acct"><a class="nm" href="#">Chase Checking</a><span class="amt">$18,240.00</span><span class="sub">Updated 6:10 AM</span></div>
        <div class="acct"><a class="nm" href="#">Ally Savings</a><span class="amt">$45,200.00</span><span class="sub">Updated 6:10 AM</span></div>
        <div class="acct"><a class="nm" href="#">Fidelity 401(k)</a><span class="amt">$340,000.00</span><span class="sub">Updated yesterday</span></div>
        <div class="acct"><a class="nm" href="#" style="color:var(--warn)">Wells Fargo Mortgage</a><a href="#">Reconnect</a><span class="sub" style="color:var(--warn)">Connection needs attention</span></div>
        <a class="addlink" href="#"><span class="plus">+</span>Add an Account</a>
      </div>
    </div>
    <div class="w">
      <div class="wh"><span class="grip">&#8942;&#8942;</span><h2>Recent Activity</h2><span class="kebab">&#8942;</span></div>
      <div class="wb">
        <div class="tx"><span>Deposit, payroll<span class="linked">Chase Checking</span></span><span class="amt">+ $12,400.00</span><span class="who">09/03/2026</span></div>
        <div class="tx"><span>Dividend reinvested, JNL/Mellon S&amp;P 500</span><span class="amt">+ $1,218.44</span><span class="who">09/02/2026 &nbsp;|&nbsp; Schwab Brokerage</span></div>
        <div class="tx"><span>Mortgage payment<span class="linked">Wells Fargo</span></span><span class="amt">&minus; $3,180.00</span><span class="who">09/01/2026</span></div>
        <div class="tx"><span>529 contribution</span><span class="amt">&minus; $500.00</span><span class="who">09/01/2026 &nbsp;|&nbsp; Fidelity 529</span></div>
        <div style="margin-top:10px"><a href="#">View All Activity</a></div>
      </div>
    </div>
    <div class="w">
      <div class="wh"><span class="grip">&#8942;&#8942;</span><h2>Balances</h2><span class="kebab">&#8942;</span></div>
      <div class="wb">
        <div class="bl"><a href="#" class="blh">&#8854; Total Net Worth</a><b>$3,606,494.78</b></div>
        <div class="bl sm"><span style="padding-left:20px">Beginning Balance (01/01/2026)</span><span>$617,364.19</span></div>
        <div class="bl sm"><a href="#" style="padding-left:20px">Net Contributions/Withdrawals</a><span>$0.00</span></div>
        <div class="bl sm"><span style="padding-left:20px">Net Change</span><span>$46,630.59</span></div>
        <div class="bl sm"><span style="padding-left:20px;font-weight:600">Ending Balance (09/09/2026)</span><b>$663,994.78</b></div>
        <div class="bl sm"><span>Total Additional Assets</span><span>$2,942,500.00</span></div>
        <div class="bl" style="margin-top:6px"><a href="#" class="blh">&#8854; Accounts</a><b>$663,994.78</b></div>
        <div class="bl sm"><span>Total Cash: $71,425.57</span><span style="color:var(--ok)">$0.00</span></div>
        <div class="bl sm" style="background:#f2f3f4;padding:4px 6px;margin-top:4px"><span>Closed Accounts: $663,840.44</span></div>
        <div class="bl sm"><a href="#">Richard Sweets Schwab Brokerage</a><b>$509,410.64*</b></div>
        <div class="bl sm"><a href="#">Karen Sweets IWS Brokerage</a><b>$84,970.46*</b></div>
        <div class="bl sm"><a href="#">Sweets Family Fidelity Advisor Funds</a><b>$69,105.00*</b></div>
        <div class="bl sm"><a href="#">Sweets Family American Funds</a><b>$200.00*</b></div>
      </div>
    </div>
    <div class="w">
      <div class="wh"><span class="grip">&#8942;&#8942;</span><h2>Asset Allocation</h2><span class="kebab">&#8942;</span></div>
      <div class="wb">
        <div class="sub" style="font-size:14px;color:#222;margin-bottom:8px">Asset Category</div>
        <div style="display:flex;gap:14px;align-items:center">
          <div class="donut"></div>
          <div style="flex:1;font-size:12.5px">
            <div class="hdr" style="grid-template-columns:1fr auto"><span>Asset Category</span><span>Value (%)</span></div>
            <div class="leg"><i style="background:#1f3b73"></i>Aggressive Alloc&hellip;<b>27.93</b></div>
            <div class="leg"><i style="background:#5aa7de"></i>Global Aggressi&hellip;<b>27.39</b></div>
            <div class="leg"><i style="background:#3d8b8f"></i>Large-Cap Blend<b>21.42</b></div>
            <div class="leg"><i style="background:#5f9a3a"></i>Cash and Equiv&hellip;<b>10.74</b></div>
            <div class="leg"><i style="background:#a9cf72"></i>Moderate Alloca&hellip;<b>6.30</b></div>
            <div class="leg"><i style="background:#f2e14b"></i>Large-Cap Growth<b>3.14</b></div>
            <div class="leg"><i style="background:#f0b323"></i>Large-Cap Value<b>1.53</b></div>
            <div class="leg"><i style="background:#e5822c"></i>Global Large-St&hellip;<b>1.15</b></div>
            <div class="leg"><i style="background:#d23a2f"></i>Intermediate Co&hellip;<b>0.40</b></div>
            <div class="leg" style="border-top:1px solid var(--line);margin-top:2px"><i style="visibility:hidden"></i><b style="text-align:left">Total:</b><b>100</b></div>
          </div>
        </div>
        <div class="sub" style="margin-top:10px;font-style:italic">09/09/2026</div>
      </div>
    </div>
    <div class="w">
      <div class="wh"><span class="grip">&#8942;&#8942;</span><h2>Balance History</h2><span class="kebab">&#8942;</span></div>
      <div class="wb">
        <svg viewBox="0 0 320 150" width="100%" style="display:block;font-size:9px;font-family:Arial">
          <g stroke="#ccc" stroke-dasharray="3 3"><line x1="55" y1="15" x2="310" y2="15"/><line x1="55" y1="75" x2="310" y2="75"/><line x1="55" y1="135" x2="310" y2="135"/></g>
          <text x="50" y="18" text-anchor="end" fill="#555">$1,000,000</text><text x="50" y="78" text-anchor="end" fill="#555">$500,000</text><text x="50" y="138" text-anchor="end" fill="#555">$0</text>
          <path d="M55 130 L90 128 L120 118 L150 108 L180 100 L210 90 L240 82 L260 66 L275 74 L290 60 L300 68 L310 56 L310 135 L55 135 Z" fill="#cfe5f5"/>
          <path d="M55 130 L90 128 L120 118 L150 108 L180 100 L210 90 L240 82 L260 66 L275 74 L290 60 L300 68 L310 56" fill="none" stroke="#4d8b31" stroke-width="2"/>
          <path d="M55 130 L120 129 L200 126 L310 124" fill="none" stroke="#3b9ad9" stroke-width="2"/>
          <text x="110" y="148" fill="#555">01/01/15</text><text x="190" y="148" fill="#555">01/01/20</text><text x="270" y="148" fill="#555">01/01/25</text>
        </svg>
        <div class="sub" style="display:flex;gap:16px;justify-content:center;margin-top:6px"><span><i style="display:inline-block;width:18px;height:3px;background:#4d8b31;vertical-align:middle;margin-right:5px"></i>Balance</span><span><i style="display:inline-block;width:18px;height:3px;background:#3b9ad9;vertical-align:middle;margin-right:5px"></i>Net Investment</span></div>
        <div class="sub" style="margin-top:8px;font-style:italic">01/14/2011 - 09/09/2026</div>
      </div>
    </div>
  </div>
</div>`;
}

function Investor360PortalPage() {
  const { user } = Route.useSearch();
  const name = (user ?? "Rick").replace(/[<>&"]/g, "");
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="i360" dangerouslySetInnerHTML={{ __html: body(name) }} />
    </>
  );
}
