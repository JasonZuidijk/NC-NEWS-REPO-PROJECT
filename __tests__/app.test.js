const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");

/* Set up your beforeEach & afterAll functions here */

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
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.img_url).toBe("string");
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
    .then(({body}) => {
      const articlesArray = body.articles
      expect(articlesArray.length).toBe(13)
      articlesArray.forEach((article) => {
        expect(typeof article.author).toBe("string")
        expect(typeof article.title).toBe("string")
        expect(typeof article.topic).toBe("string")
        expect(typeof article.created_at).toBe("string")
        expect(typeof article.votes).toBe("number")
        expect(typeof article.article_img_url).toBe("string")
        expect(typeof article.comment_count).toBe("string")
      })
    })
  })
})



//get all array of all articles
//an articles array of article objects, each of which should have the following properties:
// author
// title
// article_id
// topic
// created_at
// votes
// article_img_url
// comment_count, which is the total count of all the comments with this article_id. You should make use of queries to the database in order to achieve this.

//should be sorted by date in descendng order
//there should not be a body property present on any of the article objects.