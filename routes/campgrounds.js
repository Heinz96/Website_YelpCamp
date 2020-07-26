var express = require("express"),
	router = express.Router(),
	Campground = require("../models/campgrounds"),
	Comment = require("../models/comment"),
	middleware = require("../middleware/index");

router.get("/", function(req, res){	
	Campground.find({}, function(err, allCampgrounds){
		if (err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	})
	
});

router.post("/", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user.id,
		username: req.user.username
	}
	var newCampground = {name: name, image: image, description: desc, author: author};
	Campground.create(newCampground, function(err, newlyCreated){
		if (err){
			console.log(err);
		} else {
			req.flash("success", "You just created a new campground!");
			res.redirect("/campgrounds");
		}
	})
})

router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if (err){
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});	
		}
	});	
})

//EDIT CAMPGROUND

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//UPDATE CAMPGROUND

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, editedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "You just edited the campground" + req.body.campground.name);
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "You just deleted the campground");
			res.redirect("/campgrounds");
		}
	})
})




module.exports = router;
