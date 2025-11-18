import { test } from '@playwright/test';

export class ChallengesService {
    
    constructor (request) {
        this.request = request;
    }

    async get() {
        return test.step(' GET /challenges', async () => {
            const response = await this.request.get('/challenges', {
                headers: {
                'x-challenger': process.env['AUTH_TOKEN'],
                },
            });
            return response;
        });
    }
}