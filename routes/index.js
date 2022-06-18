var express = require('express');
var router = express.Router();
const User=require('../models/User');
const Student=require('../models/Student');

/* GET home page. */
router.get('/', function(req, res, next) {
  var today = new Date().toLocaleDateString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    weekday: 'long'
});

  console.log(today,'llllllllllll')
  res.render('index', { title: 'collegeManagementSys' });
});

//******************************* GET Logi Html Page */
router.get('/login', function(req, res, next) {
  res.render('login');
});


//******************************* GET signup */
router.get('/signup', function(req, res, next) {
  res.render('signup');
});

//******************************* student feedes */
router.get('/feedes/:id', function(req, res, next) {
  res.render('studentFeeds');
});

//******************************* all student of the same level of id */
router.get('/students/:id', function(req, res, next) {
  res.render('students');
});


//******************************* all student posts by level */
router.get('/posts/:level', function(req, res, next) {
  res.render('feedesByLevel');
});


//******************************* all student posts */
router.get('/docDashBoard/:id', function(req, res, next) {
  res.render('docDashBoard');
});

//******************************* all student posts */
router.get('/profile/:id', function(req, res, next) {
  res.render('profile');
});


//******************************* create quiz */
router.get('/createQiz/:id', function(req, res, next) {
  res.render('createQiz');
});

//******************************* create quiz */
router.get('/quiz/:id', function(req, res, next) {
  res.render('quizSolution');
});


//******************************* get quetions*/
router.get('/quizes/:id', function(req, res, next) {
  res.render('allQuizes');
});


//******************************* marks sheet */
router.get('/markSheet/:id', function(req, res, next) {
  res.render('marksSheet');
});


//******************************* all doctors */
router.get('/doctors/:id', function(req, res, next) {
  res.render('doctor');
});

//******************************* student Material */
router.get('/materials/:id', function(req, res, next) {
  res.render('studentMaterials');
});

//******************************* doctor upload material*/
router.get('/uploadMaterial/:id', function(req, res, next) {
  res.render('createMaterial');
});

//*******************************quizes with result*/
router.get('/myQuizes/:id', function(req, res, next) {
  res.render('QuizesWithResults');
});

//*******************************quizes with result*/
router.get('/quizResult/:id', function(req, res, next) {
  res.render('marksSheet');
});



//*******************************Events*/
router.get('/events', function(req, res, next) {
  res.render('events');
});


//*******************************add Doctor*/
router.get('/addDoc', function(req, res, next) {
  res.render('addDoc');
});


//*******************************adminStudents*/
router.get('/adminStudents', function(req, res, next) {
  res.render('adminStudents');
});

//*******************************all messages*/
router.get('/messages', function(req, res, next) {
  res.render('messages');
});

//*******************************chat */
router.get('/chat/:id', function(req, res, next) {
  res.render('chat');
});






module.exports = router;
