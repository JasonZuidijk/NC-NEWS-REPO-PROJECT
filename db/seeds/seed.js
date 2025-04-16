const db = require("../connection");
const format =require("pg-format")


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
      const formattedArticles = articleData.map((articles) => {
        return [articles.title, articles.topic, articles.author, articles.body, articles.votes, articles.article_img_url]
      })
      const insertArticlesData = format(
        `INSERT INTO articles
        (title, topic, author, body, votes, article_img_url)
        VALUES %L`, 
        formattedArticles
      )
      return db.query(insertArticlesData)
    })
    .then(() => {
      const formattedComments = commentData.map((comments) => {
        return [comments.body, comments.votes]
      })
      const insertCommentsData = format(
        `INSERT INTO comments
      (body, votes)
      VALUES %L`,
      formattedComments
      )
      return db.query(insertCommentsData)
    }) 

};

//  const formattedTopic = format(
//   `INSERT INTO topics
//   (slug, description, img_url)
//   VALUES %L;`,
//   formattedTopics
//  )

//add format to incorporate data  const formattedTopic = topic.map((topic)=>{
// })....

module.exports = seed;
