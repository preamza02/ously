import type { IdInterface } from "../../utils/id";
import type { Tagable } from "../../utils/id";

export interface LifeChapter extends IdInterface, Tagable {
    name: string;
    description: string;
    startWeekNumber: number;
    endWeekNumber: number;
};

export interface WeekInYourLife {
    weekNumberStart: number;
    weekNumberEnd: number;
    focus: LifeChapter | undefined;
}