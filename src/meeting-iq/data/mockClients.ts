// @ts-nocheck
import { ClientData } from '@miq/types/advisor';
import { getAllUnifiedClients } from './unifiedClientData';

// Lazy-loaded: don't call getAllUnifiedClients() at module level
let _cached: ClientData[] | null = null;
const getMockClients = (): ClientData[] => {
  if (!_cached) _cached = getAllUnifiedClients();
  return _cached;
};

// O(1) name lookup map, built once on first use
let _nameMap: Map<string, ClientData> | null = null;
const getNameMap = (): Map<string, ClientData> => {
  if (!_nameMap) {
    _nameMap = new Map();
    for (const c of getMockClients()) {
      _nameMap.set(c.name.toLowerCase(), c);
    }
  }
  return _nameMap;
};

export const mockClients = new Proxy([] as ClientData[], {
  get(target, prop) {
    const data = getMockClients();
    return Reflect.get(data, prop);
  }
});

export const getClientById = (clientId: string): ClientData | undefined => {
  return getMockClients().find(c => c.id === clientId);
};

export const getClientByName = (clientName: string): ClientData | undefined => {
  const needle = clientName.toLowerCase();
  // Fast exact match first
  const exact = getNameMap().get(needle);
  if (exact) return exact;
  // Fallback to substring match
  for (const [key, client] of getNameMap()) {
    if (key.includes(needle) || needle.includes(key)) return client;
  }
  return undefined;
};
