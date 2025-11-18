import { test } from '@playwright/test';

export class AuthService {

    constructor (request) {
        this.request = request;
    }

    async getToken() {
        return test.step('Get token /challenger', async () => {
            const response = await this.request.post('/challenger', {});
            const headers = response.headers();
            const authToken = headers['x-challenger'];
            process.env['AUTH_TOKEN'] = authToken;
            return authToken;
        });
    }
};
