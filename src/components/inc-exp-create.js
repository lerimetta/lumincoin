import config from "../../config/config.js";
import { Auth } from "../services/auth.js";
import { CustomHttp } from "../services/custom-http.js";


export class IncExpCreate {
    constructor() {
        this.params = {
            type: "income",
            amount: 25000,
            date: "2025-01-01",
            comment: "дивиденды",
            category_id: 5
        };
        this.result = null;
        this.createButton = document.getElementById('button-create');
        this.createButton.onclick = this.createCategory.bind(this);
        this.selectType = document.getElementById('select-type');

        this.selectType.onchange = () => {
            this.params.type = this.selectType.value;

        }
        this.selectType.addEventListener('change', this.init.bind(this));
        this.selectCategory = document.getElementById('select-category');
        this.selectOptions = this.selectCategory.getElementsByTagName('option');
        this.selectCategory.onchange = () => {
            let categoryName = this.selectCategory.value;
            let categortID = this.result.find(el => el.title === categoryName);
            this.params.category_id = categortID.id;
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
        this.init();
      
    }

    async init() {
        try {
            if (this.selectType.value === 'income') {
                this.result = await CustomHttp.request(config.host + '/categories/income');
                if (this.result) {
                    this.showOptions();
                    Auth.getBalance();
                    this.in();
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
        try {
            this.result = await CustomHttp.request(config.host + '/operations', 'POST', this.params);
            if (this.result) {
                if (this.result.error) {
                    throw new Error(result.error);
                }
             
                return;
            }
        }
        catch (error) {
            console.log(error);
        }

    }

    async in() {
        try {
            this.result = await CustomHttp.request(config.host + '/operations');
            if (this.result) {
                if (this.result.error) {
                    throw new Error(result.error);
                }

                return;
            }
        }
        catch (error) {
            console.log(error);
        }

    }
}