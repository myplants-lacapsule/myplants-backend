const request = require('supertest');
const app = require('../app');

it('GET ../routes/plants', async () => {
    const res = await request(app).get('/plants/0UtFpr5BqS_Zxf3NWXRJsaYHyNy76Zsh');

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toEqual(true);
});

it('GET ../routes/plants', async () => {
    const res = await request(app).get('/plants/LM9_eUCW8GEbzreXM7RC_LP_Rie175y8');

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toEqual(false);
});


it('POST ../routes/plants', async () => {
    const res = await request(app).post('/plants/newPlant/0UtFpr5BqS_Zxf3NWXRJsaYHyNy76Zsh').send({
        name: "PlantName",
        description: "PlantDescription",
        wateringFrequency: "Plant WateringFrequency",
        cuisine: "Plant Cuisine",
        toxicity: "Plant Toxicity",
        seasonality: "Plant Seasonality",
        sunExposure: "Plant SunExposure",
        photo: "PlantPhoto",
    });
   
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);
   });