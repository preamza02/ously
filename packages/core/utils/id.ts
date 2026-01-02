export interface IdInterface {
    id: string;
}

export interface Tag extends IdInterface {
    name: string;
    color: string;
}

export interface Tagable {
    tags: Tag[];
}

export function generateId() {
    return crypto.randomUUID();
}