const request = require("supertest");
const app = require("../app");

// Test pour tester la route qui récupère tous les items avec leur user associé
it("GET /allItems", async () => {
  const res = await request(app).get("/items/allItems");

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
});

// Test pour tester la route pour récupérer les items d'un utilisateur qui n'a pas d'items
it("GET /byUser/:userToken", async () => {
  const res = await request(app).get("/items/byUser/0EXfGPbIltNthtCs6K-Pi41Qrd_72Glp");

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
  expect(res.body.items).toEqual([]);
});

// Test pour tester la route pour créer un item
it("POST /newItem/:userToken", async () => {
  const res = await request(app)
    .post("/items/newItem/Ali0crEEb9OcPONkw8afGsoivaocegEM")
    .field({
      title: "Test plant",
      description: "This is a test plant",
      price: 20,
      height: 50,
      condition: "Good",
      isPlant: true,
      isGiven: false,
    })
    .attach("photoFromFront", "test/test.jpg");

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
  expect(res.body.item.title).toBe("Test plant");
  expect(res.body.item.description).toBe("This is a test plant");
  expect(res.body.item.price).toBe(20);
  expect(res.body.item.height).toBe(50);
  expect(res.body.item.condition).toBe("Good");
  expect(res.body.item.isPlant).toBe(true);
  expect(res.body.item.isGiven).toBe(false);
  expect(res.body.item.photo.length).toBe(1);
  expect(res.body.item.photo[0]).toContain("cloudinary.com");
});
