const express = require("express");
const path = require("path");
const connectDB = require("./config/database");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const Listing = require("./model/Listing");

const handlebars = require("express-handlebars");
// Sets our app to use the handlebars engine
app.set("view engine", "handlebars");
// Sets handlebars configurations with absolute paths
app.engine(
  "handlebars",
  handlebars.engine({
    layoutsDir: path.join(__dirname, "views", "layouts"), // Absolute path for layouts directory
    allowProtoPropertiesByDefault: true, // Allow proto properties
    allowProtoMethodsByDefault: true, // Allow proto methods
  })
);

connectDB();
// Routes
app.get("/", async (req, res) => {
  try {
    // Fetch the first 5 listings
    const listings = await Listing.find().lean().limit(5);

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

//route to view all listings viewListings
app.get("/viewListings", async (req, res) => {
  try {
    // Fetch all listings
    const listings = await Listing.find().lean();

    res.render("viewListings", {
      title: "View Listings",
      listings,
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
