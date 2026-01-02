import type { BudgetingItem } from "../repo/budgeting";
import type { Person } from "../../utils/person"

export interface CoupleWithBudgetingItems {
    person: Person;
    // there will be 2 people in the application and the order of budgeting items is important
    budgetingItems: BudgetingItem[];
}
export function addBudgetingItem(person1: CoupleWithBudgetingItems, person2: CoupleWithBudgetingItems, budgetingItem: BudgetingItem) {
    person1.budgetingItems.push(budgetingItem);
    person2.budgetingItems.push(budgetingItem);
}

export function removeBudgetingItem(person1: CoupleWithBudgetingItems, person2: CoupleWithBudgetingItems, budgetingItem: BudgetingItem) {
    person1.budgetingItems = person1.budgetingItems.filter(item => item.id !== budgetingItem.id);
    person2.budgetingItems = person2.budgetingItems.filter(item => item.id !== budgetingItem.id);

}

export function combineBudgetingItems(linkBudgetingItems: string[], budgetingItem: BudgetingItem) {
    linkBudgetingItems.push(budgetingItem.id);
}
