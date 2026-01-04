import type { IdInterface } from "@ously/core/utils/id";

export interface BudgetingItem extends IdInterface {
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    amount: number;
}