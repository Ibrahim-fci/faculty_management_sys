var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose=require('mongoose');
var app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const flash=require('connect-flash');
const cors=require('cors')
const socketio = require('socket.io');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const apiRouter=require('./routes/api');
const localdb = "mongodb://localhost/collegeSys";  ///database path of local storage
const herokudb="mongodb://heroku_grqts9xv:tfrrn4uu3p1psval57p18i6vmj@ds157682.mlab.com:57682/heroku_grqts9xv" ;///database path of real server storage

//
const { check, validationResult, body } = require("express-validator"); //for inputs fileds validation
const Student = require("./models/Student");
const Admin = require("./models/Admin");
const Doctor = require("./models/doctor");
const fileUploader=require('./midelware/fileUploader');
const Message = require('./models/Message')
// const domainName='http://localhost:3000/api/fileByName/'
const domainName='http://fciapi.herokuapp.com/api/fileByName/'
/////////////////////************ */ WWWW ************************************************//


/**
 * Module dependencies.
 */

var debug = require('debug')('api:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
const io = socketio(server);
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


/////////////////////************ */ WWWW ************************************************//



app.use(cors()) 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

             // to enable cross-origin request to this server
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(flash());
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));


  
  mongoose.connect(localdb,{useNewUrlParser:true,useUnifiedTopology:true},(err)=>{
    try{
      console.log("db Connected.....");
    }catch(ex){
      console.log("Error in connected to db!!!!!!!!!");
    }
  // if(err){
  //   console.log("Error in connected to db!!!!!!!!!");
  // }else{
  //   console.log("db Connected.....");
  // }
  })
 

////////*************************************** Set Routers paths */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api',apiRouter);


//********************************** Routers  */
/// Create Event  By Admin */ 2
app.post('/api/addMessage',fileUploader.upload.any('files'),[
  check("senderId").not().isEmpty().withMessage("senderId is Required"),
  check("reciverId").not().isEmpty().withMessage("reciverId is Required"),
  check("message").not().isEmpty().withMessage("message is Required"),
  check("messageType").not().isEmpty().withMessage("messageType is Required"),
],async(req,res)=>{
 const errors= await validate(req);  
  if(errors) return res.status(400).send({message:errors,success: false}) // validation errors

  //*********************** check if post is spaces or empty */

  //check is valid id format or not
  if (!mongoose.Types.ObjectId.isValid(req.body.senderId))  return res.status(404).send({message:"invalid senderId",success:false});
  if (!mongoose.Types.ObjectId.isValid(req.body.reciverId))  return res.status(404).send({message:"invalid senderId",success:false});

  //get sender and check if he found or not
  let user= await Admin.findById(req.body.senderId);
  if(!user) user= await Student.findById(req.body.senderId);
  if(!user) user= await Doctor.findById(req.body.senderId);
  if(!user) return res.status(404).send({message:"senderId not belongs to nither student nor Doctor nor Admin",success:false});


    //get reciver and check if he found or not
    let user1= await Admin.findById(req.body.reciverId);
    if(!user1) user1= await Student.findById(req.body.reciverId);
    if(!user1) user1= await Doctor.findById(req.body.reciverId);
    if(!user1) return res.status(404).send({message:"reciverId not belongs to nither student nor Doctor nor Admin",success:false});


   //get day of now
    const date=(await getDate()).toString();
    const sortDate=new Date()

    const newMessage = new Message({
      content:req.body.message,
      sender:req.body.senderId,
      reciver:req.body.reciverId,
      timestemp:date,
      sortDate:sortDate,
      messageType:req.body.messageType,
      read:false
    })

    if(req.files){
      console.log(req.files)
      for(let i =0 ; i < req.files.length ; i++){
        newMessage.images.push(domainName+req.files[i].filename)
      }
    }

    const doc = await newMessage.save()
    if(!doc) return res.status(400).send({message:"Bad Reaquest",success:false})

    const isInMyContact = user.contacts.includes(user1._id)
    if(!isInMyContact) user.contacts.push(user1._id)

    const isInMyContact2 = user1.contacts.includes(user._id)
    if(!isInMyContact2) user1.contacts.push(user._id)

    const docUser =await user.save()
    const docUser1 =await user1.save()

    //Emit BroadCast Event
    io.sockets.emit('newMessage',doc);

 return res.status(200).send({message:"message added successfully",theNewMessage:doc,success:true})


})


//********************************** Routers  */



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


/////////////////*************** Socket Area */************************* */
io.on('connection', (socket) => {
  socket.on("typing",(data)=>{
    io.sockets.emit("userTyping",data);
  })

  

  socket.on("recording",(data)=>{
    io.sockets.emit("userRecording",data);
  })
})


/////////////////*************** Helper Method*/********************* */

//function to get inputs validation errors
function validate(req){
  //parameters validation
  const ErrorMessages = validationResult(req);
  const Errors = [];
  if (!ErrorMessages.isEmpty()) {
    for (let i = 0; i < ErrorMessages.errors.length; i++) {
      Errors.push(ErrorMessages.errors[i].msg);
    }
     return Errors;
  }
}

//function to get the  date of now
async function getDate(){
  const date = new Date();
  const day = date.toLocaleString(undefined, { day: "numeric" });
  const month = date.toLocaleString(undefined, { month: "numeric" });
  const year = date.toLocaleString(undefined, { year: "numeric" });
  let hours = parseInt(date.getHours());
  const m = date.getMinutes();
  const s = date.getSeconds();
  let strampm;
  if (hours >= 12) {
    strampm = "PM";
  } else {
    strampm = "AM";
  }
  hours = hours % 12;
  if (hours == 0) {
    hours = 12;
  }
  const dateFormat =
    day +
    "/" +
    month +
    "/" +
    year +
    "  At " +
    hours +
    ":" +
    m +
    ` ${strampm}`;

    return dateFormat;
}

/////////////////*************** Helper Method**/********************* */

module.exports = app;
