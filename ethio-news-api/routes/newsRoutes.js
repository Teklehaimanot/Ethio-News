const express = require("express");
const newsController = require("../controllers/newsController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const paginationMiddleware = require("../middlewares/paginationMiddleware");
const News = require("../models/News");

const newsRouter = express.Router();

newsRouter.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  newsController.createNews
);
newsRouter.get(
  "/",
  paginationMiddleware(News, "title"),
  newsController.getAllNews
);
newsRouter.post("/bookmarks", newsController.getNewsByIds);
newsRouter.get("/:newsId", newsController.getNewsById);
newsRouter.post(
  "/createComment/:newsId",
  authMiddleware,
  newsController.createComment
);
newsRouter.get("/:newsId/comments", newsController.getCommentsByNewsId);
newsRouter.patch(
  "/:newsId",
  authMiddleware,
  roleMiddleware("admin"),
  newsController.updateNews
);
newsRouter.post("/:newsId/like", authMiddleware, newsController.likeNews);
newsRouter.get("/search/:title", newsController.searchNewsByTitle);
newsRouter.delete(
  "/:newsId",
  authMiddleware,
  roleMiddleware("admin"),
  newsController.deleteNewsById
);

module.exports = newsRouter;
