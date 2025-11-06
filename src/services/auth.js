import config from "../../config/config.js";
import { CustomHttp } from "./custom-http.js";

export class Auth {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoKey = 'userInfo';

    static async processUnauthorizedResponse() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ refreshToken: refreshToken })
            });
            if (response && response.status === 200) {
                const result = await response.json();
                if (result) {
                    this.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    return true;
                } else {
                    throw new Error(result.message);
                }
            }
        }
        this.removeTokens();
        location.href = '#/';
        return false;
    }
    static async logout() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        const response = await fetch(config.host + '/logout', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ refreshToken: refreshToken })
        });
        if (response && response.status === 200) {
            const result = await response.json();
            if (result && !result.error) {
                Auth.removeTokens();
                localStorage.removeItem(Auth.userInfoKey);
                return true;
            }
        }

    }
    static setTokens(accessToken, refreshToken) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
    static removeTokens() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    static setUserInfo(info) {
        localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    }
    static getUserInfo() {
        const userInfo = localStorage.getItem(this.userInfoKey);
        if (userInfo) {
            return JSON.parse(userInfo);
        }
        return null;
    }

    static async authCheck() {
        const accessToken = localStorage.getItem(this.accessTokenKey);
        if (!accessToken) {
            location.href = '#/';
            return;
        }
        const userName = JSON.parse(localStorage.getItem(this.userInfoKey)).name + ' ' + JSON.parse(localStorage.getItem(this.userInfoKey)).lastName;
        document.getElementById('user').innerText = userName;

    }
    static async getBalance() {
        try {
            let accessToken = localStorage.getItem(Auth.accessTokenKey);
            const response = await fetch(config.host + '/balance', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'x-auth-token': accessToken,
                }
            });
            if (response) {
                const result = await response.json();
                let balance = document.getElementById('balance');
                balance.innerText = result.balance + '$';
                return;
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    static async getBalance2() {
        try {
            const result = await CustomHttp.request(config.host + '/balance');
            if (result) {
                let balance = document.getElementById('balance');
                balance.innerText = result.balance + '$';
                return;
            }
        }
        catch (error) {
            console.log(error);
        }
    }

}