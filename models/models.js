const db = require("../db/connection");

const selectTopics = () => {
  return db
    .query("SELECT DISTINCT slug, description FROM topics")
    .then((result) => {
      return result.rows;
    });
};

const selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((result) => {
      return result.rows[0];
    });
};

const selectArticles = () => {
  return db
    .query(
      "SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at,articles.votes, articles.article_img_url, COUNT(comments.comment_id) As comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC"
    )
    .then((result) => {
      return result.rows;
    });
};
const selectArticleComments = (article_id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};
const insertCommentByArticleId = (article_id, { comment, author }) => {
  const id = parseInt(article_id, 10)


  if (isNaN(Number(article_id))) {
    return Promise.reject({ status: 400, msg: "Invalid Input :(" });
  }

  if (!author || !comment) {
    return Promise.reject({ status: 400, msg: "Missing required fields" });
  }
  return db
    .query(
      `INSERT INTO comments (article_id, body, author) VALUES ($1, $2, $3) RETURNING *`,
      [article_id, comment, author]
    )
    .then((result) => {
      return result.rows[0];
    });
};
module.exports = {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectArticleComments,
  insertCommentByArticleId,
};
