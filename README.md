# Advisor360° Dashboard

Build a clickable internal prototype of a wealth management platform for financial advisors called Advisor360°. It stitches four existing product surfaces into one connected flow, following a single advisor and a single client household the whole way through.

SCOPE LOCK (read first, obey throughout)

Build exactly the four screens and the navigation described below, nothing more. Do not add a login page, search results, settings, extra modules, a charting library beyond what is specified, additional households, or any tab behavior I did not describe. Do not invent dollar figures, account types, or holdings. Use only the data in the mock data file. If a detail is not

specified, leave it out rather than improvising. This must look like an

internal enterprise tool, calm and dense, not a flashy marketing site.

STACK

React, Tailwind, shadcn/ui, lucide-react icons. No backend, no real API calls.

All data hardcoded in one file, householdData.js. Use recharts only for the

donut and the small bar charts.

GLOBAL DESIGN SYSTEM (match the real product)

- Chrome color is deep navy, around #13294B. The left icon rail and all top

  header bars use this navy with white and light-gray text.

- Primary blue for links, the active tab underline, and primary buttons,

  around #1A5FA8. Solid blue buttons have white text, square-ish corners.

- Page background light gray, around #F0F2F5. Cards are white with a thin

  hairline border (#E3E6EA) and a small 6px corner radius. Square and dense,

  not pill-shaped.

- Logged-in advisor avatar is an orange circle (#EE8A00) with white initials

  BL.

- Chart palette, navy #13294B plus teal #1D9E75 and light teal #7FD0B5 for

  bars. The donut uses a categorical set, navy, medium blue, teal, green,

  yellow-green, yellow, orange, red, magenta, purple.

- Status pill "Good" is light green background with dark green text. AI

  elements use a small sparkle icon in primary blue.

- Font is a clean humanist sans. Load Source Sans 3 from Google Fonts, fall

  back to system-ui. Two weights only, regular and medium. Sentence case

  everywhere.

PERSISTENT LEFT RAIL (on every screen)

Vertical navy rail, narrow, icon over label. Items top to bottom, Notifications

(red 9+ badge), Home, Search, Clients, Trading, Operations, Analysis, Admin.

Then near the bottom, Help, ViDA, the orange BL avatar, and an Advisor360°

logo mark. Home is highlighted on screen 1. Clients is highlighted on the

household screens.

SCREEN 1, HOME DASHBOARD (entry point)

Navy top bar reading HOME, then "Dashboard" as the page title. Below, a light

gray page with the heading "My Dashboard" and right-aligned links "Hide All

Content" and "Manage Dashboard". Three columns of white cards.

Left column:

  - "Business Snapshot" card. Advisor's Name shows a removable chip "Lane,

    Betty H". Rows, Trades 0, Cash Available $6,167, Total Assets $428,118,932.

  - "Asset Breakdown", Fee Based Assets $276,389,552, Non-Fee Based Assets

    $151,729,379.

  - "Business Goals" with a four-item legend (Year-End Realistic Goal, Year-End

    Stretch Goal, Current Progress, Beyond Stretch Goal) and three horizontal

    bar charts labeled YTD Production, Total Assets, and Fee Based Assets, each

    "as of 06/16/2026".

Middle column:

  - "Day at a Glance" card. A "Filter by Betty Lane" chip, a June 2026 week

    strip with the 16th selected, and tabs Appointments, To Do's, Life Events.

    The Appointments tab shows ONE upcoming item, "Annual review, The Estrada

    Family, 2:00 PM". Clicking that appointment navigates into the Estrada

    household meeting prep (screen 3).

  - "Market Summary" card with a benchmark table, DJI 51,962.13 +0.56%, NASDAQ

    26,754.17 +0.26%, S&P500 7,562.30 +0.11%, 10Yr Treasury 4.46 -0.27%, 30Yr

    Treasury 4.96 -0.32%. Up rows green, down rows red. Below it a Watchlists

    dropdown defaulting to "Top Equity Holdings" with a blue GO button, and a

    Symbol/CUSIP search field with a GO button.

Right column:

  - "Last Households Viewed" card listing household names, MEDOR HOUSEHOLD,

    GEGHAM, THE ESTRADA FAMILY, SANTANA HOUSEHOLD, MARTA, GARRETT HH TEST.

    Clicking "THE ESTRADA FAMILY" navigates into that household (lands on

    meeting prep, screen 3).

  - "Statistics" card, Number of Households 11, Average Household Balance

    $38,468,702.52, Total Assets $638,659,808.17, Number of Accounts 92,

    Non Retirement 77, Retirement 15.

SHARED HOUSEHOLD HEADER (screens 2, 3, and during 4)

When inside the Estrada household, the navy top bar changes to show CLIENTS on

the left with "THE ESTRADA FAMILY" as the title, a row of small member avatars

(GE, JE, KT, RE), and a horizontal tab bar, Overview, Trading/Holdings, Reports,

Client Intelligence, Documents, Contacts, plus a "Meeting Prep" tab. The active

tab gets a blue underline. These tabs let the user move between screen 3

(Meeting Prep tab) and screen 2 (Client Intelligence tab) freely. The household

context never resets while inside.

SCREEN 3, MEETING PREP (Meeting Prep tab)

Two-panel layout.

Left panel, "Meeting Prep Chat". A document icon and a history icon top right.

One AI message bubble, "Good morning, Betty. I've prepared your Estrada Family

meeting briefing. Household is at $48.57M, up 6.8% YTD. Heads up, 89% of assets

sit in just two positions. Ask me anything or upload documents." A timestamp

8:50 AM with thumbs up and down. Below the bubble, three suggested-action

buttons, "Review last meeting summary", "View goals analysis", "Check

concentration risk". Clicking "Check concentration risk" navigates to the

Client Intelligence tab (screen 2).

Right panel, navy sub-header "Annual review with The Estrada Family, Monday

June 22 2026 at 2:00 PM, Edit", and a "Record this Meeting" toggle. Below,

"Agenda for Client Planning" with a green "Good" pill, plus Copy and Export to

PDF actions. Collapsible sections. First section "Meeting Overview &

Objectives" is expanded and contains a light-blue "Topic Summary" box (sparkle

icon) reading "Set expectations for the annual review, confirm logistics, and

flag the concentration in Microsoft and Apple." Below it "Talking Points" with

two bullets. Then two collapsed sections, "Planning & Goals" and "Portfolio

Performance & Market Insights".

SCREEN 2, CLIENT INTELLIGENCE REPORTING (Client Intelligence tab)

A collapsible left "Reports" sub-panel with a search field and tabs Favorites,

Default, Custom. List the default reports, Account Register, Allocation and

Holdings Summary (selected and starred), Beneficiary Review, Financial Summary,

Performance Summary (TWR), Portfolio Holdings, Required Minimum Distribution,

Transaction Activity.

Main panel header, "Allocation and Holdings Summary", date 06/14/2026, an "All

Accounts" dropdown, and Customize and Print actions.

  - "Asset Allocation" card with a "Donut Chart" dropdown. A donut plus a

    category table, Large-Cap Blend 43,403,683.76 (89.37%), Technology

    2,179,521.54 (4.49%), Utilities 1,574,306.24 (3.24%), Intermediate Core

    Bond 556,920.00 (1.15%), Cash and Equivalents 327,998.59 (0.68%), then a

    few smaller rows, Total 48,567,980.24 (100%).

  - An AI INSIGHT callout box (light blue, sparkle icon) directly under the

    allocation, titled "Concentration risk". Body, "89% of this household sits

    in Microsoft and Apple. A single-stock drawdown would hit the plan hard.

    Consider opening a diversification account to begin reallocating." A primary

    blue button inside this box, "Open account", navigates to the account

    opening flow (screen 4).

  - "Top 10 Holdings" table, Microsoft Corp 24,811,990.00 (51.09%), Apple Inc

    18,341,190.00 (37.76%), Global X Funds Cybersecurity ETF 2,148,930.00

    (4.42%), Telecom Utility 1,574,306.37 (3.24%), Total Bond Market Index

    Portfolio 556,920.00 (1.15%), Core Money Market CASH 261,869.84 (0.54%),

    iShares Core S&P 500 ETF, iShares ESG Aware MSCI USA ETF, American Funds

    New Perspective Cl A, Zurich Money Market. Total $48,567,980.36.

SCREEN 4, ACCOUNT OPENING FLOW (Schwab)

Launches from the "Open account" button as a stepped wizard, full page, keeping

the navy household header. Title "New account, The Estrada Family".

At the top of the wizard, a "Custodian" dropdown that is preset to "Schwab" and

locked (disabled), with helper text "Custodian set by household custody

relationship".

Step 1, Account Selection. Heading "Add account to your bundle". A list of

selectable Schwab account types, these are the ONLY options, do not add others

and do not include insurance or annuities, Individual brokerage (preselected),

Joint brokerage, Trust, Traditional IRA, Roth IRA, Rollover IRA, SEP IRA,

SIMPLE IRA, Inherited IRA, Custodial UTMA/UGMA, 529 education, Entity, Estate.

A right-side "Your bundle" panel listing selected accounts. Buttons bottom

right, Cancel and Next.

Step 2, Account details. A short form, account holder (Teresa Estrada),

registration, and a "Tradeable assets" read-only line, "Equities, ETFs, mutual

funds, fixed income, options, money market funds". Buttons, Back and Next.

Step 3, Review and submit. A summary card, Custodian Schwab, Account type

Individual brokerage, Holder Teresa Estrada, Prefilled from household with a

green check. A primary "Submit to Schwab" button that shows a success state,

"Account request sent to Schwab", with a link back to the household.

NAVIGATION SUMMARY (wire these exactly)

- Home dashboard, clicking the Estrada appointment OR the Estrada household name

  enters the household on the Meeting Prep tab.

- Meeting Prep, "Check concentration risk" goes to the Client Intelligence tab.

- Client Intelligence, "Open account" goes to the account opening wizard.

- Account opening, success returns to the household.

- The household tab bar always lets the user move between Meeting Prep and

  Client Intelligence. The left rail Home icon returns to the dashboard.

BUILD ORDER

First build the left rail, the design system, the mock data file, and the Home

dashboard. Stop and let me confirm it looks right before building the household

screens. Then add Meeting Prep, then Client Intelligence, then the account

opening wizard, then wire the navigation last.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://advisor360-demo.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f1aa9ad3-43ba-43b4-aabe-27a047e75e8a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

<!-- Sync test from Claude Code, 2026-11-10 -->
## Sync test

This line was pushed from Claude Code on 2026-11-10 to confirm GitHub → Lovable sync. Safe to delete.
