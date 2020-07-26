var express = require("express"),
	router = express.Router({mergeParams: true}),
	Campground = require("../models/campgrounds"),
	Comment = require("../models/comment"),
	middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: foundCampground});
		}
	})
	
})

router.post("/", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
					res.redirect("/campgrounds");
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					foundCampground.comments.push(comment);
					foundCampground.save();
					req.flash("success", "You just submitted the comment");
					res.redirect("/campgrounds/" + req.params.id);
				}
			})
		}
	})
})

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		Comment.findById(req.params.comment_id, function(err, foundComment){	
			res.render("comments/edit", {campground: foundCampground, comment: foundComment});
		});
	});
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment){
			req.flash("success", "You just edited the comment");
			res.redirect("/campgrounds/" + req.params.id);
		})
	})
})

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		Comment.findByIdAndRemove(req.params.comment_id, function(err){
			req.flash("success", "You just deleted the comment");
			res.redirect("/campgrounds/" + req.params.id);
		})
	})
});

module.exports = router;