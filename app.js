var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var expressValidator= require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['jobs']);
var db1 = mongojs('customerapp', ['users']);
var db2 = mongojs('customerapp', ['userprofiles']);
var db3 = mongojs('customerapp', ['userApplication']);
var ObjectId = mongojs.ObjectId;
var session = require('express-session');
var formidable = require('formidable');
var multer = require('multer');
var upload = require("express-fileupload");
var fs = require('fs');
var async = require('async');

app.use(upload());


// Use the session middleware
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 36000000000000 }, resave: true, saveUninitialized: true }))

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


app.use(function(req,res,next){
	res.locals.errors = null;
	res.locals.user = req.session.user;
	next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'client')));

//Express Validator Middleware

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.get('/', function(req,res){
res.render('index',{
	title:'USLadders'
});
});

app.get('/login', function (req, res) {
	res.render('login', {
		title: 'USLadders'
	});
});

app.get('/register', function (req, res) {
	res.render('register', {
		title: 'USLadders'
	});
});

app.get('/postingJob', function(req,res){
	db.jobs.find(function(err,docs){
		if(!err){
			res.render('postingJob', {
			title: 'USLadders',
			jobs: docs
		});
	}
	else{

	}
	})
});

app.get('/about', function (req, res) {
res.render('about',{
	title:'USLadders'
});
});

app.get('/seemore', function (req, res) {
res.render('seemore',{
	title:'USLadders'
});
});


app.get('/applyJob', function (req, res) {


	res.sendFile(__dirname + "/views");
});


app.get('/jobs/apply/:id', function (req, res) {
    console.log('karuna');
    db.jobs.findOne({ _id: ObjectId(req.params.id) }, function (err, result) {
        var id = ObjectId(req.params.id);

        if (err) {
            console.log(err);
        }
        else {
            res.send("<center><h1>User Already Exists :-( </h1></center>");
            console.log(id);

        }
    });
});


app.get('/applyJob/:id', function (req, res) {
	let wher = {};

	db.jobs.findOne({ _id: ObjectId(req.params.id) }, function (err, result) {
		wher.ide = ObjectId(req.params.id);


		console.log(wher);
		db.jobs.find({ _id: wher.ide }, function (err, docs) {
			if (!err) {
				res.render('applyJob', {
					title: 'USLadders',
					jobs: docs, wher: wher
				});
			}
			else {

			}
		})


	});
});
let resumeLink;
app.post("/upload/resume/:id", multer({ dest: './uploads/' }).single('upl'), function (req, res) {
    console.log("resume");

                if (req.files) {
                    var file = req.files.resume;
                    var filename = file.name;
                    resumeLink = "./upload/resume/" + filename;
                    file.mv("./upload/resume/" + filename, function (err) {
                        if (err) {
                            console.log(err)
                            res.send({ success: false, err: err });
                        }
                        else {
                            res.send({ success: true });
                        }
                    }
                    )

            }

});


let cvLink;
app.post("/upload/cv/:id", multer({ dest: './uploads/' }).single('upl'), function (req, res) {

    console.log("coverletter");

	if (req.files) {
		var file = req.files.cv;
        var filename = file.name;
        cvLink = "./upload/cv/" + filename;
        file.mv("./upload/cv/" + filename, function (err) {
			if (err) {
				console.log(err)
				res.send({ success: false, err: err });
			}
			else {
				res.send({ success: true });
			}
		}
		)
	}
});

app.post('/applications/add/:id', function (req, res) {
    let wher = {};

    console.log("jobApplication");
    db.jobs.findOne({ _id: ObjectId(req.params.id) }, function (err, result) {
        wher.ide = ObjectId(req.params.id);
				//wher.uname = user.user_name;

				req.checkBody('user_name', 'Uname is required').notEmpty();
				req.checkBody('job_title', 'Title is required').notEmpty();

        console.log(wher);
        db.jobs.find({ _id: wher.ide }, function (err, docs) {
            if (!err) {
                console.log(resumeLink);
                console.log(cvLink);
                var newApplication = {
                    jobID: wher.ide,
										user_name: req.session.user.username,
										//jobTitle : req.body.job_title,
                    resumeLink: resumeLink,
                    cvLink: cvLink

                }

                db3.userApplication.insert(newApplication, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("new data is entered");
                        res.redirect('/applicationSuccess');
                    }
                });

            }
        });
    });
});


app.get('/findingJob', function (req, res) {

	let where = {};
	if (req.query.category != "all" && req.query.category != null) {
		where.job_category = req.query.category;
	}

	if (req.query.expr != "any" && req.query.expr != null) {
		where.experience = req.query.expr;
	}
	console.log(where);
	db.jobs.find(where, function (err, docs) {
		if (!err) {
			res.render('findingJob', {
				title: 'USLadders',
				jobs: docs, where: where
			});
		}
		else {

		}
	})

});

app.get('/companiesDetail', function (req, res){
    res.render('companiesDetail',{

		});
});

app.get('/resources', function(req,res){
res.render('resources',{
	title:'USLadders'
});
});

app.get('/sampleResumes', function(req,res){
	res.render('sampleResumes',{
		title:'USLadders'
	});
});

app.get('/coverLetters', function(req,res){
	res.render('coverLetters',{
		title:'USLadders'
	});
});


app.get('/sampleResumeStudent', function(req,res){
	res.render('sampleResumeStudent',{
		title:'USLadders'
	});
});

app.get('/logout', function (req, res) {
	req.session.user = null;
	res.redirect("/");
});
app.get('/applicationSuccess', function (req, res) {
	res.render('applicationSuccess',{
		title:'USLadders'
	});
});


app.post('/users/add', function (req, res) {

	req.checkBody('username', 'User Name is required').notEmpty();
	req.checkBody('email', 'User Name is required').notEmpty();
	req.checkBody('password', 'User Name is required').notEmpty();
	req.checkBody('confirmpassword', 'User Name is required').notEmpty();


	var errors = req.validationErrors();

	if (errors) {
		res.render('login', {
			title: 'Customers',
			users: users,
			errors: errors
		});
	}
	else {
		var newUser = {
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			confirmpassword: req.body.confirmpassword

		}
		db1.users.findOne({
			username: newUser.username
		}, function (err, result) {
			console.log(result);
			if (result === null) {
				db1.users.insert(newUser, function (err, result) {
					if (err) {
						console.log(err);
					}
					else {
						console.log("new data is entered");
						res.redirect('/login');
					}
				});
			}
			else {
				res.send("<center><h1>User Already Exists :-( </h1></center>");
			}
		});

	}

});

app.post('/login', function (req, res) {

	var user = req.body.uname;
	var pass = req.body.pwd;



	req.checkBody('uname', 'Password is required').notEmpty();

	req.checkBody('pwd', 'User Name is required').notEmpty();

	var errors = req.validationErrors();




	db1.users.findOne({ username: user, password: pass }, function (err, result) {
		var errors = req.validationErrors();
		if (errors) {
			res.render('login', {
				title: 'Customers',
				users: users,
				errors: errors

			});
		}
		else {
			if (result !== null) {
				console.log("Login Successful");
				req.session.user = result;
				res.redirect('/');
			}
			else {
				res.send("Invalid Credentials :-(");
			}
		}
	});
});

app.post('/jobs/add', function(req,res){

	req.checkBody('company_name', 'First Name is required').notEmpty();
	req.checkBody('company_id', 'Last Name is required').notEmpty();
	req.checkBody('employee_name', 'Email is required').notEmpty();
	req.checkBody('job_title', 'title is required').notEmpty();
	req.checkBody('user_name', 'Email is required').notEmpty();

	req.checkBody('job_category', 'Category is required').notEmpty();
		req.checkBody('job_description', 'Description is required').notEmpty();
		req.checkBody('qualifications', 'Qualifications are required').notEmpty();
		req.checkBody('experience', 'Experience is required').notEmpty();
		req.checkBody('contact_details', 'Contact are required').notEmpty();


	var errors = req.validationErrors();

	if(errors){
        res.render('postingJob', {
		title: 'Customers',
		jobs: jobs,
		errors: errors
	});
}
	else{
		var newUser = {
		company_name : req.body.company_name,
		company_id : req.body.company_id,
		employee_name : req.body.employee_name,
		job_title : req.body.job_title,
		job_description: req.body.job_description,
		job_category: req.body.job_category,
		qualifications: req.body.qualifications,
		experience: req.body.experience,
		contact_details: req.body.contact_details,
		user_name: req.body.user_name
		}

db.jobs.insert(newUser,function (err,result) {
	if(err){
		console.log(err);
	}
	else{
		res.redirect('/postingJob');
	}
})
	}

	});

app.delete('/jobs/delete/:id', function(req,res){
	db.jobs.remove({_id: ObjectId(req.params.id)}, function(err,result){
 if(err){
 	console.log(err);
 }
 else{
 	res.redirect('/postingJob');
 }
	});
});

app.get('/accountSettings', function (req, res) {
    res.render('accountSettings', {
        title: 'USLadders'
    });
});


app.post('/account-change', function (req, res) {
	req.checkBody('user_name', 'User Name is required').notEmpty();
	req.checkBody('pass_1', 'Present password is required').notEmpty();
	req.checkBody('pass_2', 'New password is required').notEmpty();
	var errors = req.validationErrors();

	if (errors) {
		res.render('accountSettings', {
			title: 'Customers',

			errors: errors
		});
		console.log('kajsck');
	}
	else {
		var username = req.body.user_name;
		var password = req.body.pass_1;
		var password_new = req.body.pass_2;


		db1.users.update({ "username": username }, { $set: { "password": password_new } }, function (err, result) {
			var errors = req.validationErrors();
			if (errors) {
				res.render('accountSettings', {
					title: 'CustomerApp',
					errors: errors

				});
			}
			else {
				if (result !== null) {

					console.log("Change Successful");
					res.redirect('/accountSettings');
				}
				else {
					res.send("Invalid Credentials :-(");
				}
			}
		});

	}


});


app.get('/updateProfile', function (req, res) {
	db2.userprofiles.find(function (err, docs) {
		if (!err) {
			res.render('updateProfile', {
				title: 'USLadders',
				userprofiles: docs
			});
		}
		else {

		}
	})
});

app.post('/userprofiles/add', function(req,res){

	req.checkBody('first_name', 'First Name is required').notEmpty();
	req.checkBody('last_name', 'Last Name is required').notEmpty();
	req.checkBody('address', 'Email is required').notEmpty();
	req.checkBody('phone', 'Category is required').notEmpty();
	req.checkBody('email', 'Description is required').notEmpty();
	req.checkBody('highest_degree', 'Qualifications are required').notEmpty();
	req.checkBody('experience', 'Experience is required').notEmpty();
	req.checkBody('inlineRadioOptions', 'Contact are required').notEmpty();
	req.checkBody('university', 'Contact are required').notEmpty();
	req.checkBody('job_preference', 'Contact are required').notEmpty();


	var errors = req.validationErrors();

	if(errors){
        res.render('updateProfile', {
		title: 'Customers',
		userprofiles: userprofiles,
		errors:errors
	});
}
	else {
		var count = 0 ;
		var newUser1 = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			address: req.body.address,
			phone: req.body.phone,
			email: req.body.email,
			highest_degree: req.body.highest_degree,
			inlineRadioOptions: req.body.inlineRadioOptions,
			experience: req.body.experience,
			university: req.body.university,
			job_preference: req.body.job_preference,
			count:count+1

		}
		db2.userprofiles.insert(newUser1, function (err, result) {
			count = count + 1;
				if (err) {
					console.log(err);
				}
				else {
					res.redirect('/viewProfile');
				}
			})
		
	}

	});


app.get('/jobsApplied', function (req, res) {
	let values = [];
	let documents = [];
	db3.userApplication.find({ user_name: req.session.user.username }, function (err, docs) {

		if (!err) {
			let newDocs = [];
			/*
			let i = 0, j = 0;
			for (i = 0, j=0; i < docs.length; i++) {
				let userA = {};
				userA.apl = docs[i];
				db.jobs.findOne({ _id: docs[i].jobID }, function (err, job_result) {
					console.log('job_result', job_result);
					userA.job_desc = job_result;
					j++;
					newDocs.push(userA);
				});
				
			}
			*/
			async.each(docs, function (doc, callback) {
				let userA = {};
				userA.apl = doc;
				db.jobs.findOne({ _id: doc.jobID }, function (err, job_result) {
					console.log('job_result', job_result);
					userA.job_desc = job_result;
					newDocs.push(userA);
					callback();
				});
			}, function (err) {
				if (err) {
					console.log('err - newDocs', newDocs);
				} else {
					console.log('newDocs', newDocs);
					res.render('jobsApplied', {
						title: 'USLadders',
						userApplications: newDocs
					});
				}
				});
			
			
				
			
		}
		
		/*
		if (!err) {
			docs.forEach(function (document) {
				values += document.jobID;

			});
			console.log("values" + values);
			for (var i = 0; i < itemIds.length; i++) {


				//  collection.findOne({'_id':new BSON.ObjectID(itemIds[i])}, function(err, item) {


			db.jobs.find( {'_id':new BSON.ObjectID(itemIds[i])},function (err, results) {
				//console.log(docs.jobID);
				itemsArray.push(results);
			 //  if(user.username == job.user_name) {
			 //   values.JOBID = job.jobID }
			  });

				res.render('jobsApplied', {
				title: 'USLadders',
				userApplications: docs,
				jobdetails : itemsArray,
				values : values

 });
}
	}
		else {

			
			}
		*/
			
		
	});

});

app.get('/jobsPosted', function (req, res) {
	db.jobs.find(function (err, docs) {
		if (!err) {
			res.render('jobsPosted', {
				title: 'USLadders',
				jobs: docs
			});
		}
		else {

		}
	})
});


app.get('/viewProfile', function (req, res) {
	db2.userprofiles.find({ count: 1 }, function (err, profiles) {
		if (!err) {
			res.render('viewProfile', {
				title: 'USLadders',
				userprofiles: profiles
			});
			console.log(profiles);

		}
		else {

		}
	})
});


app.listen(3015, function(){
	console.log('Express started');
});
