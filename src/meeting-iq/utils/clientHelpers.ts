// @ts-nocheck
import { ClientData, HeaderDropdownItem } from '@miq/types/advisor';

export const transformClientsToDropdownItems = (clients: ClientData[]): HeaderDropdownItem[] => {
  return clients.map((client) => ({
    id: client.id,
    title: client.name,
    subtitle: '', // Will be handled by custom render
    priority: getClientPriority(client.category),
    timestamp: client.lastMeeting,
    action: 'select_client',
    data: client,
  }));
};

export const getClientPriority = (category: string): 'high' | 'medium' | 'low' => {
  switch (category) {
    case 'high-touch':
      return 'high';
    case 'enhanced':
      return 'medium';
    default:
      return 'low';
  }
};

export const getClientInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const formatLastMeeting = (date: Date | string | undefined): string => {
  if (!date) return 'No recent meeting';
  
  // Convert string to Date if needed
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Validate the date
  if (isNaN(dateObj.getTime())) return 'Invalid date';
  
  const diffTime = Math.abs(new Date().getTime() - dateObj.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 60) return '1 month ago';
  return `${Math.floor(diffDays / 30)} months ago`;
};