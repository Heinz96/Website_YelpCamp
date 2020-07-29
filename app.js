var seedDB 					= require("./seed"),
	express 				= require("express"),
	app 					= express(),
	flash					= require("connect-flash"),
	mongoose 				= require("mongoose"),
	passport 				= require("passport"),	
	bodyParser 				= require("body-parser"),
	Comment 				= require("./models/comment"),
	localStrategy 			= require("passport-local"),
	methodOverride			= require("method-override"),
	User 					= require("./models/user"),
	Campground 				= require("./models/campgrounds"),
	passportLocalMongoose 	= require("passport-local-mongoose");

var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

app.use(require("express-session")({
		secret: "Enzo is and always will be the best",
		resave: false,
		saveUninitialized: false
		}))
//seedDB();

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//mongoose.connect(process.env.DATABASEURL);

mongoose.connect(process.env.DATABASEURL, {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("connected to DB");
}).catch(err => {
	console.log("ERROR", err);
});

	mongoose.set('useNewUrlParser', true);
	mongoose.set('useFindAndModify', false);
	mongoose.set('useCreateIndex', true);
	mongoose.set('useUnifiedTopology', true);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
	console.log("YelpCamp server working");
});