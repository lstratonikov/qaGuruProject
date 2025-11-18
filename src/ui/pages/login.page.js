import { test } from '@playwright/test';

export class LoginPage {

    constructor(page) {
        this.page = page
        this.emailField = page.locator("[name = 'email']");
        this.passwordField = page.locator("[name = 'password']");
        this.confirmLoginButton = page.getByRole('button', { name: 'Login' });
    }

    async signIn(authorisedUser) {
        return test.step('Логинимся под существующим пользователем', async ( step ) => {
            const { email, password } = authorisedUser;
		    await this.emailField.fill(email);
		    await this.passwordField.fill(password);
		    await this.confirmLoginButton.click();
        });
    }
} 