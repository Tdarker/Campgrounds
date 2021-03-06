
const path = require('path');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ImageSchema = new Schema({
    //map với multer 
    url: String,
    filename: String
});
const Review = require('./review')
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number, 
    description : String,
    location: String,
    author : { type: Schema.Types.ObjectId, ref: 'User',},
    reviews : [{ type: Schema.Types.ObjectId, ref: 'Review',}] 
});
//delete het may cai review trong dbs khi xoa 1 camgpround.
CampgroundSchema.post("findOneAndDelete", async function(doc){
    if(doc){
        await Review.deleteMany({
            _id : {
                $in: doc.reviews
            }
        })
    }
})
const Campground = mongoose.model('Campground', CampgroundSchema);
module.exports = Campground;

