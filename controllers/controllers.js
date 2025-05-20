const db = require("../db/connection");
const endpoints = require("../endpoints.json");
const {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectArticleComments,
  insertCommentByArticleId,
  updateArticleVotes,
  removeCommentById
} = require("../models/models");

const getApi = (req, res) => {
  res.status(200).send({ endpoints });
};

const getTopics = (req, res) => {
  return selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return selectArticleById(article_id)
    .then((article) => {
      if (!article) {
        return res.status(404).send({ msg: "Article Does Not Exist :(" });
      }
      res.status(200).send({ article });
    })
    .catch(next);
};

const getArticles = (req, res, next) => {
  return selectArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

const getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  return selectArticleById(article_id)
    .then((article) => {
      if (!article) {
        return res.status(404).send({ msg: "Article Does Not Exist :(" });
      }
      return selectArticleComments(article_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

const postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;
  return selectArticleById(article_id)
  .then((article) => {
    if (!article) {
      return res.status(404).send({ msg: "Article Does Not Exist :(" });
    }
    return insertCommentByArticleId(article_id, body)
  })
  .then((comment) => {
    res.status(201).send({ comment });
  })
  .catch((err) => {
    if (err.code === "23503") {
      res.status(404).send({ msg: "User not found" });
    } else {
      next(err);
    }
  });
};

const patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (typeof inc_votes !== "number") {
    return res.status(400).send({ msg: "Invalid Input :(" });
  }

  return updateArticleVotes(article_id, inc_votes)
  .then((updatedArticle) => {
    if (!updatedArticle) {
      return res.status(404).send({ msg: "Article Does Not Exist :(" });
    }
    res.status(200).send({ article: updatedArticle });
  })
  .catch(next);
};

const deleteCommentById = (req, res, next) =>{
const {comment_id} = req.params

return removeCommentById(comment_id)
.then((deletedComment) => {
  if(!deletedComment) {
    return res.status(404).send({msg: "Comment Does Not Exist :("})
  }
  res.status(204).send()
})
.catch(next)
}




module.exports = {
  getApi,
  getTopics,
  getArticleById,
  getArticles,
  getArticleComments,
  postCommentByArticleId,
  patchArticleById,
  deleteCommentById
};
