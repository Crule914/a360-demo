// @ts-nocheck
/**
 * messySubjectGenerator
 *
 * Generates "messy", real-world style calendar invite subjects so the
 * Calendar table mirrors the kind of titles advisors actually receive
 * (lowercase, abbreviations, names, slashes, "re:", "FW:", etc.) instead
 * of perfectly normalized labels like "Annual Review".
 *
 * The output is deterministic based on the meeting id so the table stays
 * stable across re-renders.
 */

const TYPE_VARIANTS: Record<string, string[]> = {
  'Annual Review': [
    'Annual review',
    'annual review // {client}',
    'Annual Review - {client}',
    'Yearly check-in w/ {first}',
    '{client} | annual review',
    'Annual review catch-up',
  ],
  'Bi-Annual Review': [
    'Mid-year review',
    'Semi-annual review // {client}',
    '{first} - 6mo review',
    'Bi-annual planning chat',
    'Half-year review w/ {client}',
  ],
  'Quarterly Review': [
    'Q review',
    'Quarterly check-in - {client}',
    'QBR / {first}',
    'Portfolio review (Q)',
    '{client} quarterly',
    'Quarterly sync',
  ],
  'Client Planning': [
    'Planning chat',
    'Planning session w/ {client}',
    'follow up - planning',
    '{first} planning discussion',
    'Re: planning items',
  ],
  'Estate Planning': [
    'Estate planning - {first}',
    'Estate docs review',
    '{client} estate convo',
    'estate planning follow-up',
  ],
  'Tax Planning': [
    'Tax planning chat',
    '{first} - tax strategy',
    'tax planning / year-end',
    'Re: tax items',
  ],
  'Insurance Review': [
    'Insurance review',
    '{first} - insurance check-in',
    'Insurance policy review',
    'insurance follow up',
  ],
  'Financial Planning': [
    'Financial planning',
    '{first} planning meeting',
    'planning follow up',
    'FP review - {client}',
  ],
};

const GENERIC_VARIANTS: string[] = [
  '{type} - {client}',
  '{type} // {first}',
  '{client} {type}',
  'Re: {type}',
  '{first} - quick chat',
  'Catch up w/ {first}',
];

// Deterministic small hash so the same meeting id always gets the same subject
const hashString = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
};

interface MessySubjectInput {
  id?: string;
  type?: string;
  title?: string;
  clientName?: string;
}

export const generateMessySubject = (meeting: MessySubjectInput): string => {
  const type = meeting.type || meeting.title || 'Meeting';
  const client = meeting.clientName || '';
  // Take just the first first-name from "Robert & Patricia Johnson" / "John Smith"
  const firstWord = client.split(/[&,]/)[0].trim().split(/\s+/)[0] || client;

  const pool = TYPE_VARIANTS[type] || GENERIC_VARIANTS;
  const seed = hashString((meeting.id || '') + type + client);
  const template = pool[seed % pool.length];

  return template
    .replace('{type}', type)
    .replace('{client}', client || type)
    .replace('{first}', firstWord || client || type);
};
