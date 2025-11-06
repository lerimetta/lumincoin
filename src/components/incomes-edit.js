import config from "../../config/config.js";
import { Auth } from "../services/auth.js";
import { CustomHttp } from "../services/custom-http.js";
import { UrlManager } from "../services/url-manager.js";


export class EditIncome {
    constructor() {
        this.params = UrlManager.getQueryParams();
        this.error = document.getElementById('error-edit');
        this.title = null;
        this.inputEdit = document.getElementById('exampleFormControlInput1');
        this.inputEdit.onchange = (e) => {
            this.title = e.target.value;
        }
        this.editButton = document.getElementById('edit-button');
        this.editButton.onclick = this.editCategory.bind(this);
        this.getCategory();
      
    }

    async editCategory() {
        if (this.title) {
            try {
                this.result = await CustomHttp.request(config.host + '/categories/income/' + this.params.id, 'PUT', {
                    title: this.title,
                });
                if (this.result) {
                    if (this.result.error) {
                        throw new Error(result.error);
                    }
                    location.href = '#/incoms';
                    return;
                }
            }
            catch (error) {
                console.log(error);
            }
        } else {
            this.error.style.display = 'block';
            this.inputEdit.classList.add('is-invalid');
        }

    }

    async getCategory() {
        try {
            this.result = await CustomHttp.request(config.host + '/categories/income/' + this.params.id);
            if (this.result) {
                if (this.result.error) {
                    throw new Error(result.error);
                }
                this.inputEdit.value = this.result.title;
                Auth.getBalance();
                console.log(this.result);
                return;
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}