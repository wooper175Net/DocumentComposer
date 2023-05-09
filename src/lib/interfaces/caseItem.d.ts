import type { docItem } from "./docItem";

export interface caseItem {
    id?: number;
    case_number: string;
    address: string;
    last_update?: string;
    doc_itmes?: Array<docItem>
}