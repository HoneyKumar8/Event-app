const Event = require("../models/Event");

// GET ALL EVENTS (with filters + pagination)
exports.getEvents = async (req, res) => {
  const { search, category, location, date, page = 1 } = req.query;

  let query = {};

  if (search)
    query.name = { $regex: search, $options: "i" };

  if (category)
    query.category = category;

  if (location)
    query.location = location;

  if (date)
    query.date = { $gte: new Date(date) };

  const limit = 6;
  const skip = (page - 1) * limit;

  const events = await Event.find(query)
    .sort({ date: 1 })
    .skip(skip)
    .limit(limit);

  const total = await Event.countDocuments(query);

  res.json({
    events,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page),
  });
};

// GET SINGLE EVENT
exports.getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event)
    return res.status(404).json({ message: "Event not found" });

  res.json(event);
};
