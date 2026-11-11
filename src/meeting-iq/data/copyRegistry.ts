// @ts-nocheck
/**
 * Curated registry of UI copy by screen, for the Copy Review admin page.
 * Roles are used for grouping/filtering in the review UI and exports.
 */

export type CopyRole =
  | 'page-title'
  | 'section-header'
  | 'body'
  | 'button'
  | 'empty-state'
  | 'toast'
  | 'tooltip'
  | 'validation'
  | 'placeholder'
  | 'label';

export interface CopyEntry {
  id: string;
  role: CopyRole;
  text: string;
  /** Where in the screen the string appears (e.g. "Header > Right rail"). */
  location?: string;
  /** Source file for reference. */
  source?: string;
  notes?: string;
}

export interface CopyScreen {
  id: string;
  group: string;
  label: string;
  /** Path the iframe should load. */
  route: string;
  description?: string;
  entries: CopyEntry[];
}

export const COPY_SCREENS: CopyScreen[] = [
  {
    id: 'home',
    group: 'Home',
    label: 'Home — Upcoming Meeting Preps',
    route: '/',
    description: 'Landing view with Upcoming Meeting Preps grid and Clients Due for Reviews.',
    entries: [
      { id: 'home.section.upcoming', role: 'section-header', text: 'Upcoming Meeting Preps', location: 'Main canvas', source: 'src/components/landing/LandingPageOrchestrator.tsx' },
      { id: 'home.section.due', role: 'section-header', text: 'Clients Due for Reviews', location: 'Main canvas' },
      { id: 'home.empty.title', role: 'empty-state', text: 'No active meeting preps.', location: 'Upcoming grid empty state', source: 'src/components/canvas/UpcomingMeetingsGrid.tsx' },
      { id: 'home.empty.body', role: 'empty-state', text: 'Toggle "Client Review" on in the Calendar to add meetings here.' },
      { id: 'home.card.menu.view', role: 'button', text: 'View Details', location: 'Meeting card 3-dot menu', source: 'src/components/canvas/CalendarCanvas.tsx' },
      { id: 'home.card.menu.edit', role: 'button', text: 'Edit Meeting Prep', location: 'Meeting card 3-dot menu' },
      { id: 'home.card.menu.delete', role: 'button', text: 'Delete Meeting Prep', location: 'Meeting card 3-dot menu' },
      { id: 'home.card.menu.generate', role: 'button', text: 'Generate Agenda', location: 'Meeting card 3-dot menu (scheduled)' },
      { id: 'home.card.menu.settype', role: 'button', text: 'Set Meeting Type', location: 'Meeting card 3-dot menu (not_set)' },
      { id: 'home.toast.deleted', role: 'toast', text: 'Meeting prep deleted' },
      { id: 'home.toast.updated', role: 'toast', text: 'Meeting updated' },
    ],
  },
  {
    id: 'calendar',
    group: 'Calendar',
    label: 'Calendar',
    route: '/calendar',
    entries: [
      { id: 'cal.toggle.review', role: 'label', text: 'Client Review', location: 'Row toggle', source: 'src/components/canvas/CalendarCanvas.tsx' },
      { id: 'cal.toggle.parrot', role: 'label', text: 'Parrot Recording', location: 'Row toggle' },
      { id: 'cal.tip.generating', role: 'tooltip', text: 'This may take up to 20 minutes. You will be notified when ready.', location: 'Generating tooltip' },
      { id: 'cal.connect', role: 'button', text: 'Connect Household', location: 'Unmatched row action' },
      { id: 'cal.empty.title', role: 'empty-state', text: 'No meetings scheduled.', location: 'Empty calendar state' },
    ],
  },
  {
    id: 'clients',
    group: 'Clients',
    label: 'Clients',
    route: '/clients',
    entries: [
      { id: 'clients.title', role: 'page-title', text: 'Clients', location: 'Dark blue header', source: 'src/pages/ClientsPage.tsx' },
      { id: 'clients.section.potential', role: 'section-header', text: 'Potential Meetings', location: 'Body table' },
    ],
  },
  {
    id: 'setup',
    group: 'Setup',
    label: 'Setup (No Sync)',
    route: '/setup',
    entries: [
      { id: 'setup.title', role: 'page-title', text: 'Meeting Prep', source: 'src/pages/SetupPage.tsx' },
      { id: 'setup.cta', role: 'button', text: 'Get Started', location: 'Empty-state primary button' },
    ],
  },
  {
    id: 'setup-sync',
    group: 'Setup',
    label: 'Setup (Synced)',
    route: '/setup-sync',
    entries: [
      { id: 'setupsync.title', role: 'page-title', text: 'Meeting Prep', source: 'src/pages/SetupSyncPage.tsx' },
    ],
  },
  {
    id: 'calendar-onboarding',
    group: 'Setup',
    label: 'Calendar Onboarding',
    route: '/calendar-onboarding',
    description: 'Getting Started hero card shown above the calendar after sync.',
    entries: [
      { id: 'onb.badge', role: 'label', text: 'Getting Started', location: 'Hero card badge', source: 'src/components/canvas/CalendarCanvas.tsx' },
      { id: 'onb.intro', role: 'body', text: "Your calendar is synced. Here's how Meeting Prep prepares your Client Annual Reviews.", location: 'Hero card intro' },
      { id: 'onb.step1.title', role: 'section-header', text: 'Meetings Synced & Scheduled', location: 'Hero card step 1' },
      { id: 'onb.step1.body', role: 'body', text: 'Your calendar meetings have been synced. Any meeting identified as a Client Annual Review is automatically scheduled to have an agenda generated.', location: 'Hero card step 1' },
      { id: 'onb.step2.title', role: 'section-header', text: 'Add an Agenda', location: 'Hero card step 2' },
      { id: 'onb.step2.body', role: 'body', text: 'If a meeting shows a "Set Meeting Type" button, it wasn\'t auto-identified as a review. Click it to mark the meeting as a Client Annual Review and queue agenda generation.', location: 'Hero card step 2' },
      { id: 'onb.step3.title', role: 'section-header', text: 'More Agenda types coming soon', location: 'Hero card step 3' },
      { id: 'onb.step3.body', role: 'body', text: 'Meeting Prep currently only prepares agendas for Client Annual Review meetings. Other meeting types appear in your calendar for visibility, but no agenda will be generated.', location: 'Hero card step 3' },
    ],
  },
  {
    id: 'confirm-delete',
    group: 'Modals',
    label: 'Delete Meeting Prep — Confirmation',
    route: '/',
    description: 'Confirmation dialog for destructive deletes.',
    entries: [
      { id: 'confirm.delete.title', role: 'page-title', text: 'Delete Meeting Prep?', source: 'src/components/canvas/CalendarCanvas.tsx' },
      { id: 'confirm.delete.body', role: 'body', text: 'This permanently deletes the meeting prep and its agenda for {clientName} on {meetingDate}. The meeting itself will not be deleted or canceled. This cannot be undone.' },
      { id: 'confirm.delete.confirm', role: 'button', text: 'Delete Meeting Prep' },
      { id: 'confirm.delete.cancel', role: 'button', text: 'Cancel' },
    ],
  },
  {
    id: 'confirm-regenerate',
    group: 'Modals',
    label: 'Regenerate Agenda — Confirmation',
    route: '/',
    entries: [
      { id: 'confirm.regen.title', role: 'page-title', text: 'Regenerate Agenda?', source: 'src/components/canvas/renderers/MeetingAgendaRenderer.tsx' },
      { id: 'confirm.regen.body', role: 'body', text: 'Your current agenda will be replaced with a new one generated from the latest client data in Schwab Advisor Center. Make sure all updates are complete before regenerating. This cannot be undone.' },
      { id: 'confirm.regen.confirm', role: 'button', text: 'Regenerate Agenda' },
    ],
  },
  {
    id: 'meeting-details-modal',
    group: 'Modals',
    label: 'Schedule / Edit Meeting Prep',
    route: '/calendar',
    description: 'Modal for scheduling or editing a meeting prep.',
    entries: [
      { id: 'mdm.title.schedule', role: 'page-title', text: 'Schedule Meeting', source: 'src/components/canvas/MeetingDetailsModal.tsx' },
      { id: 'mdm.title.edit', role: 'page-title', text: 'Edit Meeting Prep' },
      { id: 'mdm.label.household', role: 'label', text: 'Household' },
      { id: 'mdm.label.required', role: 'label', text: 'Required Attendees' },
      { id: 'mdm.label.optional', role: 'label', text: 'Optional Attendees' },
      { id: 'mdm.label.type', role: 'label', text: 'Meeting Type' },
      { id: 'mdm.label.location', role: 'label', text: 'Location' },
      { id: 'mdm.button.save', role: 'button', text: 'Save' },
      { id: 'mdm.button.delete', role: 'button', text: 'Delete Meeting Prep and Agenda' },
      { id: 'mdm.placeholder.household', role: 'placeholder', text: 'Search households…' },
    ],
  },
];
