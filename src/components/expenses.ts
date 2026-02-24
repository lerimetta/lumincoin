import config from "../../config/config";
import { Auth } from "../services/auth";
import { CustomHttp } from "../services/custom-http";
import { CategoriesIncomeType } from "../types/categories-income.type";
import { DefaultResponseType } from "../types/default-response.type";

export class Expenses {
    private incomsList: HTMLElement | null;
    private deleteBtn: HTMLElement | null;
    private point: HTMLElement | null;
    private result: CategoriesIncomeType[] | DefaultResponseType | null = null;
    private cardId: string | null;

    constructor() {
        this.incomsList = document.getElementById('incoms-list');
        this.deleteBtn = document.getElementById('delete');
        this.point = document.getElementById('point')
        this.cardId = '';
        if (this.deleteBtn) {
            this.deleteBtn.onclick = this.deleteCategory.bind(this);
        }
        this.init();
    }

    private async init(): Promise<void> {
        try {
            this.result = await CustomHttp.request(config.host + '/categories/expense');
            if (this.result) {
                if ((this.result as DefaultResponseType).error !== undefined) {
                    throw new Error((this.result as DefaultResponseType).message);
                }
                this.showExpenses();
                Auth.getBalance();
                return;
            }
        }
        catch (error) {
            console.log(error);
            return;
        }

    }
    showExpenses() {
        (this.result as CategoriesIncomeType[]).forEach(element => {
            const cardElement: HTMLElement = document.createElement('div');
            cardElement.style.width = '22rem';
            cardElement.className = 'card';
            const cardBodyElement: HTMLElement = document.createElement('div');
            cardBodyElement.className = 'card-body';
            const cardTitleElement: HTMLElement = document.createElement('h2');
            cardTitleElement.className = 'card-title';
            cardTitleElement.innerText = element.title;
            const buttonEdit: HTMLElement = document.createElement('a');
            buttonEdit.setAttribute('href', '#/expenses-edit?id=' + element.id);
            buttonEdit.className = 'btn btn-primary me-2';
            buttonEdit.innerText = 'Редактировать';
            const buttonDelete: HTMLElement = document.createElement('a');
            buttonDelete.className = 'btn btn-danger';
            buttonDelete.innerText = 'Удалить';
            buttonDelete.setAttribute('data-bs-toggle', 'modal');
            buttonDelete.setAttribute('data-bs-target', '#exampleModalCenter');
            buttonDelete.setAttribute('data-id', element.id);
            buttonDelete.onclick = (e) => {
                this.cardId = (e.target as HTMLElement).getAttribute('data-id');
            }
            cardBodyElement.appendChild(cardTitleElement);
            cardBodyElement.appendChild(buttonEdit);
            cardBodyElement.appendChild(buttonDelete);
            cardElement.appendChild(cardBodyElement);
            if (this.incomsList) {
                this.incomsList.insertBefore(cardElement, this.point);
            }
        });
    }

    private async deleteCategory(): Promise<void> {
        try {
            const res: DefaultResponseType = await CustomHttp.request(config.host + '/categories/expense/' + this.cardId, "DELETE",
            );
            if (res) {
                if (res.error) {
                    throw new Error(res.error.toString());
                }
                location.href = '#/expenses';
                return;
            }
        }
        catch (error) {
            console.log(error);
        }

    }
}