import type { BudgetCategory, ZeroBudgetState, BudgetMode, PersonBudget } from "../repo/zeroBudget";
import { generateId } from "@ously/core/utils/id";

// ============================================================================
// Calculation Functions
// ============================================================================

/**
 * Calculate total budgeted amount for a person
 */
export function getTotalBudgeted(state: ZeroBudgetState, person: 1 | 2): number {
    return state.categories.reduce((sum, cat) => {
        return sum + (person === 1 ? cat.person1Amount : cat.person2Amount);
    }, 0);
}

/**
 * Calculate remaining budget for a person
 */
export function getRemainingBudget(state: ZeroBudgetState, person: 1 | 2): number {
    const income = person === 1 ? state.person1.income : state.person2.income;
    const budgeted = getTotalBudgeted(state, person);
    return income - budgeted;
}

/**
 * Calculate combined income for couple mode
 */
export function getCombinedIncome(state: ZeroBudgetState): number {
    if (state.mode === 'single') {
        return state.person1.income;
    }
    return state.person1.income + state.person2.income;
}

/**
 * Calculate total spending across all categories
 */
export function getTotalSpending(state: ZeroBudgetState): number {
    return state.categories.reduce((sum, cat) => {
        if (state.mode === 'single') {
            return sum + cat.person1Amount;
        }
        return sum + cat.person1Amount + cat.person2Amount;
    }, 0);
}

/**
 * Calculate remaining budget (combined income - total spending)
 */
export function getTotalRemaining(state: ZeroBudgetState): number {
    return getCombinedIncome(state) - getTotalSpending(state);
}

/**
 * Calculate percentage of income for an amount
 */
export function getPercentageOfIncome(amount: number, income: number): number {
    if (income === 0) return 0;
    return Math.round((amount / income) * 100);
}

// ============================================================================
// Combined Amount Distribution
// ============================================================================

/**
 * Distribute a combined total amount between two persons.
 * Strategy: Adjust person 1 first, then person 2.
 */
export function distributeCombinedAmount(
    total: number,
    currentP1: number,
    currentP2: number
): { person1Amount: number; person2Amount: number } {
    const currentTotal = currentP1 + currentP2;
    const diff = total - currentTotal;

    if (diff === 0) {
        return { person1Amount: currentP1, person2Amount: currentP2 };
    }

    let newP1 = currentP1;
    let newP2 = currentP2;

    if (diff > 0) {
        // Increasing: add to person 1 first
        newP1 = currentP1 + diff;
    } else {
        // Decreasing: subtract from person 1 first
        const absDecrease = Math.abs(diff);
        if (currentP1 >= absDecrease) {
            newP1 = currentP1 - absDecrease;
        } else {
            // Person 1 goes to 0, rest from person 2
            newP1 = 0;
            newP2 = currentP2 - (absDecrease - currentP1);
            if (newP2 < 0) newP2 = 0;
        }
    }

    return { person1Amount: newP1, person2Amount: newP2 };
}

// ============================================================================
// CRUD Operations
// ============================================================================

/**
 * Add a new budget category
 */
export function addCategory(
    categories: BudgetCategory[],
    category: Omit<BudgetCategory, 'id'>
): BudgetCategory[] {
    const newCategory: BudgetCategory = {
        ...category,
        id: generateId(),
    };
    return [...categories, newCategory];
}

/**
 * Update an existing category
 */
export function updateCategory(
    categories: BudgetCategory[],
    updatedCategory: BudgetCategory
): BudgetCategory[] {
    return categories.map(cat =>
        cat.id === updatedCategory.id ? updatedCategory : cat
    );
}

/**
 * Remove a category
 */
export function removeCategory(
    categories: BudgetCategory[],
    categoryId: string
): BudgetCategory[] {
    return categories.filter(cat => cat.id !== categoryId);
}

/**
 * Toggle link state for a category and optionally redistribute amounts
 */
export function toggleCategoryLink(
    categories: BudgetCategory[],
    categoryId: string
): BudgetCategory[] {
    return categories.map(cat => {
        if (cat.id !== categoryId) return cat;
        return {
            ...cat,
            isLinked: !cat.isLinked,
        };
    });
}

/**
 * Update category amount for a specific person
 */
export function updateCategoryAmount(
    categories: BudgetCategory[],
    categoryId: string,
    person: 1 | 2,
    amount: number
): BudgetCategory[] {
    return categories.map(cat => {
        if (cat.id !== categoryId) return cat;
        if (person === 1) {
            return { ...cat, person1Amount: amount };
        } else {
            return { ...cat, person2Amount: amount };
        }
    });
}

/**
 * Update combined amount for a linked category
 */
export function updateCombinedAmount(
    categories: BudgetCategory[],
    categoryId: string,
    totalAmount: number
): BudgetCategory[] {
    return categories.map(cat => {
        if (cat.id !== categoryId) return cat;
        const { person1Amount, person2Amount } = distributeCombinedAmount(
            totalAmount,
            cat.person1Amount,
            cat.person2Amount
        );
        return { ...cat, person1Amount, person2Amount };
    });
}

// ============================================================================
// Default Categories
// ============================================================================

export function getDefaultCategories(mode: BudgetMode): BudgetCategory[] {
    return [
        {
            id: generateId(),
            name: 'Housing',
            description: 'Rent, mortgage, utilities',
            icon: 'Home',
            color: '#3b82f6',
            isLinked: false,
            person1Amount: 0,
            person2Amount: 0,
        },
        {
            id: generateId(),
            name: 'Food',
            description: 'Groceries & dining',
            icon: 'ShoppingCart',
            color: '#10b981',
            isLinked: false,
            person1Amount: 0,
            person2Amount: 0,
        },
        {
            id: generateId(),
            name: 'Transportation',
            description: 'Gas, transit, uber',
            icon: 'Car',
            color: '#f59e0b',
            isLinked: false,
            person1Amount: 0,
            person2Amount: 0,
        },
        ...(mode === 'couple' ? [
            {
                id: generateId(),
                name: 'Trip',
                description: 'Travel & vacation',
                icon: 'Plane',
                color: '#8b5cf6',
                isLinked: true,
                person1Amount: 0,
                person2Amount: 0,
            },
            {
                id: generateId(),
                name: 'Special Meal',
                description: 'Date nights & celebrations',
                icon: 'UtensilsCrossed',
                color: '#ec4899',
                isLinked: true,
                person1Amount: 0,
                person2Amount: 0,
            },
        ] : []),
    ];
}
