import type { IdInterface } from "./id";

export interface Tag extends IdInterface {
    name: string;
    color: string;
}

export interface Tagable {
    tags: Tag[];
}

export function getSortListFromTagableList<T extends Tagable>(items: T[], valueFn: (item: T) => number): { tag: Tag; value: number }[] {
    const tagList: { tag: Tag; value: number }[] = [];
    for (const item of items) {
        for (const tag of item.tags) {
            const existingTag = tagList.find(t => t.tag.id === tag.id);
            if (existingTag) {
                existingTag.value += valueFn(item);
            } else {
                tagList.push({ tag, value: valueFn(item) });
            }
        }
    }
    return tagList.sort((a, b) => b.value - a.value);
}