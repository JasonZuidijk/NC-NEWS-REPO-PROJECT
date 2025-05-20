const endpointsJson = require("../endpoints.json");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");


beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topicsArray = body.topics;
        expect(topicsArray.length).toBe(3);
        topicsArray.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the correct object & properties for relative paramentric endpoint", () => {
    const articleId = 1;
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("article_id", articleId);
        expect(typeof body.article.article_id).toBe("number");
        expect(typeof body.article.title).toBe("string");
        expect(typeof body.article.topic).toBe("string");
        expect(typeof body.article.author).toBe("string");
        expect(typeof body.article.body).toBe("string");
        expect(body.article).toHaveProperty("created_at");
        expect(typeof body.article.votes).toBe("number");
        expect(typeof body.article.article_img_url).toBe("string");
      });
  });
  test("status:400, responds with an error message when passed a bad article ID", () => {
    return request(app)
      .get("/api/articles/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input :(");
      });
  });
  test("status:404, responds with an error message when passed a valid ID that does not exist in the database", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Does Not Exist :(");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articlesArray = body.articles;
        expect(articlesArray.length).toBe(13);
        articlesArray.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(Object.hasOwn(article, "body")).toBe(false);
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article ID", () => {
    const articleId = 3;
    return request(app)
      .get(`/api/articles/${articleId}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        const commentsArray = body.comments;
        expect(commentsArray.length).toBe(2);
        commentsArray.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  test("status:400, responds with an error message when passed a bad article ID", () => {
    return request(app)
      .get("/api/articles/notAnId/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input :(");
      });
  });
  test("status:404, responds with an error message when passed a valid ID that does not exist in the database", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Does Not Exist :(");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("insert comment object to article by article id", () => {
   return request(app)
    .post("/api/articles/1/comments")
    .send({
      author: "icellusedkars",
      comment: "very gripping"
    })
    .expect(201)
    .then(({ body }) => {
      expect(body.comment.body).toBe("very gripping");
    })
  })
  test("status:400, responds with an error message when passed a bad article ID", () => {
    return request(app)
    .post("/api/articles/notAnId/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input :(");
      })
  })
  test("status:404, responds with an error message when passed a valid ID that does not exist in the database", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Does Not Exist :(");
      });
  })
  test("status:400, responds with an error message when 'author' is missing", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ comment: "very gripping" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input :(");
      });
  });
  test("status:404, responds with an error message when username does not exist", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        author: "nonexistent_user",
        comment: "this should fail"
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  })
  
describe("Patch /api/articles/:article_id", () => {
  test("200: responds with updated article when votes decremented", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -10 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("article_id", 1);
        expect(typeof body.article.votes).toBe("number");
      });
  });

  test("400: responds with error when article_id is invalid (not a number)", () => {
    return request(app)
      .patch("/api/articles/not-an-id")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input :(");
      });
  });

  test("404: responds with error when article_id does not exist", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Does Not Exist :(");
      });
  });

  test("400: responds with error when inc_votes is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "banana" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input :(");
      });
  });

  test("400: responds with error when inc_votes is missing", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input :(");
      });
  });
});
})

describe("DELETE /api/comments/:comment_id", () => {
  test("204: deletes the comment by ID and responds with no content", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204);
  });
  test("404: reponds with error if commentdoes not exits", () => {
    return request(app)
    .delete("/api/comments/9999")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Comment Does Not Exist :(")
    })
  })
  test("400: responds with error if comment_id is not a number", () => {
    return request(app)
      .delete("/api/comments/notanid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input :(");
      });
  });
});






