const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Event = require("./models/Event");

dotenv.config();
connectDB();

const seedEvents = async () => {
  try {
    await Event.deleteMany();

    const events = [
      {
        name: "Tech Conference 2026",
        organizer: "Bellcorp",
        location: "Bangalore",
        date: new Date("2026-03-15"),
        description: "Annual tech innovation conference.",
        capacity: 100,
        category: "Technology",
      },
      {
        name: "Startup Meetup",
        organizer: "Startup Hub",
        location: "Mumbai",
        date: new Date("2026-04-10"),
        description: "Networking for founders.",
        capacity: 50,
        category: "Business",
      },
      {
        name: "AI Workshop",
        organizer: "AI Labs",
        location: "Hyderabad",
        date: new Date("2026-05-05"),
        description: "Hands-on AI session.",
        capacity: 40,
        category: "Technology",
      },
    ];

    // Generate more events
    for (let i = 1; i <= 17; i++) {
      events.push({
        name: `Music Fest ${i}`,
        organizer: "Event Corp",
        location: i % 2 === 0 ? "Delhi" : "Chennai",
        date: new Date(`2026-06-${i + 1}`),
        description: "Live music festival.",
        capacity: 80,
        category: "Entertainment",
      });
    }

    await Event.insertMany(events);

    console.log("Events Seeded Successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedEvents();
