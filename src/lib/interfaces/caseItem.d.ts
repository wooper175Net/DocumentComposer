import type { docItem } from "./docItem";

export interface caseItem {
    id?: number;
    //dbid?: number; //add this to make sure ids don't get amended while dragging and rearranging
    status: 'new'|'pending'|'done'
    case_number: string;
    address: string;
    last_update?: string;
    doc_itmes?: Array<docItem>;
    created_by?: number;
}