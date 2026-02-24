import config from "../../config/config";
import { Auth } from "../services/auth";
import { CustomHttp } from "../services/custom-http";
import { UrlManager } from "../services/url-manager";
import { QueryParamsType } from "../types/query-params.type";
import { IncExpDatasType } from "../types/inc-exp-datas.type";
import { DefaultResponseType } from "../types/default-response.type";
import { ResultCategoryResponseType } from "../types/result-category-response.type";

export class CreateIncExp {
    private errorCategory: HTMLElement | null;
    private errorAmount: HTMLElement | null;
    private errorDate: HTMLElement | null;
    private errorComment: HTMLElement | null;
    private urlParams: QueryParamsType;
    private params: IncExpDatasType;
    private result: ResultCategoryResponseType[] | DefaultResponseType | null = null;
    private createButton: HTMLElement | null;
    private selectType: HTMLElement | null;
    private selectExpense: HTMLElement | null;
    private selectCategory: HTMLElement | null;
    private selectOptions: HTMLCollectionOf<HTMLOptionElement>;
    private amount: HTMLElement | null;
    private date: HTMLElement | null;
    private comment: HTMLElement | null;

    constructor() {
        this.errorCategory = document.getElementById('error-category');
        this.errorAmount = document.getElementById('error-amount');
        this.errorDate = document.getElementById('error-date');
        this.errorComment = document.getElementById('error-comment');
        this.urlParams = UrlManager.getQueryParams();
        this.params = {
            type: 'income',
            amount: 0,
            date: "",
            comment: "",
            category_id: 0,
        };

        this.createButton = document.getElementById('button-create');
        if (this.createButton) {
            this.createButton.onclick = this.createCategory.bind(this);
        }
        this.selectType = document.getElementById('select-type');
        this.selectExpense = document.getElementById('expense');
        if (this.selectType) {
            this.selectType.onchange = () => {
                this.params.type = (this.selectType as HTMLInputElement).value;
            }
            this.selectType.addEventListener('change', this.init.bind(this));
        }

        this.selectCategory = document.getElementById('select-category');
        this.selectOptions = this.selectCategory!.getElementsByTagName('option');
        if (this.selectCategory) {

            this.selectCategory.onchange = () => {
                let categoryName = (this.selectCategory as HTMLInputElement).value;
                let categoryId = (this.result as ResultCategoryResponseType[]).find(el => el.title === categoryName);
                if (categoryId) {
                    this.params.category_id = categoryId.id;
                }
            }
        }

        this.amount = document.getElementById('amount');
        if (this.amount) {
            this.amount.onchange = () => {
                this.params.amount = Number((this.amount as HTMLInputElement).value);
            }
        }

        this.date = document.getElementById('date');
        if (this.date) {
            this.date.onchange = () => {
                this.params.date = (this.date as HTMLInputElement).value;
            }
        }

        this.comment = document.getElementById('comment');
        if (this.comment) {
            this.comment.onchange = () => {
                this.params.comment = (this.comment as HTMLInputElement).value;
            }
        }

        this.checkButton();
        this.init();
    }
    async init() {
        try {
            if ((this.selectType as HTMLInputElement).value === 'income') {
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
            this.selectOptions[i]!.remove();
        }
        (this.result as ResultCategoryResponseType[]).forEach(element => {
            const selectElement = document.getElementById('select-category');
            const optionElement = document.createElement('option');
            optionElement.setAttribute('value', element.title);
            optionElement.innerText = element.title;
            if (selectElement) {
                selectElement.appendChild(optionElement);
            }
        });
    }
    async createCategory() {
        let isValid: boolean = this.isValidForm();
        if (isValid) {
            try {
                let res = await CustomHttp.request(config.host + '/operations', 'POST', this.params);
                if (res) {
                    if (res.error) {
                        throw new Error(res.error);
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
            (this.selectExpense as HTMLInputElement).setAttribute('selected', 'selected');
            this.params.type = (this.selectType as HTMLInputElement).value;
        }
    }
    isValidForm() {
        if ((this.selectCategory as HTMLInputElement).value === 'category') {
            this.errorCategory!.style.display = 'block';
            this.selectCategory!.classList.add('is-invalid');
        } else {
            this.errorCategory!.style.display = 'none';
            this.selectCategory!.classList.remove('is-invalid');
        }
        if (!(this.amount as HTMLInputElement).value) {
            this.errorAmount!.style.display = 'block';
            this.amount!.classList.add('is-invalid');
        } else {
            this.errorAmount!.style.display = 'none';
            this.amount!.classList.remove('is-invalid');
        }
        if (!(this.date as HTMLInputElement).value) {
            this.errorDate!.style.display = 'block';
            this.date!.classList.add('is-invalid');
        } else {
            this.errorDate!.style.display = 'none';
            this.date!.classList.remove('is-invalid');
        }
        if (!(this.comment as HTMLInputElement).value) {
            this.errorComment!.style.display = 'block';
            this.comment!.classList.add('is-invalid');
        } else {
            this.errorComment!.style.display = 'none';
            this.comment!.classList.remove('is-invalid');
        }
        if ((this.selectCategory as HTMLInputElement).value !== 'category' && (this.amount as HTMLInputElement).value && (this.date as HTMLInputElement).value && (this.comment as HTMLInputElement).value) {
            return true;
        }
        return false;
    }
}