import type { docItemSubItem } from "./docItemSubItem";


export interface docItem {
    id?: number;
    heading: string;
    type: string;
    desc?: string;
    sub_items?: Array<docItemSubItem>;
    done?: boolean;
}