const express = require("express");
const app = express();
const db = require("./db/connection");
const { getApi, getTopics } = require("./controllers/controllers");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

module.exports = app;
