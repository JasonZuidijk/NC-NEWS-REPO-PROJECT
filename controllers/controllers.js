const db = require("../db/connection");
const endpoints = require("../endpoints.json");
const { selectTopics, selectArticleById } = require("../models/models");

const getApi = (req, res) => {
  res.status(200).send({ endpoints });
};

const getTopics = (req, res) => {
  return selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

const getArticleById = (req, res) => {
  const { article_id } = req.params;
  return selectArticleById(article_id).then((article) => {
    res.status(200).send({ article });
  });
};

module.exports = { getApi, getTopics, getArticleById };
