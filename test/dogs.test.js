// test/dogs.test.js – full dog route test coverage

const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const app = require("../app");

const { expect } = chai;
chai.use(chaiHttp);

let ownerToken;
let adopterToken;
let dogId;

describe("Dog Routes (full flow)", () => {
  before(async function () {
    this.timeout(10000); // allow up to 10s for DB connect
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    });

    // Create two separate users
    const ownerU = `owner_${Date.now()}`;
    const adopterU = `adopter_${Date.now()}`;

    // Register + login user A (owner)
    await chai
      .request(app)
      .post("/api/auth/register")
      .send({ username: ownerU, password: "abc123" });

    let loginRes = await chai
      .request(app)
      .post("/api/auth/login")
      .send({ username: ownerU, password: "abc123" });
    ownerToken = loginRes.body.data.token;

    // Register + login user B (adopter)
    await chai
      .request(app)
      .post("/api/auth/register")
      .send({ username: adopterU, password: "abc123" });

    loginRes = await chai
      .request(app)
      .post("/api/auth/login")
      .send({ username: adopterU, password: "abc123" });
    adopterToken = loginRes.body.data.token;
  });

  after(async () => {
    await mongoose.disconnect();
  });

  it("should register a dog", (done) => {
    chai
      .request(app)
      .post("/api/dogs")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ name: "TestDog", description: "lovely pupper" })
      .end((err, res) => {
        expect(res).to.have.status(201);
        dogId = res.body.data._id;
        done();
      });
  });

  it("should not allow owner to adopt their own dog", (done) => {
    chai
      .request(app)
      .post(`/api/dogs/${dogId}/adopt`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ thankYouMessage: "Thanks!" })
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });

  it("should allow a different user to adopt the dog", (done) => {
    chai
      .request(app)
      .post(`/api/dogs/${dogId}/adopt`)
      .set("Authorization", `Bearer ${adopterToken}`)
      .send({ thankYouMessage: "Thanks!" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it("should not allow anyone to adopt an already adopted dog", (done) => {
    chai
      .request(app)
      .post(`/api/dogs/${dogId}/adopt`)
      .set("Authorization", `Bearer ${adopterToken}`)
      .send({ thankYouMessage: "Again?" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("should list adopted dogs of the adopter", (done) => {
    chai
      .request(app)
      .get("/api/dogs/adopted")
      .set("Authorization", `Bearer ${adopterToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.an("array");
        expect(res.body.data[0]._id).to.equal(dogId);
        done();
      });
  });

  it("owner should not be able to delete an adopted dog", (done) => {
    chai
      .request(app)
      .delete(`/api/dogs/${dogId}`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
});
