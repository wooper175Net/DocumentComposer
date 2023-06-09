import type { docItem } from "./docItem";

interface caseItem {
    id?: number;
    status: 'new'|'pending'|'done'
    caseNumber: string;
    address: string;
    published: boolean;
    documents: Array<docItem>;
    createdBy?: number;
}

export interface createdUpdatedFields {
    createdAt?: Date
    lastUpdate?: Date
}