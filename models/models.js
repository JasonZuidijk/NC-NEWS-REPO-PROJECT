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
  const id = parseInt(article_id, 10);

  if (isNaN(Number(article_id))) {
    return Promise.reject({ status: 400, msg: "Invalid Input :(" });
  }

  if (!author || !comment) {
    return Promise.reject({ status: 400, msg: "Invalid Input :(" });
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

const updateArticleVotes = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles
         SET votes = votes + $1
         WHERE article_id = $2
         RETURNING *;`,
      [inc_votes, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

const removeCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then((result) => {
      return result.rows[0];
    });
};

const selectUsers = () => {
  return db
    .query(`SELECT username, name, avatar_url FROM users;`)
    .then((result) => {
      return result.rows;
    });
};

const selectArticles = (sort_by = "created_at", order = "desc") => {
  const validSortBy = [
    "article_id",
    "title",
    "author",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrder = ["asc", "desc"];

  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by column" });
  }
  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  const queryStr = `
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};
  `;
  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};

module.exports = {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectArticleComments,
  insertCommentByArticleId,
  updateArticleVotes,
  removeCommentById,
  selectUsers,
};
