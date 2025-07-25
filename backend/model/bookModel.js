const mongoose = require('mongoose');
const reviewSchema=new mongoose.Schema({
  userid:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
  name:{type:String,required:true},
  rating:{type:Number,required:true},
  comment:{type:String,default:""},
  createdAT:{type:Date,default:Date.now}
})
const bookSchema = new mongoose.Schema({
  openLibraryId: String, // unique Open Library work ID
  isbn: String,
  title: String,
  authors: [String],
  infoUrl: String,
  previewUrl: String,
  thumbnailUrl: String,
  coverImage: String, // large cover image URL
  subject: String, // e.g., 'science_fiction'
  summary: String, // ✅ Short description of the book
  reviews:[reviewSchema],
});

module.exports = mongoose.model('Book', bookSchema);
