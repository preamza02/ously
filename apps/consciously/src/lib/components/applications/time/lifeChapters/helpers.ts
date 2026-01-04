/**
 * UI Helper Functions for Life in Weeks
 * These are display-specific functions that don't belong in packages/core
 */

/**
 * Format age range for display
 * @example formatAgeRange(18, 22) => "Age 18-22"
 * @example formatAgeRange(22, 22) => "Age 22"
 */
export function formatAgeRange(startAge: number, endAge: number): string {
    if (startAge === endAge) return `Age ${startAge}`;
    return `Age ${startAge}-${endAge}`;
}

/**
 * Format weeks as a readable string
 * @example formatWeeks(52) => "52 weeks"
 * @example formatWeeks(1) => "1 week"
 */
export function formatWeeks(weeks: number): string {
    return weeks === 1 ? '1 week' : `${weeks} weeks`;
}

/**
 * Format weeks as a relative string
 * @example formatWeeksRelative(4) => "In 4 weeks"
 * @example formatWeeksRelative(1) => "In 1 week"
 * @example formatWeeksRelative(0) => "This week"
 */
export function formatWeeksRelative(weeks: number): string {
    if (weeks === 0) return 'This week';
    if (weeks === 1) return 'In 1 week';
    return `In ${weeks} weeks`;
}

/**
 * Format duration for display
 * @example formatDurationSoFar(82) => "82 weeks so far"
 */
export function formatDurationSoFar(weeks: number): string {
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} so far`;
}

import { IconType } from '@ously/ui';

/**
 * Get an icon type based on tag ID
 * Maps common tag names to appropriate icons
 */
export function getIconForTag(tagId: string | undefined): IconType {
    const id = tagId?.toLowerCase();
    if (id === 'vacation' || id === 'travel') return IconType.FLIGHT_TAKEOFF;
    if (id === 'education') return IconType.SCHOOL;
    if (id === 'childhood') return IconType.TOYS;
    if (id === 'career' || id === 'work') return IconType.WORK;
    if (id === 'health' || id === 'relationship') return IconType.FAVORITE;
    if (id === 'family') return IconType.HOME;
    if (id === 'celebration') return IconType.CELEBRATION;
    if (id === 'milestone') return IconType.STAR;
    return IconType.ROCKET_LAUNCH;
}


/**
 * Calculate the week number of a date relative to a birth date
 */
export function getWeekNumber(date: Date, birthDate: Date): number {
    const diffTime = date.getTime() - birthDate.getTime();
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
}
