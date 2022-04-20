if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const Joi = require('joi');

const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require("method-override");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const campgroundRouters = require('./routers/campground');
const reviewRouters = require('./routers/review');
const userRouters = require('./routers/user')
const {validateReview, validateCampground, isLoggedIn} = require('./middleware');

const session = require('express-session');
const MongoDBStore = require('connect-mongo'); 
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';


//kiểm tra kết nối database 
// 'mongodb://localhost:27017/yelp-camp'
mongoose.connect( dbUrl);

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
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')))

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
const store = new MongoDBStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());   

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds',campgroundRouters);
app.use('/campgrounds/:id/reviews', reviewRouters )
app.use('/', userRouters)
// không cần phải tại dữ liệu vậy mà sẽ dùng mục index
// app.get('/makecampground', async (req,res) => {
//     const camp = new Campground({ title: 'MyBackyard', description: 'cheap location' });
//     await camp.save();
//     res.send(camp)
// })
app.get('/', (req,res) => {
    res.render('home');
});


app.all("*",(res,req,next) => {
    next(new ExpressError("Page not found",404));
})

app.use((err, req, res, next) => {		
    const { statusCode = 500} = err;		
    if(!err.message) err.message="Oh no Something went wrong";
    res.status(statusCode).render('error',{err});    		
})		
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})
