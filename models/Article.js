// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true
  },
  // link is a required string
  // todo save summary paragraph instead of link
  link: {
    type: String,
    required: true
  },
  // Saves array of notes.
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;



// var mongoose = require("mongoose");

// // Save a reference to the Schema constructor
// var Schema = mongoose.Schema;

// // Using the Schema constructor, create a new UserSchema object
// // This is similar to a Sequelize model
// var ArticleSchema = new Schema({
//   // `title` is required and of type String
  
//   title: {
//     type: String,
//     required: true
//   },
//   // `link` is required and of type String
//   link: {
//     type: String,
//     required: true
//   },
//   // `note` is an object that stores a Note id
//   // The ref property links the ObjectId to the Note model
//   // This allows us to populate the Article with an associated Note
//   note: {
//     type: Schema.Types.ObjectId,
//     ref: "Note"
//   }
 
// });
// ArticleSchema.set('validateBeforeSave', false);
// // This creates our model from the above schema, using mongoose's model method
// var Article = mongoose.model("Article", ArticleSchema);

// // Export the Article model
// module.exports = Article;
