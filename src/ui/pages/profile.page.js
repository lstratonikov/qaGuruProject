import { test } from '@playwright/test';

export class ProfilePage {

    constructor(page) {
        this.page = page;
        this.myArticlesItem = page.getByRole('link', { name: 'My Articles' });
        this.favoritedArticlesItem = page.getByRole('link', { name: 'Favorited Articles' });
        this.firstArticle = page.locator(".preview-link").first();
        this.articles = page.locator(".article-preview");
    }

    async openArticle(articleTitle) {
        return test.step('Открываем статью', async ( step ) => {
            const articleLink = this.page.getByText(articleTitle);
            await articleLink.click()
        });
    }

    async addArticleToFavorite(articleTitle) {
        return test.step('Добавляем статью в избранное', async ( step ) => {
            const addToFavoriteButton = this.page.locator(".article-preview").filter({ hasText: articleTitle }).locator(".btn.btn-sm.btn-outline-primary.pull-xs-right");
            await addToFavoriteButton.click();
        });
    }

    async goToFavoritedArticles() {
        return test.step('Открываем список избранных статей', async ( step ) => {
            await this.favoritedArticlesItem.click();
        });
    }
}