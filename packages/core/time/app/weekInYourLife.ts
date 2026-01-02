import type { Tag } from "../../utils/id";
import { addItemInSortedList, removeItemInSortedList } from "../../utils/sortList";
import { getSortListFromTagableList } from "../../utils/tag";
import type { LifeChapter, WeekInYourLife } from "../repo/lifeChapter";

export interface ApplicationState {
    // lifeChapterList is always sorted by startWeekNumber
    lifeChapters: LifeChapter[];
    // specialWeekList is always sorted by startWeekNumber
    specialWeeks: LifeChapter[];
    tags: Tag[];
    lifeSpanWeeks: number;
    birthDate: Date;
}

const UnplannedTag: Tag = { id: "Unplanned", name: "Unplanned", color: "#f3f4f6ff" };
const CareerTag: Tag = { id: "Career", name: "Career", color: "#dbeafeff" };
const VacationTag: Tag = { id: "Vacation", name: "Vacation", color: "#e0d9d9ff" };
const ChildhoodTag: Tag = { id: "Childhood", name: "Childhood", color: "#e0d9d9ff" };
const EducationTag: Tag = { id: "Education", name: "Education", color: "#e0d9d9ff" };

const lifeChapterMoreThanFn: (a: LifeChapter, b: LifeChapter) => boolean = (a: LifeChapter, b: LifeChapter) => a.startWeekNumber > b.startWeekNumber;

export function initApplicationState(birthDate: Date, expectedLifeSpanYears: number): ApplicationState {
    let lifeSpanWeeks = getLifeSpanWeeks(birthDate, expectedLifeSpanYears);
    return { lifeChapters: [], specialWeeks: [], tags: [UnplannedTag, CareerTag, VacationTag, ChildhoodTag, EducationTag], lifeSpanWeeks, birthDate };
}

export function getLifeSpanWeeks(birthDate: Date, expectedLifeSpanYears: number): number {
    const lastDayonEarth = new Date(birthDate);
    lastDayonEarth.setFullYear(birthDate.getFullYear() + expectedLifeSpanYears);
    return getWeekNumberFromBirthDate(birthDate, lastDayonEarth);
}

export function getCurrentWeekNumber(birthDate: Date): number {
    return getWeekNumberFromBirthDate(birthDate, new Date());
}

export function getWeekNumberFromBirthDate(birthDate: Date, date: Date): number {
    const diffTime = Math.abs(date.getTime() - birthDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7);
}

export function getWeekStartDateAndEndDate(birthDate: Date, startWeekNumber: number, endWeekNumber: number): { startDate: Date; endDate: Date } {
    if (startWeekNumber > endWeekNumber) {
        throw new Error("startWeekNumber must be less than endWeekNumber");
    }
    const startDate = new Date(birthDate);
    startDate.setDate(birthDate.getDate() + startWeekNumber * 7);
    const endDate = new Date(birthDate);
    endDate.setDate(birthDate.getDate() + (endWeekNumber + 1) * 7 - 1);
    return { startDate, endDate };
}

export function addLifeChapter(lifeChapters: LifeChapter[], lifeChapter: LifeChapter): LifeChapter[] {
    return addItemInSortedList(lifeChapters, lifeChapter, lifeChapterMoreThanFn);
}

export function removeLifeChapter(lifeChapters: LifeChapter[], lifeChapter: LifeChapter): LifeChapter[] {
    return removeItemInSortedList(lifeChapters, lifeChapter, lifeChapterMoreThanFn);
}

export function updateLifeChapter(lifeChapters: LifeChapter[], lifeChapter: LifeChapter): LifeChapter[] {
    lifeChapters = removeLifeChapter(lifeChapters, lifeChapter);
    return addLifeChapter(lifeChapters, lifeChapter);
}

export function generateWeekInYourLife(
    lifeSpanWeeks: number,
    lifeChapters: LifeChapter[],
    specialWeeks: LifeChapter[],
): WeekInYourLife[] {
    const timeline: WeekInYourLife[] = [];
    let currentWeek = 0;
    let chapterIdx = 0;
    let specialIdx = 0;

    while (currentWeek < lifeSpanWeeks) {
        while (chapterIdx < lifeChapters.length && lifeChapters[chapterIdx].endWeekNumber < currentWeek) {
            chapterIdx++;
        }
        while (specialIdx < specialWeeks.length && specialWeeks[specialIdx].endWeekNumber < currentWeek) {
            specialIdx++;
        }

        const activeChapter = lifeChapters[chapterIdx];
        const activeSpecial = specialWeeks[specialIdx];

        if (activeSpecial && activeSpecial.startWeekNumber <= currentWeek) {
            const end = Math.min(activeSpecial.endWeekNumber, lifeSpanWeeks - 1);

            timeline.push({
                weekNumberStart: currentWeek,
                weekNumberEnd: end,
                focus: activeSpecial
            });

            currentWeek = end + 1;
            continue;
        }

        if (activeChapter && activeChapter.startWeekNumber <= currentWeek) {
            let segmentEnd = Math.min(activeChapter.endWeekNumber, lifeSpanWeeks - 1);

            if (activeSpecial && activeSpecial.startWeekNumber <= segmentEnd) {
                segmentEnd = activeSpecial.startWeekNumber - 1;
            }

            timeline.push({
                weekNumberStart: currentWeek,
                weekNumberEnd: segmentEnd,
                focus: activeChapter
            });

            currentWeek = segmentEnd + 1;
            continue;
        }

        const nextChapterStart = activeChapter ? activeChapter.startWeekNumber : Infinity;
        const nextSpecialStart = activeSpecial ? activeSpecial.startWeekNumber : Infinity;

        const nextEventStart = Math.min(nextChapterStart, nextSpecialStart);
        const gapEnd = Math.min(nextEventStart - 1, lifeSpanWeeks - 1);

        timeline.push({
            weekNumberStart: currentWeek,
            weekNumberEnd: gapEnd,
            focus: undefined
        });

        currentWeek = gapEnd + 1;
    }

    return timeline;
}

export function getCurrentWeekInYourLife(
    birthDate: Date,
    weekInYourLifes: WeekInYourLife[],
): WeekInYourLife | undefined {
    const currentWeekNumber = getCurrentWeekNumber(birthDate);
    return weekInYourLifes.find(week => week.weekNumberStart <= currentWeekNumber && week.weekNumberEnd >= currentWeekNumber);
}

export function generateWeekInYourLifeWithPassAndFuture(
    birthDate: Date,
    weekInYourLifes: WeekInYourLife[],
): { passWeeks: WeekInYourLife[], futureWeeks: WeekInYourLife[] } {
    const currentWeekNumber = getCurrentWeekNumber(birthDate);
    const passWeeks: WeekInYourLife[] = [];
    const futureWeeks: WeekInYourLife[] = [];

    for (const week of weekInYourLifes) {
        if (week.weekNumberEnd <= currentWeekNumber) {
            passWeeks.push(week);
        } else if (week.weekNumberStart > currentWeekNumber) {
            futureWeeks.push(week);
        } else {
            passWeeks.push({
                ...week,
                weekNumberEnd: currentWeekNumber
            });

            futureWeeks.push({
                ...week,
                weekNumberStart: currentWeekNumber + 1
            });
        }
    }

    return { passWeeks, futureWeeks };
}

export function getSortTagsFromWeekInYourLife(
    weekInYourLifes: WeekInYourLife[],
): { tag: Tag; value: number }[] {
    const lifeChapterList: LifeChapter[] = weekInYourLifes.filter(weekInYourLife => weekInYourLife.focus !== undefined).map(weekInYourLife => weekInYourLife.focus!);
    const valueFn = (lifeChapter: LifeChapter) => lifeChapter.endWeekNumber - lifeChapter.startWeekNumber;
    return getSortListFromTagableList(lifeChapterList, valueFn);
}

// ============================================================================
// Dashboard Functions
// ============================================================================

/**
 * Get remaining weeks of life
 */
export function getRemainingWeeks(birthDate: Date, lifeSpanWeeks: number): number {
    const currentWeek = getCurrentWeekNumber(birthDate);
    return Math.max(0, lifeSpanWeeks - currentWeek);
}

/**
 * Get remaining years of physically active life
 * Uses Date directly for age calculation rather than week-based calculation
 */
export function getRemainingActiveYears(birthDate: Date, activeAgeLimit: number = 65): number {
    const now = new Date();
    const currentAge = (now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return Math.max(0, Math.floor(activeAgeLimit - currentAge));
}

/**
 * Get life progress as percentage (0-100)
 */
export function getLifeProgressPercentage(birthDate: Date, lifeSpanWeeks: number): number {
    const currentWeek = getCurrentWeekNumber(birthDate);
    return Math.min(100, Math.round((currentWeek / lifeSpanWeeks) * 100));
}

/**
 * Convert week number to age in years
 */
export function getAgeFromWeekNumber(weekNumber: number): number {
    return Math.floor(weekNumber / 52);
}

/**
 * Get age range (in years) for a life chapter
 */
export function getAgeRangeFromChapter(chapter: LifeChapter): { startAge: number; endAge: number } {
    return {
        startAge: getAgeFromWeekNumber(chapter.startWeekNumber),
        endAge: getAgeFromWeekNumber(chapter.endWeekNumber)
    };
}

/**
 * Get total duration of a chapter in weeks
 */
export function getChapterDuration(chapter: LifeChapter): number {
    return chapter.endWeekNumber - chapter.startWeekNumber + 1;
}

/**
 * Get how many weeks have elapsed since chapter started (for ongoing chapters)
 */
export function getChapterDurationSoFar(birthDate: Date, chapter: LifeChapter): number {
    const currentWeek = getCurrentWeekNumber(birthDate);
    if (currentWeek < chapter.startWeekNumber) return 0;
    return Math.min(currentWeek - chapter.startWeekNumber + 1, getChapterDuration(chapter));
}

/**
 * Get upcoming special events (not yet started)
 */
export function getUpcomingSpecialEvents(
    birthDate: Date,
    specialWeeks: LifeChapter[],
    limit: number = 5
): LifeChapter[] {
    const currentWeek = getCurrentWeekNumber(birthDate);
    return specialWeeks
        .filter(event => event.startWeekNumber > currentWeek)
        .slice(0, limit);
}

/**
 * Get weeks until an event starts
 */
export function getWeeksUntilEvent(birthDate: Date, event: LifeChapter): number {
    const currentWeek = getCurrentWeekNumber(birthDate);
    return Math.max(0, event.startWeekNumber - currentWeek);
}

/**
 * Get total unplanned weeks (gaps with no assigned chapter)
 */
export function getUnplannedWeeks(weekInYourLifes: WeekInYourLife[]): number {
    return weekInYourLifes
        .filter(w => w.focus === undefined)
        .reduce((sum, w) => sum + (w.weekNumberEnd - w.weekNumberStart + 1), 0);
}

/**
 * Validate that a new chapter doesn't overlap with existing chapters
 */
export function validateChapterOverlap(
    chapters: LifeChapter[],
    newChapter: { startWeekNumber: number; endWeekNumber: number; id?: string }
): { hasOverlap: boolean; overlappingChapters: LifeChapter[] } {
    const overlapping = chapters.filter(c => {
        // Skip self when updating existing chapter
        if (newChapter.id && c.id === newChapter.id) return false;
        // Check if ranges overlap
        return !(newChapter.endWeekNumber < c.startWeekNumber ||
            newChapter.startWeekNumber > c.endWeekNumber);
    });
    return { hasOverlap: overlapping.length > 0, overlappingChapters: overlapping };
}