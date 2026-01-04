/**
 * Zero-Base Budgeting Store
 * Centralized state management using Svelte 5 runes
 */

import type { BudgetCategory, ZeroBudgetState, BudgetMode, PersonBudget } from '@ously/core/money/repo/zeroBudget';
import {
    getTotalBudgeted,
    getRemainingBudget,
    getCombinedIncome,
    getTotalSpending,
    getTotalRemaining,
    getPercentageOfIncome,
    addCategory as addCategoryCore,
    updateCategory as updateCategoryCore,
    removeCategory as removeCategoryCore,
    toggleCategoryLink as toggleCategoryLinkCore,
    updateCategoryAmount as updateCategoryAmountCore,
    updateCombinedAmount as updateCombinedAmountCore,
    getDefaultCategories,
} from '@ously/core/money/app/zeroBudgetApp';
import { browser } from '$app/environment';

// ============================================================================
// Storage Keys
// ============================================================================

const STORAGE_KEY = 'zeroBudget';

// ============================================================================
// LocalStorage Persistence
// ============================================================================

function loadFromStorage(): ZeroBudgetState | null {
    if (!browser) return null;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;
        return JSON.parse(stored);
    } catch (e) {
        console.error('Failed to load zero budget state from localStorage:', e);
        return null;
    }
}

function saveToStorage(state: ZeroBudgetState): void {
    if (!browser) return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error('Failed to save zero budget state to localStorage:', e);
    }
}

// ============================================================================
// Default State
// ============================================================================

function createDefaultState(): ZeroBudgetState {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    return {
        mode: 'couple',
        currentMonth,
        person1: {
            person: { name: 'Person 1', income: 0 },
            income: 0,
        },
        person2: {
            person: { name: 'Your Love', income: 0 },
            income: 0,
        },
        categories: [],
    };
}

// ============================================================================
// Reactive State
// ============================================================================

const defaultState = createDefaultState();
const initialState = loadFromStorage() ?? defaultState;

export const zeroBudgetState = $state<ZeroBudgetState>(initialState);

// Track if state has been loaded
export const isStateLoaded = $state({ value: typeof window !== 'undefined' });

// ============================================================================
// Persistence Effect
// ============================================================================

export function initPersistence() {
    $effect(() => {
        const stateSnapshot = {
            mode: zeroBudgetState.mode,
            currentMonth: zeroBudgetState.currentMonth,
            person1: zeroBudgetState.person1,
            person2: zeroBudgetState.person2,
            categories: zeroBudgetState.categories,
        };
        saveToStorage(stateSnapshot);
    });
}

// ============================================================================
// Derived Values
// ============================================================================

export const derivedValues = {
    get person1Budgeted() {
        return getTotalBudgeted(zeroBudgetState, 1);
    },

    get person2Budgeted() {
        return getTotalBudgeted(zeroBudgetState, 2);
    },

    get person1Remaining() {
        return getRemainingBudget(zeroBudgetState, 1);
    },

    get person2Remaining() {
        return getRemainingBudget(zeroBudgetState, 2);
    },

    get combinedIncome() {
        return getCombinedIncome(zeroBudgetState);
    },

    get totalSpending() {
        return getTotalSpending(zeroBudgetState);
    },

    get totalRemaining() {
        return getTotalRemaining(zeroBudgetState);
    },

    getPercentage(amount: number, person: 1 | 2) {
        const income = person === 1 ? zeroBudgetState.person1.income : zeroBudgetState.person2.income;
        return getPercentageOfIncome(amount, income);
    },
};

// ============================================================================
// Actions
// ============================================================================

export const actions = {
    // Mode actions
    setMode(mode: BudgetMode) {
        zeroBudgetState.mode = mode;
        // Reset categories when mode changes
        zeroBudgetState.categories = getDefaultCategories(mode);
    },

    // Month navigation
    setMonth(month: string) {
        zeroBudgetState.currentMonth = month;
    },

    navigateMonth(direction: 'prev' | 'next') {
        const [year, month] = zeroBudgetState.currentMonth.split('-').map(Number);
        const date = new Date(year, month - 1);
        date.setMonth(date.getMonth() + (direction === 'next' ? 1 : -1));
        zeroBudgetState.currentMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    },

    // Person actions
    updatePerson1Income(income: number) {
        zeroBudgetState.person1 = {
            ...zeroBudgetState.person1,
            income,
        };
    },

    updatePerson2Income(income: number) {
        zeroBudgetState.person2 = {
            ...zeroBudgetState.person2,
            income,
        };
    },

    updatePerson1Name(name: string) {
        zeroBudgetState.person1 = {
            ...zeroBudgetState.person1,
            person: { ...zeroBudgetState.person1.person, name },
        };
    },

    updatePerson2Name(name: string) {
        zeroBudgetState.person2 = {
            ...zeroBudgetState.person2,
            person: { ...zeroBudgetState.person2.person, name },
        };
    },

    // Category actions
    addCategory(category: Omit<BudgetCategory, 'id'>) {
        zeroBudgetState.categories = addCategoryCore(zeroBudgetState.categories, category);
    },

    updateCategory(category: BudgetCategory) {
        zeroBudgetState.categories = updateCategoryCore(zeroBudgetState.categories, category);
    },

    removeCategory(categoryId: string) {
        zeroBudgetState.categories = removeCategoryCore(zeroBudgetState.categories, categoryId);
    },

    toggleCategoryLink(categoryId: string) {
        zeroBudgetState.categories = toggleCategoryLinkCore(zeroBudgetState.categories, categoryId);
    },

    updateCategoryAmount(categoryId: string, person: 1 | 2, amount: number) {
        zeroBudgetState.categories = updateCategoryAmountCore(
            zeroBudgetState.categories,
            categoryId,
            person,
            amount
        );
    },

    updateCombinedAmount(categoryId: string, totalAmount: number) {
        zeroBudgetState.categories = updateCombinedAmountCore(
            zeroBudgetState.categories,
            categoryId,
            totalAmount
        );
    },

    reorderCategories(fromIndex: number, toIndex: number) {
        const categories = [...zeroBudgetState.categories];
        const [movedItem] = categories.splice(fromIndex, 1);
        categories.splice(toIndex, 0, movedItem);
        zeroBudgetState.categories = categories;
    },

    // Reset
    reset() {
        const newState = createDefaultState();
        zeroBudgetState.mode = newState.mode;
        zeroBudgetState.currentMonth = newState.currentMonth;
        zeroBudgetState.person1 = newState.person1;
        zeroBudgetState.person2 = newState.person2;
        zeroBudgetState.categories = newState.categories;
    },

    clearStorage() {
        if (browser) {
            localStorage.removeItem(STORAGE_KEY);
        }
    },
};
