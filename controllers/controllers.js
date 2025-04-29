const db = require("../db/connection");
const endpoints = require("../endpoints.json");
const selectTopics = require("../models/models");

const getApi = (req, res) => {
  res.status(200).send({ endpoints });
};

const getTopics = (req, res) => {
  return selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

module.exports = { getApi, getTopics };
