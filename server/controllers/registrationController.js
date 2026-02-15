const Registration = require("../models/Registration");
const Event = require("../models/Event");

// REGISTER
exports.registerEvent = async (req, res) => {
  const event = await Event.findById(req.params.eventId);

  if (!event)
    return res.status(404).json({ message: "Event not found" });

  if (event.registeredCount >= event.capacity)
    return res.status(400).json({ message: "Event full" });

  try {
    await Registration.create({
      user: req.user._id,
      event: event._id,
    });

    event.registeredCount += 1;
    await event.save();

    res.json({ message: "Registered successfully" });
  } catch (error) {
    res.status(400).json({ message: "Already registered" });
  }
};

// CANCEL
exports.cancelRegistration = async (req, res) => {
  const registration = await Registration.findOne({
    user: req.user._id,
    event: req.params.eventId,
  });

  if (!registration)
    return res.status(404).json({ message: "Registration not found" });

  await registration.deleteOne();

  const event = await Event.findById(req.params.eventId);
  event.registeredCount -= 1;
  await event.save();

  res.json({ message: "Registration cancelled" });
};

// GET MY EVENTS
exports.getMyRegistrations = async (req, res) => {
  const registrations = await Registration.find({
    user: req.user._id,
  }).populate("event");

  res.json(registrations);
};
