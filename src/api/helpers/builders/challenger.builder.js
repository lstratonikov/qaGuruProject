import { faker } from "@faker-js/faker";

export class ChallengerBuilder {

    addAuthToken(authToken) {
        this.authToken = authToken;
        return this;
    }

    addXchallenger(xChallenger) {
        this.xChallenger = xChallenger;
        return this;
    }

    addRandomXchallenger() {
        this.xChallenger = faker.string.uuid();
        return this;
    }

    addSecretNote(secretNote) {
        this.secretNote = secretNote;
        return this;
    }

    addChallengeStatus(data) {
        this.challengeStatus = data;
        return this;
    }

    generate() {
        return {
            "xAuthToken": this.authToken,
            "xChallenger": this.xChallenger,
            "secretNote": this.secretNote,
            "challengeStatus": this.challengeStatus
        }
    }

    generateRandom() {
        return {
            "xAuthToken": this.authToken,
            "xChallenger": this.xChallenger,
            "secretNote": this.secretNote,
            "challengeStatus": this.challengeStatus
        }
    }

}