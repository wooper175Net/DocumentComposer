import type { caseItem } from "$lib/interfaces/caseItem";
import type { docItem } from "$lib/interfaces/docItem";
import type { docItemSubItem } from "$lib/interfaces/docItemSubItem";

class Api {
    private apiUrl = '/api';
    private publicApiUrl = '/papi';

    async updateCaseDocs(caseItem:caseItem, newDocList: Array<docItem>) {
        return this.sendApiRequest('update-docs', { caseItem, newDocList });
    }

    async deleteDoc(docId: number) {
        return this.sendApiRequest('delete-doc', { docId });
    }

    async toggleDoc(docId: number, done: boolean) {
        return this.sendApiRequest('toggle-doc', { docId, done }, this.publicApiUrl);
    }

    async addSubItem(docId: number, subItem: docItemSubItem) {
        return this.sendApiRequest('add-sub-item', { docId, subItem });
    }

    async deleteSubItem(subItemId: number) {
        return this.sendApiRequest('del-sub-item', { subItemId });
    }

    async toggleSubItem(subItemId: number, checked: boolean) {
        return this.sendApiRequest('toggle-sub-item', { subItemId, checked }, this.publicApiUrl);
    }

    async createDocTemplate(docTemplateItem: docItem) {
        return this.sendApiRequest('add-doc-template', { docTemplateItem } );
    }

    async updateDocTemplate(docTemplateItem: docItem, deletedSubItems: Array<docItemSubItem>) {
        return this.sendApiRequest('update-doc-template', { docTemplateItem, deletedSubItems });
    }

    async deleteDocTemplate(tempDocId: number) {
        return this.sendApiRequest('del-doc-template', { tempDocId });
    }

    async updateDoc(updatedItem: docItem) {
        return this.sendApiRequest('update-doc', { updatedItem });
    }

    async toggleCaseStatus(caseId: number, status: string) {
        return this.sendApiRequest('toggle-case-status', { caseId, status }, this.publicApiUrl);
    }

    private async sendApiRequest(endpoint: string, postObj: Object, apiUrl: string = this.apiUrl) {
        let response = await fetch(`${apiUrl}/${endpoint}`, {method:'POST', body: JSON.stringify( postObj )});

        if (!response.ok) {
            throw new Error("Operation failed")
        }

        return await response.json();
    }
}

export const api = new Api;