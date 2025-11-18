import { faker } from "@faker-js/faker";

export class TodoBuilder {

    addTitle() {
        this.title = faker.lorem.words(3);
        return this;
    }
    addStatus() {
        this.status = faker.datatype.boolean();
        return this;
    }
    addDescription() {
        this.description = faker.lorem.sentence(5);
        return this;
    }
    addTooLongTitle(length) {
        this.title = faker.string.alphanumeric(length);
        return this;
    }
    addInvalidStatus() {
        this.status = faker.number.int();
        return this;
    }
    addTooLongDescription(length) {
        this.description = faker.string.alphanumeric(length);
        return this;
    }

    addInvalidField(fieldName) {
        this.invalidField = fieldName;
        this.invalidFieldValue = faker.lorem.word();
        return this;
    }

    addId(id) {
        this.id = id;
        return this;  
    }

    generate() {
        return {
            "title": this.title,
            "doneStatus": this.status,
            "description": this.description
        };
    }

    generateDone() {
        return {
            "title": this.title,
            "doneStatus": true,
            "description": this.description
        };
    }

    generateInvalid() {
        return {
            "title": this.title,
            "doneStatus": this.status,
            "description": this.description,
            "id": this.id,
            [this.invalidField]: this.invalidFieldValue
        };
    }
}