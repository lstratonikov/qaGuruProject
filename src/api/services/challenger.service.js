import { test, expect } from '@playwright/test';

export class ChallengerService {

    constructor (request) {
        this.request = request;
    }
    
    async post() {
        return test.step('POST /challenger', async () => {
            const response = await this.request.post('/challenger');
            return response;
        });
    }

    async getProgress(guid) {
        return test.step('GET /challenger/{guid}', async () => {
            const response = await this.request.get(`/challenger/${guid}`, {
                headers: {
                'x-challenger': process.env['AUTH_TOKEN'],
                },
            });
            return response;
        });
    }

    async putProgress(guid, data) {
        return test.step('PUT /challenger/{guid}', async () => {
            const response = await this.request.put(`/challenger/${guid}`, {
                headers: {
                'x-challenger': process.env['AUTH_TOKEN'],
                },
                data
            });
            return response;
        });
    }

    async getTodosForUser(guid) {
        return test.step('GET /challenger/database/{guid}', async () => {
            const response = await this.request.get(`/challenger/database/${guid}`, {
                headers: {
                'x-challenger': process.env['AUTH_TOKEN'],
                },
            });
            return response;
        });
    }

    async putTodosForUser(guid, data) {
        return test.step('PUT /challenger/database/{guid}', async () => {
            const response = await this.request.put(`/challenger/database/${guid}`, {
                headers: {
                'x-challenger': process.env['AUTH_TOKEN'],
                },
                data
            });
            return response;
        });
    }
}