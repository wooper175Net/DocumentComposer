import type { SubItemType } from "$lib/enums/SubItemType";

export interface docItemSubItem {
    id?: number;
    label: string;
    checked?: boolean;
    type: SubItemType;
}