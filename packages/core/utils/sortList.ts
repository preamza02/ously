import type { IdInterface } from "./id";

export function findPositionInSortedNormalList<T extends IdInterface>(list: T[], item: T, moreThanFn: (a: T, b: T) => boolean): number {
    let low = 0;
    let high = list.length - 1;

    while (low <= high) {
        const mid = (low + high) >>> 1;
        const guess = list[mid];

        if (guess.id === item.id) {
            return mid;
        }

        if (moreThanFn(guess, item)) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }

    return low;
}

export function addItemInSortedList<T extends IdInterface>(list: T[], item: T, moreThanFn: (a: T, b: T) => boolean): T[] {
    const position = findPositionInSortedNormalList(list, item, moreThanFn);
    return [
        ...list.slice(0, position),
        item,
        ...list.slice(position)
    ];
}

export function removeItemInSortedList<T extends IdInterface>(list: T[], item: T, moreThanFn: (a: T, b: T) => boolean): T[] {
    const position = findPositionInSortedNormalList(list, item, moreThanFn);
    return [
        ...list.slice(0, position),
        ...list.slice(position + 1)
    ];
}