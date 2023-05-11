import type { docItemSubItem } from "./docItemSubItem";


export interface docItem {
    id?: number;
    //dbid?: number; //add this to make sure ids don't get amended while dragging and rearranging
    heading: string;
    type: string;
    desc?: string;
    sub_items?: Array<docItemSubItem>;
    done?: boolean;
}