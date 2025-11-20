import { expect } from '@playwright/test';
import { test, request } from '../../src/api/helpers/fixtures/index';
import { ChallengerBuilder, TodoBuilder } from '../../src/api/helpers/builders/index';
import { API_CONST } from '../../src/api/constants/const';

test.beforeAll(async ({ api }) => {
    await api.auth.getToken();
});

test.describe('First Real Challenge', () => {
    
    test('2. Запрашиваем список challenges',{ tag: ['@challenges', '@get', '@positive'],}, async ({ api }) => {
        const response = await api.challenges.get();
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.challenges.length).toEqual(59);
    });
});

test.describe('GET Challenges', () => {
    
    test('3. Запрашиваем список todos', { tag: ['@todos', '@get', '@positive'],}, async ({ api }) => {
        const response = await api.todos.getTodosList();
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.todos.length).toBeGreaterThanOrEqual(1);
    });
    
    test('4. Получаем ошибку, если эндпоинт todo в ед.ч, 404', { tag: ['@todos', '@get', '@negative'],},  async ({ api }) => {
        const response = await api.todos.getTodoList();
        expect(response.status()).toBe(404);
    });

    test('5. Запрашиваем todo по id', { tag: ['@todos', '@get', '@positive'],}, async ({ api }) => {
        const todosListResponse = await api.todos.getTodosList();
        const todosListJson = await todosListResponse.json();
        const todosListLength = todosListJson.todos.length;
        const id = todosListLength;
        const todo = todosListJson.todos.find(todo => todo.id === id)
        const response = await api.todos.getTodoById(id);
        expect(response.status()).toBe(200);
        const json = await response.json();
        const todoToCompare = json.todos[0];
        expect(todo).toEqual(todoToCompare);
    });

    test('6. Запрашиваем todo по несуществующему id, 404', { tag: ['@todos', '@get', '@negative'],},  async ({ api }) => {
        const todosListResponse = await api.todos.getTodosList();
        const todosListJson = await todosListResponse.json();
        const todosListLength = todosListJson.todos.length;
        const id = todosListLength + 1
        const response = await api.todos.getTodoById(id);
        expect(response.status()).toBe(404);
        const json = await response.json();
        const errorMessage = [`Could not find an instance with todos/${id}`];
        expect(json.errorMessages).toEqual(errorMessage);
    });

    test('7. Запрашиваем список todos с фильтром', { tag: ['@todos', '@get', '@positive'],}, async ({ api }) => {
        const randomTodo = new TodoBuilder()
            .addTitle()
            .addDescription()
            .generateDone();

        const filter = API_CONST.TODO_FILTER
        const todosListResponse = await api.todos.getTodosList();
        const todosListJson = await todosListResponse.json();
        const todosListLength = todosListJson.todos.length;
        const id = todosListLength;
        const responsePut = await api.todos.putTodo(id, randomTodo);
        expect(responsePut.status()).toBe(200);
        const response = await api.todos.getTodosListWithFilter(filter);
        expect(response.status()).toBe(200);
        const json = await response.json();
        expect(json.todos[0].id).toEqual(id);
    });
});

test.describe('HEAD Challenges', () => {
    
    test('8. Запрашиваем список хедеров запроса /todos', { tag: ['@todos', '@head', '@positive'],}, async ({ api }) => {
        const checkedHeaderName = 'server';
        const checkedHeaderValue = API_CONST.SERVER_NAME;
        const response = await api.todos.headTodosList();
        expect(response.status()).toBe(200);
        const headers = await response.headers();
        expect(headers[checkedHeaderName]).toEqual(checkedHeaderValue);
    });
});

test.describe('Creation Challenges with POST', () => {
    
    test('9. Создаем новое todo', { tag: ['@todos', '@post', '@positive'],}, async ({ api }) => {
        const randomTodo = new TodoBuilder()
            .addTitle()
            .addStatus()
            .addDescription()
            .generate();
        
        const response = await api.todos.addTodo(randomTodo);
        expect(response.status()).toBe(201);
        const json = await response.json();
        expect(json.title).toEqual(randomTodo.title);
    });

    test('10. Создаем новое todo c невалидным doneStatus, 400', { tag: ['@todos', '@post', '@negative'],}, async ({ api }) => {
        const randomTodo = new TodoBuilder()
            .addTitle()
            .addInvalidStatus()
            .addDescription()
            .generate();
        const errorMessage = 'doneStatus should be BOOLEAN but was NUMERIC';
        const errorMessages = [`Failed Validation: ${errorMessage}`];
        
        const response = await api.todos.addTodo(randomTodo);
        expect(response.status()).toBe(400);
        const json = await response.json();
        expect(json.errorMessages).toEqual(errorMessages);
    });

    test('11. Создаем новое todo cо слишком длинным title, 400', { tag: ['@todos', '@post', '@negative'],}, async ({ api }) => {
        const randomTodo = new TodoBuilder()
            .addTooLongTitle(51)
            .addStatus()
            .addDescription()
            .generate();
        const errorMessage = 'Maximum allowable length exceeded for title - maximum allowed is 50';
        const errorMessages = [`Failed Validation: ${errorMessage}`];
        
        const response = await api.todos.addTodo(randomTodo);
        expect(response.status()).toBe(400);
        const json = await response.json();
        expect(json.errorMessages).toEqual(errorMessages);
    });

    test('12. Создаем новое todo cо слишком длинным description, 400', { tag: ['@todos', '@post', '@negative'],}, async ({ api }) => {
        const randomTodo = new TodoBuilder()
            .addTitle()
            .addStatus()
            .addTooLongDescription(201)
            .generate();
        const errorMessage = 'Maximum allowable length exceeded for description - maximum allowed is 200';
        const errorMessages = [`Failed Validation: ${errorMessage}`];
        
        const response = await api.todos.addTodo(randomTodo);
        expect(response.status()).toBe(400);
        const json = await response.json();
        expect(json.errorMessages).toEqual(errorMessages);
    });

    test('13. Создаем новое todo с максимально возможными title и description', { tag: ['@todos', '@post', '@positive'],}, async ({ api }) => {
        const randomTodo = new TodoBuilder()
            .addTooLongTitle(50)
            .addStatus()
            .addTooLongDescription(200)
            .generate();
        
        const response = await api.todos.addTodo(randomTodo);
        expect(response.status()).toBe(201);
        const json = await response.json();
        expect(json.title).toEqual(randomTodo.title);
    });

    test('14. Создаем новое todo cо слишком объемным payload в поле description, 413', { tag: ['@todos', '@post', '@negative'],}, async ({ api }) => {
        const randomTodo = new TodoBuilder()
            .addTitle()
            .addStatus()
            .addTooLongDescription(5000)
            .generate();
        const errorMessage = 'Request body too large, max allowed is 5000 bytes';
        const errorMessages = [`Error: ${errorMessage}`];
        
        const response = await api.todos.addTodo(randomTodo);
        expect(response.status()).toBe(413);
        const json = await response.json();
        expect(json.errorMessages).toEqual(errorMessages);
    });

    test('15. Создаем новое todo c несуществующим полем, 400', { tag: ['@todos', '@post', '@negative'],}, async ({ api }) => {
        const fieldName = API_CONST.INVALID_FIELDNAME;

        const randomTodo = new TodoBuilder()
            .addTitle()
            .addStatus()
            .addDescription()
            .addInvalidField(fieldName)
            .generateInvalid();
        
        const response = await api.todos.addTodo(randomTodo);
        expect(response.status()).toBe(400);
        const json = await response.json();
        const errorMessages = [`Could not find field: ${fieldName}`];
        expect(json.errorMessages).toEqual(errorMessages);
    });
});

test.describe('Creation Challenges with PUT', () => {
    
    test('16. Обновляем несуществующий todo запросом PUT, 400', { tag: ['@todos', '@put', '@negative'],}, async ({ api }) => {
        const randomTodo = new TodoBuilder()
            .addTitle()
            .addStatus()
            .addDescription()
            .generate();
        const errorMessages = ['Cannot create todo with PUT due to Auto fields id'];
        
        const todosListResponse = await api.todos.getTodosList();
        const todosListJson = await todosListResponse.json();
        const todosListLength = todosListJson.todos.length;
        const invalidTodoId = todosListLength + 1
        const id = invalidTodoId;
        const response = await api.todos.putTodo(id, randomTodo);
        expect(response.status()).toBe(400);
        const json = await response.json();
        expect(json.errorMessages).toEqual(errorMessages);
    });
});

test.describe('Update Challenges with POST', () => {

    test('17. Обновляем существующий todo запросом POST', { tag: ['@todos', '@post', '@positive'],}, async ({ api }) => {
        const randomTodo = new TodoBuilder()
            .addTitle()
            .addStatus()
            .addDescription()
            .generate();
        const updatedTodo = new TodoBuilder()
            .addTitle()
            .addStatus()
            .addDescription()
            .generate();
        
        const addTodoResponse = await api.todos.addTodo(randomTodo);
        expect(addTodoResponse.status()).toBe(201);
        const addTodoJson = await addTodoResponse.json();
        const id = addTodoJson.id;
        const response = await api.todos.postTodo(id, updatedTodo);
        expect(response.status()).toBe(200);
        const json = await response.json();
        expect(json.title).toEqual(updatedTodo.title);
        expect(json.description).toEqual(updatedTodo.description);
    });

    test('18. Проверяем, что нельзя обновить несуществующий todo запросом POST', { tag: ['@todos', '@post', '@negative'],}, async ({ api }) => {
        const randomTodo = new TodoBuilder()
            .addTitle()
            .addStatus()
            .addDescription()
            .generate();
        
        const todosListResponse = await api.todos.getTodosList();
        const todosListJson = await todosListResponse.json();
        const todosListLength = todosListJson.todos.length;
        const id = todosListLength + 1
        const response = await api.todos.postTodo(id, randomTodo);
        expect(response.status()).toBe(404);
        const json = await response.json();
        const errorMessages = [`No such todo entity instance with id == ${id} found`];
        expect(json.errorMessages).toEqual(errorMessages);
    });
});

test.describe('Update Challenges with PUT', () => {
    
    test('19. Обновляем todo запросом PUT', { tag: ['@todos', '@put', '@positive'],}, async ({ api }) => {
        const randomTodo = new TodoBuilder()
            .addTitle()
            .addStatus()
            .addDescription()
            .generate();
        const updatedTodo = new TodoBuilder()
            .addTitle()
            .addStatus()
            .addDescription()
            .generate();
        
        const addTodoResponse = await api.todos.addTodo(randomTodo);
        expect(addTodoResponse.status()).toBe(201);
        const addTodoJson = await addTodoResponse.json();
        const id = addTodoJson.id;
        const response = await api.todos.putTodo(id, updatedTodo);
        expect(response.status()).toBe(200);
        const json = await response.json();
        expect(json.title).toEqual(updatedTodo.title);
        expect(json.description).toEqual(updatedTodo.description);
    });

    test('20. Обновляем title существующего todo запросом PUT', { tag: ['@todos', '@put', '@positive'],}, async ({ api }) => {
        const randomTodo = new TodoBuilder()
            .addTitle()
            .addStatus()
            .addDescription()
            .generate();
        const updatedTodo = new TodoBuilder()
            .addTitle()
            .generate();
        
        const addTodoResponse = await api.todos.addTodo(randomTodo);
        expect(addTodoResponse.status()).toBe(201);
        const addTodoJson = await addTodoResponse.json();
        const id = addTodoJson.id;
        const response = await api.todos.putTodo(id, updatedTodo);
        expect(response.status()).toBe(200);
        const json = await response.json();
        expect(json.title).toEqual(updatedTodo.title);
    });

    test('21. Обновляем todo запросом PUT без поля title, 400', { tag: ['@todos', '@put', '@negative'],}, async ({ api }) => {
        const randomTodo = new TodoBuilder()
            .addTitle()
            .addStatus()
            .addDescription()
            .generate();
        const updatedTodo = new TodoBuilder()
            .addStatus()
            .addDescription()
            .generate();
        const errorMessages = ['title : field is mandatory'];
        
        const addTodoResponse = await api.todos.addTodo(randomTodo);
        expect(addTodoResponse.status()).toBe(201);
        const addTodoJson = await addTodoResponse.json();
        const id = addTodoJson.id;
        const response = await api.todos.putTodo(id, updatedTodo);
        expect(response.status()).toBe(400);
        const json = await response.json();
        expect(json.errorMessages).toEqual(errorMessages);
    });
    
    test('22. Обновляем todoId запросом PUT, 400', { tag: ['@todos', '@put', '@negative'],}, async ({ api }) => {
        const randomTodo = new TodoBuilder()
            .addTitle()
            .addStatus()
            .addDescription()
            .generate();
        
        const addTodoResponse = await api.todos.addTodo(randomTodo);
        expect(addTodoResponse.status()).toBe(201);
        const addTodoJson = await addTodoResponse.json();
        const id = addTodoJson.id;
        const newId = id + 1;
        const updatedTodo = new TodoBuilder()
            .addTitle()    
            .addStatus()
            .addDescription()
            .addId(newId)
            .generateInvalid();
        const response = await api.todos.putTodo(id, updatedTodo);
        expect(response.status()).toBe(400);
        const json = await response.json();
        const errorMessages = [`Can not amend id from ${id} to ${newId}`];
        expect(json.errorMessages).toEqual(errorMessages);
    });
});

test.describe('DELETE Challenges', () => {
    
    test('23. Удаляем todo по id', { tag: ['@todos', '@delete', '@positive'],}, async ({ api }) => {
        const randomTodo = new TodoBuilder()
            .addTitle()
            .addStatus()
            .addDescription()
            .generate();
        
        const addTodoResponse = await api.todos.addTodo(randomTodo);
        const addTodoJson = await addTodoResponse.json();
        const id = addTodoJson.id;
        const responseDel = await api.todos.deleteTodo(id);
        expect(responseDel.status()).toBe(200);
        const responseGet = await api.todos.getTodoById(id);
        expect(responseGet.status()).toBe(404);
        const json = await responseGet.json();
        const errorMessages = [`Could not find an instance with todos/${id}`];
        expect(json.errorMessages).toEqual(errorMessages);
    });
});

test.describe('OPTIONS Challenges', () => {
    
    test('24. Проверяем варианты типов запросов /todos', { tag: ['@todos', '@options', '@positive'],}, async ({ api }) => {
        const allowListMethods = API_CONST.ALLOWED_METHODS;
        
        const response = await api.todos.optionsTodos();
        expect(response.status()).toBe(200);
        const todosHeaders = await response.headers();
        const todosAllowList = todosHeaders.allow;
        expect(todosAllowList).toEqual(allowListMethods);
    });
});

test.describe('Accept Challenges', () => {
    
    test('25. Проверяем, что список todos может возвращаться в XML-формате', { tag: ['@todos', '@get', '@positive'],}, async ({ api }) => {
        
        const acceptHeader = 'application/xml'
        const response = await api.todos.getTodosAccept(acceptHeader);
        expect(response.status()).toBe(200);
        const headers = await response.headers();
        const contentType = headers['content-type'];
        expect(contentType).toEqual(acceptHeader);
    });

    test('26. Проверяем, что список todos может возвращаться в JSON-формате', { tag: ['@todos', '@get', '@positive'],}, async ({ api }) => {
        
        const acceptHeader = 'application/json'
        const response = await api.todos.getTodosAccept(acceptHeader);
        expect(response.status()).toBe(200);
        const headers = await response.headers();
        const contentType = headers['content-type'];
        expect(contentType).toEqual(acceptHeader);
    });

    test('27. Проверяем, что список todos возвращается по умолчанию в JSON-формате', { tag: ['@todos', '@get', '@positive'],}, async ({ api }) => {
        
        const acceptHeader = '*/*';
        const acceptHeaderJson = 'application/json';
        const response = await api.todos.getTodosAccept(acceptHeader);
        expect(response.status()).toBe(200);
        const headers = await response.headers();
        const contentType = headers['content-type'];
        expect(contentType).toEqual(acceptHeaderJson);
    });

    test('28. Проверяем, что список todos при наличии в хедере обоих форматов JSON и XML возвращается в XML', { tag: ['@todos', '@get', '@positive'],}, async ({ api }) => {
        
        const acceptHeader = 'application/xml, application/json';
        const acceptHeaderXml = 'application/xml';
        const response = await api.todos.getTodosAccept(acceptHeader);
        expect(response.status()).toBe(200);
        const headers = await response.headers();
        const contentType = headers['content-type'];
        expect(contentType).toEqual(acceptHeaderXml);
    });

    test('29. Проверяем, что список todos возвращается без хедера Accept', { tag: ['@todos', '@get', '@positive'],}, async ({ api }) => {
        
        const acceptHeader = '';
        const acceptHeaderJson = 'application/json';
        const response = await api.todos.getTodosAccept(acceptHeader);
        expect(response.status()).toBe(200);
        const headers = await response.headers();
        const contentType = headers['content-type'];
        expect(contentType).toEqual(acceptHeaderJson);
    });

    test('30. Проверяем, что возвращается ошибка 406 при невалидном значении Accept', { tag: ['@todos', '@get', '@negative'],}, async ({ api }) => {
        
        const acceptHeader = 'application/gzip';
        const errorMessages = ['Unrecognised Accept Type'];
        const response = await api.todos.getTodosAccept(acceptHeader);
        expect(response.status()).toBe(406);
        const json = await response.json();
        expect(json.errorMessages).toEqual(errorMessages);
    });
});

test.describe('Fancy a break? Restore your session', () => {
    
    test('34. Возвращаем прогресс выполнения заданий по guid', { tag: ['@challenger', '@get', '@positive'],}, async ({ api }) => {
        const guid = process.env['AUTH_TOKEN'];
        
        const response = await api.challenger.getProgress(guid);
        expect(response.status()).toBe(200);
        const json = await response.json();
        const xChallenger = json['xChallenger'];
        expect(xChallenger).toEqual(guid);
    });

    test('35. Обновляем прогресс выполнения заданий по guid', { tag: ['@challenger', '@put', '@positive'],}, async ({ api }) => {
        const guid = process.env['AUTH_TOKEN'];
        
        const responseProgress = await api.challenger.getProgress(guid);
        expect(responseProgress.status()).toBe(200);
        const jsonProgress = await responseProgress.json();
        const xChallengerProgress = jsonProgress['xChallenger'];
        expect(xChallengerProgress).toEqual(guid);
        const authtoken = jsonProgress.xAuthToken;
        const secretNote = jsonProgress.secretNote;
        const challengeStatus = jsonProgress.challengeStatus;
        const responseGuid = await api.challenger.post();
        expect(responseGuid.status()).toBe(201);
        const headersGuid = await responseGuid.headers();
        const newGuid = headersGuid['x-challenger'];
        const data = new ChallengerBuilder()
            .addAuthToken(authtoken)
            .addXchallenger(newGuid)
            .addSecretNote(secretNote)
            .addChallengeStatus(challengeStatus)
            .generate();
        const response = await api.challenger.putProgress(newGuid, data);
        expect(response.status()).toBe(200);
        const json = await response.json();
        expect(json.challengeStatus).toEqual(challengeStatus);
    });

    test('36. Обновляем прогресс выполнения заданий для guid не из БД', { tag: ['@challenger', '@put', '@positive'],}, async ({ api }) => {
        
        const guid = process.env['AUTH_TOKEN'];
        const responseProgress = await api.challenger.getProgress(guid);
        expect(responseProgress.status()).toBe(200);
        const jsonProgress = await responseProgress.json();
        const xChallengerProgress = jsonProgress['xChallenger'];
        expect(xChallengerProgress).toEqual(guid);
        const authtoken = jsonProgress.xAuthToken;
        const secretNote = jsonProgress.secretNote;
        const challengeStatus = jsonProgress.challengeStatus;
        const data = new ChallengerBuilder()
            .addAuthToken(authtoken)
            .addRandomXchallenger()
            .addSecretNote(secretNote)
            .addChallengeStatus(challengeStatus)
            .generateRandom();
        const newGuid = data.xChallenger;
        const response = await api.challenger.putProgress(newGuid, data);
        expect(response.status()).toBe(201);
        const headers = await response.headers();
        const xChallenger = headers['x-challenger'];
        expect(xChallenger).toEqual(newGuid);
        const responseNewProgress = await api.challenger.getProgress(guid);
        const json = await responseNewProgress.json();
        expect(json.challengeStatus).toEqual(jsonProgress.challengeStatus);
    });

    test('37. Возвращаем список todo по guid', { tag: ['@challenger', '@get', '@positive'],}, async ({ api }) => {
        const guid = process.env['AUTH_TOKEN'];
        
        const responseTodosList = await api.todos.getTodosList();
        expect(responseTodosList.status()).toBe(200);
        const jsonTodosList = await responseTodosList.json();
        const response = await api.challenger.getTodosForUser(guid);
        expect(response.status()).toBe(200);
        const headers = await response.headers();
        const text = await response.text();
        const json = await response.json();
        const xChallenger = headers['x-challenger'];
        expect(xChallenger).toEqual(guid);
        expect(json.todos.length).toEqual(jsonTodosList.todos.length);
    });

    test('38. Обновляем список todo по guid', { tag: ['@challenger', '@put', '@positive'],}, async ({ api }) => {
        const guid = process.env['AUTH_TOKEN'];
        
        //Cоздаем newGuid
        const newChallengerResponse = await api.challenger.post();
        expect(newChallengerResponse.status()).toBe(201);
        const headersChallenger = await newChallengerResponse.headers();
        const newGuid = headersChallenger['x-challenger'];
        //Запрашиваем список todo для текущего guid
        const responseGet = await api.challenger.getTodosForUser(guid);
        expect(responseGet.status()).toBe(200);
        const data = await responseGet.json();
        //Обновляем список todo для newGuid
        const responsePut = await api.challenger.putTodosForUser(newGuid, data);
        expect(responsePut.status()).toBe(204);
        const headersPut = await responsePut.headers();
        const xChallengerPut = headersPut['x-challenger'];
        expect(xChallengerPut).toEqual(newGuid);
        //Запрашиваем список todo для newGuid и сравниваем со списком для guid
        const response = await api.challenger.getTodosForUser(newGuid);
        expect(response.status()).toBe(200);
        const json = await response.json();
        expect(json.todos.length).toEqual(data.todos.length);
    });
});

test.describe('Status Code Challenges', () => {
    
    test('41. Пытаемся использовать недопустимый метод DELETE для /heartbeat', { tag: ['@heartbeat', '@delete', '@negative'],}, async ({ api }) => {
        
        const response = await api.heartbeat.delete();
        expect(response.status()).toBe(405);
    });

    test('42. Пытаемся использовать недопустимый метод PATCH для /heartbeat', { tag: ['@heartbeat', '@patch', '@negative'],}, async ({ api }) => {
        
        const response = await api.heartbeat.patch();
        expect(response.status()).toBe(500);
    });

    test('43. Пытаемся использовать недопустимый метод TRACE для /heartbeat', { tag: ['@heartbeat', '@trace', '@negative'],}, async ({ api }) => {
        
        const response = await api.heartbeat.trace();
        expect(response.status()).toBe(501);
    });

    test('44. Получаем статус соединения методом GET /heartbeat', { tag: ['@heartbeat', '@get', '@positive'],}, async ({ api }) => {
        const server = API_CONST.SERVER_NAME;
        const via = API_CONST.VIA_NAME;
        
        const response = await api.heartbeat.get();
        expect(response.status()).toBe(204);
        const headers = await response.headers();
        const serverHeader = headers['server'];
        const viaHeader = headers['via'];
        expect(serverHeader).toEqual(server);
        expect(viaHeader).toEqual(via);
    });
});

test.describe('HTTP Method Override Challenges', () => {
    
    test('45. Пытаемся использовать недопустимый метод DELETE в хедерах метода POST /heartbeat', { tag: ['@heartbeat', '@post', '@negative'],}, async ({ api }) => {
        
        const method = 'DELETE';
        const response = await api.heartbeat.postOverride(method);
        expect(response.status()).toBe(405);
    });

    test('46. Пытаемся использовать недопустимый метод PATCH в хедерах метода POST /heartbeat', { tag: ['@heartbeat', '@post', '@negative'],}, async ({ api }) => {
        
        const method = 'PATCH';
        const response = await api.heartbeat.postOverride(method);
        expect(response.status()).toBe(500);
    });

    test('47. Пытаемся использовать недопустимый метод TRACE в хедерах метода POST /heartbeat', { tag: ['@heartbeat', '@post', '@negative'],}, async ({ api }) => {
        
        const method = 'TRACE';
        const response = await api.heartbeat.postOverride(method);
        expect(response.status()).toBe(501);
    });

});

test.describe('Authentication Challenges', () => {
    
    test('48. Пытаемся получить authtoken с неверными кредами через POST /secret/token', { tag: ['@secret', '@post', '@negative'],}, async ({ api }) => {
        const username = API_CONST.INVALID_USERNAME;
        const password = API_CONST.INVALID_PASSWORD; 
        
        const response = await api.secret.postAuthBasic(username, password);
        expect(response.status()).toBe(401);
    });

    test('49. Пытаемся получить authtoken с корректными кредами через POST /secret/token', { tag: ['@secret', '@post', '@positive'],}, async ({ api }) => {
        
        const response = await api.secret.postAuthBasic();
        expect(response.status()).toBe(201);
        const headers = await response.headers();
        const xAuthToken = headers['x-auth-token'];
        expect(xAuthToken).not.toBe(null);
    });
});

test.describe('Authorization Challenges', () => {
    
    test('50. Пытаемся получить notes с неверным authtoken через GET /secret/note', { tag: ['@secret', '@get', '@negative'],}, async ({ api }) => {
        const authToken = API_CONST.INVALID_AUTHTOKEN;
        
        const response = await api.secret.getNote(authToken);
        expect(response.status()).toBe(403);
    });

    test('51. Пытаемся получить notes без authtoken через GET /secret/note', { tag: ['@secret', '@get', '@negative'],}, async ({ api }) => {
        const authToken = null;
        
        const response = await api.secret.getNote(authToken);
        expect(response.status()).toBe(401);
    });

});
