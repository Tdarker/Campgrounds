const express = require('express');
const router = express.Router({mergeParams : true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const {validateReview } = require('../middleware');

router.post('/', catchAsync( async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save(); 
    await campground.save();
    req.flash('success','Create New review!');
    res.redirect(`/campgrounds/${campground._id}`);
}))
//xoa review campground
router.delete('/:reviewid',catchAsync(async(req,res)=>{
    const {id, reviewid} = req.params;
    await Campground.findByIdAndUpdate(id, { $pull:{ reviews : reviewid}})
    await Review.findByIdAndDelete(req.params.reviewid);
    req.flash('success','Successfully delete !')
    res.redirect(`/campgrounds/${id}`); 
}))
module.exports = router;