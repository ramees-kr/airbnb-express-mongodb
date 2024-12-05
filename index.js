const express = require("express");
const path = require("path");
const connectDB = require("./config/database");
const passport = require("passport");
const session = require("express-session");

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Passport configuration
require(path.join(__dirname, "config", "passport"))(passport);

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const Listing = require("./model/Listing");
const User = require("./model/User");
const authMiddleware = require("./middleware/auth");
const handlebars = require("express-handlebars");

// Set the views directory
app.set("views", path.join(__dirname, "views"));
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
app.get("/", authMiddleware, async (req, res) => {
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
app.get("/listings", authMiddleware, async (req, res) => {
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
app.post("/listings", authMiddleware, async (req, res) => {
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
app.put("/listings/:id", authMiddleware, async (req, res) => {
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
app.delete("/listings/:id", authMiddleware, async (req, res) => {
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

// Register Route
app.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});

app.post("/register", async (req, res) => {
  const { username, email, password, password2 } = req.body;
  if (password !== password2) {
    return res.render("register", { error: "Passwords do not match!" });
  }

  try {
    const user = new User({ username, email, password });
    await user.save();
    res.redirect("/login");
  } catch (error) {
    res.render("register", { error: "Error registering user!" });
  }
});

// Login Route
app.get("/login", (req, res) => {
  const error = req.query.error; // Get error from query string
  res.render("login", {
    title: "Login",
    error, // Pass error message to the template
  });
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // Pass the error message in the query string
      return res.redirect(`/login?error=${info.message}`);
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  })(req, res, next);
});

// Logout Route
app.get("/logout", (req, res) => {
  req.logout((err) => {
    res.redirect("/");
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
