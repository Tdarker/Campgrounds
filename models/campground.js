
const path = require('path');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number, 
    description : String,
    location: String 
});
const Campground = mongoose.model('Campground', CampgroundSchema);
module.exports = Campground;

