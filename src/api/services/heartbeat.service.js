import { test } from '@playwright/test';

export class HeartbeatService {
    
    constructor (request) {
        this.request = request;
    }

    async get() {
        return test.step(' GET /heartbeat', async () => {
            const response = await this.request.get('/heartbeat', {
                headers: {
                'x-challenger': process.env['AUTH_TOKEN'],
                },
            });
            return response;
        });
    }

    async patch() {
        return test.step(' PATCH /heartbeat', async () => {
            const response = await this.request.patch('/heartbeat', {
                headers: {
                'x-challenger': process.env['AUTH_TOKEN'],
                },
            });
            return response;
        });
    }

    async postOverride(method) {
        return test.step(' PATCH /heartbeat', async () => {
            const response = await this.request.post('/heartbeat', {
                headers: {
                'x-challenger': process.env['AUTH_TOKEN'],
                'x-http-method-override': method,
                },
            });
            return response;
        });
    }

    async delete() {
        return test.step(' DELETE /heartbeat', async () => {
            const response = await this.request.delete('/heartbeat', {
                headers: {
                'x-challenger': process.env['AUTH_TOKEN'],
                },
            });
            return response;
        });
    }

    async trace() {
        return test.step(' TRACE /heartbeat', async () => {
            const response = await this.request.fetch('/heartbeat', {
                method: 'trace',
                headers: {
                'x-challenger': process.env['AUTH_TOKEN'],
                },
            });
            return response;
        });
    }
}