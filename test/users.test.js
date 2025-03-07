const request = require("supertest");
const app = require("../app");

it('GET ../routes/users', async () => {
	const res = await request(app).get('/users/getUserLocation/4IJVJjuM1J4-74zyKCS8mMbCgsp_bx5s');

	expect(res.statusCode).toBe(200);
	expect(res.body.result).toEqual(true);
});