export class MainPage {

    constructor(page) {
        this.page = page
        this.homePage = 'https://realworld.qa.guru/';
        this.loginLink = page.locator("[href = '#/login']");
        this.registerLink = page.locator("[href = '#/register']");
        this.newArticleLink = page.locator("[href = '#/editor']");
        this.dropdownProfileMenu = page.locator(".nav-link.dropdown-toggle.cursor-pointer"); //Как кликнуть четко по указателю? Псевдоэлемент ::after
        this.profileOption = page.getByText('Profile');
        this.settingsOption = page.getByText('Settings');
        this.logoutOption = page.getByText('Logout');
    }

    async open() {
        await this.page.goto(this.homePage);
    }

    async login() {
        await this.loginLink.click();
    }

    async register() {
        await this.registerLink.click();
    }

    async newArticle() {
        await this.newArticleLink.click();
    }

    async goToProfile() {
        await this.dropdownProfileMenu.click();
        await this.profileOption.click();
    }

    async goToSettings() {
        await this.dropdownProfileMenu.click();
        await this.settingsOption.click();
    }

    async logout() {
        await this.dropdownProfileMenu.click();
        await this.logoutOption.click();
    }

}