import config from "../../config/config.js";
import { Auth } from "../services/auth.js";
import { CustomHttp } from "../services/custom-http.js";
import { UrlManager } from "../services/url-manager.js";

export class CreateIncExp {
    constructor() {
        this.errorCategory = document.getElementById('error-category');
        this.errorAmount = document.getElementById('error-amount');
        this.errorDate = document.getElementById('error-date');
        this.errorComment = document.getElementById('error-comment');
        this.urlParams = UrlManager.getQueryParams();
        this.params = {
            type: 'income',
            amount: null,
            date: null,
            comment: "",
            category_id: null,
        };
        this.result = null;
        this.createButton = document.getElementById('button-create');
        this.createButton.onclick = this.createCategory.bind(this);
        this.selectType = document.getElementById('select-type');
        this.selectExpense = document.getElementById('expense');
        this.selectType.onchange = () => {
            this.params.type = this.selectType.value;
        }
        this.selectType.addEventListener('change', this.init.bind(this));
        this.selectCategory = document.getElementById('select-category');
        this.selectOptions = this.selectCategory.getElementsByTagName('option');
        this.selectCategory.onchange = () => {
            let categoryName = this.selectCategory.value;
            let categoryId = this.result.find(el => el.title === categoryName);
            this.params.category_id = categoryId.id;
        }
        this.amount = document.getElementById('amount');
        this.amount.onchange = () => {
            this.params.amount = Number(this.amount.value);
        }
        this.date = document.getElementById('date');
        this.date.onchange = () => {
            this.params.date = this.date.value;
        }
        this.comment = document.getElementById('comment');
        this.comment.onchange = () => {
            this.params.comment = this.comment.value;
        }
        this.checkButton();
        this.init(); 
    }
    async init() {
        try {
            if (this.selectType.value === 'income') {
                this.result = await CustomHttp.request(config.host + '/categories/income');
                if (this.result) {
                    this.showOptions();
                    Auth.getBalance();
                    return;
                }
            } else {
                this.result = await CustomHttp.request(config.host + '/categories/expense');
                this.showOptions();
                Auth.getBalance();
                return;
            }

        }
        catch (error) {
            console.log(error);
        }

    }

    showOptions() {
        for (let i = this.selectOptions.length - 1; i >= 1; i--) {
            this.selectOptions[i].remove();
        }
        this.result.forEach(element => {
            const selectElement = document.getElementById('select-category');
            const optionElement = document.createElement('option');
            optionElement.setAttribute('value', element.title);
            optionElement.innerText = element.title;
            selectElement.appendChild(optionElement);
        });
    }
    async createCategory() {
        let isValid = this.isValidForm();
        if (isValid) {
            try {
                this.result = await CustomHttp.request(config.host + '/operations', 'POST', this.params);
                if (this.result) {
                    if (this.result.error) {
                        throw new Error(result.error);
                    }

                    location.href = '#/inc-exp';
                    return;
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    checkButton() {
        if (this.urlParams.type === 'expense') {
            this.selectExpense.setAttribute('selected', 'selected');
            this.params.type = this.selectType.value;
        }
    }
    isValidForm() {
        if (this.selectCategory.value === 'category') {
            this.errorCategory.style.display = 'block';
            this.selectCategory.classList.add('is-invalid');
        } else {
            this.errorCategory.style.display = 'none';
            this.selectCategory.classList.remove('is-invalid');
        }
        if (!this.amount.value) {
            this.errorAmount.style.display = 'block';
            this.amount.classList.add('is-invalid');
        } else {
            this.errorAmount.style.display = 'none';
            this.amount.classList.remove('is-invalid');
        }
        if (!this.date.value) {
            this.errorDate.style.display = 'block';
            this.date.classList.add('is-invalid');
        } else {
            this.errorDate.style.display = 'none';
            this.date.classList.remove('is-invalid');
        }
        if (!this.comment.value) {
            this.errorComment.style.display = 'block';
            this.comment.classList.add('is-invalid');
        } else {
            this.errorComment.style.display = 'none';
            this.comment.classList.remove('is-invalid');
        }
        if (this.selectCategory.value !== 'category' && this.amount.value && this.date.value && this.comment.value) {
            return true;
        }
        return false;
    }
}