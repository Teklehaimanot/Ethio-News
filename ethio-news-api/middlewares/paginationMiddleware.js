const paginationMiddleware = (model, searchField = "name") => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchString = req.query[searchField] || "";

    const skip = (page - 1) * limit;

    try {
      // Build the search query based on the provided name
      const searchQuery = {
        [searchField]: { $regex: new RegExp(searchString, "i") },
      };

      const results = await model
        .find(searchQuery)
        .select("-password")
        .sort({ date: -1, _id: -1 })
        .skip(skip)
        .limit(limit);

      const totalDocuments = await model.countDocuments(searchQuery);
      const totalPages = Math.ceil(totalDocuments / limit);

      const paginationInfo = {
        currentPage: page,
        totalPages: totalPages,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        count: totalDocuments,
      };

      req.paginatedResults = {
        success: true,
        pagination: paginationInfo,
        data: results,
      };

      next();
    } catch (error) {
      console.error("Error fetching paginated data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

module.exports = paginationMiddleware;
