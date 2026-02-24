import config from "../../config/config";
import { Auth } from "../services/auth";
import { CustomHttp } from "../services/custom-http";
import { IncExpResponseType } from "../types/inc-exp-response.type";
import { DefaultResponseType } from "../types/default-response.type";

export class IncExp {
    private id: string | null;
    private result: IncExpResponseType[] | DefaultResponseType | null = null;;
    private tableRow: HTMLCollectionOf<HTMLTableRowElement> | null = null;
    private dateFromValue: string;
    private dateToValue: string;
    private tBody: HTMLElement | null;
    private deleteButton: HTMLElement | null;
    private todayButton: HTMLElement | null;
    private weekButton: HTMLElement | null;
    private monthButton: HTMLElement | null;
    private yearButton: HTMLElement | null;
    private allButton: HTMLElement | null;
    private intervalButton: HTMLElement | null;
    private dateFrom: HTMLElement | null;
    private dateTo: HTMLElement | null;

    constructor() {
        this.id = '';
        this.dateFromValue = "";
        this.dateToValue = "";
        this.tBody = document.getElementById('tbody');
        this.deleteButton = document.getElementById('delete-button');
        if (this.deleteButton) {
            this.deleteButton.onclick = () => {
                this.deleteItem();
            }
        }
        this.init();
        this.todayButton = document.getElementById('today');
        if (this.todayButton) {
            this.todayButton.onclick = (e: Event) => {
                const active = document.querySelector('.active');
                active?.classList.remove('active');
                const current = e.target as HTMLElement;
                current.classList.add('active');
                this.init();
            }
        }
        this.weekButton = document.getElementById('week');
        if (this.weekButton) {
            this.weekButton.onclick = (e: Event) => {
                const active = document.querySelector('.active');
                active?.classList.remove('active');
                const current = e.target as HTMLElement;
                current.classList.add('active');
                this.init();
            }
        }
        this.monthButton = document.getElementById('month');
        if (this.monthButton) {
            this.monthButton.onclick = (e: Event) => {
                const active = document.querySelector('.active');
                active?.classList.remove('active');
                const current = e.target as HTMLElement;
                current.classList.add('active');
                this.init();
            }
        }
        this.yearButton = document.getElementById('year');
        if (this.yearButton) {
            this.yearButton.onclick = (e: Event) => {
                const active = document.querySelector('.active');
                active?.classList.remove('active');
                const current = e.target as HTMLElement;
                current.classList.add('active');
                this.init();
            }
        }
        this.allButton = document.getElementById('all');
        if (this.allButton) {
            this.allButton.onclick = (e: Event) => {
                const active = document.querySelector('.active');
                active?.classList.remove('active');
                const current = e.target as HTMLElement;
                current.classList.add('active');
                this.init();
            }
        }

        this.intervalButton = document.getElementById('interval');
        if (this.intervalButton) {
            this.intervalButton.onclick = (e: Event) => {
                const active = document.querySelector('.active');
                active?.classList.remove('active');
                const current = e.target as HTMLElement;
                current.classList.add('active');
            }
        }

        this.dateFrom = document.getElementById('with-date');
        if (this.dateFrom) {
            this.dateFrom.onchange = (e: Event) => {
                this.dateFromValue = (e.target as HTMLInputElement).value
                this.init();
            }
        }

        this.dateTo = document.getElementById('on-date');
        if (this.dateTo) {
            this.dateTo.onchange = (e: Event) => {
                this.dateToValue = (e.target as HTMLInputElement).value
                this.init();
            }
        }

    }
    private async init(): Promise<void> {
        try {
            let currentButton: HTMLElement | null = document.querySelector('.active');
            if (currentButton) {
                let period: string | null = currentButton.getAttribute('id');
                switch (period) {
                    case 'today':
                        this.result = await CustomHttp.request(config.host + '/operations');
                        break;
                    case 'week':
                        this.result = await CustomHttp.request(config.host + '/operations?period=week');
                        break;
                    case 'month':
                        this.result = await CustomHttp.request(config.host + '/operations?period=month');
                        break;
                    case 'year':
                        this.result = await CustomHttp.request(config.host + '/operations?period=year');
                        break;
                    case 'all':
                        this.result = await CustomHttp.request(config.host + '/operations?period=all');
                        break;
                    case 'interval':
                        if (this.dateFromValue && this.dateToValue) {
                            this.result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + this.dateFromValue + '&dateTo=' + this.dateToValue);
                        }
                        break;
                }
            }
            if (this.result) {
                if ((this.result as DefaultResponseType).error !== undefined) {
                    throw new Error((this.result as DefaultResponseType).message);
                }
                this.showData();
                Auth.getBalance();
                return;
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    private showData(): void {
        const tbodyElement: HTMLElement | null = document.getElementById('tbody');
        if (this.tableRow) {
            for (let index = this.tableRow.length - 1; index >= 0; index--) {
                this.tableRow[index]?.remove();
            }
        }
        (this.result as IncExpResponseType[]).forEach((element, index) => {
            const trElement: HTMLTableRowElement = document.createElement('tr');
            tbodyElement?.appendChild(trElement);
            const thElement: HTMLTableCellElement = document.createElement('th');
            thElement.innerText = (index + 1).toLocaleString();
            trElement.appendChild(thElement);
            const tdElement: HTMLTableCellElement = document.createElement('td');
            tdElement.setAttribute('class', element.type === 'income' ? 'text-success' : 'text-danger');
            tdElement.innerText = element.type === 'income' ? 'доход' : 'расход';
            trElement.appendChild(tdElement);
            const categoryElement: HTMLTableCellElement = document.createElement('td');
            if (!element.category) {
                categoryElement.innerText = 'Без категории';
            } else {
                categoryElement.innerText = element.category.toLowerCase();
            }
            trElement.appendChild(categoryElement);
            const amountElement: HTMLTableCellElement = document.createElement('td');
            amountElement.innerText = element.amount + '$';
            trElement.appendChild(amountElement);
            const dateElement: HTMLTableCellElement = document.createElement('td');
            const date = new Date(element.date);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            dateElement.innerText = `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`
            trElement.appendChild(dateElement);
            const commentElement: HTMLTableCellElement = document.createElement('td');
            commentElement.innerText = element.comment;
            trElement.appendChild(commentElement);
            const actionElement: HTMLTableCellElement = document.createElement('td');
            const trashElement: HTMLAnchorElement = document.createElement('a');
            trashElement.setAttribute('class', 'me-3');
            trashElement.setAttribute('data-bs-toggle', 'modal');
            trashElement.setAttribute('data-bs-target', '#exampleModalCenter');
            trashElement.setAttribute('type', 'button');
            const trashImg: HTMLImageElement = document.createElement('img');
            trashImg.setAttribute('src', './assets/images/trash.svg');
            trashImg.setAttribute('data-id', (element.id).toLocaleString());
            trashElement.appendChild(trashImg);
            actionElement.appendChild(trashElement);
            trashElement.onclick = (e) => {
                this.id = (e.target as HTMLElement).getAttribute('data-id');
            }
            const editElement = document.createElement('a');
            editElement.setAttribute('href', '#/inc-exp-edit?id=' + element.id);
            const editImg = document.createElement('img');
            editImg.setAttribute('src', './assets/images/pen.svg');
            editElement.appendChild(editImg);
            actionElement.appendChild(editElement);
            trElement.appendChild(actionElement);
        });
        if (this.tBody) {
            this.tableRow = this.tBody.getElementsByTagName('tr');
        }

    }

    private async deleteItem(): Promise<void> {
        try {
            let res = await CustomHttp.request(config.host + '/operations/' + this.id, 'DELETE');
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

