// const Post = require("../models/post");
// const Student = require("../models/Student");
// const bcrypt = require("bcryptjs"); // model for incrypt&decrypt  password
// const { check, validationResult } = require("express-validator"); //for inputs fileds validation
// const multer = require("multer"); //for uploading images from local computing
// const GridFsStorage = require("multer-gridfs-storage");
// const nodemailer = require("nodemailer"); //model for e-mail
// const mongoose = require("mongoose");
// const crypto = require("crypto"); //model for generate strong random variable
// const questoion = require("../models/quesiton");
// const Quiz = require("../models/quiz");
// const Doctor = require("../models/doctor");
// const Result = require("../models/quizResult");
// //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& const declartion&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

// let vrivicationCode = 0; //Code generated to send if student forget his password
// let stID;
// let chConfirm = 1;

// const mongoURI ="mongodb://heroku_grqts9xv:tfrrn4uu3p1psval57p18i6vmj@ds157682.mlab.com:57682/heroku_grqts9xv";
// // const mongoURI = "mongodb://localhost/collegeSys";
// const conn = mongoose.createConnection(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// let gfs;

// conn.once("open", () => {
//   //init stream

//   gfs = new mongoose.mongo.GridFSBucket(conn.db, {
//     bucketName: "uploads"
//   });
// });

// //=====================================//Validation//============================
// const asddStudentValidation = [
//   check("email")
//     .not()
//     .isEmpty()
//     .withMessage("Email Can not be Empty"),
//   check("email")
//     .isEmail()
//     .withMessage("Email Not Correct.."),
//   check("password")
//     .not()
//     .isEmpty()
//     .withMessage("Password can not be Empty"),
//   check("password")
//     .isLength({ min: 5, max: 15 })
//     .withMessage("minimum password length is 5 character"),

//   check("Name")
//     .not()
//     .isEmpty()
//     .withMessage("user name can not be Empty"),
//   check("Name")
//     .isLength({ min: 5, max: 20 })
//     .withMessage("minimum UserName length is 5  & maximum is 20 character "),
//   check("Dept")
//     .not()
//     .isEmpty()
//     .withMessage("Department is required"),
//   check("grade")
//     .not()
//     .isEmpty()
//     .withMessage("Grade is required"),
//   check("Dof")
//     .not()
//     .isEmpty()
//     .withMessage("Date of birth is required"),
//   check("city")
//     .not()
//     .isEmpty()
//     .withMessage("City is required"),
//   check("address")
//     .not()
//     .isEmpty()
//     .withMessage("address is required"),
//   check("gender")
//     .not()
//     .isEmpty()
//     .withMessage("Gender is required")
// ];

// const forgetValidation = [
//   check("email")
//     .isEmail()
//     .withMessage("Invalid Email")
// ];

// const changePasswordValidation = [
//   check("id")
//     .isEmpty()
//     .withMessage("password is Required"),
//   check("password")
//     .isEmpty()
//     .withMessage("id Required")
// ];

// const quizCreateValidation = [
//   check("question")
//     .not()
//     .isEmpty()
//     .withMessage("You must Insert A quesion"),
//   check("answer")
//     .not()
//     .isEmpty()
//     .withMessage("You must Insert A answer"),
//   check("op1")
//     .not()
//     .isEmpty()
//     .withMessage("You must Insert 2 option at least (a,b)"),
//   check("op2")
//     .not()
//     .isEmpty()
//     .withMessage("You must Insert 2 option at least (a,b)"),
//   check("quizTitle")
//     .not()
//     .isEmpty()
//     .withMessage("You must choose Quiz Name"),
//   check("level")
//     .not()
//     .isEmpty()
//     .withMessage("You must choose a Student level ")
// ];

// const addQuestionToQuizValidation = [
//   check("question")
//     .not()
//     .isEmpty()
//     .withMessage("You must Insert A quesion"),
//   check("answer")
//     .not()
//     .isEmpty()
//     .withMessage("You must Insert A answer"),
//   check("op1")
//     .not()
//     .isEmpty()
//     .withMessage("You must Insert 2 option at least (a,b)"),
//   check("op2")
//     .not()
//     .isEmpty()
//     .withMessage("You must Insert 2 option at least (a,b)"),
//   check("quizId")
//     .not()
//     .isEmpty()
//     .withMessage("You must Insert Quiz Id"),
//   check("doctorId")
//     .not()
//     .isEmpty()
//     .withMessage("You must Insert  quiz creator Id")
// ];

// const loginValidation = [
//   check("email")
//     .isEmpty()
//     .withMessage("email is Required"),
//   check("email")
//     .isEmail()
//     .withMessage("invalid email format"),
//   check("password")
//     .isEmpty()
//     .withMessage("id Required"),
//   check("title")
//     .isEmpty()
//     .withMessage("id Required")
// ];

// const updateValidation = [
//   check("password")
//     .not()
//     .isEmpty()
//     .withMessage("Password can not be Empty"),
//   check("password")
//     .isLength({ min: 5, max: 15 })
//     .withMessage("minimum password length is 5 character"),
//   check("newpassword")
//     .not()
//     .isEmpty()
//     .withMessage("New password is required")
// ];

// const corectQuizValidation = [
//   check("studentId")
//     .isEmpty()
//     .withMessage("studentId is Required"),
//   check("quizId")
//     .isEmpty()
//     .withMessage("quizIdRequired"),
//   check("result")
//     .isEmpty()
//     .withMessage("id Required")
// ];
// //=========================================method to check if input is spaces===================////
// function isNullOrEmpty(str) {
//   return !str || !str.trim();
// }

// ////////////////////////////////Encrypt and Decrypt Password////////////////////////////////////
// function hashPassword(password) {
//   var salt = bcrypt.genSaltSync(10);
//   return bcrypt.hashSync(password, salt);
// }

// function ComparePassword(password, passwordDB) {
//   return bcrypt.compareSync(password, passwordDB);
// }

// ///////////////////validation func//////////////////
// function validationFunc(req, res) {
//   const ErrorMessages = validationResult(req);
//   const temp = [];
//   if (!ErrorMessages.isEmpty()) {
//     for (i = 0; i < ErrorMessages.errors.length; i++) {
//       temp.push(ErrorMessages.errors[i].msg);
//     }
//     return res.status(400).send({ message: temp[0], success: false });
//   } else {
//     return;
//   }
// }
// /////////////////get All students/////////////////////////
// async function getStudents(req, res) {
//   const result = await Student.find({});
//   res.send({ info: result });
// }

// /////////////get All posts////////////////////////////////
// async function getPosts(req, res) {
//   let result = await Post.find({});
//   result=result.reverse();
//   res.send({ info: result });
// }

// //////////gat A post//////////////////////////////////
// async function getPost(req, res) {
//   if (mongoose.Types.ObjectId.isValid(req.body.id)) {
//     //................../check if id empty....???????????????
//     const post = await Post.findById(req.body.id);
//     if (post) {
//       res.json(post);
//     } else {
//       return res
//         .status(404)
//         .send({ status: "This Post Not Found Check your id", Success: false });
//     }
//   } else {
//     return res.status(400).send({ status: "Invalid Id", Success: false });
//   }
// }

// //.....................kkk
// async function getPost44(req, res) {
//   if (mongoose.Types.ObjectId.isValid(req.params.id)) {
//     //................../check if id empty....???????????????
//     const post = await Post.findById(req.params.id);
//     if (post) {
//       res.json(post);
//     } else {
//       return res
//         .status(200)
//         .send({ status: "This Post Not Found Check your id", Success: false });
//     }
//   } else {
//     return res.status(200).send({ status: "Invalid Id", Success: false });
//   }
// }

// //////////gat A student//////////////////////////////////
// async function getStudent(req, res) {
//   if (mongoose.Types.ObjectId.isValid(req.params.id)) {
//     const student = await Student.findById(req.params.id);
//     if (student) {
//       res.json(student);
//     } else {
//       return res.status(404).send({
//         status: "This Student Not Found Check your id",
//         Success: false
//       });
//     }
//   } else {
//     return res.status(400).send({ status: "Invalid id ", Success: false });
//   }
// }

// ///////////get student by Email////////////
// async function getPostByEmail(req, res) {
//   if (req.params.email) {
//     const student = await Student.findOne({ Email: req.params.email });
//     if (student) {
//       res.json(student);
//     } else {
//       return res.status(404).send({
//         status: "This Student Not Found Check your id",
//         Success: false
//       });
//     }
//   }else{
//     return res.status(400).send({
//       status: "This Student Not Found Check your id",
//       Success: false
//     })
//   }
// }

// //////////post add post//////////////////////////////////
// async function postAddPost(req, res) {
//   if (!req.body.studentId)
//     return res
//       .status(400)
//       .send({ message: "you must send student id", success: false });
//   if (isNullOrEmpty(req.body.postContent))
//     return res
//       .status(400)
//       .send({ message: "Post can not be empty or spaces", success: false });

//   const student = await Student.findOne({ _id: req.body.studentId });
//   if (student) {
//     const date = new Date();
//     const day = date.toLocaleString(undefined, { day: "numeric" });
//     const month = date.toLocaleString(undefined, { month: "numeric" });
//     const year = date.toLocaleString(undefined, { year: "numeric" });
//     let hours = date.getHours();
//     const m = date.getMinutes();
//     const s = date.getSeconds();
//     let strampm;
//     if (hours >= 12) {
//       strampm = "PM";
//     } else {
//       strampm = "AM";
//     }
//     hours = hours % 12;
//     if (hours == 0) {
//       hours = 12;
//     }
//     const dateFormat =
//       day +
//       "/" +
//       month +
//       "/" +
//       year +
//       "  At " +
//       hours +
//       ":" +
//       m +
//       ` ${strampm}`;
//     const post = new Post({
//       content: req.body.postContent,
//       timestemp: dateFormat,
//       postCreator: student
//     });

//     post.save((err, doc) => {
//       if (err)
//         return res.status(400).send({ message: "Bad Request", success: false });
//       if (doc) {
//         student.posts.push(post._id);
//         student.save();
//         return res.status(200).send({
//           message: `post added sucssefully by ${student.Name} student`,
//           success: true
//         });
//       }
//     });
//   } else {
//     return res
//       .status(404)
//       .send({ message: "Student Not found", success: false });
//   }
// }

// //============================helpLogin================
// async function helpLoginFunc(req, res, schema) {
//   const user = await schema.findOne({ Email: req.body.email });
//   //check if this email  exists or not in db

//   if (user) {
//     if (ComparePassword(req.body.password, user.Password)) {
//       //set user session Id with student id
//       req.session.userId = user._id;
//       return res.status(200).send({ message: "Success", success: true });
//     } else {
//       return res
//         .status(400)
//         .json({ message: "Invalid Email Or Password", success: false });
//     }
//   } else {
//     return res
//       .status(400)
//       .json({ message: "Invalid Email Or Password", success: false });
//   }

//   //.................................
// }

// /////////login/////////////////////////////////
// async function login(req, res) {
//   const ErrorMessages = validationResult(req);
//   const temp = [];

//   if (!ErrorMessages.isEmpty()) {
//     for (i = 0; i < ErrorMessages.errors.length; i++) {
//       temp.push(ErrorMessages.errors[i].msg);
//     }
//     return res.status(400).send({ message: temp, success: false });
//   }
//   if (req.body) {
//     if (req.body.title == "Student") {
//       helpLoginFunc(req, res, Student);
//     } else if (req.body.title == "Doctor") {
//       //..............doc login..................
//       helpLoginFunc(req, res, Doctor);
//     } else {
//       return res.status(404).send({
//         message:
//           "This Title Not Found Choose one of(Student,Doctor,Admin) Titls",
//         success: false
//       });
//     }
//   } else {
//     return res.status(404).send({
//       message:
//         "email and password and title(Student, Doctor,Admin) is required",
//       success: false
//     });
//   }
// }



// //===========================//post addStudent//========
// async function postAddStudent(req, res) {
//   const errors = validationResult(req);
//   const temp = [];
//   //if ther is errors from inputs file validation
//   if (!errors.isEmpty()) {
//     for (i = 0; i < errors.errors.length; i++) {
//       temp.push(errors.errors[i].msg);
//     }
//   }

//   if (!temp.length == 0)
//     return res.status(400).json({ message: `${temp[0]}`, success: false });

//   if (req.body) {
//     const student = await Student.findOne({ Email: req.body.email });
//     if (student)
//       return res.status(400).json({
//         message: "this student is already Existed before!!!!!!!!!",
//         success: false
//       });
//     // account  not found  then  insert  this new account
//     // const studentObj = new Student({
//     //   Name: req.body.Name,
//     //   Email: req.body.email,
//     //   Password: hashPassword(req.body.password).toString(), //hashPassword  is custom function to encrypt&&decrypt password using bcrypt
//     //   Department: req.body.Dept,
//     //   Dof: req.body.Dof,
//     //   grade: req.body.grade,
//     //   ProfileImagePath: "../images/default.png" //this path is adefault image to the user until he update it
//     // });
//     const studentObj = await new Student({
//       Name: req.body.Name,
//       Email: req.body.email,
//       Password: hashPassword(req.body.password).toString(), //hashPassword  is custom function to encrypt&&decrypt password using bcrypt
//       Department: req.body.Dept,
//       Dof: req.body.Dof,
//       grade: req.body.grade,
//       ProfileImagePath: "../images/images (6).jfif", //this path is adefault image to the user until he update it
//       city: req.body.city,
//       Address: req.body.address,
//       Gender: req.body.gender
//     });

//     studentObj.save((err, doc) => {
//       if (err)
//         return res
//           .status(400)
//           .json({ message: `Bad Request error:${err}`, success: false });

//       if (doc)
//         return res
//           .status(200)
//           .send({ message: `Student added successfull `, success: true });
//     });
//   } else {
//     return res.status(400).json({ message: `Bad Request `, success: false });
//   }
// }

// //===========================//make like to post//========
// async function likePost(req, res) {
//   if (
//     mongoose.Types.ObjectId.isValid(req.body.studentId) &&
//     mongoose.Types.ObjectId.isValid(req.body.postId)
//   ) {
//     const student = await Student.findById(req.body.studentId);
//     const post = await Post.findOne({ _id: req.body.postId });
//     if (post) {
//       const duplicate = await post.Likes.find(c => c == req.body.studentId);

//       if (duplicate) {
//         //check if this student make like to this post before
//         post.Likes.pop(p => p == req.body.studentId);
//         student.Likes.pop(p => p == post._id);
//         await post.save();
//         await student.save();
//         return res.status(200).send({ message: "unlike", success: true });
//       } else {
//         ////if student does not make like to this post before
//         post.Likes.push(req.body.studentId);
//         student.Likes.push(post._id);
//         await post.save();
//         await student.save();
//         return res.status(200).send({ message: "like", success: true });
//       }
//     }
//   } else {
//     return res
//       .status(400)
//       .send({ message: "Invalid postId or studentId", success: false });
//   }
// }

// //===========================//get afile=======================
// async function getFile(req, res) {
//   gfs.find({ filename: req.params.filename }).toArray((err, file) => {
//     // check if files
//     if (!file || file.length === 0) {
//       return res
//         .status(404)
//         .send({ message: "this file not found", success: false });
//     } else {
//       gfs.openDownloadStreamByName(req.params.filename).pipe(res);
//       // const ss = fs.readFileSync(req.params.filename);
//       // res.render("Student/profile", { im: ss });
//     }
//   });
// }

// //===================================forget password====================
// async function postForgetPassword(req, res) {
//   const ErrorMessages = validationResult(req);
//   const temp = [];

//   if (!ErrorMessages.isEmpty()) {
//     for (i = 0; i < ErrorMessages.errors.length; i++) {
//       temp.push(ErrorMessages.errors[i].msg);
//     }
//     return res.status(400).send({ message: temp, success: false });
//   }
//   if (req.body.gridRadios == "Student") {
//     const student = await Student.findOne({ Email: req.body.email });
//     if (student) {
//       console.log(student.id);
//       var transporter = nodemailer.createTransport({
//         //create transport to send virefication code to student who forget his password
//         host: "smtp.gmail.com",
//         port: 465,
//         secure: false,
//         service: "gmail",
//         auth: {
//           user: "ibrahimismail00000@gmail.com", //admin Email who will send the virefication code to student
//           pass: "Hh6544567"
//         }
//       });

//       vrivicationCode = crypto //generate random virfication code
//         .randomBytes(20 / 2)
//         .toString("hex")
//         .slice(0, 12);

//       chConfirm = vrivicationCode;
//       stID = await student.id;
//       req.session.stId = await student.id;

//       var mailOptions = {
//         from: "CollegeMangement Admin <ibrahimismail00000@gmail.com>",
//         to: student.Email,
//         subject: "Reseting Student Password",
//         text: "hima said hi to you",
//         html: `<h1>${vrivicationCode}</h1>` // sending code in html shape
//       };

//       transporter.sendMail(mailOptions, async (error, response) => {
//         if (error) {
//           return res.status(400).send(`Bad Request ${error}`);
//         } else {
//           await console.log(`response:${response}`);
//           return res.status(200).send({ code: vrivicationCode, success: true });
//         }
//       });
//     } else {
//       res.status(404).send("this email not registered before");
//     }
//   } else {
//     res.status(400).send("choose correct degree");
//   }
// }

// async function postVerify(req, res) {
//   if (req.body.code === vrivicationCode) {
//     vrivicationCode = 0;
//     chConfirm = 0;
//     const student = await Student.findOne({ _id: req.session.stId });
//     console.log(student);
//     if (student) {
//       return res
//         .status(200)
//         .send({ message: `studentId:${student._id}`, success: true });
//     } else {
//       return res.status(400).send({
//         message: "you must insert email in forget password first ",
//         success: false
//       });
//     }
//   } else {
//     return res.status(400).send({ message: "Invalid Code", success: false });
//   }
// }

// async function postChangePassord(req, res) {
//   if (mongoose.Types.ObjectId.isValid(req.body.id)) {
//     if (req.body.password) {
//       const student = await Student.findById(req.body.id);
//       if (student) {
//         student.Password = hashPassword(req.body.password).toString();
//         await student.save();
//         res.send({ message: "password updated successfully", success: true });
//       } else {
//         res.send({
//           message: "you must verify your code first",
//           success: false
//         });
//       }
//     } else {
//       return res
//         .status(400)
//         .send({ message: "Invalid password", success: false });
//     }
//   } else {
//     return res
//       .status(400)
//       .send({ message: "Invalid student id", success: false });
//   }
// }

// ////create quiz with intial question=====================================================================
// async function createQuiz(req, res) {
//   const ErrorMessages = validationResult(req);
//   const temp = [];

//   if (!ErrorMessages.isEmpty()) {
//     for (i = 0; i < ErrorMessages.errors.length; i++) {
//       temp.push(ErrorMessages.errors[i].msg);
//     }
//     return res.status(400).send({ message: temp[0], success: false });
//   } else {
//     const doctor = await Doctor.findById(req.body.doctorId);
//     if (doctor) {
//       const q = new questoion({
//         //creat initial question in the new quiz
//         question: req.body.question,
//         answer: req.body.answer,
//         option1: req.body.op1,
//         option2: req.body.op2,
//         option3: req.body.op3,
//         option4: req.body.op4
//       });

//       await q.save();
//       const quizz = new Quiz({
//         //create the new quiz with initial question
//         questions: [q],
//         Title: req.body.quizTitle,
//         QuizCreator: req.body.doctorId,
//         Level: req.body.level
//       });

//       await quizz.save();
//       return res.status(200).send({ message: `${quizz._id}`, success: true });
//     } else {
//       return res.status(404).send({
//         message: "This doctor not found check id and try agin",
//         success: false
//       });
//     }
//   }
// }

// //===========add quesion to existed quiz==============================================
// async function addQuestionToQuiz(req, res) {
//   if (validationFunc(req, res)) {
//     //check validation  using express validator
//     return;
//   } else {
//     if (mongoose.Types.ObjectId.isValid(req.body.quizId)) {
//       const quiz = await Quiz.findById(req.body.quizId);
//       if (quiz.QuizCreator == req.body.doctorId) {
//         if (quiz) {
//           const isRedundent = quiz.questions.find(
//             c => c.question == req.body.question
//           );
//           if (isRedundent) {
//             return res.status(400).send({
//               message: "this question is existed before in this quiz",
//               success: false
//             });
//           }
//           if (
//             req.body.answer == "1" ||
//             req.body.answer == "2" ||
//             req.body.answer == "3" ||
//             req.body.answer == "4"
//           ) {
//             const q = new questoion({
//               //creat initial question in the new quiz
//               question: req.body.question,
//               answer: req.body.answer,
//               option1: req.body.op1,
//               option2: req.body.op2,
//               option3: req.body.op3,
//               option4: req.body.op4
//             });

//             await q.save();
//             quiz.questions.push(q);
//             await quiz.save();

//             return res
//               .status(200)
//               .send({ message: `Question added successfully`, success: true });
//           } else {
//             return res.status(400).send({
//               message: `answer must be one of (1,2,3,4)`,
//               success: false
//             });
//           }
//         } else {
//           return res
//             .status(404)
//             .send({ message: `this Quiz Not found`, success: true });
//         }
//       } else {
//         return res.status(400).send({
//           message: `this doctor has no authorizayion to access this quiz`,
//           success: false
//         });
//       }
//     }
//   }
// }

// //=========================get a quiz==============================================
// async function getAquiz(req, res) {
//   if (mongoose.Types.ObjectId.isValid(req.body.id)) {
//     const quiz = await Quiz.findById(req.body.id);
//     if (quiz) {
//       return res.status(200).send({ info: quiz });
//     } else {
//       return res
//         .status(404)
//         .send({ message: "this quiz not found", success: false });
//     }
//   } else {
//     return res.status(400).send({ message: "Invalid Id", success: false });
//   }
// }
// //===============get all doctors===================================================
// async function getDoctor(req, res) {
//   const result = await Doctor.find({});
//   res.send({ info: result });
// }

// //=============profile update ================================================
// async function profileUpdate(req, res) {
//   const ErrorMessages = validationResult(req);
//   const temp = [];

//   if (!ErrorMessages.isEmpty()) {
//     for (i = 0; i < ErrorMessages.errors.length; i++) {
//       temp.push(ErrorMessages.errors[i].msg);
//     }
//     return res
//       .status(400)
//       .send({ message: { validation: temp }, success: false });
//   }

//   if (req.body.title == "Student") {
//     const student = await Student.findOne({ Email: req.body.email });

//     if (student) {
//       if (ComparePassword(req.body.password, student.Password)) {
//         Student.updateOne(
//           { _id: student._id },
//           {
//             $set: {
//               Email: req.body.email,
//               Password: hashPassword(req.body.newpassword).toString()
//             }
//           },
//           (err, doc) => {
//             if (err)
//               return res.status(400).send({ message: { err }, success: false });
//             if (doc)
//               return res.status(200).send({
//                 message: "Student Updated succesfully",
//                 success: true
//               });
//           }
//         );
//       } else {
//         return res
//           .status(400)
//           .json({ message: "Invalid Email Or Password", success: false });
//       }
//     } else {
//       return res
//         .status(404)
//         .send({ message: "This Student Not found", success: false });
//     }
//   } else if (req.body.title == "Doctor") {
//     const doctor = await Doctor.findOne({ Email: req.body.email });
//     if (doctor) {
//       if (ComparePassword(req.body.password, doctor.Password)) {
//         Doctor.updateOne(
//           { _id: doctor._id },
//           {
//             $set: {
//               Email: req.body.email,
//               Password: hashPassword(req.body.newpassword).toString() //hashPassword  is custom function to encrypt&&decrypt password using bcrypt
//               //this path is adefault image to the user until he update it
//             }
//           },
//           (err, doc) => {
//             if (err)
//               return res.status(400).send({ message: { err }, success: false });
//             if (doc)
//               return res
//                 .status(200)
//                 .send({ message: "doctor Updated succesfully", success: true });
//           }
//         );
//       } else {
//         return res
//           .status(400)
//           .json({ message: "Invalid Email Or Password", success: false });
//       }
//     } else {
//       return res
//         .status(404)
//         .send({ message: "This doctor Not found", success: false });
//     }
//   } else {
//     return res.status(404).send({
//       message: "Invalid title you must choose one of (Student,Doctor) ",
//       success: false
//     });
//   }
// }

// //===============================get all quizes======================================
// async function getQuizes(req, res) {
//   const quizes = await Quiz.find({});
//   if (quizes) {
//     return res.status(200).send({ info: quizes });
//   } else {
//     return res
//       .status(404)
//       .send({ message: "no quizes founded Id", success: false });
//   }
// }

// //===========================================get a doctor by id===================================
// async function getAdoctor(req, res) {
//   if (mongoose.Types.ObjectId.isValid(req.params.id)) {
//     const doctor = await Doctor.findById(req.params.id);
//     if (doctor) {
//       return res.status(200).send({ info: doctor });
//     } else {
//       return res
//         .status(404)
//         .send({ message: "this doctor Not found", success: false });
//     }
//   } else {
//     return res.status(400).send({ message: "Invalid Id", success: false });
//   }
// }

// //=================correct the exam and push dgree============================================
// async function examCorrection(req, res) {
//   let redundent;
//   if (
//     mongoose.Types.ObjectId.isValid(req.body.studentId) &&
//     mongoose.Types.ObjectId.isValid(req.body.quizId)
//   ) {
//     if (req.body.result) {
//       const student = await Student.findById(req.body.studentId);
//       const quiz = await Quiz.findById(req.body.quizId);
//       try {
//         redundent = await quiz.StudentDone.find(
//           s => s.studentId == req.body.studentId
//         );
//       } catch {
//         redundent = false;
//       }

//       if (redundent) {
//         return res.status(400).send({
//           message: "this student have been taken this quiz before",
//           success: false
//         });
//       } else {
//         if (student && quiz) {
//           const newResult = new Result({
//             studentId: student._id,
//             Result: req.body.result
//           });

//           quiz.StudentDone.push(newResult);
//           student.quizes.push(quiz._id);
//           await quiz.save();
//           await student.save();
//           return res
//             .status(200)
//             .send({ message: "Result submitted successfully", success: true });
//         } else {
//           return res
//             .status(400)
//             .send({ message: "Invalid studentId or quizId", success: false });
//         }
//       }
//     } else {
//       return res
//         .status(400)
//         .send({ message: "result is Required", success: false });
//     }
//   } else {
//     return res
//       .status(400)
//       .send({ message: "Invalid studentId or quizId", success: false });
//   }
// }

// async function updateProfileImage(req,res){
//  if(mongoose.Types.ObjectId.isValid(req.body.id)) {
//    if(req.body.title == "Student"){
//     const student = await Student.findById(req.body.id);
//       if(student){
//         const storage = new GridFsStorage({
//           url: mongoURI,
//           file: (req, file) => {
//             return new Promise((resolve, reject) => {
//               crypto.randomBytes(16, (err, buf) => {
//                 if (err) {
//                   return reject(err);
//                 }
//                 const filename = buf.toString("hex") + path.extname(file.originalname);
//                 const fileInfo = {
//                   filename: file.originalname,
//                   bucketName: "uploads"
//                 };
//                 resolve(fileInfo);
//               });
//             });
//           }
//         });
        
//         const upload = multer({ storage }).single("file");

//         upload(req,res,err=>{
//           if(err) return res.status(400).send("Bad request");
//           console.log("req.file");
//           console.log(req.file);
//           return res.status(200).send("student profile changed");
//         })
//       }
//    }else{
//     return res.status(400).send("student not found");
//    }
//  }else{
//    return res.status(400).send("Invalid Id");
//  }
// }

// module.exports = {
//   getStudents: getStudents,
//   getPosts: getPosts,
//   getPost: getPost,
//   getStudent: getStudent,
//   postAddPost: postAddPost,
//   hashPassword: hashPassword,
//   ComparePassword: ComparePassword,
//   login: login,
//   postAddStudent: postAddStudent,
//   asddStudentValidation: asddStudentValidation,
//   likePost: likePost,
//   getFile: getFile,
//   postForgetPassword: postForgetPassword,
//   postVerify: postVerify,
//   postChangePassord: postChangePassord,
//   forgetValidation: forgetValidation,
//   changePasswordValidation: changePasswordValidation,
//   addQuestionToQuizValidation: addQuestionToQuizValidation,
//   quizCreateValidation: quizCreateValidation,
//   addQuestionToQuiz: addQuestionToQuiz,
//   createQuiz: createQuiz,
//   getDoctor: getDoctor,
//   loginValidation: loginValidation,
//   profileUpdate: profileUpdate,
//   updateValidation: updateValidation,
//   getAquiz: getAquiz,
//   getQuizes: getQuizes,
//   getAdoctor: getAdoctor,
//   corectQuizValidation: corectQuizValidation,
//   examCorrection: examCorrection,
//   getPost44: getPost44,
//   getPostByEmail:getPostByEmail,
//   updateProfileImage:updateProfileImage
// };
