import config from "../../config/config";
import { Auth } from "../services/auth";
import { CustomHttp } from "../services/custom-http";
import {Chart} from 'chart.js/auto';
import { DefaultResponseType } from "../types/default-response.type";
import { IncExpResponseType } from "../types/inc-exp-response.type";
import { DataType } from "../types/data.type";

export class Main {
    private myChart: Chart | null = null;
    private myChart2: Chart | null = null;
    private result: IncExpResponseType[] | DefaultResponseType | null = null;
    private todayButton: HTMLElement | null;
    private weekButton: HTMLElement | null;
    private monthButton: HTMLElement | null;
    private yearButton: HTMLElement | null;
    private allButton: HTMLElement | null;
    private intervalButton: HTMLElement | null;
    private dateFrom: HTMLElement | null;
    private dateFromValue: string;
    private dateTo: HTMLElement | null;
    private dateToValue: string;
    private data: DataType;
    private data2: DataType;;
    constructor() {
        this.myChart = null;
        this.myChart2 = null;
        this.dateFromValue = '';
        this.dateToValue = '';
        this.todayButton = document.getElementById('today');
        if (this.todayButton) {
            this.todayButton.onclick = (e: Event) => {
                const active: HTMLElement | null = document.querySelector('.active');
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
    
        this.data = {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    label: '$',
                    data: [],
                    borderWidth: 1,
                    backgroundColor: [
                        'rgb(220, 53, 69)',
                        'rgb(253, 126, 20)',
                        'rgb(255, 193, 7 )',
                        'rgb(32, 201, 151 )',
                        'rgb(13, 110, 253 )',
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                    ],
                    hoverOffset: 4,
                }],
            },
            options: {
                layout: {
                    padding: {
                        left: -10,
                        bottom: 0,
                    }
                },
            }
        };
        this.data2 = {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    label: '$',
                    data: [],
                    borderWidth: 1,
                    backgroundColor: [
                        'rgb(220, 53, 69)',
                        'rgb(253, 126, 20)',
                        'rgb(255, 193, 7 )',
                        'rgb(32, 201, 151 )',
                        'rgb(13, 110, 253 )',
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                    ],
                    hoverOffset: 4,
                }],
            },
            options: {
                layout: {
                    padding: {
                        left: -10,
                        bottom: 0,
                    }
                },

            }
        }
        this.init();
        Chart.defaults.color = '#052C65';
        Chart.defaults.font.weight = 500;

    }

    private async init(): Promise<void> {
        const ctx = document.getElementById('myChart') as HTMLCanvasElement;
        const ctx2 = document.getElementById('myChart2') as HTMLCanvasElement;
    
        try {
            let currentButton: HTMLElement | null = document.querySelector('.active') as HTMLElement;
            let period: string | null = currentButton.getAttribute('id');
            switch (period) {
                case 'today':
                    this.result = await CustomHttp.request(config.host + '/operations');
                    if (this.myChart !== null) {
                        this.myChart.destroy();
                    }
                    if (this.myChart2 !== null) {
                        this.myChart2.destroy();
                    }
                    break;
                case 'week':
                    this.result = await CustomHttp.request(config.host + '/operations?period=week');
                    if (this.myChart !== null) {
                        this.myChart.destroy();
                    }
                    if (this.myChart2 !== null) {
                        this.myChart2.destroy();
                    }

                    break;
                case 'month':
                    this.result = await CustomHttp.request(config.host + '/operations?period=month');
                    if (this.myChart !== null) {
                        this.myChart.destroy();
                    }
                    if (this.myChart2 !== null) {
                        this.myChart2.destroy();
                    }
                    break;
                case 'year':
                    this.result = await CustomHttp.request(config.host + '/operations?period=year');
                    if (this.myChart !== null) {
                        this.myChart.destroy();
                    }
                    if (this.myChart2 !== null) {
                        this.myChart2.destroy();
                    }
                    break;
                case 'all':
                    this.result = await CustomHttp.request(config.host + '/operations?period=all');
                    if (this.myChart !== null) {
                        this.myChart.destroy();
                    }
                    if (this.myChart2 !== null) {
                        this.myChart2.destroy();
                    }
                    break;
                case 'interval':
                    if (this.myChart !== null) {
                        this.myChart.destroy();
                    }
                    if (this.myChart2 !== null) {
                        this.myChart2.destroy();
                    }
                    if (this.dateFromValue && this.dateToValue) {
                        this.result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + this.dateFromValue + '&dateTo=' + this.dateToValue);

                    }
                    break;
            };
            Auth.getBalance();
            if ((this.result as IncExpResponseType[]).length !== 0) {
                if ((this.result as DefaultResponseType).error) {
                    throw new Error((this.result as DefaultResponseType).message);
                }

                let incomes = (this.result as IncExpResponseType[]).filter(function (el) {
                    return el.type === 'income';
                })
                let incomesCategory = incomes.map(function (item) {
                    return !item.category ? "Без категории" : item.category;
                });
                let amountIncomes = incomes.map(function (item) {
                    return item.amount;
                });
                let expense = (this.result as IncExpResponseType[]).filter(function (el) {
                    return el.type === 'expense';
                });
                let expenseCategory = expense.map(function (item) {
                    return !item.category ? "Без категории" : item.category;
                });
                let amountExpense = expense.map(function (item) {
                    return item.amount;
                });
                this.data.data.labels = incomesCategory;
                this.data.data.datasets[0].data = amountIncomes;
                this.data2.data.labels = expenseCategory;
                this.data2.data.datasets[0].data = amountExpense;
                this.myChart = new Chart(ctx, this.data);
                this.myChart2 = new Chart(ctx2, this.data2);

                return;
            }

        }
        catch (error) {
            console.log(error);
        }
    }

}