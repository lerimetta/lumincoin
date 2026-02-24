import config from "../../config/config";
import { LogoutResponseType } from "../types/logout-response.type";
import { RefreshResponseType } from "../types/refresh-response.type";
import { UserInfoType } from "../types/user-info.type";
import { CustomHttp } from "./custom-http";

export class Auth {
    public static accessTokenKey: string = 'accessToken';
    private static refreshTokenKey: string = 'refreshToken';
    private static userInfoKey: string = 'userInfo';

    public static async processUnauthorizedResponse(): Promise<boolean> {
        const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ refreshToken: refreshToken })
            });
            if (response && response.status === 200) {
                const result: RefreshResponseType | null = await response.json();
                if (result && result.tokens) {
                    this.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    return true;
                }
            }
        }
        this.removeTokens();
        location.href = '#/';
        return false;
    }
    public static async logout(): Promise<boolean> {
        const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
        const response: Response = await fetch(config.host + '/logout', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ refreshToken: refreshToken })
        });
        if (response && response.status === 200) {
            const result: LogoutResponseType | null = await response.json();
            if (result && !result.error) {
                Auth.removeTokens();
                localStorage.removeItem(Auth.userInfoKey);
                return true;
            }
        }
        return false;
    }
    public static setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
    private static removeTokens(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    public static setUserInfo(info: UserInfoType) {
        localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    }
    static getUserInfo() {
        const userInfo = localStorage.getItem(this.userInfoKey);
        if (userInfo) {
            return JSON.parse(userInfo);
        }
        return null;
    }

    public static async authCheck(): Promise<void> {
        const accessToken: string | null = localStorage.getItem(this.accessTokenKey);
        if (!accessToken) {
            location.href = '#/';
            return;
        }
        const userName: string = JSON.parse(localStorage.getItem(this.userInfoKey)!).name + ' ' + JSON.parse(localStorage.getItem(this.userInfoKey)!).lastName;
        const el: HTMLElement | null = document.getElementById('user');
        if (el) {
            el.innerText = userName;
        }
    }
    public static async getBalance() {
        try {
            let accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);
            const param: any = {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'x-auth-token': accessToken,
                }
            }
            const response = await fetch(config.host + '/balance', param);
            if (response) {
                const result = await response.json();
                let balance: HTMLElement | null = document.getElementById('balance');
                if (balance) {
                    balance.innerText = result.balance + '$';
                    return;
                }

            }
        }
        catch (error) {
            console.log(error);
        }
    }
    public static async getBalance2(): Promise<void> {
        try {
            const result = await CustomHttp.request(config.host + '/balance');
            if (result) {
                let balance: HTMLElement | null = document.getElementById('balance');
                if (balance) {
                    balance.innerText = result.balance + '$';
                    return;
                }

            }
        }
        catch (error) {
            console.log(error);
        }
    }

}