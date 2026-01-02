import type { IdInterface } from "@ously/core/utils/id";

export interface BudgetingItem extends IdInterface {
    name: string;
    amount: number;
}