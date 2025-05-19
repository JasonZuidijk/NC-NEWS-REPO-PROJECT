const express = require("express");
const app = express();
app.use(express.json());
const {
  getApi,
  getTopics,
  getArticleById,
  getArticles,
  getArticleComments,
  postCommentByArticleId,
  patchArticleById
} = require("./controllers/controllers");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleById)


app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid Input :(" });
  } else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;

// app.use((err, req, res, next) => {
//   if (err.code === "22P02") {
//     res.status(400).send({ msg: "Invalid Input :(" });
//   } else next(err);
// });

// app.use((err, req, res, next) => {
//   res.status(500).send({ msg: "server Error!" });
// });