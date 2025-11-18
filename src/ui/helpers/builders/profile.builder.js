import { faker } from '@faker-js/faker';

export class ProfileBuilder {
    editAvatar() {
        this.avatar = faker.image.avatar();
        return this;
    }
    editUsername() {
        this.username = faker.internet.username();
        return this;
    }
    editBio() {
        this.bio = faker.person.bio();
        return this;
    }
    editEmail() {
        this.email = faker.internet.email();
        return this;
    }
    editPassword(symbol = 10) {
        this.password = faker.internet.password({length: symbol});
        return this;
    }
    generate() {
        return {
            avatar: this.avatar,
            username: this.username,
            bio: this.bio,
            email: this.email,
            password: this.password
        };
    }
}