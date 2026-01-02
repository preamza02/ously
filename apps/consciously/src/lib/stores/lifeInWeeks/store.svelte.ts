/**
 * Life in Weeks Store
 * Interface-based reactive store using Svelte 5 runes
 * Applies core functions directly without class wrapper
 */

import type { LifeChapter, WeekInYourLife } from '@ously/core/time/repo/lifeChapter';
import type { Tag } from '@ously/core/utils/id';
import {
    getCurrentWeekNumber,
    getRemainingWeeks,
    getLifeProgressPercentage,
    getRemainingActiveYears,
    generateWeekInYourLife,
    getCurrentWeekInYourLife,
    generateWeekInYourLifeWithPassAndFuture,
    getSortTagsFromWeekInYourLife,
    getUpcomingSpecialEvents,
    getUnplannedWeeks,
    addLifeChapter,
    removeLifeChapter,
    updateLifeChapter as updateLifeChapterCore
} from '@ously/core/time/app/weekInYourLife';
import { browser } from '$app/environment';

// ============================================================================
// State Interface
// ============================================================================

export interface LifeInWeeksState {
    birthDate: Date;
    lifeSpanWeeks: number;
    activeLifeYears: number;
    lifeChapters: LifeChapter[];
    specialWeeks: LifeChapter[];
    tags: Tag[];
    isOpenHelpModal: boolean;
}

// ============================================================================
// LocalStorage Persistence
// ============================================================================

const STORAGE_KEY = 'lifeInWeeks';

interface StoredState {
    birthDate: string;
    lifeSpanWeeks: number;
    activeLifeYears: number;
    lifeChapters: LifeChapter[];
    specialWeeks: LifeChapter[];
    tags: Tag[];
    isOpenHelpModal: boolean;
}

function loadFromStorage(): LifeInWeeksState | null {
    if (!browser) return null;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;

        const parsed: StoredState = JSON.parse(stored);
        return {
            ...parsed,
            birthDate: new Date(parsed.birthDate)
        };
    } catch (e) {
        console.error('Failed to load state from localStorage:', e);
        return null;
    }
}

function saveToStorage(state: LifeInWeeksState): void {
    if (!browser) return;

    try {
        const toStore: StoredState = {
            ...state,
            birthDate: state.birthDate.toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (e) {
        console.error('Failed to save state to localStorage:', e);
    }
}

// ============================================================================
// Default Tags
// ============================================================================

const defaultTags: Tag[] = [
    { id: 'unplanned', name: 'Unplanned', color: '#94a3b8' },
    { id: 'career', name: 'Career', color: '#3b82f6' },
    { id: 'education', name: 'Education', color: '#f59e0b' },
    { id: 'vacation', name: 'Vacation', color: '#10b981' },
    { id: 'health', name: 'Health', color: '#22c55e' },
    { id: 'family', name: 'Family', color: '#ec4899' },
    { id: 'childhood', name: 'Childhood', color: '#a855f7' }
];

// Sample life chapters for demonstration
const sampleChapters: LifeChapter[] = [
    {
        id: 'chapter-1',
        name: 'Childhood & Schooling',
        description: 'Early years and primary education',
        startWeekNumber: 0,
        endWeekNumber: 152,
        tags: [{ id: 'childhood', name: 'Childhood', color: '#a855f7' }]
    },
    {
        id: 'chapter-2',
        name: 'Schooling',
        description: 'Primary and secondary education',
        startWeekNumber: 153,
        endWeekNumber: 936,
        tags: [{ id: 'education', name: 'Education', color: '#f59e0b' }]
    },
];

// Sample special events
const sampleSpecialWeeks: LifeChapter[] = [
    // {
    //     id: 'event-1',
    //     name: 'NewYear With Family',
    //     description: 'New Year with family',
    //     startWeekNumber: 1750,
    //     endWeekNumber: 1753,
    //     tags: [{ id: 'family', name: 'Family', color: '#ec4899' }]
    // }
];

// ============================================================================
// Reactive State (using $state)
// ============================================================================

// Default state
const defaultState: LifeInWeeksState = {
    birthDate: new Date('1993-01-01'),
    lifeSpanWeeks: 4160, // 80 years
    activeLifeYears: 65,
    lifeChapters: [...sampleChapters],
    specialWeeks: [...sampleSpecialWeeks],
    tags: [...defaultTags],
    isOpenHelpModal: false
};

// Load from localStorage or use defaults
const initialState = loadFromStorage() ?? defaultState;

export const lifeInWeeksState = $state<LifeInWeeksState>(initialState);

// ============================================================================
// Persistence Effect
// ============================================================================

/**
 * Initialize persistence - call this from a Svelte component to enable auto-save.
 * This creates an effect that watches for state changes and persists to localStorage.
 */
export function initPersistence() {
    $effect(() => {
        // Access all state properties to track changes
        const stateSnapshot = {
            birthDate: lifeInWeeksState.birthDate,
            lifeSpanWeeks: lifeInWeeksState.lifeSpanWeeks,
            activeLifeYears: lifeInWeeksState.activeLifeYears,
            lifeChapters: lifeInWeeksState.lifeChapters,
            specialWeeks: lifeInWeeksState.specialWeeks,
            tags: lifeInWeeksState.tags,
            isOpenHelpModal: lifeInWeeksState.isOpenHelpModal
        };
        saveToStorage(stateSnapshot);
    });
}

// ============================================================================
// Derived Values (using $derived)
// ============================================================================

export const derivedValues = {
    get currentWeekNumber() {
        return getCurrentWeekNumber(lifeInWeeksState.birthDate);
    },

    get remainingWeeks() {
        return getRemainingWeeks(lifeInWeeksState.birthDate, lifeInWeeksState.lifeSpanWeeks);
    },

    get lifeProgress() {
        return getLifeProgressPercentage(lifeInWeeksState.birthDate, lifeInWeeksState.lifeSpanWeeks);
    },

    get remainingActiveYears() {
        return getRemainingActiveYears(lifeInWeeksState.birthDate, 65);
    },

    get timeline() {
        return generateWeekInYourLife(
            lifeInWeeksState.lifeSpanWeeks,
            lifeInWeeksState.lifeChapters,
            lifeInWeeksState.specialWeeks
        );
    },

    get currentChapter() {
        return getCurrentWeekInYourLife(lifeInWeeksState.birthDate, this.timeline);
    },

    get pastAndFuture() {
        return generateWeekInYourLifeWithPassAndFuture(lifeInWeeksState.birthDate, this.timeline);
    },

    get tagStats() {
        return getSortTagsFromWeekInYourLife(this.timeline);
    },

    get upcomingEvents() {
        return getUpcomingSpecialEvents(lifeInWeeksState.birthDate, lifeInWeeksState.specialWeeks, 5);
    },

    get unplannedWeeks() {
        return getUnplannedWeeks(this.timeline);
    }
};

// ============================================================================
// Actions (apply core functions directly)
// ============================================================================

export const actions = {
    // Life Chapter Actions
    addChapter(chapter: LifeChapter) {
        lifeInWeeksState.lifeChapters = addLifeChapter(lifeInWeeksState.lifeChapters, chapter);
    },

    updateChapter(chapter: LifeChapter) {
        lifeInWeeksState.lifeChapters = updateLifeChapterCore(lifeInWeeksState.lifeChapters, chapter);
    },

    removeChapter(id: string) {
        const chapter = lifeInWeeksState.lifeChapters.find((c) => c.id === id);
        if (chapter) {
            lifeInWeeksState.lifeChapters = removeLifeChapter(lifeInWeeksState.lifeChapters, chapter);
        }
    },

    // Special Event Actions
    addSpecialEvent(event: LifeChapter) {
        lifeInWeeksState.specialWeeks = addLifeChapter(lifeInWeeksState.specialWeeks, event);
    },

    updateSpecialEvent(event: LifeChapter) {
        lifeInWeeksState.specialWeeks = updateLifeChapterCore(lifeInWeeksState.specialWeeks, event);
    },

    removeSpecialEvent(id: string) {
        const event = lifeInWeeksState.specialWeeks.find((e) => e.id === id);
        if (event) {
            lifeInWeeksState.specialWeeks = removeLifeChapter(lifeInWeeksState.specialWeeks, event);
        }
    },

    // Tag Actions
    addTag(tag: Tag) {
        lifeInWeeksState.tags = [...lifeInWeeksState.tags, tag];
    },

    removeTag(id: string) {
        lifeInWeeksState.tags = lifeInWeeksState.tags.filter((t) => t.id !== id);
    },

    // Settings Actions
    setBirthDate(date: Date) {
        lifeInWeeksState.birthDate = date;
    },

    setLifeSpan(years: number) {
        lifeInWeeksState.lifeSpanWeeks = years * 52;
    },

    setActiveLifeYears(years: number) {
        lifeInWeeksState.activeLifeYears = years;
    },

    // Reset to defaults and clear localStorage
    reset() {
        lifeInWeeksState.birthDate = defaultState.birthDate;
        lifeInWeeksState.lifeSpanWeeks = defaultState.lifeSpanWeeks;
        lifeInWeeksState.activeLifeYears = defaultState.activeLifeYears;
        lifeInWeeksState.lifeChapters = [...defaultState.lifeChapters];
        lifeInWeeksState.specialWeeks = [...defaultState.specialWeeks];
        lifeInWeeksState.tags = [...defaultState.tags];
        lifeInWeeksState.isOpenHelpModal = defaultState.isOpenHelpModal;
    },

    // Clear localStorage only
    clearStorage() {
        if (browser) {
            localStorage.removeItem(STORAGE_KEY);
        }
    },

    // Mark help modal as opened (for first-time highlight)
    setHelpModalOpened() {
        lifeInWeeksState.isOpenHelpModal = true;
    }
};
