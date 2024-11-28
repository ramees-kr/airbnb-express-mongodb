const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Use String for _id to match the example
    listing_url: { type: String, required: true },
    name: { type: String, required: true },
    summary: { type: String },
    space: { type: String },
    description: { type: String },
    neighborhood_overview: { type: String },
    notes: { type: String },
    transit: { type: String },
    access: { type: String },
    interaction: { type: String },
    house_rules: { type: String },
    property_type: { type: String },
    room_type: { type: String },
    bed_type: { type: String },
    minimum_nights: { type: String },
    maximum_nights: { type: String },
    cancellation_policy: { type: String },
    last_scraped: { type: Date },
    calendar_last_scraped: { type: Date },
    first_review: { type: Date },
    last_review: { type: Date },
    accommodates: { type: Number },
    bedrooms: { type: Number },
    beds: { type: Number },
    number_of_reviews: { type: Number },
    bathrooms: { type: Number },
    amenities: { type: [String] }, // Array of strings for amenities
    price: { type: Number },
    security_deposit: { type: Number },
    cleaning_fee: { type: Number },
    extra_people: { type: Number },
    guests_included: { type: Number },
    images: {
      type: Object, // Adjust schema if you know the image structure
    },
    host: {
      type: Object, // Adjust schema if you know the host structure
    },
    address: {
      type: Object, // Adjust schema if you know the address structure
    },
    availability: {
      type: Object, // Adjust schema if you know the availability structure
    },
    review_scores: {
      type: Object, // Adjust schema if you know the review scores structure
    },
    reviews: {
      type: [Object], // Array of review objects
    },
  },
  {
    collection: "listingsAndReviews",
  }
);

module.exports = mongoose.model("Listing", ListingSchema);
