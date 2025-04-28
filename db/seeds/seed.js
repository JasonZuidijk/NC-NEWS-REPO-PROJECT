const db = require("../connection");
const format =require("pg-format")
const {convertTimestampToDate, createRef} = require("./utils.js")

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics`);
    })
    .then(() => {
      return db.query(`CREATE TABLE topics(
      slug VARCHAR(100) PRIMARY KEY,
      description VARCHAR(2000),
      img_url VARCHAR(1000)
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users(
      username VARCHAR(100) PRIMARY KEY,
      name VARCHAR(100),
      avatar_url VARCHAR(1000)
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles(
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(200),
      topic VARCHAR(100),
      author VARCHAR(100),
      body TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000)
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments(
      comment_id SERIAL PRIMARY KEY,
      ARTICLE_ID INT,
      body TEXT,
      votes INT DEFAULT 0,
      author VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`);
    })
    .then(() => {
      return db.query(
        `ALTER TABLE articles
      ADD FOREIGN KEY (topic) REFERENCES topics(slug)`
      );
    })
    .then(() => {
      return db.query(`
      ALTER TABLE articles
      ADD FOREIGN KEY (author) REFERENCES users(username)`);
    })
    .then(() => {
      return db.query(
        `ALTER TABLE comments
      ADD FOREIGN KEY (article_id) REFERENCES articles(article_id)`
      );
    })
    .then(() => {
      return db.query(
        `ALTER TABLE comments
      ADD FOREIGN KEY (author) REFERENCES users(username)`
      );
    })
    .then(() => {
      const formattedTopics = topicData.map((topic) => {
        return [topic.slug, topic.description, topic.img_url];
      });
      const insertTopicsQuery = format(
        `INSERT INTO topics 
        (slug, description, img_url)
        VALUES %L;`,
        formattedTopics
      );
      return db.query(insertTopicsQuery);
    })
    .then(() => {
      const formattedUsers = userData.map((users) => {
        return [users.username, users.name, userData.avatar_url];
      });
      const insertUsersQuery = format(
        `INSERT INTO users 
          (username, name, avatar_url)
          VALUES %L;`,
        formattedUsers
      );
      return db.query(insertUsersQuery);
    })
    .then(() => {
      const formatedArticles = articleData.map((article) => {
        const convertedArticle = convertTimestampToDate(article);
        return [
          article.title,
          article.topic,
          article.author,
          article.body,
          convertedArticle.created_at,
          article.votes,
          article.article_img_url,
        ];
      });
      const insertArticles = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`,
        formatedArticles
      );
      return db.query(insertArticles);
    })
    .then((result) => {
      const articleRefObject = createRef(result.rows);
      const formatedComments = commentData.map((comment) => {
        const convertedComment = convertTimestampToDate(comment);
        return [
          articleRefObject[comment.article_title],
          comment.body,
          comment.votes,
          comment.author,
          convertedComment.created_at,
        ];
      });
      const insertComments = format(
        `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L`,
        formatedComments
      );
      return db.query(insertComments);
    });
};

module.exports = seed;
