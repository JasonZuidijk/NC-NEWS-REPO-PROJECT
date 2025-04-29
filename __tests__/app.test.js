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
        const array = body.topics;
        expect(array.length).toBe(3);
        array.forEach((topic) => {
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
        expect(typeof body.article.article_id).toBe("number")
        expect(typeof body.article.title).toBe("string")
        expect(typeof body.article.topic).toBe("string")
        expect(typeof body.article.author).toBe("string")
        expect(typeof body.article.body).toBe("string")
        expect(body.article).toHaveProperty("created_at")
        expect(typeof body.article.votes).toBe("number")
        expect(typeof body.article.article_img_url).toBe("string")
      });
  });
});


// don't know how to test created_at

//do not know how to handle or test for errors

// /api/articles/:article_id
// get article by id
//article object with correct properties (8)
//consider what errors could occur
//add description of the endpoint to your /api endpoint


//an article object, which should have the following properties:
// author
// title
// article_id
// body
// topic
// created_at
// votes
// article_img_url

// article_id      | 1
// title           | Living in the shadow of a great man
// topic           | mitch
// author          | butter_bridge
// body            | I find this existence challenging
// created_at      | 2020-07-09 21:11:00
// votes           | 100
// article_img_url | https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700
