import { test } from '@playwright/test';
export class SettingsPage {

    constructor(page) {
        this.page = page;
        this.avatarField = page.locator("[name = 'image']");
        this.usernameField = page.locator("[name = 'username']");
        this.bioField = page.locator("[name = 'bio']");
        this.emailField = page.locator("[name = 'email']");
        this.passwordField = page.locator("[name = 'password']");
        this.confirmUpdateSettingsButton = page.getByRole('button', { name: 'Update Settings' });
    }

    async editProfile(randomProfile) {
        return test.step('Редактируем данные пользователя', async ( step ) => {
            const {avatar, username, bio, email, password} = randomProfile;
		    await this.avatarField.fill(avatar);
            await this.usernameField.fill(username);
		    await this.bioField.fill(bio);
            await this.emailField.fill(email);
		    await this.passwordField.fill(password);
		    await this.confirmUpdateSettingsButton.click();
        });
    }
}