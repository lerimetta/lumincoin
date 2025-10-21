import config from "../config/config.js";
import { Auth } from "../services/auth.js";
import { CustomHttp } from "../services/custom-http.js";

export class Form {
  constructor(page) {
    this.processElement = null;
    this.page = page;
    this.emailError = document.getElementById('email-error');
    this.passwordError = document.getElementById('password-error');
    this.nameError = document.getElementById('name-error');
    this.lastNameError = document.getElementById('last-name-error');
    this.repeatPasswordError = document.getElementById('repeat-password-error');
    // const accessToken = localStorage.getItem(Auth.accessTokenKey);
    // if (accessToken) {
    //   location.href = '#/main';
    //   return;
    // }
    this.fields = [
      {
        name: 'email',
        id: 'email',
        element: null,
        span: this.emailError,
        regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        valid: false,
      },
      {
        name: 'password',
        id: 'password',
        element: null,
        span: this.passwordError,
        regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
        valid: false,
      },
    ];
    if (this.page === 'signup') {
      this.fields.unshift(
        {
          name: 'name',
          id: 'name',
          element: null,
          span: this.nameError,
          regex: /^[А-Я][а-я]+\s*$/,
          valid: false,
        },
        {
          name: 'lastName',
          id: 'last-name',
          element: null,
          span: this.lastNameError,
          regex: /^[А-Я][а-я]+\s*$/,
          valid: false,
        },
        {
          name: 'repeatPassword',
          id: 'repeat-password',
          element: null,
          span: this.repeatPasswordError,
          regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
          valid: false,
        },

      )
    }
    const that = this;
    this.fields.forEach(item => {
      item.element = document.getElementById(item.id);
      item.element.onchange = function () {
        that.validateField.call(that, item, this);
      };
    });
    this.processElement = document.getElementById('process');
    this.processElement.onclick = function () {
      that.processForm();
    }

  }
  validateField(field, element) {
    if (!element.value || !element.value.match(field.regex)) {
      field.span.style.display = 'block';
      element.classList.add('is-invalid');
      field.valid = false;
    } else {
      field.span.style.display = 'none';
      element.classList.remove('is-invalid');
      field.valid = true;
    };
    this.validateForm();
  }
  validateForm() {
    const validForm = this.fields.every(item => item.valid);
    const isValid = this.agreeElement ? this.agreeElement.checked && validForm : validForm;
    if (isValid) {
      this.processElement.removeAttribute('disabled');
    } else {
      this.processElement.setAttribute('disabled', 'disabled');
    }
    return isValid;
  }
  async processForm() {
    const email = this.fields.find(item => item.name === 'email').element.value;
    const password = this.fields.find(item => item.name === 'password').element.value;
    if (this.validateForm()) {
      if (this.page === 'signup') {
        try {
          const result = await CustomHttp.request(config.host + '/signup', 'POST', {
            name: this.fields.find(item => item.name === 'name').element.value,
            lastName: this.fields.find(item => item.name === 'lastName').element.value,
            email: email,
            password: password,
            passwordRepeat: this.fields.find(item => item.name === 'repeatPassword').element.value,
          });
          if (result) {
            if (result.error || !result.user) {
              throw new Error(result.message);
            }
          }
        }
        catch (error) {
          return console.log(error);
        }

      }
      try {
        const result = await CustomHttp.request(config.host + '/login', 'POST', {
          email: email,
          password: password,
        });
        if (result) {
          if (!result.tokens) {
            throw new Error(result.message);
          }
          Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
          Auth.setUserInfo({
            name: result.user.name,
            lastName: result.user.lastName,
            userId: result.user.id,
            email: email,
          })
          location.href = '#/main';
        }
      }
      catch (error) {
        console.log(error);
      }
    }
  }
};