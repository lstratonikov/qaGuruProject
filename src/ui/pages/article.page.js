export class ArticlePage {

    constructor(page) {
        this.page = page;
        this.editArticleButton = page.getByRole('button', { name: 'Edit Article' }).first();
        this.deleteArticleButton = page.getByRole('button', { name: 'Delete Article' }).first();
        this.articleTitle = page.locator("[name = 'title']");
        this.articleText = page.locator("[name = 'body']");
        this.articleTags = page.locator("[name = 'tags']");
        this.heading = page.getByRole('heading');
        this.paragraph = page.getByRole('paragraph');
    }

    async editArticle() {
        await this.editArticleButton.click();
    }

    async deleteArticle() {
        this.page.on('dialog', async dialog => {
            await dialog.accept();
        });
        await this.deleteArticleButton.click();
    }
}