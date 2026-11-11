// @ts-nocheck
import { ClientData } from '@miq/types/advisor';

export const generateCRMData = (client: ClientData): Partial<ClientData> => {
  const age = client.birthDate ? new Date().getFullYear() - new Date(client.birthDate).getFullYear() : 45;
  const isMarried = Math.random() > 0.3;
  const hasChildren = Math.random() > 0.4;
  const isRetired = age > 65;
  
  return {
    extendedHousehold: generateHousehold(client, age, isMarried, hasChildren),
    professionalNetwork: generateProfessionalNetwork(client),
    preferredCommunication: generateCommunicationPrefs(client),
    relationshipHistory: generateRelationshipHistory(client, age)
  };
};

const generateHousehold = (client: ClientData, age: number, isMarried: boolean, hasChildren: boolean) => {
  const household = [];
  
  // Add spouse if married
  if (isMarried) {
    const spouseAge = age + Math.floor(Math.random() * 6) - 3;
    household.push({
      name: getSpouseName(client.name),
      relationship: 'spouse',
      email: getSpouseEmail(client.email),
      phone: getSpousePhone(client.phone),
      birthDate: `${new Date().getFullYear() - spouseAge}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      role: 'spouse' as const,
      responsibilities: 'Joint account holder, backup contact'
    });
  }
  
  // Add children if applicable
  if (hasChildren) {
    const numChildren = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numChildren; i++) {
      const childAge = Math.floor(Math.random() * 25) + 5;
      household.push({
        name: getChildName(i),
        relationship: 'child',
        birthDate: `${new Date().getFullYear() - childAge}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        role: 'beneficiary' as const,
        responsibilities: childAge < 18 ? 'Minor dependent' : 'Adult beneficiary'
      });
    }
  }
  
  // Add emergency contact
  household.push({
    name: getEmergencyContactName(),
    relationship: 'sibling',
    email: getRandomEmail(),
    phone: getRandomPhone(),
    role: 'emergency_contact' as const,
    responsibilities: 'Primary emergency contact',
    emergencyContactPriority: 1
  });
  
  return household;
};

const generateProfessionalNetwork = (client: ClientData) => {
  const hasHighAssets = client.householdAssets > 1000000;
  
  return {
    accountant: {
      name: getRandomAccountantName(),
      firm: getRandomAccountingFirm(),
      email: getRandomProfessionalEmail('accountant'),
      phone: getRandomPhone(),
      specialties: hasHighAssets 
        ? ['Tax Planning', 'Estate Tax', 'Business Tax', 'High Net Worth']
        : ['Individual Tax', 'Retirement Planning', 'Small Business'],
      yearsWorking: Math.floor(Math.random() * 8) + 3,
      lastContact: getRecentDate(),
      collaborationFrequency: 'quarterly',
      referralSource: 'client referral'
    },
    estateAttorney: hasHighAssets ? {
      name: getRandomAttorneyName(),
      firm: getRandomLawFirm(),
      email: getRandomProfessionalEmail('attorney'),
      phone: getRandomPhone(),
      specialties: ['Estate Planning', 'Trust Administration', 'Probate Law', 'Tax Law'],
      yearsWorking: Math.floor(Math.random() * 5) + 4,
      lastContact: getRecentDate(),
      collaborationFrequency: 'annually',
      referralSource: 'professional referral'
    } : undefined,
    insuranceAgent: {
      name: getRandomInsuranceName(),
      firm: getRandomInsuranceFirm(),
      email: getRandomProfessionalEmail('insurance'),
      phone: getRandomPhone(),
      coverageTypes: ['Life Insurance', 'Disability Insurance', 'Long Term Care', 'Umbrella Policy'],
      yearsWorking: Math.floor(Math.random() * 6) + 2,
      lastContact: getRecentDate(),
      collaborationFrequency: 'semi-annually'
    }
  };
};

const generateCommunicationPrefs = (client: ClientData) => {
  const methods = ['email', 'phone', 'text', 'in_person'] as const;
  const frequencies = ['weekly', 'monthly', 'quarterly', 'as_needed', 'bi-weekly'] as const;
  
  return {
    method: methods[Math.floor(Math.random() * methods.length)],
    frequency: frequencies[Math.floor(Math.random() * frequencies.length)],
    bestTimeToContact: getBestTimeToContact()
  };
};

const generateRelationshipHistory = (client: ClientData, age: number) => {
  const history = [];
  const startYear = new Date().getFullYear() - Math.floor(Math.random() * 8) - 2;
  
  // Onboarding
  history.push({
    date: new Date(`${startYear}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-15`),
    milestone: 'Client Onboarding Completed',
    type: 'onboarding' as const,
    description: 'Successfully onboarded as new client, completed risk assessment and initial portfolio setup',
    outcome: 'Account established with initial portfolio allocation'
  });
  
  // Account opening
  history.push({
    date: new Date(`${startYear}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-20`),
    milestone: 'Investment Account Opened',
    type: 'account_opening' as const,
    description: 'Opened primary investment account and established automatic contribution schedule',
    outcome: 'Monthly contributions initiated'
  });
  
  // Major transaction (if high assets)
  if (client.householdAssets > 500000) {
    history.push({
      date: new Date(`${startYear + 1}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-10`),
      milestone: 'Portfolio Restructuring',
      type: 'major_transaction' as const,
      description: 'Completed major portfolio rebalancing following market analysis and risk assessment update',
      outcome: 'Improved diversification and risk-adjusted returns'
    });
  }
  
  // Recent review
  history.push({
    date: new Date(client.lastMeeting || new Date()),
    milestone: 'Quarterly Portfolio Review',
    type: 'regular_review' as const,
    description: 'Conducted comprehensive portfolio review, discussed performance and adjusted strategy',
    outcome: 'Portfolio performing within target parameters'
  });
  
  return history.sort((a, b) => b.date.getTime() - a.date.getTime());
};

// Helper functions
const getSpouseName = (clientName: string): string => {
  const spouseNames = ['Jennifer', 'Sarah', 'Michelle', 'Lisa', 'Karen', 'Nancy', 'Betty', 'Helen', 'Sandra', 'Donna'];
  const maleNames = ['Michael', 'David', 'John', 'James', 'Robert', 'Mark', 'Paul', 'Steven', 'Kenneth', 'Joshua'];
  
  // Simple gender detection based on common names
  const femaleIndicators = ['Sarah', 'Jennifer', 'Lisa', 'Karen', 'Nancy', 'Betty', 'Helen', 'Sandra', 'Donna', 'Patricia', 'Linda', 'Barbara', 'Elizabeth', 'Susan', 'Jessica', 'Margaret', 'Dorothy', 'Ruth', 'Sharon', 'Maria'];
  
  const isClientFemale = femaleIndicators.some(name => clientName.includes(name));
  const names = isClientFemale ? maleNames : spouseNames;
  
  const lastName = clientName.split(' ').pop();
  return names[Math.floor(Math.random() * names.length)] + ' ' + lastName;
};

const getSpouseEmail = (clientEmail: string): string => {
  const domain = clientEmail.split('@')[1];
  const prefix = clientEmail.split('@')[0];
  return prefix.replace(/[0-9]/g, '') + '.spouse@' + domain;
};

const getSpousePhone = (clientPhone: string): string => {
  const base = clientPhone.replace(/\D/g, '');
  const lastDigit = parseInt(base.slice(-1));
  const newLastDigit = (lastDigit + 1) % 10;
  return clientPhone.slice(0, -1) + newLastDigit;
};

const getChildName = (index: number): string => {
  const names = ['Emma', 'Olivia', 'Sophia', 'Isabella', 'Ava', 'Mia', 'Abigail', 'Emily', 'Charlotte', 'Harper', 
                 'Liam', 'Noah', 'Oliver', 'Elijah', 'William', 'James', 'Benjamin', 'Lucas', 'Henry', 'Alexander'];
  return names[index % names.length];
};

const getEmergencyContactName = (): string => {
  const names = ['Rebecca Wilson', 'Peter Johnson', 'Jennifer Davis', 'Christopher Brown', 'Amanda Miller', 
                 'Matthew Garcia', 'Sarah Rodriguez', 'Daniel Martinez', 'Lisa Anderson', 'Kevin Taylor'];
  return names[Math.floor(Math.random() * names.length)];
};

const getRandomAccountantName = (): string => {
  const names = ['Margaret Foster CPA', 'Samuel Mitchell CPA', 'Sandra Powell CPA', 'Richard Evans CPA', 
                 'Catherine Brooks CPA', 'William Reed CPA', 'Janet Cook CPA', 'Anthony Hill CPA'];
  return names[Math.floor(Math.random() * names.length)];
};

const getRandomAccountingFirm = (): string => {
  const firms = ['Foster & Associates CPAs', 'Mitchell Tax Partners', 'Powell Financial Services', 
                 'Evans & Reed CPAs', 'Brooks Accounting Group', 'Reed & Associates', 'Cook Tax Solutions'];
  return firms[Math.floor(Math.random() * firms.length)];
};

const getRandomAttorneyName = (): string => {
  const names = ['James Wellington Esq.', 'Victoria Stonefield Esq.', 'Charles Pemberton Esq.', 
                 'Alexandra Whitmore Esq.', 'Benjamin Fairfield Esq.', 'Caroline Ashworth Esq.'];
  return names[Math.floor(Math.random() * names.length)];
};

const getRandomLawFirm = (): string => {
  const firms = ['Wellington & Partners LLP', 'Stonefield Estate Law', 'Pemberton Legal Group', 
                 'Whitmore & Associates', 'Fairfield Law Offices', 'Ashworth Estate Planning'];
  return firms[Math.floor(Math.random() * firms.length)];
};

const getRandomInsuranceName = (): string => {
  const names = ['Karen Shields', 'Robert Fleming', 'Rachel Murphy', 'Paul Harrison', 
                 'Linda Peterson', 'Steven Clark', 'Nancy Wright', 'Mark Anderson'];
  return names[Math.floor(Math.random() * names.length)];
};

const getRandomInsuranceFirm = (): string => {
  const firms = ['Shields Insurance Group', 'Fleming & Associates', 'Murphy Insurance Services',
                 'Harrison Benefits', 'Peterson Insurance Agency', 'Clark Risk Management'];
  return firms[Math.floor(Math.random() * firms.length)];
};

const getRandomProfessionalEmail = (type: string): string => {
  const domains = ['email.com', 'business.com', 'professional.net', 'services.org'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${type}.contact@${domain}`;
};

const getRandomPhone = (): string => {
  const area = 555;
  const exchange = Math.floor(Math.random() * 900) + 100;
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `(${area}) ${exchange}-${number}`;
};

const getRandomEmail = (): string => {
  const domains = ['email.com', 'contact.net', 'personal.org'];
  const prefixes = ['contact', 'info', 'personal', 'family'];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]}@${domains[Math.floor(Math.random() * domains.length)]}`;
};

const getRecentDate = (): string => {
  const days = Math.floor(Math.random() * 90) + 1;
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

const getBestTimeToContact = (): string => {
  const times = [
    'Weekday mornings (9-11 AM)',
    'Weekday afternoons (2-4 PM)', 
    'Weekday evenings (6-8 PM)',
    'Weekend mornings (10 AM-12 PM)',
    'Any time weekdays',
    'Lunch time (12-1 PM)'
  ];
  return times[Math.floor(Math.random() * times.length)];
};