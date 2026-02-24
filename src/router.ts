import { Auth } from "./services/auth";
import { Form } from "./components/form";
import { Main } from "./components/main";
import { Incoms } from "./components/incoms";
import { CreateIncom } from "./components/create-incom";
import { IncExp } from "./components/inc-exp";
import { Expenses } from "./components/expenses";
import { EditIncome } from "./components/incomes-edit";
import { CreateExpense } from "./components/create-expense";
import { EditExpense } from "./components/expenses-edit";
import { EditIncExp } from "./components/inc-exp-edit";
import { CreateIncExp } from "./components/inc-exp-create";
import { RouteType } from "./types/route.type";


export class Router {
    readonly contentElement: HTMLElement | null;
    readonly stylesElement: HTMLElement | null;
    readonly title: HTMLElement | null;
    readonly profileElement: HTMLElement | null;
    readonly profileFullNameElement: HTMLElement | null;

    private routes: RouteType[];
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
                template: 'src/templates/login.html',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/sign-up',
                title: 'Регистрация | Lumincoin',
                template: 'src/templates/sign-up.html',
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/main',
                title: 'Главная | Lumincoin',
                template: 'src/templates/main.html',
                load: () => {
                    Auth.authCheck();
                    new Main();
                }
            },
            {
                route: '#/inc-exp',
                title: 'Доходы & расходы | Lumincoin',
                template: 'src/templates/inc-exp.html',
                load: () => {
                    Auth.authCheck();
                    new IncExp();
                }
            },
            {
                route: '#/inc-exp-create',
                title: 'Создание дохода/расхода | Lumincoin',
                template: 'src/templates/inc-exp-create.html',
                load: () => {
                    Auth.authCheck();
                    new CreateIncExp();
                }
            },
            {
                route: '#/inc-exp-edit',
                title: 'Редактирование дохода/расхода | Lumincoin',
                template: 'src/templates/inc-exp-edit.html',
                load: () => {
                    Auth.authCheck();
                    new EditIncExp();
                }
            },
            {
                route: '#/incoms',
                title: 'Доходы | Lumincoin',
                template: 'src/templates/incoms.html',
                load: () => {
                    Auth.authCheck();
                    new Incoms();
                }
            },
            {
                route: '#/incoms-edit',
                title: 'Редактирование дохода | Lumincoin',
                template: 'src/templates/incoms-edit.html',
                load: () => {
                    Auth.authCheck();
                    new EditIncome();
                }
            },
            {
                route: '#/incoms-create',
                title: 'Создание дохода | Lumincoin',
                template: 'src/templates/incoms-create.html',
                load: () => {
                    Auth.authCheck();
                    new CreateIncom();
                }
            },
            {
                route: '#/expenses',
                title: 'Расходы | Lumincoin',
                template: 'src/templates/expenses.html',
                load: () => {
                    Auth.authCheck();
                    new Expenses();
                }
            },
            {
                route: '#/expenses-edit',
                title: 'Редактирование расхода | Lumincoin',
                template: 'src/templates/expenses-edit.html',
                load: () => {
                    Auth.authCheck();
                    new EditExpense();
                }
            },
            {
                route: '#/expenses-create',
                title: 'Создание расхода | Lumincoin',
                template: 'src/templates/expenses-create.html',
                load: () => {
                    Auth.authCheck();
                    new CreateExpense();
                }
            },

        ]
    }

    public async openRoute(): Promise<void> {
        const urlRoute: string | undefined = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/';
            return;
        }
        const newRoute: RouteType | undefined = this.routes.find(item => {
            return item.route === urlRoute;
        });
        if (!newRoute) {
            window.location.href = '#/';
            return;
        }
        if (!this.contentElement || !this.title) {
            if (urlRoute === '#/') {
                return;
            } else {
                window.location.href = '#/';
                return;
            }
        }
        this.contentElement.innerHTML = await fetch(newRoute.template).then(response => {
            return response.text();
        });
        this.title.innerText = newRoute.title;
        newRoute.load();
    }
}