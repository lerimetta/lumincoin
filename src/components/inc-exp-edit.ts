import config from "../../config/config";
import { Auth } from "../services/auth";
import { CustomHttp } from "../services/custom-http";
import { UrlManager } from "../services/url-manager";
import { IncExpDatasType } from "../types/inc-exp-datas.type";
import { QueryParamsType } from "../types/query-params.type";
import { IncExpCreateResponseType } from "../types/inc-exp-create-response.type";
import { DefaultResponseType } from "../types/default-response.type";
import { ResultCategoryResponseType } from "../types/result-category-response.type";

export class EditIncExp {
    private params: QueryParamsType;
    private datas: IncExpDatasType;
    private inputType: HTMLElement | null;
    private inputCategory: HTMLElement | null;
    private inputAmount: HTMLElement | null;
    private inputDate: HTMLElement | null;
    private result: IncExpCreateResponseType | DefaultResponseType | null = null;
    private editButton: HTMLElement | null;
    private errorAmount: HTMLElement | null;
    private errorDate: HTMLElement | null;
    private errorComment: HTMLElement | null;
    private inputComment: HTMLElement | null;
  
    constructor() {
        this.params = UrlManager.getQueryParams();
        this.datas = {
            type: "income",
            amount: 0,
            date: '',
            comment: "",
            category_id: 0,
        };
        // this.error = document.getElementById('error-edit');
        // this.title = null;
        this.inputType = document.getElementById('type-input');
        this.inputCategory = document.getElementById('category-input');
        this.inputAmount = document.getElementById('amount-input');
        if (this.inputAmount) {
            this.inputAmount.onchange = () => { this.datas.amount = Number((this.inputAmount as HTMLInputElement).value) };
      
        }

        this.inputDate = document.getElementById('date-input');
        if (this.inputDate) {
            this.inputDate.onchange = () => { this.datas.date = (this.inputDate as HTMLInputElement).value };
        }
        this.inputComment = document.getElementById('comment-input');
        if (this.inputComment) {
            this.inputComment.onchange = () => { this.datas.comment = (this.inputComment as HTMLInputElement).value };
        }
        this.result = null;
        this.editButton = document.getElementById('button-edit');
        if (this.editButton) {
            this.editButton.onclick = this.editCategory.bind(this);
        }
        // this.errorCategory = document.getElementById('error-category');
        this.errorAmount = document.getElementById('error-amount');
        this.errorDate = document.getElementById('error-date');
        this.errorComment = document.getElementById('error-comment');
        this.getCategory();
    }
    
    private async editCategory(): Promise<void> {
        let isValid: boolean = this.isValidForm();
        if (isValid) {
            try {
                this.result = await CustomHttp.request(config.host + '/operations/' + this.params.id, 'PUT', this.datas);
                if (this.result) {
                    if ((this.result as DefaultResponseType).error !== undefined) {
                        throw new Error((this.result as DefaultResponseType).message);
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

    private async getCategory(): Promise<void> {
        try {
            this.result = await CustomHttp.request(config.host + '/operations/' + this.params.id);
            let resultCategory: ResultCategoryResponseType[];
            if ((this.result as IncExpCreateResponseType).type === 'income') {
                resultCategory = await CustomHttp.request(config.host + '/categories/income');
            } else {
                resultCategory = await CustomHttp.request(config.host + '/categories/expense');
                this.datas.type = 'expense';
            }
            let categoryId: ResultCategoryResponseType | undefined = resultCategory.find(el => el.title === (this.result as IncExpCreateResponseType).category);
            if (this.result) {
                if ((this.result as DefaultResponseType).error !== undefined) {
                    throw new Error((this.result as DefaultResponseType).message);
                }
                (this.inputType as HTMLInputElement).value = (this.result as IncExpCreateResponseType).type === 'income' ? 'Доход' : 'Расход';
                (this.inputType as HTMLInputElement).setAttribute('readonly', 'readonly');
                if((this.result as IncExpCreateResponseType).category=== undefined){
                    (this.inputCategory as HTMLInputElement).value = "без категории"; 
                }else {
                    (this.inputCategory as HTMLInputElement).value = (this.result as IncExpCreateResponseType).category;
                }           
                (this.inputAmount as HTMLInputElement).value = (this.result as IncExpCreateResponseType).amount.toLocaleString();
                (this.inputDate as HTMLInputElement).value = (this.result as IncExpCreateResponseType).date;
                (this.inputComment as HTMLInputElement).value = (this.result as IncExpCreateResponseType).comment;
                this.datas.amount = Number((this.inputAmount as HTMLInputElement).value);
                this.datas.date = (this.inputDate as HTMLInputElement).value;
                this.datas.comment = (this.inputComment as HTMLInputElement).value;
                // this.datas.category_id = (categoryId as ResultCategoryResponseType).id;
                Auth.getBalance();
                return;
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    private isValidForm(): boolean {
        if (!(this.inputAmount as HTMLInputElement).value) {
            this.errorAmount!.style.display = 'block';
            this.inputAmount!.classList.add('is-invalid');
        } else {
            this.errorAmount!.style.display = 'none';
            this.inputAmount!.classList.remove('is-invalid');
        }
        if (!(this.inputDate as HTMLInputElement).value) {
            this.errorDate!.style.display = 'block';
            this.inputDate!.classList.add('is-invalid');
        } else {
            this.errorDate!.style.display = 'none';
            this.inputDate!.classList.remove('is-invalid');
        }
        if (!(this.inputComment as HTMLInputElement).value) {
            this.errorComment!.style.display = 'block';
            this.inputComment!.classList.add('is-invalid');
        } else {
            this.errorComment!.style.display = 'none';
            this.inputComment!.classList.remove('is-invalid');
        }
        if ((this.inputAmount as HTMLInputElement).value && (this.inputDate as HTMLInputElement).value && (this.inputComment as HTMLInputElement).value) {
            return true;
        }
        return false;
    }

}