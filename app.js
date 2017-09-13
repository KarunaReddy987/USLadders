var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var expressValidator= require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['jobs']);
var ObjectId = mongojs.ObjectId;



//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


app.use(function(req,res,next){
	res.locals.errors = null;
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
app.get('/applyJob', function (req, res) {
	res.render('applyJob', {
		title: 'USLadders'
	});
});
app.get('/findingJob', function(req,res){
	db.jobs.find(function (err, docs) {
		if (!err) {
			res.render('findingJob', {
				title: 'USLadders',
				jobs: docs
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

app.post('/jobs/add', function(req,res){

	req.checkBody('company_name', 'First Name is required').notEmpty();
	req.checkBody('company_id', 'Last Name is required').notEmpty();
	req.checkBody('employee_name', 'Email is required').notEmpty();
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
		job_description: req.body.job_description,
		job_category: req.body.job_category,
		qualifications: req.body.qualifications,
		experience: req.body.experience,
		contact_details: req.body.contact_details

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

app.listen(3000, function(){
	console.log('Express started');
});
