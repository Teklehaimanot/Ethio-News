const News = require("../models/News");
const User = require("../models/User");
const _ = require("lodash");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // Optional: Limit the file size (1 MB in this case)
}).single("image");

const uploadAsync = (req, res) => {
  return new Promise((resolve, reject) => {
    upload(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const createNews = async (req, res) => {
  try {
    await uploadAsync(req, res);
    const imagePath = req.file ? req.file.path : null;
    const { title, description, date, source, sourceUrl } = req.body;

    if (!title || !description || !imagePath) {
      return res.status(400).json({ error: "all fileds are required" });
    }
    const news = new News({
      title,
      description,
      image: imagePath,
      date: date ? date : Date.now(),
      source,
      sourceUrl,
    });

    const savedNews = await news.save();
    res.status(201).json(savedNews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createComment = async (req, res) => {
  try {
    const { userId, commentText } = req.body;
    const { newsId } = req.params;

    const news = await News.findById(newsId);

    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    news.comments.push({ user: userId, comment: commentText });
    const updatedNews = await news.save();

    res.status(201).json(updatedNews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllNews = async (req, res) => {
  try {
    res.status(200).json(req.paginatedResults);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCommentsByNewsId = async (req, res) => {
  const { newsId } = req.params;
  try {
    const news = await News.findById(newsId).populate(
      "comments.user",
      "_id name profileImage"
    );

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    const comments = news.comments.map((comment) => ({
      comment,
    }));
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getNewsById = async (req, res) => {
  try {
    const { newsId } = req.params;

    const news = await News.findById(newsId);

    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }

    res.status(200).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getNewsByIds = async (req, res) => {
  try {
    const { newsIds } = req.body;
    if (!Array.isArray(newsIds) || newsIds.length === 0) {
      return res.status(400).json({ error: "Invalid or empty newsIds array" });
    }

    const news = await News.find({ _id: { $in: newsIds } });

    if (!news || news.length === 0) {
      return res.status(404).json({ error: "No news items found" });
    }
    res.status(200).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateNews = async (req, res) => {
  const { newsId } = req.params;

  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          error: "File upload failed",
        });
      }

      const imagePath = req.file ? req.file.path : null;
      const { title, description, date, source, sourceUrl } = req.body;

      if (!title || !description) {
        return res.status(400).json({
          error: "Title and description are required",
        });
      }

      const news = await News.findById(newsId);

      if (!news) {
        return res.status(404).json({
          error: "Evidence Brief not found",
        });
      }
      news.title = title;
      news.description = description;
      news.date = date || news.date;
      news.source = source || news.source;
      news.sourceUrl = sourceUrl || news.sourceUrl;

      if (imagePath) {
        news.image = imagePath;
      }
      const updatedNews = await news.save();
      res.status(200).json(updatedNews);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const likeNews = async (req, res) => {
  try {
    const userId = req.user._id;
    const { newsId } = req.params;

    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }

    if (news.likedBy.includes(userId)) {
      news.likedBy.pull(userId);
      news.likes -= 1;
    } else {
      news.likedBy.push(userId);
      news.likes += 1;
    }
    await news.save();
    res.status(201).json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const searchNewsByTitle = async (req, res) => {
  try {
    const { title } = req.params;
    const regex = new RegExp(title, "i");
    const news = await News.find({ title: regex });

    res.status(200).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteNewsById = async (req, res) => {
  try {
    const { newsId } = req.params;
    const deletedNews = await News.findByIdAndDelete(newsId);

    if (!deletedNews) {
      return res.status(404).json({ error: "News not found" });
    }

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createNews,
  createComment,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNewsById,
  searchNewsByTitle,
  getCommentsByNewsId,
  likeNews,
  getNewsByIds,
};
