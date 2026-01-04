import type { IdInterface } from "@ously/core/utils/id";
import type { Person } from "@ously/core/utils/person";

/**
 * Budget mode - determines single or couple budgeting
 */
export type BudgetMode = 'single' | 'couple';

/**
 * A budget category with allocations for one or two persons
 */
export interface BudgetCategory extends IdInterface {
    name: string;
    description?: string;
    icon: string;
    color: string;
    /** Whether this category is linked (combined) between two persons */
    isLinked: boolean;
    /** Amount allocated by person 1 */
    person1Amount: number;
    /** Amount allocated by person 2 (only used in couple mode) */
    person2Amount: number;
}

/**
 * Person with budget information
 */
export interface PersonBudget {
    person: Person;
    /** Total income for this person */
    income: number;
}

/**
 * Complete zero-base budget state for a month
 */
export interface ZeroBudgetState {
    mode: BudgetMode;
    /** Current month being budgeted (ISO string) */
    currentMonth: string;
    /** Person 1 (always present) */
    person1: PersonBudget;
    /** Person 2 (only used in couple mode) */
    person2: PersonBudget;
    /** All budget categories */
    categories: BudgetCategory[];
}
