import { faker } from '@faker-js/faker';

export class ArticleBuilder {
    addArticleTitle() {
        this.title = faker.lorem.sentence();
        return this;
    }
    addArticleAbout() {
        this.about = faker.lorem.paragraph();
        return this;
    }
    addArticleText(paragraphs = 2) {
        this.text = faker.lorem.paragraphs(paragraphs);
        return this;
    }
    addArticleTags() {
        this.tags = [faker.lorem.word({length: 4}), faker.lorem.word({length: 5})].join(',');
        return this;
    }
    generate() {
        return {
            title: this.title,
            about: this.about,
            text: this.text,
            tags: this.tags
        };
    }
}