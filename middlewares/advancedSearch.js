const advancedSearch = (model, populate) => async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };

  // Field to exclude from the request query
  const removeFields = ["select", "sort", "page", "limit"];

  // delete fields that not included in the query
  // to not let mogoose use them a book fields
  // but as mogoose queries
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create mogoose operators [$gt,$lt..]
  let queryString = JSON.stringify(reqQuery);

  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = model.find(JSON.parse(queryString));

  // Slect custum fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // add Populate
  if (populate) {
    query.populate(populate);
  }

  const result = await query;

  // Pagination result
  const pagination = {};

  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit };
  }

  if (endIndex < total) {
    pagination.next = { page: page + 1, limit };
  }
  req.advencedSearch = {
    success: true,
    count: result.length,
    pagination,
    data: result,
  };

  next();
};

module.exports = advancedSearch;
