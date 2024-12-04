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
app.get("/listings", async (req, res) => {
  try {
    // Fetch all listings
    const listings = await Listing.find().lean().limit(18);
    //limit number of results to improve performance

    res.render("viewListings", {
      title: "View Listings",
      listings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching listings.");
  }
});

//Route to create a new listing
router.post("/listings", async (req, res) => {
  try {
    const newListing = new Listing(req.body);
    // Assuming the body contains all required fields, have to add validations here based on the form design with final fields chosen
    await newListing.save();
    res
      .status(201)
      .json({ message: "Listing created successfully", listing: newListing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating listing", error });
  }
});

// Route to update an existing listing
router.put("/listings/:id", async (req, res) => {
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // to return the updated document
        runValidators: true, // Ensure validation is applied, need to change with express-validator later
      }
    );
    if (!updatedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.json({
      message: "Listing updated successfully",
      listing: updatedListing,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating listing", error });
  }
});

// Route to delete a listing
router.delete("/listings/:id", async (req, res) => {
  try {
    const deletedListing = await Listing.findByIdAndDelete(req.params.id);
    if (!deletedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.json({
      message: "Listing deleted successfully",
      listing: deletedListing,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting listing", error });
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
