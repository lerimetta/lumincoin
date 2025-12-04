import config from "../../config/config.js";
import { Auth } from "../services/auth.js";
import { CustomHttp } from "../services/custom-http.js";
import { UrlManager } from "../services/url-manager.js";

export class EditIncExp {
    constructor() {
        this.params = UrlManager.getQueryParams();
        this.datas = {
            type: "income",
            amount: null,
            date: null,
            comment: "",
            category_id: null,
        };
        this.error = document.getElementById('error-edit');
        this.title = null;
        this.inputType = document.getElementById('type-input');
        this.inputCategory = document.getElementById('category-input');
        this.inputAmount = document.getElementById('amount-input');
        this.inputAmount.onchange = () => { this.datas.amount = Number(this.inputAmount.value)};
        this.inputDate = document.getElementById('date-input');
        this.inputDate.onchange = () => { this.datas.date = this.inputDate.value };
        this.inputComment = document.getElementById('comment-input');
        this.inputComment.onchange = () => { this.datas.comment = this.inputComment.value };
        this.result = null;
        this.editButton = document.getElementById('button-edit');
        this.editButton.onclick = this.editCategory.bind(this);
        this.errorCategory = document.getElementById('error-category');
        this.errorAmount = document.getElementById('error-amount');
        this.errorDate = document.getElementById('error-date');
        this.errorComment = document.getElementById('error-comment');
        this.getCategory();

    }

    async editCategory() {
        let isValid = this.isValidForm();
        if (isValid) {
            try {
                this.result = await CustomHttp.request(config.host + '/operations/' + this.params.id, 'PUT', this.datas);
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

    async getCategory() {
        try {
            this.result = await CustomHttp.request(config.host + '/operations/' + this.params.id);
            let resultCategory = null;
            if (this.result.type === 'income') {
                resultCategory = await CustomHttp.request(config.host + '/categories/income');
            } else {
                resultCategory = await CustomHttp.request(config.host + '/categories/expense');
                this.datas.type = 'expense';
            }
            let categoryId = resultCategory.find(el => el.title === this.result.category);
            if (this.result) {
                if (this.result.error) {
                    throw new Error(result.error);
                }
                this.inputType.value = this.result.type === 'income' ? 'Доход' : 'Расход';
                this.inputType.setAttribute('readonly', 'readonly');
                this.inputCategory.value = this.result.category;
                this.inputAmount.value = this.result.amount;
                this.inputDate.value = this.result.date;
                this.inputComment.value = this.result.comment;
                this.datas.amount = Number(this.inputAmount.value);
                this.datas.date = this.inputDate.value;
                this.datas.comment = this.inputComment.value;
                this.datas.category_id = categoryId.id;
                Auth.getBalance();
                return;
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    isValidForm() {
        if (!this.inputAmount.value) {
            this.errorAmount.style.display = 'block';
            this.inputAmount.classList.add('is-invalid');
        } else {
            this.errorAmount.style.display = 'none';
            this.inputAmount.classList.remove('is-invalid');
        }
        if (!this.inputDate.value) {
            this.errorDate.style.display = 'block';
            this.inputDate.classList.add('is-invalid');
        } else {
            this.errorDate.style.display = 'none';
            this.inputDate.classList.remove('is-invalid');
        }
        if (!this.inputComment.value) {
            this.errorComment.style.display = 'block';
            this.inputComment.classList.add('is-invalid');
        } else {
            this.errorComment.style.display = 'none';
            this.inputComment.classList.remove('is-invalid');
        }
        if (this.inputAmount.value && this.inputDate.value && this.inputComment.value) {
            return true;
        }
        return false;
    }

}