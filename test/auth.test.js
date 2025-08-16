// test/auth.test.js – Validates authentication routes using mocha/chai

const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const app = require("../app");

// Use chai-http plugin so we can make HTTP requests against our Express app
chai.use(chaiHttp);
const { expect } = chai;

describe("Auth API", () => {
  // Connect to the database before running tests
  before(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    });
  });

  // Disconnect from the database when all tests finish
  after(async () => {
    await mongoose.disconnect();
  });

  // Test user registration endpoint
  describe("POST /api/auth/register", () => {
    it("should register a new user", (done) => {
      chai
        .request(app)
        .post("/api/auth/register")
        .send({ username: "testuser", password: "testpass" })
        .end((err, res) => {
          expect(res).to.have.status(201);
          done();
        });
    });
  });

  // Test login endpoint
  describe("POST /api/auth/login", () => {
    it("should login the user and return a JWT token", (done) => {
      chai
        .request(app)
        .post("/api/auth/login")
        .send({ username: "testuser", password: "testpass" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.data).to.have.property("token");
          done();
        });
    });
  });
});
