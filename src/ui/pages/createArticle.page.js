import { test } from '@playwright/test';

export class CreateArticlePage {

    constructor(page) {
        this.page = page;
        this.articleTitleField = page.locator("[name = 'title']");
        this.articleAboutField = page.locator("input[name = 'description']");
        this.articleTextField = page.locator("[name = 'body']");
        this.articleTagsField = page.locator("[name = 'tags']");
        this.publishArticleButton = page.locator("button[type = 'submit']");
    }

    async createArticle(article) {
        return test.step('Создаем новую статью', async ( step ) => {
            const { title, about, text, tags } = article;
		    await this.articleTitleField.fill(title);
		    await this.articleAboutField.fill(about);
		    await this.articleTextField.fill(text);
		    await this.articleTagsField.fill(tags);
            await this.publishArticleButton.click();
        });
    }
}