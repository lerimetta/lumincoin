import config from "../../config/config.js";
import { Auth } from "../services/auth.js";
import { CustomHttp } from "../services/custom-http.js";
import Chart from 'chart.js/auto';

export class Main {
    constructor() {
        this.myChart = null;
        this.myChart2 = null;
        this.result;
        this.todayButton = document.getElementById('today');
        this.todayButton.onclick = (e) => {
            const active = document.querySelector('.active');
            active.classList.remove('active');
            const current = e.target;
            current.classList.add('active');
            this.init();
        }
        this.weekButton = document.getElementById('week');
        this.weekButton.onclick = (e) => {
            const active = document.querySelector('.active');
            active.classList.remove('active');
            const current = e.target;
            current.classList.add('active');
            this.init();
        }
        this.monthButton = document.getElementById('month');
        this.monthButton.onclick = (e) => {
            const active = document.querySelector('.active');
            active.classList.remove('active');
            const current = e.target;
            current.classList.add('active');
            this.init();
        }
        this.yearButton = document.getElementById('year');
        this.yearButton.onclick = (e) => {
            const active = document.querySelector('.active');
            active.classList.remove('active');
            const current = e.target;
            current.classList.add('active');
            this.init();
        }
        this.allButton = document.getElementById('all');
        this.allButton.onclick = (e) => {
            const active = document.querySelector('.active');
            active.classList.remove('active');
            const current = e.target;
            current.classList.add('active');
            this.init();
        }
        this.intervalButton = document.getElementById('interval');
        this.intervalButton.onclick = (e) => {
            const active = document.querySelector('.active');
            active.classList.remove('active');
            const current = e.target;
            current.classList.add('active');
            // this.init();
        }
        this.dateFrom = document.getElementById('with-date');
        this.dateFrom.onchange = (e) => {
            this.dateFromValue = e.target.value
            this.init();
        }
        this.dateTo = document.getElementById('on-date');
        this.dateTo.onchange = (e) => {
            this.dateToValue = e.target.value
            this.init();
        }

        const ctx2 = document.getElementById('myChart2');
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
        }
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
                    }
                },

            }
        }
        Chart.defaults.color = '#052C65';
        Chart.defaults.font.weight = '500';
        this.init();

    }

    async init() {
        const ctx = document.getElementById('myChart');
        const ctx2 = document.getElementById('myChart2');
        try {
            let currentButton = document.querySelector('.active');
            let period = currentButton.getAttribute('id');
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
            if (this.result.length !== 0) {
                if (this.result.error) {
                    throw new Error(result.error);
                }

                let incomes = this.result.filter(function (el) {
                    return el.type === 'income';
                })
                let incomesCategory = incomes.map(function (item) {
                    return !item.category ? "Без категории" : item.category;
                });
                let amountIncomes = incomes.map(function (item) {
                    return item.amount;
                });
                let expense = this.result.filter(function (el) {
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