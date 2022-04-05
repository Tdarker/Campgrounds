const Campground = require('../models/campground');


module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}
module.exports.renderNewForm = (req,res) => {
    res.render('campgrounds/create')
}
module.exports.createCampground = async (req, res, next) => {
       
    //if (!req.body.campground) throw new ExpressError('Invalid Data campground',400)
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success','Successfully create a new campgrounds');
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.showCampground = async (req,res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path : 'reviews', 
            populate: { path : 'author'}
        }).populate('author');
    res.render('campgrounds/show', {campground});
}
module.exports.editCampground = async (req, res) =>{
    const campground = await Campground.findById(req.params.id);
    //them authorize 
    res.render('campgrounds/edit', {campground})
}
module.exports.updateCampground = async (req,res,next) => {
    const { id } = req.params;
    //them authorize 
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Successfully updated a new campgrounds');
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.deleteCampground = async (req,res) =>{
    const {id } = req.params;
    //them authorize 
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully delete !')
    res.redirect('/campgrounds')
}