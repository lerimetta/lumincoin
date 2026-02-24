import config from "../../config/config";
import { Auth } from "../services/auth";
import { CustomHttp } from "../services/custom-http";
import { UrlManager } from "../services/url-manager";
import { QueryParamsType } from "../types/query-params.type";

export class EditExpense {
    private params: QueryParamsType;
    private error: HTMLElement | null;
    private title: string;
    private inputEdit: HTMLElement | null;
    private editButton: HTMLElement | null;

    constructor() {
        this.params = UrlManager.getQueryParams();
        this.error = document.getElementById('error-edit');
        this.title = '';
        this.inputEdit = document.getElementById('exampleFormControlInput1');
        if (this.inputEdit) {
            this.inputEdit.onchange = (e: Event) => {
                this.title = (e.target as HTMLInputElement).value;
            }
        }
        this.editButton = document.getElementById('edit-button');
        if (this.editButton) {
            this.editButton.onclick = this.editCategory.bind(this);
        }
        this.getCategory();
    }

    private async editCategory(): Promise<void> {
        if (this.title) {
            try {
                let result = await CustomHttp.request(config.host + '/categories/expense/' + this.params.id, 'PUT', {
                    title: this.title,
                });
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    location.href = '#/expenses';
                    return;
                }
            }
            catch (error) {
                console.log(error);
            }
        } else {
            if (this.error && this.inputEdit) {
                this.error.style.display = 'block';
                this.inputEdit.classList.add('is-invalid');
            }
        }
    }

    async getCategory() {
        try {
            let result = await CustomHttp.request(config.host + '/categories/expense/' + this.params.id);
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }
                (this.inputEdit as HTMLInputElement).value = result.title;
                Auth.getBalance();
                return;
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}