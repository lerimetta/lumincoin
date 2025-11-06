import config from "../../config/config.js";
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
        this.selectCategory = document.getElementById('select-category');
        this.selectCategory.onchange = () => {
            let categoryName = this.selectCategory.value;
            let categortID = this.result.find(el => el.title === categoryName);
            this.params.category_id = categortID.id;
            console.log(categortID);
            console.log(categortID.id);

        }
        this.amount = document.getElementById('amount');
        this.amount.onchange = () => {
            this.params.amount = this.amount.value;
            console.log(this.params);

        }
        this.date = document.getElementById('date');
        this.date.onchange = () => {
            this.params.date = this.date.value;

        }
        this.comment = document.getElementById('comment');
        this.comment.onchange = () => {
            this.params.comment = this.comment.value;
            console.log(this.params);
        }

        this.init();
    }

    async init() {
        try {
            this.result = await CustomHttp.request(config.host + '/categories/income');
            if (this.result) {
                if (this.result.error) {
                    throw new Error(result.error);
                }
                this.showOptions();
                return;
            }
        }
        catch (error) {
            console.log(error);
        }

    }

    showOptions() {
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