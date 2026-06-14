const catchAsync = require("../utils/catchAsync");

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedDoc = await Model.findByIdAndDelete(id);
    if (!deletedDoc) {
      return next({ status: 404, message: "Item not found!" });
    }
    res.status(204).send();
  });

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: newDoc,
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updatedOne = await Model.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!updatedOne) {
      return next({ status: 404, message: "Item not found!" });
    }
    res.status(200).json({
      status: "success",
      data: updatedOne,
    });
  });

const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const query = Model.findById(id);
    if (popOptions) query.populate(popOptions);
    const item = await query;
    if (!item) {
      return next({ status: 404, message: "Item not found!" });
    }
    res.status(200).json({
      status: "success",
      data: item,
    });
  });

const getAllDocs = (Model, getUser, popOptions) =>
  catchAsync(async (req, res, next) => {
    // courses/:id/lessons
    const queryObj = { ...req.query };

    // Fields not used for filtering
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const filter = req.params.courseId ? { course: req.params.courseId } : {};
    const initialFilter = getUser ? { user: req.user._id } : {};

    const mongoFilter = { ...filter, ...initialFilter };

    // Price filtering
    if (queryObj.minPrice || queryObj.maxPrice) {
      mongoFilter.price = {};
      if (queryObj.minPrice) mongoFilter.price.$gte = Number(queryObj.minPrice);
      if (queryObj.maxPrice) mongoFilter.price.$lte = Number(queryObj.maxPrice);
    }
    // console.log(mongoFilter);
    // Title search (case-insensitive -> $options: "i" )
    if (queryObj.title) {
      const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      mongoFilter.title = {
        $regex: escapeRegex(queryObj.title),
        $options: "i",
      };
    }
    // console.log(mongoFilter);
    let query = Model.find(mongoFilter);

    if (popOptions) query.populate(popOptions);

    //sort lessons by order
    if (req.params.courseId) {
      query = query.sort("order");
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // pagination
    const page = req.query.page * 1 || 1;
    const limit = Math.min(req.query.limit * 1 || 10, 25);
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const totalItems = await Model.countDocuments(mongoFilter);
    const totalPages = Math.ceil(totalItems / limit);

    const docs = await query;

    res.status(200).json({
      status: "success",
      results: docs.length,
      totalPages,
      page,
      data: docs,
    });
  });

module.exports = {
  deleteOne,
  createOne,
  updateOne,
  getOne,
  getAllDocs,
};
