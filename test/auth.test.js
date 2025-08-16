// test/auth.test.js
const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const app = require("../app");

const { expect } = chai;
chai.use(chaiHttp);
const username = "mochatest_" + Date.now();

describe("Auth API", () => {
  before(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    });
  });

  after(async () => {
    await mongoose.disconnect();
  });

  it("should register a user", (done) => {
    chai
      .request(app)
      .post("/api/auth/register")
      .send({ username, password: "abc123" })
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });
});
