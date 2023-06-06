import type { caseItem } from "$lib/interfaces/caseItem";
import type { docItem } from "$lib/interfaces/docItem";
import type { docItemSubItem } from "$lib/interfaces/docItemSubItem";

class Api {
    private apiUrl = '/api';

    async updateCaseDocs(caseItem:caseItem, newDocList: Array<docItem>): Promise<docItem[]> {
        const data = {
            caseItem: caseItem,
            newDocList: newDocList
        };
        
        let response = await fetch(`${this.apiUrl}/update-docs`, {method:'POST', body: JSON.stringify(data)});
        const newDocs = await response.json();
        return newDocs;
    }

    async deleteDoc(docId: number) {
        let response = await fetch(`${this.apiUrl}/delete-doc`, {method:'POST', body: JSON.stringify( { docId } )});
        const json = await response.json();
        return json;
    }

    async toggleDoc(docId: number, done: boolean) {
        let response = await fetch(`${this.apiUrl}/toggle-doc`, {method:'POST', body: JSON.stringify( { docId, done } )});
        const json = await response.json();
        return json;
    }

    async addSubItem(docId: number, subItem: docItemSubItem) {
        let response = await fetch(`${this.apiUrl}/add-sub-item`, {method:'POST', body: JSON.stringify( { docId, subItem } )});
        const json = await response.json();
        return json;
    }
}

export const api = new Api;