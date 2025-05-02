const db = require("../db/connection");
const endpoints = require("../endpoints.json");
const {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectArticleComments,
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
  selectArticleComments(article_id)
    .then((comments) => {
        if (comments.length === 0){
            return res.status(404).send({ msg: "Article Does Not Exist :(" })
        }
      res.status(200).send({ comments });
    })
    .catch(next);
};

module.exports = {
  getApi,
  getTopics,
  getArticleById,
  getArticles,
  getArticleComments,
};
