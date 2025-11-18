import { test } from '@playwright/test';

export class SecretService {
    
    constructor (request) {
        this.request = request;
    }

    async postAuthBasic(username = 'admin', password = 'password') {
        const data = `${username}:${password}`;
        const auth = Buffer.from(data).toString('base64');
        const authBasic = `Basic ${auth}`;
        return test.step(' POST /secret/token', async () => {
            const response = await this.request.post('/secret/token', {
                headers: {
                    'Authorization': authBasic,
                    'x-challenger': process.env['AUTH_TOKEN'],
                },
            });
            return response;
        });
    }

    async getNote(authToken) {
        return test.step('GET /secret/note', async () => {
            let headers = {
                'x-challenger': process.env['AUTH_TOKEN'],
            };
            if (authToken != null) {
                headers['x-auth-token'] = authToken;
            }
            const response = await this.request.get('/secret/note', { headers });
            return response;
        });
    }
}