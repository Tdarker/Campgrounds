const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const Campground = require('./models/campground');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require("method-override");

//kiểm tra kết nối database
mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
   console.log('Database connected!');
});

app.engine('ejs', engine);
app.set('view engine','ejs')
app.set('views', path.join(__dirname,'views'))
//dùng để xuất dữ liệu ra định dạng json
app.use(express.urlencoded({extended :true}));
app.use(methodOverride('_method'));
    
app.get('/', (req,res) => {
    res.render('home');
})
// không cần phải tại dữ liệu vậy mà sẽ dùng mục index
// app.get('/makecampground', async (req,res) => {
//     const camp = new Campground({ title: 'MyBackyard', description: 'cheap location' });
//     await camp.save();
//     res.send(camp)
// })
app.get('/campgrounds', async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
})
app.get('/campgrounds/create', (req,res) => {
    res.render('campgrounds/create')
})
//tạo mới post lên thông tin
app.post('/campgrounds', catchAsync(async (req, res, next) => {
    if (!req.body.campground) throw new ExpressError('Invalid Data campground',400)
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

//chuc nang show
app.get('/campgrounds/:id', catchAsync(async (req,res,next) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground});
}))
//chuc nang edit 
app.get('/campgrounds/:id/edit', catchAsync( async (req, res) =>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground});
}));
//edit
app.put('/campgrounds/:id', catchAsync(async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}));
//delete
app.delete('/campgrounds/:id', catchAsync(async (req,res) =>{
    const {id } = req.params;
    const campground = await Campground.findByIdAndDelete(id, {...req.body.campground});
    res.redirect('/campgrounds')
}));
app.all("*",(res,req,next) => {
    next(new ExpressError("Page not found",404));
})

app.use((err, req, res, next) => {		
    const { statusCode = 500} = err;		
    if(!err.message) err.message="Oh no Something went wrong";
    res.status(statusCode).render('error',{err});    		
})		
    
app.listen(3000, () => {
    console.log('Serving on port 3000')
})
