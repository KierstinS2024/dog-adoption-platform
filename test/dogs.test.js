// test/dogs.test.js – basic Dog endpoint happy-path tests

const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const app = require("../app");

const { expect } = chai;
chai.use(chaiHttp);

let token;
let dogId;

describe("Dog Routes", () => {
  before(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    });

    // Register + login a user so we can get a token
    await chai.request(app)
      .post("/api/auth/register")
      .send({ username: "dogtester", password: "abc123" });

    const res = await chai.request(app)
      .post("/api/auth/login")
      .send({ username: "dogtester", password: "abc123" });

    token = res.body.data.token;
  });

  after(async () => {
    await mongoose.disconnect();
  });

  it("should register a new dog", (done) => {
    chai.request(app)
      .post("/api/dogs")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "TestDog", description: "lovely pupper" })
      .end((err, res) => {
        expect(res).to.have.status(201);
        dogId = res.body.data._id;
        done();
      });
  });

  it("should list registered dogs", (done) => {
    chai.request(app)
      .get("/api/dogs")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.an("array");
        done();
      });
  });

  it("should adopt a dog", (done) => {
    chai.request(app)
      .post(`/api/dogs/${dogId}/adopt`)
      .set("Authorization", `Bearer ${token}`)
      .send({ thankYouMessage: "Thanks!" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
