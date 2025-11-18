import { test, expect } from '@playwright/test';

export class TodosService {

    constructor (request) {
        this.request = request;
    }
    
    async getTodosList() {
        return test.step('GET /todos', async () => {
            const response = await this.request.get('/todos', {
                headers: {
                'x-challenger': process.env['AUTH_TOKEN'],
                },
            });
            return response;
        });
    }

    async getTodosListWithFilter(filter) {
        return test.step('GET /todos', async () => {
            const response = await this.request.get(`/todos?${filter}`, {
                headers: {
                'x-challenger': process.env['AUTH_TOKEN'],
                },
            });
            return response;
        });
    }

    async getTodosAccept(acceptHeader) {
        return test.step('GET /todos', async () => {
            const response = await this.request.get('/todos', {
                headers: {
                'x-challenger': process.env['AUTH_TOKEN'],
                'Accept': acceptHeader
                },
            });
            return response;
        });
    }

    async getTodoList() {
        return test.step('GET /todo (404) not plural', async () => {
            const response = await this.request.get('/todo', {
                headers: {
                'x-challenger': process.env['AUTH_TOKEN'],
                },
            });
            return response;
        });
    }

    async getTodoById(id) {
        return test.step('GET /todos/{id}', async () => {
            const response = await this.request.get(`/todos/${id}`, {
                headers: {
                'x-challenger': process.env['AUTH_TOKEN'],
                },
            });
            return response;
        });
    }

    async headTodosList() {
        return test.step('HEAD /todos', async () => {
            const response = await this.request.head('/todos', {
                headers: {
                'x-challenger': process.env['AUTH_TOKEN'],
                },
            });
            return response;
        });
    }

    async addTodo(data) {
        return test.step('POST /todos', async () => {
            const response = await this.request.post('/todos', {
                headers: {
                'x-challenger': process.env['AUTH_TOKEN'],
                'Content-Type': 'application/json',
                },
                data
            });
            return response;
        });
    }

    async postTodo(id, data) {
        return test.step('POST /todos/{id}', async () => {
            const response = await this.request.post(`/todos/${id}`, {
                headers: {
                'x-challenger': process.env['AUTH_TOKEN'],
                'Content-Type': 'application/json',
                },
                data
            });
            return response;
        });
    }

    async putTodo(id, data) {
        return test.step('PUT /todos/{id}', async () => {
            const response = await this.request.put(`/todos/${id}`, {
                headers: {
                'x-challenger': process.env['AUTH_TOKEN'],
                },
                data
            });
            return response;
        });
    }

    async patchTodo(id, data) {
        return test.step('PATCH /todos/{id}', async () => {
            const response = await this.request.put(`/todos/${id}`, {
                headers: {
                'x-challenger': process.env['AUTH_TOKEN'],
                },
                data
            });
            return response;
        });
    }

    async deleteTodo(id) {
        return test.step('DELETE /todos/{id}', async () => {
            const response = await this.request.delete(`/todos/${id}`, {
                headers: {
                'x-challenger': process.env['AUTH_TOKEN']
                }
            });
            return response;
        });
    }

    async optionsTodos() {
        return test.step('OPTIONS /todos', async () => {
            const response = await this.request.fetch('/todos', {
                'method': 'OPTIONS',
                headers: {
                'x-challenger': process.env['AUTH_TOKEN']
                }
            });
            return response;
        });
    }
}