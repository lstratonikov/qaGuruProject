import { MainPage, RegisterPage, LoginPage, YourFeedPage, CreateArticlePage, ProfilePage, ArticlePage, EditArticlePage, SettingsPage } from './index';

export class App {

    constructor(page) {
        this.page = page;
        this.main = new MainPage(page);
        this.register = new RegisterPage(page);
        this.login = new LoginPage(page);
        this.yourFeed = new YourFeedPage(page);
        this.newArticle = new CreateArticlePage(page);
        this.profile = new ProfilePage(page);
        this.article = new ArticlePage(page);
        this.editArticle = new EditArticlePage(page);
        this.settings = new SettingsPage(page);
    }
}