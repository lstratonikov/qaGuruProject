import { test } from '@playwright/test';

export class RegisterPage {

    constructor(page) {
        this.page = page
        this.usernameField = page.locator("[name = 'username']");
        this.emailField = page.locator("[name = 'email']");
        this.passwordField = page.locator("[name = 'password']");
        this.confirmSignUpButton = page.getByRole('button', { name: 'Sign up' });
    }

    async signUp(randomUser) {
        return test.step('Регистрируем нового пользователя', async ( step ) => {
            const {username, email, password} = randomUser;
		    await this.usernameField.fill(username);
		    await this.emailField.fill(email);
		    await this.passwordField.fill(password);
		    await this.confirmSignUpButton.click();
        });
    }
} 