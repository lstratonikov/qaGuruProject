import { test } from '@playwright/test';

export class MainPage {

    constructor(page) {
        this.page = page
        this.homePage = '/';
        this.loginLink = page.locator("[href = '#/login']");
        this.registerLink = page.locator("[href = '#/register']");
        this.newArticleLink = page.locator("[href = '#/editor']");
        this.dropdownProfileMenu = page.locator(".nav-link.dropdown-toggle.cursor-pointer");
        this.profileOption = page.getByText('Profile');
        this.settingsOption = page.getByText('Settings');
        this.logoutOption = page.getByText('Logout');
    }

    async open() {
        return test.step('Переходим на главную страницу', async ( step ) => {
            await this.page.goto(this.homePage);
        });
    }

    async login() {
        return test.step('Переходим на страницу залогина', async ( step ) => {
            await this.loginLink.click();
        });
    }

    async register() {
        return test.step('Переходим на страницу регистрации', async ( step ) => {
            await this.registerLink.click();
        });
    }

    async newArticle() {
        return test.step('Переходим к созданию новой статьи', async ( step ) => {
            await this.newArticleLink.click();
        });
    }

    async goToProfile() {
        return test.step('Переходим на страницу профиля', async ( step ) => {
            await this.dropdownProfileMenu.click();
            await this.profileOption.click();
        });
    }

    async goToSettings() {
        return test.step('Переходим на страницу настроек', async ( step ) => {
            await this.dropdownProfileMenu.click();
            await this.settingsOption.click();
        });
    }

    async logout() {
        return test.step('Выходим из текущего профиля', async ( step ) => {
            await this.dropdownProfileMenu.click();
            await this.logoutOption.click();
        });
    }
}