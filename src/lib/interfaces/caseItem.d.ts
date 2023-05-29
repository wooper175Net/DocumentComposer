import type { docItem } from "./docItem";

interface caseItem {
    id?: number;
    status: 'new'|'pending'|'done'
    caseNumber: string;
    address: string;
    doc_itmes?: Array<docItem>;
    createdBy?: number;
}

export interface createdUpdatedFields {
    createdAt?: Date
    lastUpdate?: Date
}