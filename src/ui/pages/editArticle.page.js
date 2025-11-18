import { test } from '@playwright/test';

export class EditArticlePage {

    constructor(page) {
        this.page = page;
        this.articleTitleField = page.locator("[name = 'title']");
        this.articleAboutField = page.locator("input[name = 'description']");
        this.articleTextField = page.locator("[name = 'body']");
        this.articleTagsField = page.locator("[name = 'tags']");
        this.updateArticleButton = page.locator("button[type = 'submit']");
    }

    async updateArticle(article) {
        return test.step('Редактируем статью', async ( step ) => {
            const { title, about, text, tags } = article;
		    await this.articleTitleField.fill(title);
		    await this.articleAboutField.fill(about);
		    await this.articleTextField.fill(text);
		    await this.articleTagsField.fill(tags);
            await this.updateArticleButton.click();
        });
    }
}