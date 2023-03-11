import { username, password, email, warning, toSha256, testFunc } from './validation.js';

testFunc()

(function() {
    var signUp = {
        userInfo: {},
        init: function() {
            this.cacheDom();
            this.bindEvents();
        },
        cacheDom: function() {
            this.open = document.getElementById("sign-up-modal-button");
            this.overlay = document.getElementById("overlay");
            this.modal = document.getElementById("sign-up-modal");
            this.close = this.modal.querySelector("#sign-up-close-button");
            this.form = this.modal.querySelector("#sign-up-form");
            this.submit = this.modal.querySelector("#sign-up-account-button");
            this.firstName = this.modal.querySelector("#first-name");
            this.lastName = this.modal.querySelector("#last-name");
            this.middleName = this.modal.querySelector("#middle-name");
            this.sex = this.modal.querySelector("#sex");
            this.birthDate = this.modal.querySelector("#birth-date");
            this.email = this.modal.querySelector("#email");
            this.username = this.modal.querySelector("#user-name");
            this.password = this.modal.querySelector("#password");
        },
        bindEvents: function() {
            this.submit.addEventListener('click',() => this.signUp());
            this.email.addEventListener('change', () => email(this.email.value));
            this.password.addEventListener('keyup', () => password(this.password.value));
            this.overlay.addEventListener('click', () => this.hide());
            this.close.addEventListener('click', () => this.hide());
            this.open.addEventListener('click', () => this.display());
        },
        display: function() {
            this.modal.classList.add("active");
            this.overlay.classList.add("active");
        },
        hide: function() {
            this.modal.classList.remove("active");
            this.overlay.classList.remove("active");
            this.form.reset();
            warning("", "red");
        },
        isInputValid: async function() {
            if (!email(this.email.value)) return;
            if (!password(this.password.value)) return;
            if (!await username(this.username.value)) return;
            return true;
        },
        setUserInfo: async function() {
            this.userInfo = {
                firstName: this.firstName.value,
                lastName: this.lastName.value,
                middleName: this.middleName.value,
                sex: this.sex.value,
                birthDate: this.birthDate.value,
                email: this.email.value,
                username: this.username.value,
                password: await toSha256(this.password.value)
            };
        },
        create: async function(userInfo) {
            db.collection('users')
            .doc(crypto.randomUUID())
            .set(userInfo)
            .catch((error) => {
                alert(error)
            });
        },
        signUp: async function() {
            if (await this.isInputValid()) {
                await this.setUserInfo();              
                await this.create(this.userInfo);
                this.userInfo = {};
                alert("Created! Try and log in.");
                this.hide();
            }
        }
    }
    signUp.init()
})();