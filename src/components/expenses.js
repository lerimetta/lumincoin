import config from "../../config/config.js";
import { Auth } from "../services/auth.js";
import { CustomHttp } from "../services/custom-http.js";

export class Expenses {
    constructor() {
        this.incomsList = document.getElementById('incoms-list');
        this.deleteBtn = document.getElementById('delete');
        this.point = document.getElementById('point')
        this.result = null;
        this.cardId = null;
        this.deleteBtn.onclick = this.deleteCategory.bind(this);
        this.init();

    }

    async init() {
        try {
            this.result = await CustomHttp.request(config.host + '/categories/expense');
            if (this.result) {
                if (this.result.error) {
                    throw new Error(result.error);
                }
                this.showExpenses();
                Auth.getBalance();
                return;
            }
        }
        catch (error) {
            console.log(error);
        }

    }
    showExpenses() {
        this.result.forEach(element => {
            const cardElement = document.createElement('div');
            cardElement.style.width = '22rem';
            cardElement.className = 'card';
            const cardBodyElement = document.createElement('div');
            cardBodyElement.className = 'card-body';
            const cardTitleElement = document.createElement('h2');
            cardTitleElement.className = 'card-title';
            cardTitleElement.innerText = element.title;
            const buttonEdit = document.createElement('a');
            buttonEdit.setAttribute('href', '#/expenses-edit?id=' + element.id);
            buttonEdit.className = 'btn btn-primary me-2';
            buttonEdit.innerText = 'Редактировать';
            const buttonDelete = document.createElement('a');
            buttonDelete.className = 'btn btn-danger';
            buttonDelete.innerText = 'Удалить';
            buttonDelete.setAttribute('data-bs-toggle', 'modal');
            buttonDelete.setAttribute('data-bs-target', '#exampleModalCenter');
            buttonDelete.setAttribute('data-id', element.id);
            buttonDelete.onclick = (e) => {
                this.cardId = e.target.getAttribute('data-id');
            }
            cardBodyElement.appendChild(cardTitleElement);
            cardBodyElement.appendChild(buttonEdit);
            cardBodyElement.appendChild(buttonDelete);
            cardElement.appendChild(cardBodyElement);
            this.incomsList.insertBefore(cardElement, this.point);
        });
    }

    async deleteCategory() {
        try {
            this.result = await CustomHttp.request(config.host + '/categories/expense/' + this.cardId, "DELETE",
            );
            if (this.result) {
                if (this.result.error) {
                    throw new Error(result.error);
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