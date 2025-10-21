
import { Auth } from "../services/auth.js";
import { Form } from "./form.js";
import { Main } from "./main.js";


export class Router {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');
        this.title = document.getElementById('page-title');
        this.profileElement = document.getElementById('profile');
        this.profileFullNameElement = document.getElementById('profile-full-name');

        this.routes = [
            {
                route: '#/',
                title: 'Авторизация | Lumincoin',
                template: 'templates/login.html',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/sign-up',
                title: 'Регистрация | Lumincoin',
                template: 'templates/sign-up.html',
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/main',
                title: 'Главная | Lumincoin',
                template: 'templates/main.html',
                load: () => {
                    new Main();
                }
            },
            {
                route: '#/inc-exp',
                title: 'Доходы & расходы | Lumincoin',
                template: 'templates/inc-exp.html',
                load: () => {

                }
            },
            {
                route: '#/inc-exp-create',
                title: 'Создание дохода/расхода | Lumincoin',
                template: 'templates/inc-exp-create.html',
                load: () => {

                }
            },
            {
                route: '#/inc-exp-edit',
                title: 'Редактирование дохода/расхода | Lumincoin',
                template: 'templates/inc-exp-edit.html',
                load: () => {

                }
            },
            {
                route: '#/incoms',
                title: 'Доходы | Lumincoin',
                template: 'templates/incoms.html',
                load: () => {

                }
            },
            {
                route: '#/incoms-edit',
                title: 'Редактирование дохода | Lumincoin',
                template: 'templates/incoms-edit.html',
                load: () => {

                }
            },
            {
                route: '#/incoms-create',
                title: 'Создание дохода | Lumincoin',
                template: 'templates/incoms-create.html',
                load: () => {

                }
            },
            {
                route: '#/expenses',
                title: 'Расходы | Lumincoin',
                template: 'templates/expenses.html',
                load: () => {

                }
            },
            {
                route: '#/expenses-edit',
                title: 'Редактирование расхода | Lumincoin',
                template: 'templates/expenses-edit.html',
                load: () => {

                }
            },
            {
                route: '#/expenses-create',
                title: 'Создание расхода | Lumincoin',
                template: 'templates/expenses-create.html',
                load: () => {

                }
            },

        ]
    }

    async openRoute() {
        const urlRoute = window.location.hash;
        // if (urlRoute === '#/logout') {
        //     await Auth.logout();
        //     window.location.href = '#/';
        //     return;
        // }
        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        });
        if (!newRoute) {
            window.location.href = '#/';
            return;
        }
        this.contentElement.innerHTML = await fetch(newRoute.template).then(response => {
            return response.text();
        });
        // this.stylesElement.setAttribute('href', newRoute.styles);
        this.title.innerText = newRoute.title;
        // const userInfo = Auth.getUserInfo();
        // const accessToken = localStorage.getItem(Auth.accessTokenKey);
        // if (userInfo && accessToken) {
        //     this.profileElement.style.display = 'flex';
        //     this.profileFullNameElement.innerText = userInfo.fullName;
        // } else {
        //     this.profileElement.style.display = 'none';
        // }
        newRoute.load();
    }
}