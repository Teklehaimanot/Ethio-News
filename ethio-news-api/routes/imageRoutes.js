const express = require("express");
const { proxyImage } = require("../controllers/imageProxyController");

const imageRouter = express.Router();

imageRouter.get("/proxy", proxyImage);

module.exports = imageRouter;
