// @ts-nocheck
import { differenceInYears, parseISO, isValid, format, addYears, startOfDay, isAfter, isBefore } from 'date-fns';

/**
 * Calculate age from birth date string
 */
export const calculateAge = (birthDate: string): number => {
  try {
    const birth = parseISO(birthDate);
    if (!isValid(birth)) {
      console.warn('Invalid birth date:', birthDate);
      return 0;
    }
    return differenceInYears(new Date(), birth);
  } catch (error) {
    console.warn('Error calculating age:', error);
    return 0;
  }
};

/**
 * Get the next birthday date for a person
 */
export const getNextBirthday = (birthDate: string): Date | null => {
  try {
    const birth = parseISO(birthDate);
    if (!isValid(birth)) return null;
    
    const currentYear = new Date().getFullYear();
    const thisYearBirthday = new Date(currentYear, birth.getMonth(), birth.getDate());
    const nextYearBirthday = new Date(currentYear + 1, birth.getMonth(), birth.getDate());
    
    // If this year's birthday has passed, return next year's
    return isAfter(startOfDay(new Date()), startOfDay(thisYearBirthday)) 
      ? nextYearBirthday 
      : thisYearBirthday;
  } catch (error) {
    console.warn('Error calculating next birthday:', error);
    return null;
  }
};

/**
 * Format birth date for display
 */
export const formatBirthday = (birthDate: string): string => {
  try {
    const birth = parseISO(birthDate);
    if (!isValid(birth)) return 'Invalid Date';
    return format(birth, 'MMMM d, yyyy');
  } catch (error) {
    console.warn('Error formatting birthday:', error);
    return 'Invalid Date';
  }
};

/**
 * Get days until next birthday
 */
export const getDaysUntilBirthday = (birthDate: string): number => {
  try {
    const nextBirthday = getNextBirthday(birthDate);
    if (!nextBirthday) return 0;
    
    const today = startOfDay(new Date());
    const nextBday = startOfDay(nextBirthday);
    
    // If birthday is today, return 0
    if (today.getTime() === nextBday.getTime()) return 0;
    
    // Calculate difference in days
    const diffTime = nextBday.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch (error) {
    console.warn('Error calculating days until birthday:', error);
    return 0;
  }
};

/**
 * Check if today is someone's birthday
 */
export const isBirthdayToday = (birthDate: string): boolean => {
  try {
    const birth = parseISO(birthDate);
    if (!isValid(birth)) return false;
    
    const today = new Date();
    return birth.getMonth() === today.getMonth() && birth.getDate() === today.getDate();
  } catch (error) {
    return false;
  }
};

/**
 * Sort household members by upcoming birthdays
 */
export const sortByUpcomingBirthdays = (people: Array<{ birthDate: string; [key: string]: any }>) => {
  return people
    .filter(person => person.birthDate)
    .sort((a, b) => {
      const daysA = getDaysUntilBirthday(a.birthDate);
      const daysB = getDaysUntilBirthday(b.birthDate);
      
      // Put today's birthdays first
      if (daysA === 0 && daysB !== 0) return -1;
      if (daysB === 0 && daysA !== 0) return 1;
      
      return daysA - daysB;
    });
};