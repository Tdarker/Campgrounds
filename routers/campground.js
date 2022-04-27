const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {validateCampground, isLoggedIn, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer  = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({storage});
router.route('/')
//phải để path này lên trc để tránh miss với /:id
    .get(catchAsync(campgrounds.index))
    //console.log()
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
router.get('/create', isLoggedIn , campgrounds.renderNewForm)

router.route('/:id')
    .get( catchAsync(campgrounds.showCampground))
    .put( isLoggedIn , isAuthor,upload.array('image'),  validateCampground, catchAsync(campgrounds.updateCampground))
    .delete( isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

//chuc nang show edit 
router.get('/:id/edit',  isLoggedIn, isAuthor,  catchAsync(campgrounds.editCampground));
module.exports = router