const express = require("express");
const app = express();
const db = require("./db/connection");
const {
  getApi,
  getTopics,
  getArticleById,
  getArticles,
  getArticleComments,
} = require("./controllers/controllers");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid Input :(" });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "server Error!" });
});

module.exports = app;
