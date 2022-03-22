const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {validateCampground } = require('../middleware');

router.get('/', async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
})
//phải để path này lên trc để tránh miss với /:id
router.get('/create', (req,res) => {
    res.render('campgrounds/create')
})
//tạo mới post lên thông tin
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
       
    //if (!req.body.campground) throw new ExpressError('Invalid Data campground',400)
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success','Successfully create a new campgrounds');
    res.redirect(`/campgrounds/${campground._id}`)
}))


//chuc nang show
router.get('/:id', catchAsync(async (req,res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', {campground});
}))
//chuc nang edit 
router.get('/:id/edit', catchAsync( async (req, res) =>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground});
}));
//update
router.put('/:id',validateCampground, catchAsync(async (req,res,next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Successfully updated a new campgrounds');
    res.redirect(`/campgrounds/${campground._id}`)
}));
//delete
router.delete('/:id', catchAsync(async (req,res) =>{
    const {id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully delete !')
    res.redirect('/campgrounds')
}));
module.exports  = router; 