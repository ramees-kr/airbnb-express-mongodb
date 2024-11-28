const express = require("express");
const path = require("path");
const connectDB = require("./config/database");

const app = express();

const Listing = require("./model/Listing");

// Set Pug as the templating engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

connectDB();
// Routes
app.get("/", async (req, res) => {
  try {
    // Fetch the first 5 listings
    const listings = await Listing.find().limit(5);

    console.log(listings);
    res.render("index", {
      title: "Home Page",
      message: "Welcome to the Airbnb Clone!",
      listings, // Pass the listings to the Pug template
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching listings.");
  }
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Us",
    message: "Simple airbnb app.",
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
