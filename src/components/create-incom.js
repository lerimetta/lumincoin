import config from "../../config/config.js";
import { Auth } from "../services/auth.js";
import { CustomHttp } from "../services/custom-http.js";


export class CreateIncom {
    constructor() {
        this.error = document.getElementById('error-create');
        this.title = null;
        this.inputCreate = document.getElementById('exampleFormControlInput1');
        this.inputCreate.onchange = (e) => {
            this.title = e.target.value;
        }
        this.createButton = document.getElementById('create-button');
        this.createButton.onclick = this.createNewCategory.bind(this);
        Auth.getBalance2();
    }

    async createNewCategory() {
        if (this.title) {
            try {
                this.result = await CustomHttp.request(config.host + '/categories/income', "POST",
                    { title: this.title }
                );
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
            this.inputCreate.classList.add('is-invalid');
        }
    
    }

}