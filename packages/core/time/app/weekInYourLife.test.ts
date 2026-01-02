import { describe, it, expect } from 'vitest';
import type { LifeChapter, WeekInYourLife } from '../repo/lifeChapter';
import type { Tag } from '../../utils/id';
import {
    initApplicationState,
    getCurrentWeekNumber,
    getWeekNumberFromBirthDate,
    getWeekStartDateAndEndDate,
    addLifeChapter,
    removeLifeChapter,
    updateLifeChapter,
    generateWeekInYourLife,
    getCurrentWeekInYourLife,
    generateWeekInYourLifeWithPassAndFuture,
    getSortTagsFromWeekInYourLife,
    getRemainingWeeks,
    getRemainingActiveYears,
    getLifeProgressPercentage,
    getAgeFromWeekNumber,
    getAgeRangeFromChapter,
    getChapterDuration,
    getChapterDurationSoFar,
    getUpcomingSpecialEvents,
    getWeeksUntilEvent,
    getUnplannedWeeks,
    validateChapterOverlap,
    ApplicationState
} from './weekInYourLife';
import { TestInterface } from '../../utils/test_utils';

// Test fixtures
const createTag = (id: string, name: string, color: string = '#000000'): Tag => ({ id, name, color });

const createChapter = (
    id: string,
    name: string,
    startWeekNumber: number,
    endWeekNumber: number,
    tags: Tag[] = []
): LifeChapter => ({
    id,
    name,
    description: '',
    startWeekNumber,
    endWeekNumber,
    tags
});

const UnplannedTag = createTag("Unplanned", "Unplanned", "#f3f4f6ff");
const CareerTag = createTag("Career", "Career", "#dbeafeff");
const VacationTag = createTag("Vacation", "Vacation", "#e0d9d9ff");
const ChildhoodTag = createTag("Childhood", "Childhood", "#e0d9d9ff");
const EducationTag = createTag("Education", "Education", "#e0d9d9ff");
const defaultTags = [UnplannedTag, CareerTag, VacationTag, ChildhoodTag, EducationTag];

// ============================================================================
// initApplicationState
// ============================================================================

const initApplicationTestCases: (TestInterface<ApplicationState> & {
    birthDate: Date;
    lifeSpanYears: number;
})[] = [
        {
            name: 'should initialize state with correct lifeSpanWeeks for 80 years',
            birthDate: new Date('1990-01-01'),
            lifeSpanYears: 80,
            expectedResult: {
                lifeSpanWeeks: 4174, // 80 years * 52.17 weeks approx, but implementation uses getWeekNumberFromBirthDate
                lifeChapters: [],
                specialWeeks: [],
                tags: defaultTags,
                birthDate: new Date('1990-01-01'),
            }
        }
    ];

describe("initApplicationState", () => {
    it.each(initApplicationTestCases)("%s", ({ birthDate, lifeSpanYears, expectedResult }) => {
        const state = initApplicationState(birthDate, lifeSpanYears);
        expect(state).toEqual(expectedResult);
    });
});

// ============================================================================
// getWeekNumberFromBirthDate
// ============================================================================

const getWeekNumberTestCases: (TestInterface<number> & {
    birthDate: Date;
    targetDate: Date;
})[] = [
        {
            name: 'should return 0 for same date',
            birthDate: new Date('1990-01-01'),
            targetDate: new Date('1990-01-01'),
            expectedResult: 0
        },
        {
            name: 'should return 1 for one week later',
            birthDate: new Date('1990-01-01'),
            targetDate: new Date('1990-01-08'),
            expectedResult: 1
        },
        {
            name: 'should return 52 for one year later',
            birthDate: new Date('1990-01-01'),
            targetDate: new Date('1991-01-01'),
            expectedResult: 52
        }
    ];

describe("getWeekNumberFromBirthDate", () => {
    it.each(getWeekNumberTestCases)("%s", ({ birthDate, targetDate, expectedResult }) => {
        const result = getWeekNumberFromBirthDate(birthDate, targetDate);
        expect(result).toBe(expectedResult);
    });
});

// ============================================================================
// getWeekStartDateAndEndDate
// ============================================================================

const getWeekRangeTestCases: (TestInterface<{ startDate: Date; endDate: Date } | Error> & {
    birthDate: Date;
    startWeek: number;
    endWeek: number;
})[] = [
        {
            name: 'should return correct date range for week 0',
            birthDate: new Date('1990-01-01'),
            startWeek: 0,
            endWeek: 0,
            expectedResult: {
                startDate: new Date('1990-01-01'),
                endDate: new Date('1990-01-07')
            }
        },
        {
            name: 'should throw error if startWeek > endWeek',
            birthDate: new Date('1990-01-01'),
            startWeek: 10,
            endWeek: 5,
            expectedResult: new Error("startWeekNumber must be less than endWeekNumber")
        }
    ];

describe("getWeekStartDateAndEndDate", () => {
    it.each(getWeekRangeTestCases)("%s", ({ birthDate, startWeek, endWeek, expectedResult }) => {
        if (expectedResult instanceof Error) {
            expect(() => getWeekStartDateAndEndDate(birthDate, startWeek, endWeek)).toThrow(expectedResult.message);
        } else {
            const result = getWeekStartDateAndEndDate(birthDate, startWeek, endWeek);
            expect(result.startDate.toISOString().split('T')[0]).toBe(expectedResult.startDate.toISOString().split('T')[0]);
            expect(result.endDate.toISOString().split('T')[0]).toBe(expectedResult.endDate.toISOString().split('T')[0]);
        }
    });
});

// ============================================================================
// addLifeChapter
// ============================================================================

const addChapterTestCases: (TestInterface<LifeChapter[]> & {
    chapters: LifeChapter[];
    newChapter: LifeChapter;
})[] = [
        {
            name: 'should add chapter in sorted order',
            chapters: [createChapter('2', 'Second', 200, 300)],
            newChapter: createChapter('1', 'First', 0, 100),
            expectedResult: [
                createChapter('1', 'First', 0, 100),
                createChapter('2', 'Second', 200, 300)
            ]
        }
    ];

describe("addLifeChapter", () => {
    it.each(addChapterTestCases)("%s", ({ chapters, newChapter, expectedResult }) => {
        const result = addLifeChapter(chapters, newChapter);
        expect(result).toEqual(expectedResult);
    });
});

// ============================================================================
// generateWeekInYourLife
// ============================================================================

const generateTimelineTestCases: (TestInterface<number> & {
    lifeSpanWeeks: number;
    chapters: LifeChapter[];
    specialWeeks: LifeChapter[];
})[] = [
        {
            name: 'should generate timeline with correct number of segments',
            lifeSpanWeeks: 500,
            chapters: [createChapter('1', 'Test', 100, 200)],
            specialWeeks: [],
            expectedResult: 3 // Gap, Chapter, Gap
        }
    ];

describe("generateWeekInYourLife", () => {
    it.each(generateTimelineTestCases)("%s", ({ lifeSpanWeeks, chapters, specialWeeks, expectedResult }) => {
        const result = generateWeekInYourLife(lifeSpanWeeks, chapters, specialWeeks);
        expect(result.length).toBe(expectedResult);
    });
});

// ============================================================================
// getRemainingWeeks
// ============================================================================

const remainingWeeksTestCases: (TestInterface<boolean> & {
    birthDate: Date;
    lifeSpanWeeks: number;
})[] = [
        {
            name: 'should return positive remaining weeks for 30yo',
            birthDate: (function () { const d = new Date(); d.setFullYear(d.getFullYear() - 30); return d; })(),
            lifeSpanWeeks: 4160,
            expectedResult: true // We check if > 2500
        }
    ];

describe("getRemainingWeeks", () => {
    it.each(remainingWeeksTestCases)("%s", ({ birthDate, lifeSpanWeeks }) => {
        const result = getRemainingWeeks(birthDate, lifeSpanWeeks);
        expect(result).toBeGreaterThan(2500);
    });
});

// ============================================================================
// getRemainingActiveYears
// ============================================================================

const activeYearsTestCases: (TestInterface<number> & {
    birthDate: Date;
    limit: number;
})[] = [
        {
            name: 'should return 35 for 30yo with 65 limit',
            birthDate: (function () { const d = new Date(); d.setFullYear(d.getFullYear() - 30); return d; })(),
            limit: 65,
            expectedResult: 35
        }
    ];

describe("getRemainingActiveYears", () => {
    it.each(activeYearsTestCases)("%s", ({ birthDate, limit, expectedResult }) => {
        const result = getRemainingActiveYears(birthDate, limit);
        if (expectedResult instanceof Error) {
            // This case is not handled in the current test cases but for type safety
            throw expectedResult;
        }
        // Allow small difference due to day calculation
        expect(result).toBeGreaterThanOrEqual(expectedResult - 1);
        expect(result).toBeLessThanOrEqual(expectedResult);
    });
});

// ============================================================================
// getAgeFromWeekNumber
// ============================================================================

const ageFromWeekTestCases: (TestInterface<number> & {
    week: number;
})[] = [
        { name: '0 weeks is age 0', week: 0, expectedResult: 0 },
        { name: '52 weeks is age 1', week: 52, expectedResult: 1 },
        { name: '1040 weeks is age 20', week: 1040, expectedResult: 20 }
    ];

describe("getAgeFromWeekNumber", () => {
    it.each(ageFromWeekTestCases)("%s", ({ week, expectedResult }) => {
        const result = getAgeFromWeekNumber(week);
        expect(result).toBe(expectedResult);
    });
});

// ============================================================================
// getChapterDuration
// ============================================================================

const chapterDurationTestCases: (TestInterface<number> & {
    chapter: LifeChapter;
})[] = [
        {
            name: 'should return 100 for 100-week chapter',
            chapter: createChapter('1', 'Test', 100, 199),
            expectedResult: 100
        }
    ];

describe("getChapterDuration", () => {
    it.each(chapterDurationTestCases)("%s", ({ chapter, expectedResult }) => {
        const result = getChapterDuration(chapter);
        expect(result).toBe(expectedResult);
    });
});

// ============================================================================
// getUnplannedWeeks
// ============================================================================

const unplannedWeeksTestCases: (TestInterface<number> & {
    timeline: WeekInYourLife[];
})[] = [
        {
            name: 'should count gaps correctly',
            timeline: [
                { weekNumberStart: 0, weekNumberEnd: 99, focus: undefined },
                { weekNumberStart: 100, weekNumberEnd: 199, focus: createChapter('1', 'Test', 100, 199) },
                { weekNumberStart: 200, weekNumberEnd: 299, focus: undefined }
            ],
            expectedResult: 200
        }
    ];

describe("getUnplannedWeeks", () => {
    it.each(unplannedWeeksTestCases)("%s", ({ timeline, expectedResult }) => {
        const result = getUnplannedWeeks(timeline);
        expect(result).toBe(expectedResult);
    });
});

// ============================================================================
// removeLifeChapter
// ============================================================================

const removeChapterTestCases: (TestInterface<LifeChapter[]> & {
    chapters: LifeChapter[];
    chapterToRemove: LifeChapter;
})[] = [
        {
            name: 'should remove chapter from list',
            chapters: [createChapter('1', 'First', 0, 100), createChapter('2', 'Second', 200, 300)],
            chapterToRemove: createChapter('1', 'First', 0, 100),
            expectedResult: [createChapter('2', 'Second', 200, 300)]
        }
    ];

describe("removeLifeChapter", () => {
    it.each(removeChapterTestCases)("%s", ({ chapters, chapterToRemove, expectedResult }) => {
        const result = removeLifeChapter(chapters, chapterToRemove);
        expect(result).toEqual(expectedResult);
    });
});

// ============================================================================
// getCurrentWeekInYourLife
// ============================================================================

const currentWeekInLifeTestCases: (TestInterface<string | undefined> & {
    birthDate: Date;
    timeline: WeekInYourLife[];
})[] = [
        {
            name: 'should find current segment',
            birthDate: (function () { const d = new Date(); d.setFullYear(d.getFullYear() - 30); return d; })(),
            timeline: [
                { weekNumberStart: 0, weekNumberEnd: 1000, focus: undefined },
                { weekNumberStart: 1001, weekNumberEnd: 2000, focus: createChapter('1', 'Current', 1001, 2000) },
                { weekNumberStart: 2001, weekNumberEnd: 4160, focus: undefined }
            ],
            expectedResult: '1'
        }
    ];

describe("getCurrentWeekInYourLife", () => {
    it.each(currentWeekInLifeTestCases)("%s", ({ birthDate, timeline, expectedResult }) => {
        const result = getCurrentWeekInYourLife(birthDate, timeline);
        expect(result?.focus?.id).toBe(expectedResult);
    });
});

// ============================================================================
// getLifeProgressPercentage
// ============================================================================

const progressPercentageTestCases: (TestInterface<number> & {
    birthDate: Date;
    lifeSpanWeeks: number;
})[] = [
        {
            name: 'should return ~50% for 40yo with 80y lifespan',
            birthDate: (function () { const d = new Date(); d.setFullYear(d.getFullYear() - 40); return d; })(),
            lifeSpanWeeks: 4160,
            expectedResult: 50
        }
    ];

describe("getLifeProgressPercentage", () => {
    it.each(progressPercentageTestCases)("%s", ({ birthDate, lifeSpanWeeks, expectedResult }) => {
        const result = getLifeProgressPercentage(birthDate, lifeSpanWeeks);
        if (expectedResult instanceof Error) throw expectedResult;
        expect(result).toBeGreaterThanOrEqual(expectedResult - 2);
        expect(result).toBeLessThanOrEqual(expectedResult + 2);
    });
});

// ============================================================================
// getAgeRangeFromChapter
// ============================================================================

const ageRangeTestCases: (TestInterface<{ startAge: number; endAge: number }> & {
    chapter: LifeChapter;
})[] = [
        {
            name: 'should return 18-22 for university years',
            chapter: createChapter('1', 'Uni', 936, 1144),
            expectedResult: { startAge: 18, endAge: 22 }
        }
    ];

describe("getAgeRangeFromChapter", () => {
    it.each(ageRangeTestCases)("%s", ({ chapter, expectedResult }) => {
        const result = getAgeRangeFromChapter(chapter);
        expect(result).toEqual(expectedResult);
    });
});

// ============================================================================
// getUpcomingSpecialEvents
// ============================================================================

const upcomingEventsTestCases: (TestInterface<number> & {
    birthDate: Date;
    events: LifeChapter[];
})[] = [
        {
            name: 'should return only future events',
            birthDate: (function () { const d = new Date(); d.setFullYear(d.getFullYear() - 30); return d; })(),
            events: [
                createChapter('1', 'Past', 0, 100),
                createChapter('2', 'Future', 3000, 3100)
            ],
            expectedResult: 1
        }
    ];

describe("getUpcomingSpecialEvents", () => {
    it.each(upcomingEventsTestCases)("%s", ({ birthDate, events, expectedResult }) => {
        const result = getUpcomingSpecialEvents(birthDate, events);
        expect(result.length).toBe(expectedResult);
    });
});

// ============================================================================
// getWeeksUntilEvent
// ============================================================================

const weeksUntilEventTestCases: (TestInterface<number> & {
    birthDate: Date;
    event: LifeChapter;
})[] = [
        {
            name: 'should return correct weeks until future event',
            birthDate: (function () { const d = new Date(); d.setFullYear(d.getFullYear() - 30); return d; })(),
            event: createChapter('1', 'Future', 2000, 2100),
            expectedResult: 2000 // approx, will check range
        }
    ];

describe("getWeeksUntilEvent", () => {
    it.each(weeksUntilEventTestCases)("%s", ({ birthDate, event }) => {
        const currentWeek = getCurrentWeekNumber(birthDate);
        const result = getWeeksUntilEvent(birthDate, event);
        expect(result).toBe(event.startWeekNumber - currentWeek);
    });
});

// ============================================================================
// validateChapterOverlap
// ============================================================================

const overlapTestCases: (TestInterface<boolean> & {
    chapters: LifeChapter[];
    newChapter: { startWeekNumber: number; endWeekNumber: number; id?: string };
})[] = [
        {
            name: 'should detect overlap',
            chapters: [createChapter('1', 'First', 0, 100)],
            newChapter: { startWeekNumber: 50, endWeekNumber: 150 },
            expectedResult: true
        },
        {
            name: 'should not detect overlap for separate ranges',
            chapters: [createChapter('1', 'First', 0, 100)],
            newChapter: { startWeekNumber: 110, endWeekNumber: 150 },
            expectedResult: false
        }
    ];

describe("validateChapterOverlap", () => {
    it.each(overlapTestCases)("%s", ({ chapters, newChapter, expectedResult }) => {
        const result = validateChapterOverlap(chapters, newChapter);
        expect(result.hasOverlap).toBe(expectedResult);
    });
});
