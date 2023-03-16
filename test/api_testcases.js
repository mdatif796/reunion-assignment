const chai = require("chai");
const should = require("chai").should();
const chaiHTTP = require("chai-http");
const { response } = require("express");

chai.use(chaiHTTP);

let url = "http://localhost:8000";
let jwt_token = "";
let postId = "";
let userId = "";

describe("API Test", () => {
  // Test the POST route for creating user
  // in this api
  // we need --> name, email and password
  describe("POST /api/create-user", () => {
    it("It should create the user and return that user", (done) => {
      chai
        .request(url)
        .post("/api/create-user")
        .set("content-type", "application/x-www-form-urlencoded")
        .send({ email: "a@a.com", password: "123", name: "edward" })
        .end((err, response) => {
          response.should.have.status(201);
          done();
        });
    }).timeout(30000);
  });

  // // Test the POST route for authentication
  // // in this api
  // // we need --> email and password
  describe("POST /api/authenticate", () => {
    it("It should authenticate the user and return JWT token", (done) => {
      chai
        .request(url)
        .post("/api/authenticate")
        .set("content-type", "application/x-www-form-urlencoded")
        .send({ email: "a@a.com", password: "123" })
        .end((err, response) => {
          response.should.have.status(201);
          jwt_token = response.body.jwt_token.token;
          done();
        });
    }).timeout(30000);
  });

  // Test the POST route for authenticated user follow the user which id is passed in params
  // in this api
  // we need --> authenticated user jwt token
  // id of user who will be followed

  // create user for further testcases checking
  describe("POST /api/create-user", () => {
    it("It should create the user and return that user", (done) => {
      chai
        .request(url)
        .post("/api/create-user")
        .set("content-type", "application/x-www-form-urlencoded")
        .send({ email: "abc@a.com", password: "123", name: "mark" })
        .end((err, response) => {
          userId = response.body.user._id;
          done();
        });
    }).timeout(30000);
  });

  describe("POST /api/follow/:id", () => {
    it("Authenticate user should follow the user with id given in params", (done) => {
      chai
        .request(url)
        .post(`/api/follow/${userId}`)
        .set({
          "content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${jwt_token}`,
        })
        .end((err, response) => {
          response.should.have.status(201);
          done();
        });
    }).timeout(30000);
  });

  // // Test the POST route for authenticated user unfollow the user which id is passed in params
  // // in this api
  // // we need --> authenticated user jwt token
  // // id of user who will be unfollowed
  describe("POST /api/unfollow/:id", () => {
    it("Authenticate user should unfollow the user with id given in params", (done) => {
      chai
        .request(url)
        .post(`/api/unfollow/${userId}`)
        .set({
          "content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${jwt_token}`,
        })
        .end((err, response) => {
          response.should.have.status(201);
          done();
        });
    }).timeout(30000);
  });

  // Test the GET route to return the authenticated user profile
  // in this api
  // we need --> authenticated user jwt token
  describe("GET /api/user", () => {
    it("Return the profile of authenticated user", (done) => {
      chai
        .request(url)
        .get("/api/user")
        .set({
          "content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${jwt_token}`,
        })
        .end((err, response) => {
          response.should.have.status(200);
          done();
        });
    }).timeout(30000);
  });

  // Test the POST route to create a post by authenticated user
  // in this api
  // we need --> authenticated user jwt token
  // post --> title and description
  describe("POST /api/posts", () => {
    it("Add a new post by authenticated user", (done) => {
      chai
        .request(url)
        .post("/api/posts")
        .set({
          "content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${jwt_token}`,
        })
        .send({
          title: "dummy post title",
          description: "dummy post description",
        })
        .end((err, response) => {
          console.log("err: ", err);
          response.should.have.status(201);
          postId = response.body.post.id;
          done();
        });
    }).timeout(30000);
  });

  // Test the DELETE route for deleting a post by authenticated user
  // in this api
  // we need --> authenticated user jwt token
  // post --> post id which need to be deleted
  describe("DELETE /api/posts/:id", () => {
    it("Delete a post by authenticated user", (done) => {
      chai
        .request(url)
        .delete(`/api/posts/${postId}`)
        .set({
          "content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${jwt_token}`,
        })
        .end((err, response) => {
          response.should.have.status(200);
          done();
        });
    }).timeout(30000);
  });

  // Test the POST route for like a post by authenticated user
  // in this api
  // we need --> authenticated user jwt token
  // post --> post id which will be liked
  // for liking the post, we have to first create the post
  describe("POST /api/posts", () => {
    it("Add a new post by authenticated user again for checking testcases", (done) => {
      chai
        .request(url)
        .post("/api/posts")
        .set({
          "content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${jwt_token}`,
        })
        .send({
          title: "dummy post title",
          description: "dummy post description",
        })
        .end((err, response) => {
          postId = response.body.post.id;
          done();
        });
    }).timeout(30000);
  });

  describe("POST /api/like/:id", () => {
    it("Like a post by authenticated user", (done) => {
      chai
        .request(url)
        .post(`/api/like/${postId}`)
        .set({
          "content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${jwt_token}`,
        })
        .end((err, response) => {
          response.should.have.status(201);
          done();
        });
    }).timeout(30000);
  });

  // Test the POST route for unlike a post by authenticated user
  // in this api
  // we need --> authenticated user jwt token
  // post --> post id which will be unliked
  describe("POST /api/unlike/:id", () => {
    it("Unike a post by authenticated user", (done) => {
      chai
        .request(url)
        .post(`/api/unlike/${postId}`)
        .set({
          "content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${jwt_token}`,
        })
        .end((err, response) => {
          response.should.have.status(201);
          done();
        });
    }).timeout(30000);
  });

  // Test the POST route for adding a comment on a post by authenticated user
  // in this api
  // we need --> authenticated user jwt token
  // post --> post id on which comment will be add
  describe("POST /api/comment/:id", () => {
    it("Comment on a post by authenticated user", (done) => {
      chai
        .request(url)
        .post(`/api/comment/${postId}`)
        .set({
          "content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${jwt_token}`,
        })
        .send({ input: "dummy comment on post" })
        .end((err, response) => {
          response.should.have.status(201);
          done();
        });
    }).timeout(30000);
  });

  // Test the GET route for getting a post by its id
  // in this api
  // post --> post id
  describe("GET /api/posts/:id", () => {
    it("Get a post by its id", (done) => {
      chai
        .request(url)
        .get(`/api/posts/${postId}`)
        .set({
          "content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${jwt_token}`,
        })
        .end((err, response) => {
          response.should.have.status(200);
          done();
        });
    }).timeout(30000);
  });

  // Test the GET route for getting all post created by authenticated user
  // in this api
  // we need --> authenticated user jwt token
  describe("GET /api/all_posts", () => {
    it("Get all posts created by authenticated user", (done) => {
      chai
        .request(url)
        .get("/api/all_posts")
        .set({
          "content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${jwt_token}`,
        })
        .end((err, response) => {
          response.should.have.status(200);
          done();
        });
    }).timeout(30000);
  });
});
