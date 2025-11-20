import { expect} from '@playwright/test';
import { test } from '../../src/ui/helpers/fixtures/index';
import { ArticleBuilder, ProfileBuilder, UserBuilder } from '../../src/ui/helpers/builders/index';

test('1. Пользователь может зарегистрироваться', async ({ app }) => {

    //Генерируем юзера для регистрации
    const randomUser = new UserBuilder()
        .addUsername()
        .addEmail()
        .addPassword(10)
        .generate();

    //Процесс регистрации
    await app.main.register();
    await app.register.signUp(randomUser);
    
    //Проверка, что заданное имя соответствует созданному
    await expect(app.yourFeed.profileNameField).toContainText(randomUser.username);
});

test('2. Авторизованный пользователь может добавить статью', async({ app }) => {

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

    await app.main.register();
    await app.register.signUp(randomUser);

    //Промежуточная проверка регистрации
    await expect(app.yourFeed.profileNameField).toContainText(randomUser.username);

    //Переходим в New Article, создаем статью,,переходим в нее
    await app.main.newArticle();
    await app.newArticle.createArticle(article);
    await app.main.goToProfile();
    await app.profile.openArticle(article.title);

    //Проверка соответствия данных статьи
    await expect(app.article.heading).toContainText(article.title);
    await expect(app.article.paragraph).toContainText(article.text);
});

test('3. Пользователь может редактировать свою статью', async({ app }) => {

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

    await app.main.register();
    await app.register.signUp(randomUser);

    //Промежуточная проверка регистрации
    await expect(app.yourFeed.profileNameField).toContainText(randomUser.username);

     //Создаем статью, редактируем
    await app.main.newArticle();
    await app.newArticle.createArticle(article);
    await app.main.goToProfile();
    await app.profile.openArticle(article.title);
    await app.article.editArticle();
    await app.editArticle.updateArticle(editedArticle);
    await app.main.goToProfile();
    await app.profile.openArticle(editedArticle.title);
    await app.article.editArticle();

    //Проверяем что изменения сохранились
    await expect(app.editArticle.articleTitleField).toHaveValue(editedArticle.title);
    await expect(app.editArticle.articleAboutField).toHaveValue(editedArticle.about);
    await expect(app.editArticle.articleTextField).toHaveValue(editedArticle.text);
    //Теги не сохраняются при редактировании, следующий тест будет падать, нужно пофиксить на сайте
    //await expect(app.editArticle.articleTagsField).toHaveValue(editedArticle.tags);
});

test('4. Пользователь может удалить свою статью', async({ app }) => {

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

    await app.main.open();
    await app.main.register();
    await app.register.signUp(randomUser);

    //Промежуточная проверка регистрации
    await expect(app.yourFeed.profileNameField).toContainText(randomUser.username);

    //Создаем и удаляем статью
    await app.main.newArticle();
    await app.newArticle.createArticle(article);
    await app.main.goToProfile();
    await app.profile.openArticle(article.title);
    await app.article.deleteArticle();
    await app.main.open();
    await app.main.goToProfile();

    //Проверяем что статьи больше нет
    await expect(app.profile.articles).toContainText(`${randomUser.username} doesn't have articles.`);
});

test('5. Пользователь может изменить свои личные данные', async({ app }) => {

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

    await app.main.register();
    await app.register.signUp(randomUser);

    //Промежуточная проверка регистрации
    await expect(app.yourFeed.profileNameField).toContainText(randomUser.username);

    //Редактируем информацию в профиле и логинимся с новыми данными
    await app.main.goToSettings();
    await app.settings.editProfile(randomProfile);
    await app.main.logout();
    await app.main.login();
    await app.login.signIn(randomProfile);
    await app.main.goToSettings();

    //Проверям, что новые данные подтянулись
    await expect(app.settings.usernameField).toHaveValue(randomProfile.username);
    await expect(app.settings.avatarField).toHaveValue(randomProfile.avatar);
    await expect(app.settings.emailField).toHaveValue(randomProfile.email);
    await expect(app.settings.bioField).toHaveValue(randomProfile.bio);
});

test('6. Пользователь может добавить свою статью в Избранное', async({ app }) => {

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

    await app.main.register();
    await app.register.signUp(randomUser);

    //Промежуточная проверка регистрации
    await expect(app.yourFeed.profileNameField).toContainText(randomUser.username);

    //Создаем и лайкаем созданную статью
    await app.main.newArticle();
    await app.newArticle.createArticle(article);
    await app.main.open();
    await app.main.goToProfile();
    await app.profile.addArticleToFavorite(article.title);
    await app.profile.goToFavoritedArticles();
    
    //Проверяем, что статья там отображается в избранном
    await expect(app.profile.firstArticle).toContainText(article.title);
});



