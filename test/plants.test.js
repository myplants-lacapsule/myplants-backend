const request = require("supertest");
const app = require("../app");

it("GET ../routes/plants", async () => {
  const res = await request(app).get(
    "/plants/0UtFpr5BqS_Zxf3NWXRJsaYHyNy76Zsh"
  );

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toEqual(true);
});

it("GET ../routes/plants", async () => {
  const res = await request(app).get(
    "/plants/LM9_eUCW8GEbzreXM7RC_LP_Rie175y8"
  );

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toEqual(false);
});

it("POST ../routes/plants", async () => {
  const res = await request(app)
    .post("/plants/newPlant/0UtFpr5BqS_Zxf3NWXRJsaYHyNy76Zsh")
    .send({
      name: "PlantName",
      description: "PlantDescription",
      wateringFrequency: 4,
      cuisine: "Is not edible",
      toxicity: "Non-toxic",
      seasonality: "Needs shade",
      sunExposure: "Fall",
      photo: "PlantPhoto",
    });

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
  expect(res.body.name).toBe("PlantName");
  expect(res.body.description).toBe("PlantDescription");
  expect(res.body.wateringFrequency).toBe(4);
  expect(res.body.cuisine).toBe("Is not edible");
  expect(res.body.toxicity).toBe("Non-toxic");
  expect(res.body.seasonality).toBe("Needs shade");
  expect(res.body.sunExposure).toBe("Fall");
  expect(res.body.photo.length).toBe(1);
});
