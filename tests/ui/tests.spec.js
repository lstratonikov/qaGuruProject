import { test, expect} from '@playwright/test';
import { ArticleBuilder, ProfileBuilder, UserBuilder } from '../../src/ui/helpers/builders/index';
import { App } from '../../src/ui/pages/app.page';

test('1. Пользователь может зарегистрироваться', async ({page}) => {

    //Генерируем юзера для регистрации
    const randomUser = new UserBuilder()
        .addUsername()
        .addEmail()
        .addPassword(10)
        .generate();

    let app = new App(page);

    //Процесс регистрации
    await app.main.open();
    await app.main.register();
    await app.register.signUp(randomUser);
    await expect(app.yourFeed.profileNameField).toContainText(randomUser.username);

});

test('2. Авторизованный пользователь может добавить статью', async({page}) => {

    //Создаем юзера
    const randomUser = new UserBuilder()
        .addUsername()
        .addEmail()
        .addPassword(10)
        .generate();

    //Генерируем данные для статьи
    const article = new ArticleBuilder()
        .addArticleTitle()
        .addArticleAbout()
        .addArticleText()
        .addArticleTags()
        .generate();

    let app = new App(page);

    await app.main.open();
    await app.main.register();
    await app.register.signUp(randomUser);
    await expect.soft(app.yourFeed.profileNameField).toContainText(randomUser.username);

    //Переходим в New Article и создаем статью
    await app.main.newArticle();
    await app.newArticle.createArticle(article);

    //Проверяем, что созданная статья сохранилась
    await app.main.goToProfile();
    await app.profile.openArticle(article.title);
    await expect(app.article.heading).toContainText(article.title);
    await expect(app.article.paragraph).toContainText(article.text);
});

test('3. Пользователь может редактировать свою статью', async({page}) => {

    const randomUser = new UserBuilder()
        .addUsername()
        .addEmail()
        .addPassword(10)
        .generate();
    
    const article = new ArticleBuilder()
        .addArticleTitle()
        .addArticleAbout()
        .addArticleText()
        .addArticleTags()
        .generate();

    const editedArticle = new ArticleBuilder()
        .addArticleTitle()
        .addArticleAbout()
        .addArticleText()
        .addArticleTags()
        .generate();

    let app = new App(page);

    await app.main.open();
    await app.main.register();
    await app.register.signUp(randomUser);
    await expect.soft(app.yourFeed.profileNameField).toContainText(randomUser.username);
    await app.main.newArticle();
    await app.newArticle.createArticle(article);

    //Открываем профиль юзера, находим написанную статью, редактируем все поля
    await app.main.goToProfile();
    await app.profile.openArticle(article.title);
    await app.article.editArticle();
    await app.editArticle.updateArticle(editedArticle);

    //Проверяем что изменения сохранились
    await app.main.goToProfile();
    await app.profile.openArticle(editedArticle.title);
    await expect(app.article.heading).toContainText(editedArticle.title);
    await expect(app.article.paragraph).toContainText(editedArticle.text);
});

test('4. Пользователь может удалить свою статью', async({page}) => {

    const randomUser = new UserBuilder()
        .addUsername()
        .addEmail()
        .addPassword(10)
        .generate();
    
    const article = new ArticleBuilder()
        .addArticleTitle()
        .addArticleAbout()
        .addArticleText()
        .addArticleTags()
        .generate();

    let app = new App(page);

    await app.main.open();
    await app.main.register();
    await app.register.signUp(randomUser);
    await expect.soft(app.yourFeed.profileNameField).toContainText(randomUser.username);
    await app.main.newArticle();
    await app.newArticle.createArticle(article);

    //Удаляем статью
    await app.main.goToProfile();
    await app.profile.openArticle(article.title);
    await app.article.deleteArticle();

    //Проверяем что статьи больше нет
    await app.main.open();
    await app.main.goToProfile();
    await expect(app.profile.articles).toContainText(`${randomUser.username} doesn't have articles.`);
});

test('5. Пользователь может изменить свои личные данные', async({page}) => {

    const randomUser = new UserBuilder()
        .addUsername()
        .addEmail()
        .addPassword(10)
        .generate();

    const randomProfile = new ProfileBuilder()
        .editAvatar()
        .editUsername()
        .editBio()
        .editEmail()
        .editPassword(10)
        .generate();

    let app = new App(page);

    await app.main.open();
    await app.main.register();
    await app.register.signUp(randomUser);
    await expect.soft(app.yourFeed.profileNameField).toContainText(randomUser.username);

    //Идем в профиль и редактируем информацию
    await app.main.goToSettings();
    await app.settings.editProfile(randomProfile);
    await app.main.logout();

    //Логинимся с новыми данными, проверям, что данные подтянулись
    await app.main.login();
    await app.login.signIn(randomProfile);
    await expect(app.yourFeed.profileNameField).toContainText(randomProfile.username);
});

test('6. Пользователь может добавить свою статью в Избранное', async({page}) => {

    const randomUser = new UserBuilder()
        .addUsername()
        .addEmail()
        .addPassword(10)
        .generate();
    
    const article = new ArticleBuilder()
        .addArticleTitle()
        .addArticleAbout()
        .addArticleText()
        .addArticleTags()
        .generate();

    let app = new App(page);

    await app.main.open();
    await app.main.register();
    await app.register.signUp(randomUser);
    await expect.soft(app.yourFeed.profileNameField).toContainText(randomUser.username);
    await app.main.newArticle();
    await app.newArticle.createArticle(article);
    await app.main.open();
    await app.main.goToProfile();

    //Лайкаем созданную статью
    await app.profile.addArticleToFavorite(article.title);
    
    //Идем в Favorited Articles и проверяем, что статья там отображается
    await app.profile.goToFavoritedArticles();
    await expect(app.profile.firstArticle).toContainText(article.title);
});



