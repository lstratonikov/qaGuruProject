import { faker } from '@faker-js/faker';

export class UserBuilder {
    addUsername() {
        this.username = faker.internet.username();
        return this;
    }
    addEmail() {
        this.email = faker.internet.email();
        return this;
    }
    addPassword(symbol = 10) {
        this.password = faker.internet.password({length: symbol});
        return this;
    }
    generate() {
        return {
            username: this.username,
            email: this.email,
            password: this.password
        };
    }
}