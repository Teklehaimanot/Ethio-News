const AboutNdmc = require("../models/AboutNdmc");

const createAbout = async (req, res) => {
  try {
    const { directorStatement, strategies, aboutUs, vision, mission } =
      req.body;
    if (
      !directorStatement.title ||
      !directorStatement.description ||
      !strategies.title ||
      !strategies.description ||
      !aboutUs ||
      !vision ||
      !mission
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newAbout = new AboutNdmc({
      directorStatement,
      strategies,
      aboutUs,
      vision,
      mission,
    });
    const find = await AboutNdmc.find();
    if (find.length > 0) {
      return res
        .status(200)
        .json({ error: "About contents are already exist" });
    }
    const savedAbout = await newAbout.save();

    res.status(201).json(savedAbout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAboutNdmc = async (req, res) => {
  try {
    const aboutNdmc = await AboutNdmc.findOne();

    if (!aboutNdmc) {
      return res.status(404).json({ error: "About NDMC not found" });
    }

    res.status(200).json(aboutNdmc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateAboutData = async (req, res) => {
  try {
    const { directorStatement, strategies, aboutUs, vision, mission } =
      req.body;

    if (
      !directorStatement.title ||
      !directorStatement.description ||
      !strategies.title ||
      !strategies.description ||
      !aboutUs ||
      !vision ||
      !mission
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const updatedAbout = await AboutNdmc.findOneAndUpdate(
      {},
      { directorStatement, strategies, aboutUs, vision, mission },
      { new: true, upsert: true }
    );

    res.status(200).json(updatedAbout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteAllAboutData = async (req, res) => {
  try {
    const result = await AboutNdmc.deleteMany({});
    res
      .status(200)
      .json({ message: `${result.deletedCount} documents deleted` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  createAbout,
  getAboutNdmc,
  deleteAllAboutData,
  updateAboutData,
};
