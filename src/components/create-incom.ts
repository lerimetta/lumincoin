import config from "../../config/config";
import { Auth } from "../services/auth";
import { CustomHttp } from "../services/custom-http";

export class CreateIncom {
    private error: HTMLElement | null;
    private title: string;
    private inputCreate: HTMLElement | null;
    private createButton: HTMLElement | null;

    constructor() {
        this.error = document.getElementById('error-create');
        this.title = '';
        this.inputCreate = document.getElementById('exampleFormControlInput1');
        if (this.inputCreate) {
            this.inputCreate.onchange = (e: Event) => {
                this.title = (e.target as HTMLInputElement).value;
            }
        }
        this.createButton = document.getElementById('create-button');
        if (this.createButton) {
            this.createButton.onclick = this.createNewCategory.bind(this);
        }
        Auth.getBalance2();
    }

    async createNewCategory() {
        if (this.title) {
            try {
                let result = await CustomHttp.request(config.host + '/categories/income', "POST",
                    { title: this.title }
                );
                if (result) {
                    if (result.error) {
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
            if (this.error && this.inputCreate) {
                this.error.style.display = 'block';
                this.inputCreate.classList.add('is-invalid');
            }
        }
    }
}