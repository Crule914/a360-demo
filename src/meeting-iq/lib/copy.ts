// @ts-nocheck
/**
 * Stubbed for in-process port: the original copy override store reads from
 * a Supabase `copy_review_suggestions` table that does not exist in this
 * project. Resolves all keys to their hardcoded fallback string.
 */

export function enableCopyRealtime(): void {}
export function applyCopyOverride(_entryId: string, _value: string | null): void {}
export function useCopy(_entryId: string, fallback: string): string {
  return fallback;
}
