import { request } from "@playwright/test";

async function globalSetup() {
    const apiContext = await request.newContext();
    const response = await apiContext.post('https://apichallenges.herokuapp.com/challenger', {});
    const headers = response.headers();
    process.env['AUTH_TOKEN'] = headers['x-challenger'];
    await apiContext.dispose();
}

export default globalSetup;