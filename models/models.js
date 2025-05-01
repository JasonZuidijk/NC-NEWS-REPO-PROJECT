const db = require("../db/connection");

const selectTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
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
    .query("SELECT articles.*, COUNT(comments.comment_id) As comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC").then((result) => {
        console.log(result.rows)
        return result.rows;
    })
}

module.exports = { selectTopics, selectArticleById, selectArticles};
