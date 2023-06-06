import type { docItemSubItem } from "./docItemSubItem";


export interface docItem {
    id?: number;
    heading: string;
    type: string;
    desc?: string;
    documentSubItems?: Array<docItemSubItem>;
    done?: boolean;
    sequence?: number;
}