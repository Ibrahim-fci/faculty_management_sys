'use strict';
var express = require("express");
var router = express.Router();
const crypto = require("crypto"); //model for generate strong random variable
const multer = require("multer"); //for uploading images from local computing
const GridFsStorage = require("multer-gridfs-storage");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // model for incrypt&decrypt  password
const { check, validationResult, body } = require("express-validator"); //for inputs fileds validation
const _=require("underscore")

///////************************  custom modules */*************************************
const apiController = require("../Controllers/apiController");
const Student = require("../models/Student");
const questoion = require("../models/quesiton");
const Questoion = require("../models/quesiton");
const Quiz = require("../models/quiz"); 
const Doctor = require("../models/doctor");
const Result = require("../models/quizResult");
const Post = require("../models/post");
const Comment=require('../models/comments')
const Replay=require('../models/replay')
const Material =require('../models/material')
const Admin =require('../models/Admin')
const Event = require('../models/events')
const Message = require('../models/Message')
const fileUploader=require('../midelware/fileUploader');
// const domainName='http://localhost:3000/api/fileByName/'
const domainName='http://fciapi.herokuapp.com/api/fileByName/'





//get api documment page 
router.get("/", async(req,res)=>{
  res.render('api',{domain:"http://fciapi.herokuapp.com/"})
});

//post login function
router.post("/login", [
  check("email").not().isEmpty().withMessage("email is Required"),
  check("password").not().isEmpty().withMessage("password Required"),
  check("title").not().isEmpty().withMessage("title Required")
],login);

//*******************Api to get posts by Level  sorted by the latest updated*/
router.get('/studentPosts/:id',async(req,res)=>{
  if (!mongoose.Types.ObjectId.isValid(req.params.id))  return res.status(404).send({message:"invalid userId",success:false});
   const student = await Student.findById(req.params.id);
   if(!student) return res.status(404).send({message:"Student Not Found",success:false});

   //get posts and send it to user
   const posts=await getPostsByLevel(student.level,student._id);
   return res.status(200).send({posts:posts.sort((a, b) => b.sortDate - a.sortDate),success:true});
   
})



//******************************* create Student */
router.post('/createStudent',[
  check("email").not().isEmpty().withMessage("email is Required"),
  check("Name").not().isEmpty().withMessage("student Name Required"),
  check("Password").not().isEmpty().withMessage("password Required"),
  check("Department").not().isEmpty().withMessage("Department Required"),
  check("Dof").not().isEmpty().withMessage("Date of birth Required"),
  check("Gender").not().isEmpty().withMessage("Gender Required"),
  check("level").not().isEmpty().withMessage("level  Required"),
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({message:errors,success: false}) // validation errors

  const isFresisteredBefore = await Student.findOne({Email:req.body.email});
  if(isFresisteredBefore)  return res.status(400).send({message:"this student registered before",success: false}) 


 const newStudent=new Student({
  Email:req.body.email,
  Name:req.body.Name,
  Password:hashPassword(req.body.Password),
  Department:req.body.Department,
  Dof:req.body.Dof,
  Gender:req.body.Gender,
  level:req.body.level,
  ProfileImagePath:domainName+'1020188d72657b9574dc4958dce4720d.png',
  city:req.body.city,
  isDisabled:false
 })
 const doc =await newStudent.save();
 if(!doc) return res.status(400).send({message:"bad request",success:false})

 return res.status(200).send({message:"student created succefully",newStudent:_.pick(doc,['_id','Name','Email','ProfileImagePath']),success:true})
})

///******************************* create Post */
router.post('/createPost',fileUploader.upload.single('file'),[
  check("postContent").not().isEmpty().withMessage("post content is Required"),
  check("userId").not().isEmpty().withMessage("userId is Required"),
],async(req,res)=>{
 const errors= await validate(req); 
  if(errors) return res.status(400).send({message:errors,success: false}) // validation errors

  //*********************** check if post is spaces or empty */
  if(isNullOrEmpty(req.body.postContent)) return res.status(400).send({message:"post content cant be empty",success:false})

  //check is valid id format or not
  if (!mongoose.Types.ObjectId.isValid(req.body.userId))  return res.status(404).send({message:"invalid studentId",success:false});

  //get student and check if he found or not
  const student= await Student.findById(req.body.userId);
  if(!student) return res.status(404).send({message:"student not found",success:false})
  
  const date=(await getDate()).toString();
  const sortDate=new Date()
  let filePath=''
  let postType=''; 

  if(req.file){
    filePath=domainName+req.file.filename;   // set file name to atteched file
    postType=req.file.contentType;   //get file type from file
   } 
   //get file type from file
 console.log(req.file)

 const newPost=new Post({
  content:req.body.postContent,
  postCreator:req.body.userId,
  timestemp:date,
  sortDate:sortDate,
  Level:student.level,
  postType:postType,
  filePath:filePath
 })

 //********** push atteched file */
//  newPost.fileAttatched.push(filePath);
 const doc=await newPost.save()

 if(!doc) return res.status(400),send({message:"bad request",success:false});

 user.posts.push(doc._id)
 const doc3=await user.save()

 //***************handel retrived data of the new post */
  doc.likesNum=doc.Likes.length
  doc.commentsNum=doc.comments.length
  doc.postUploader=await Student.findById(doc.postCreator).select("Name Email ProfileImagePath _id grade");
  doc.Likes=undefined;
  doc.comments=undefined;
  doc.postCreator=undefined
  doc.sortDate=undefined

 return res.status(200).send({message:"post aded successfully",newPost:doc,success:true})


})

//********************* get files by Name */
router.get('/fileByName/:filename',fileUploader.getFile)

//****************************** get post by post id */
router.get('/postById/:id',async(req,res)=>{
  if (!mongoose.Types.ObjectId.isValid(req.params.id))  return res.status(404).send({message:"invalid postId",success:false});
  const doc=await Post.findById(req.params.id);
  if(!doc) return res.status(404).send({message:"post not found",success:false})
   //***************handel retrived data of the new post */
   doc.likesNum=doc.Likes.length
   doc.commentsNum=doc.comments.length
   doc.postUploader=await Student.findById(doc.postCreator).select("Name Email ProfileImagePath _id");
   doc.comments = await getComments(doc._id)
   doc.Likes=undefined;
  //  doc.comments=undefined;
   doc.postCreator=undefined
   doc.sortDate=undefined

   return res.status(200).send({post:doc,success:true});
})

//******************************get student by his id */
router.get('/studentById/:id',async(req,res)=>{
  if (!mongoose.Types.ObjectId.isValid(req.params.id))  return res.status(404).send({message:"invalid postId",success:false});

  const student=await Student.findById(req.params.id);
  if(!student) return res.status(404).send({message:"student not found",success:false})
  
  student.posts=undefined
  student.Likes=undefined
  student.quizes=undefined
  student.Password=undefined

  return res.status(200).send({student:student,success:true})

  
})

//******************************get student in my level */
router.get('/studentofMyLevel/:id',async(req,res)=>{
  if (!mongoose.Types.ObjectId.isValid(req.params.id))  return res.status(404).send({message:"invalid postId",success:false});

  const student=await Student.findById(req.params.id);
  if(!student) return  res.status(404).send({message:"student not found",success:false});

  const students= await Student.find({level:student.level});

  let i=0;
  let temp=[];

  for(i ; i < students.length ; i++ ){
    if((student._id).toString() != (students[i]._id).toString()){
      temp.push(students[i]);
    }
  }
   
  if(i == students.length){
    return res.status(200).send({students:temp,success:true})
  }
 
})

//***************************** post Like */
router.post('/postLike',[
  check("postId").not().isEmpty().withMessage("postId  is Required"),
  check("userId").not().isEmpty().withMessage("userId  is Required"),
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({message:errors,success: false}) // validation errors

  if (!mongoose.Types.ObjectId.isValid(req.body.userId))  return res.status(404).send({message:"invalid postId",success:false});

  let student= await Student.findById(req.body.userId);
  if(!student) student= await Doctor.findById(req.body.userId);
  if(!student) return res.status(404).send({message:"student not found",success:false});

  const post= await Post.findById(req.body.postId);
  if(!post) return res.status(404).send({message:"post not found",success:false});

  const isLiked=post.Likes.includes(student._id);

  if(isLiked){
    post.Likes.pop(student._id);
    student.Likes.pop(post._id);

   await post.save();
   await student.save()

   const likesNum=post.Likes.length

   return res.status(200).send({message:"like removed successfully",likesNum:likesNum,success:true})
  }else{
    post.Likes.push(student._id);
    student.Likes.push(post._id);

   await post.save();
   await student.save()

   const likesNum=post.Likes.length
   return res.status(200).send({message:"like added successfully",likesNum:likesNum,success:true})
  }
  
})

//****************************** create post comment */
router.post('/createComment',[
  check("commentContent").not().isEmpty().withMessage("commentContent is required"),
  check("postId").not().isEmpty().withMessage("postId is required"),
  check("studentId").not().isEmpty().withMessage("studentId is required"),
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({message:errors,success: false}) // validation errors

  let student = await Student.findById(req.body.studentId);
  if(!student) student= await Doctor.findById(req.body.studentId)
  if(!student) return res.status(404).send({message:"id not belongs to neither student nor doctor ",success:false})

  const post = await Post.findById(req.body.postId) ;
  if(!post) return res.status(404).send({message:"post  not found",success:false})

  const date=(await getDate()).toString();
  const sortDate=new Date()
  const newComment= new Comment({
    commntCreator:student._id,
    content:req.body.commentContent,
    uploadDate:date,
    sortDate:sortDate
  })

  const doc = await newComment.save()
  if(!doc) return res.status(400).send({message:"bad request",success:false})

  post.comments.push(doc._id);
  const doc1= await post.save()
  if(!doc1) return res.status(400).send({message:"bad request",success:false})

  const commentsNum= doc1.comments.length;
  const newFormatedComment = await getOneCommentById(doc._id);
  return res.status(200).send({message:"comment added successfully",newComment:newFormatedComment,commentsNum:commentsNum,success:true})
  
})

//*********************** add like to comment */
router.post('/commentLike',[
  check("commentId").not().isEmpty().withMessage("commentId is required"),
  check("studentId").not().isEmpty().withMessage("studentId is required"),
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({message:errors,success: false}) // validation errors

  const comment = await Comment.findById(req.body.commentId);
  if(!comment) return res.status(404).send({message:"comment not found",success:false});

  let student= await Student.findById(req.body.studentId);
  if(!student) student= await Doctor.findById(req.body.studentId);
  if(!student) return res.status(404).send({message:"this id neither belongs to student nor doctor",success:false}); 

  const isLiked= comment.Likes.includes(student._id)


  if(isLiked){
    comment.Likes.pop(student._id);

   await comment.save()

   const likesNum=comment.Likes.length

   return res.status(200).send({message:"like removed successfully",likesNum:likesNum,success:true})
  }else{
    comment.Likes.push(student._id);

   await comment.save()

   const likesNum=comment.Likes.length
   return res.status(200).send({message:"like added successfully",likesNum:likesNum,success:true})
  }
  
})

//******************* update comment */
router.post("/commentUpdate",[
  check("commentId").not().isEmpty().withMessage("commentId is required"),
  check("studentId").not().isEmpty().withMessage("studentId is required"),
  check("commentContent").not().isEmpty().withMessage("commentContent is required"),

],async(req,res) =>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({message:errors,success: false}) // validation errors

  const student= await Student.findById(req.body.studentId);
  if(!student) return res.status(404).send({message:"student not found",success:false})

  const comment= await Comment.findById(req.body.commentId);
  if(!comment) return res.status(404).send({message:"comment  not found",success:false})

  if( comment.commntCreator.toString() == student._id){
    comment.content=req.body.commentContent;
    const doc = await comment.save()
    if(!doc) return res.status(400).send({message:"bad request",success:false})

    return res.status(200).send({message:"comment updated successfully",success:true})
  }else{
    return res.status(400).send({message:"this comment not belong you so you have no permission to update it ",success:false})
  }
})

//*************** add replay to a comment */
router.post("/comentReplay",[
  check("commentId").not().isEmpty().withMessage("commentId is required"),
  check("studentId").not().isEmpty().withMessage("studentId is required"),
  check("replayComment").not().isEmpty().withMessage("replayComment is required"),
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({message:errors,success: false}) // validation errors

  const comment = await Comment.findById(req.body.commentId);
  if(!comment) return res.status(404).send({message:"comment not found",success:false})

  let student = await Student.findById(req.body.studentId);
  if(!student) student = await Doctor.findById(req.body.studentId);
  if(!student) return res.status(404).send({message:"student not found",success:false})

  const newReplay = new Replay({
    content:req.body.replayComment,
    replayCreator:student._id,
  })

  const doc = await newReplay.save();
  if(!doc) return res.status(400).send({message:"bad request",success:false})

  comment.replayes.push(doc._id)
  const doc2 =await  comment.save()
  if(!doc2) return res.status(400).send({message:"bad request",success:false})

  const theReplay= await getreplayById(doc._id)

  return res.status(200).send({message:"replay added successfully",newReplay:theReplay,success:true})

})


//***************** get comment replayes */
router.get("/getReplayes/:id",async(req,res) =>{
  const comment = await Comment.findById(req.params.id);
  if(!comment) return res.status(404).send({message:"comment not found ",success:false})

  const replayes =await getReplayes(comment._id);

  return res.status(200).send({replayes:replayes,success:true});
})

//********************* replay like  */
router.post('/replayLike',[
  check("replayId").not().isEmpty().withMessage("commentId is required"),
  check("studentId").not().isEmpty().withMessage("studentId is required"),
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({message:errors,success: false}) // validation errors

  const replay = await Replay.findById(req.body.replayId);
  if(!replay) return res.status(404).send({message:"replay not found",success:false});

  let student= await Student.findById(req.body.studentId);
  if(!student) student= await Doctor.findById(req.body.studentId);
  if(!student) return res.status(404).send({message:"student  not found",success:false}); 

  const isLiked= replay.Likes.includes(student._id)


  if(isLiked){
    replay.Likes.pop(student._id);

   await replay.save()

   const likesNum=replay.Likes.length

   return res.status(200).send({message:"like removed successfully",likesNum:likesNum,success:true})
  }else{
    replay.Likes.push(student._id);

   await replay.save()

   const likesNum=replay.Likes.length
   return res.status(200).send({message:"like added successfully",likesNum:likesNum,success:true})
  }
  
})

//****************************** send e-mail router */
router.post('/sendMaile',[
  check("to").not().isEmpty().isEmail().withMessage("invalid email"),
  check("message").not().isEmpty().withMessage("message is required"),
  check("subject").not().isEmpty().withMessage("message is required"),
],async(req,res) =>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({messages:errors,success: false}) // validation errors
  try{

    main1(req.body.to,req.body.message,req.body.subject).then(()=>{
      res.status(200).send({message:"E-mail sent successfully",status:true})
    }).catch((err)=>{
      res.status(400).send({message:"something wrong happened",status:false})
    })
  }catch(ex){
    console.log(ex)
  }
    
})


router.post("/forgetPassword",[
  check("email").not().isEmpty().isEmail().withMessage("invalid email"),
  check("title").not().isEmpty().isEmail().withMessage("title required"),
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({messages:errors,success: false}) // validation errors

  let user = req.body.title.find({Email:req.body.email});
  if(!user) res.status(404).send({message:"User Not Found",success:false});


  // create random string
  const randomKey = 'hhhh'

  // set random key to user 

  user.mailedKey = randomKey;
  const doc = await user.save();
  if(!doc) res.status(404).send({message:"Bad request",success:false});

  //send  email with this random key
  try{

    main1(user.Email,randomKey,"rest account Password").then(()=>{
      //after sending  the email return email to end user
      res.status(200).send({message:"E-mail sent successfully",email:user.Email,status:true})
    }).catch((err)=>{
      res.status(400).send({message:"something wrong happened",status:false})
    })
  }catch(ex){
    console.log(ex)
    res.status(400).send({message:"something wrong happened",status:false})
  }
    

  




})

router.post("/authenticationCheck",[
  check("email").not().isEmpty().isEmail().withMessage("invalid email"),
  check("resetKey").not().isEmpty().isEmail().withMessage("resetKey is required"),
  check("title").not().isEmpty().isEmail().withMessage("title required"),
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({messages:errors,success: false}) // validation errors


  // Get the User
  let user = req.body.title.find({Email:req.body.email});
  if(!user) res.status(404).send({message:"User Not Found",success:false});

  // check if the user key is matched with reset key
  if((user.mailedKey).toString() == (req.body.resetKey).toString()){
      return res.status(200).send({message:"reset key is true",email:user.Email,success:true})
  }else{
    return res.status(400).send({message:"reset key is false",success:false})
  }

})

router.post("/resetPassword",[
  check("email").not().isEmpty().isEmail().withMessage("invalid email"),
  check("title").not().isEmpty().isEmail().withMessage("title required"),
  check("newPassword").not().isEmpty().isEmail().withMessage("title required"),
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({messages:errors,success: false}) // validation errors


  // Get the User
  let user = req.body.title.find({Email:req.body.email});
  if(!user) res.status(404).send({message:"User Not Found",success:false});

  // set the new password
   user.Password = hashPassword(req.body.newPassword);
   const doc = await user.save()
   if(!doc) return res.status(400).send({message:"Bad Request",success:false})


   return res.status(200).send({message:"password updated successfully",success:true})
})


//********************************* create doctor for testing */
router.post("/createDoc",[
  check("Name").not().isEmpty().withMessage("Name is required"),
  check("email").not().isEmpty().withMessage("Email is required"),
  check("Password").not().isEmpty().withMessage("Password is required"),
  check("city").not().isEmpty().withMessage("city is required"),
  check("title").not().isEmpty().withMessage("title is required"),
  check("Dof").not().isEmpty().withMessage("Dof is required"),
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({messages:errors,success: false}) // validation errors

  const isFresisteredBefore = await Doctor.findOne({Email:req.body.email});
  if(isFresisteredBefore)  return res.status(400).send({messages:"this Doctor registered before",success: false}) 

  const newDoc = new Doctor({
    Name:req.body.Name,
    Email:req.body.email,
    Password:hashPassword(req.body.Password) ,
    city:req.body.city,
    title:req.body.title,
    Dof:req.body.Dof,
    ProfileImagePath:domainName+'1e533d2408c0f57251902087ddf5ace3.png',
    Gender:req.body.Gender
  })

  const doc = await newDoc.save()
  if(!doc) return res.status(400).send({messages:"bad request",success: false})

  return res.status(200).send({messages:"doctor created successfully",newDoc:_.pick(doc,['Name','_id','Email','ProfileImagePath','city']),success: true});
})

//**************************** create quiz by doctor */
router.post('/createQuizByDoc',[
  check("title").not().isEmpty().withMessage("quiz title is required"),
  check("level").not().isEmpty().withMessage("level is required"),
  check("doctorId").not().isEmpty().withMessage("doctorId is required"),
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({messages:errors,success: false}) // validation errors

  const doctor = await Doctor.findById(req.body.doctorId);
  if(!doctor) return res.status(404).send({message:"doctor not found",success:false})

  const date=(await getDate()).toString();
  const sortDate=new Date()

  const newQuiz = new Quiz({
    Title:req.body.title,
    QuizCreator:doctor._id,
    Level:req.body.level,
    isPuplished:false,
    uploadDate:date,
    sortDate:sortDate
  })

  const doc = await newQuiz.save()
  if(!doc) return res.status(400).send({message:"bad request",success:false})

  doctor.quizes.push(doc._id)
  const doc2 = await doctor.save()
  if(!doc2) return res.status(400).send({message:"bad request",success:false})

  return res.status(200).send({message:"quiz created successfully",newQuiz:_.pick(doc,['Title','Level','_id']),success:true})
})


//*************************************** add question to quiz */
router.post("/addQuetion",[
  check("quizId").not().isEmpty().withMessage("quizId  is required"),
  check("question").not().isEmpty().withMessage("question  is required"),
  check("answer").not().isEmpty().withMessage("answer is required"),
  check("option1").not().isEmpty().withMessage("option1 is required"),
  check("option2").not().isEmpty().withMessage("option2 is required"),
  check("option3").not().isEmpty().withMessage("option3 is required"),
  check("option4").not().isEmpty().withMessage("option4 is required"),
],async(req,res) => {
  const errors= await validate(req); 
  if(errors) return res.status(400).send({messages:errors,success: false}) // validation errors

  const quiz =await Quiz.findById(req.body.quizId);
  if(!quiz) return res.status(404).send({messages:"quiz not found",success: false})

  const newQuestion = new Questoion({
    question:req.body.question,
    answer:req.body.answer,
    option1:req.body.option1,
    option2:req.body.option2,
    option3:req.body.option3,
    option4:req.body.option4,

  })

  const doc = await newQuestion.save();
  if(!doc) return res.status(400).send({messages:"Bad request",success: false})

  quiz.questions.push(doc._id)
  const doc2= await quiz.save()
  if(!doc2) return res.status(400).send({messages:"Bad request",success: false})

  return res.status(200).send({messages:"question added successfully",newQuestion:doc,success: true})
})


//****************** get quizes of my level */
router.get("/quizes/:id",async(req,res)=>{
  if (!mongoose.Types.ObjectId.isValid(req.params.id))  return res.status(404).send({message:"invalid student Id",success:false});

  const student= await Student.findById(req.params.id);
  if(!student) return res.status(404).send({message:"student not found",success:false});

  const quizes = await getQuizes(student.level,student._id);

  return res.status(200).send({quizes:quizes,success:true})
  
})




//************************* get quiz by id */
router.get("/getQuiz/:studentId/:quizId",async(req,res)=>{
  if (!mongoose.Types.ObjectId.isValid(req.params.studentId))  return res.status(404).send({message:"invalid studentId",success:false});
  if (!mongoose.Types.ObjectId.isValid(req.params.quizId))  return res.status(404).send({message:"invalid quizId",success:false});

  let student= await Student.findById(req.params.studentId);
  if(!student) student= await Doctor.findById(req.params.studentId);
  if(!student) return res.status(404).send({message:"this id not belongs to neither student nor doctor",success:false});



  const quiz= await Quiz.findById(req.params.quizId);
  if(!quiz) return res.status(404).send({message:"quiz not found",success:false});

  let redundent=false
  let flag =0;
  let i =0;

   // check if this student taked this  quiz  before
   for(i ; i< quiz.StudentDone.length ; i++){
    let result= await Result.findById(quiz.StudentDone[i])
      if((result.studentId).toString() == (student._id.toString()) ){
          flag=true;
           return res.status(400).send({message:"this student taked this quiz before",success:false});
      }
  }


    if( i == quiz.StudentDone.length ){

      if(quiz.Level != student.level) return res.status(400).send({message:"this quiz not for your level",success:false});
      const formatedQuiz = await getQuiz(quiz._id);
    
      return res.status(200).send({quiz:formatedQuiz,success:true})
    }


 
  
})

//************************* get quiz by id */
router.get("/getQuizByDoc/:studentId/:quizId",async(req,res)=>{
  if (!mongoose.Types.ObjectId.isValid(req.params.studentId))  return res.status(404).send({message:"invalid studentId",success:false});
  if (!mongoose.Types.ObjectId.isValid(req.params.quizId))  return res.status(404).send({message:"invalid quizId",success:false});

  let student= await Doctor.findById(req.params.studentId);
  if(!student) return res.status(404).send({message:"doctor not found",success:false});



  const quiz= await Quiz.findById(req.params.quizId);
  if(!quiz) return res.status(404).send({message:"quiz not found",success:false});


   if(!((quiz.QuizCreator).toString() == student._id)) return res.status(400).send({message:"this quiz not belongs to you",success:false});
  

    const formatedQuiz = await getQuiz(quiz._id);
    
    return res.status(200).send({quiz:formatedQuiz,success:true})

})

//*************************correct quiz */ 
router.post('/quizResult',[
  check("quizId").not().isEmpty().withMessage("quizId is required"),
  check("studentId").not().isEmpty().withMessage("studentId is required"),
  check("result").not().isEmpty().withMessage("result is required"),
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({messages:errors,success: false}) // validation errors

  const student = await Student.findById(req.body.studentId);
  if(!student) return res.status(404).send({message:"student not found",success:false})

  const quiz = await Quiz.findById(req.body.quizId);
  if(!quiz) return res.status(404).send({message:"quiz not found",success:false})

   //check if this quiz belong to this student
  if(quiz.Level != student.level) return res.status(400).send({message:"this quiz not for your level",success:false});
  
  let i=0;
  let temp = [];
  let flag=false;

  // check if this student taked this  quiz  before
  for(i ; i< quiz.StudentDone.length ; i++){
    let result= await Result.findById(quiz.StudentDone[i])
      if((result.studentId).toString() == (student._id.toString()) ){
          flag=true;
          break;
          return res.status(400).send({message:"this student taked this quiz before",success:false});
      }
  }



  if(i == quiz.StudentDone.length ){
    if(flag) return res.status(400).send({message:"this student taked this quiz before",success:false});
       console.log(req.body.result)
      const quizResult= new Result({
        studentId:student._id,
        Result:req.body.result,
    })

    const doc= await quizResult.save()
    if(!doc) return res.status(400).send({message:"Bad request",success:false});

    quiz.StudentDone.push(doc._id);
    const doc2 = await quiz.save();
    if(!doc2) return res.status(400).send({message:"Bad request",success:false});

    student.quizes.push(doc2._id)
    const doc3 = await student.save()
    if(!doc3) return res.status(400).send({message:"Bad request",success:false});

    return res.status(200).send({message:"The result was approved successfully",studentResult:req.body.result,success:true});


  }
 
})

//************************ all student of my level */
router.get("/students/:id",async(req,res)=>{
  if (!mongoose.Types.ObjectId.isValid(req.params.id))  return res.status(404).send({message:"invalid studentId",success:false});

  const student = await Student.findById(req.params.id);
  if(!student) return res.status(404).send({message:"student not found",success:false});

  const students = await getStudents(student.level,student._id);

return res.status(200).send({students:students,success:true});
})


//*************************** students search */
router.post('/studentsSearch',[
  check('studentId').not().isEmpty().withMessage("student id is required"),
  check('searchKey').not().isEmpty().withMessage("searchKey is required"),
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({messages:errors,success: false}) // validation errors

  let student = await Student.findById(req.body.studentId);
  if(!student) student = Doctor.findById(req.body.studentId)
  if(!student) return res.status(404).send({message:"student no found",success:false});


  const students = await studentsSearch(student._id,req.body.searchKey,student.level);
  return res.status(200).send({students:students,success:true})

})


//*******************Api to get posts by Level  sorted by the latest updated by student or doctor id*/
router.get('/postsByLevel/:id/:level',async(req,res)=>{
  if (!mongoose.Types.ObjectId.isValid(req.params.id))  return res.status(404).send({message:"invalid userId",success:false});
  if(!req.params.level) return res.status(404).send({message:"level is required",success:false});

   //get posts and send it to user
   const posts=await getPostsByLevelByDocOrStudent((req.params.level).toString(),req.params.id);
   return res.status(200).send({posts:posts.sort((a, b) => b.sortDate - a.sortDate),success:true});
   
   
})


///******************************* create Post by doctor or student */
router.post('/createPostByDocOrStudent',fileUploader.upload.single('file'),[
  check("postContent").not().isEmpty().withMessage("post content is Required"),
  check("userId").not().isEmpty().withMessage("userId is Required"),
  check("level").not().isEmpty().withMessage("level is Required"),
],async(req,res)=>{
 const errors= await validate(req); 
  if(errors) return res.status(400).send({message:errors,success: false}) // validation errors

  //*********************** check if post is spaces or empty */
  if(isNullOrEmpty(req.body.postContent)) return res.status(400).send({message:"post content cant be empty",success:false})

  //check is valid id format or not
  if (!mongoose.Types.ObjectId.isValid(req.body.userId))  return res.status(404).send({message:"invalid studentId",success:false});

  //get student and check if he found or not
  let user= await Student.findById(req.body.userId);
  if(!user) user = await Doctor.findById(req.body.userId);
  if(!user) return res.status(404).send({message:"this id nither a student nor a doctor",success:false});
  
  
  const date=(await getDate()).toString();
  const sortDate=new Date()
  let filePath=''
  let postType=''

 if(req.file){
   console.log(req.file)
  filePath=domainName+req.file.filename;   // set file name to atteched file
  postType=req.file.contentType;   //get file type from file
 } 
 console.log(req.file)

 const newPost=new Post({
  content:req.body.postContent,
  postCreator:req.body.userId,
  timestemp:date,
  sortDate:sortDate,
  Level:(req.body.level).toString(),
  postType:postType,
  filePath:filePath
 })

 //********** push atteched file */
//  newPost.fileAttatched.push(filePath);
 const doc=await newPost.save()
 console.log(doc)

 if(!doc) return res.status(400),send({message:"bad request",success:false});

 user.posts.push(doc._id)
 const doc3=await user.save()

 //***************handel retrived data of the new post */
  // doc.likesNum=doc.Likes.length
  // doc.commentsNum=doc.comments.length
  // doc.postUploader= _.pick(user,['Name','Email','ProfileImagePath','_id','grade'])
  // doc.Likes=undefined;
  // doc.comments=undefined;
  // doc.postCreator=undefined
  // doc.sortDate=undefined

  const theNewPost = await getOnePost(doc._id,user._id)

 return res.status(200).send({message:"post aded successfully",newPost:theNewPost,success:true})


})


//********************* get student or doctor or admin  by his id */
router.get('/studentOrDocInfo/:id',async(req,res)=>{
  if (!mongoose.Types.ObjectId.isValid(req.params.id))  return res.status(404).send({message:"invalid userId",success:false});

  let user = await Student.findById(req.params.id);
  if(!user) user= await Doctor.findById(req.params.id);
  if(!user) user= await Admin.findById(req.params.id);
  if(!user) return res.status(404).send({message:"this id not nither belong to a doctor nor belongs to student nor Admin",success:false});

  let formatedUser=_.pick(user,['Name','Email','ProfileImagePath','_id','Department','level','title','grade','Gender','bio','city']);

  return res.status(200).send({user:formatedUser,success:true});
})


//************************ update image photo */
router.post('/updateProfileImage',[
  check("userId").not().isEmpty().withMessage("userId is required"),
],fileUploader.upload.single('file'),async(req,res)=>{
  

  if(!req.file) return res.status(404).send({message:"file required",success:false});
  // if(!(req.file.contentType.includes('image'))) return res.status(400).send({message:"image just allowed",success:false});
   console.log(req.file)
  if (!mongoose.Types.ObjectId.isValid(req.body.userId))  return res.status(404).send({message:"invalid userId",success:false});
  let user = await Student.findById(req.body.userId);

  if(!user) user= await Doctor.findById(req.body.userId);
  if(!user) return res.status(404).send({message:"this id nither belongs to a student nor Doctor",success:false});

  const imagePath = domainName+req.file.filename;

  user.ProfileImagePath=imagePath;
  const doc= await user.save();
  if(!doc) return res.status(400).send({message:"Bad request",success:false});

  let formatedUser=_.pick(doc,['Name','Email','ProfileImagePath','_id','Department','level','title','grade','Gender']);

  return res.status(200).send({message:"user profile image Updated successfully",user:formatedUser,success:true});
})


//************************************ get comment by postId */
router.get("/getComments/:id/:userId",async(req,res)=>{
  if (!mongoose.Types.ObjectId.isValid(req.params.id))  return res.status(404).send({message:"invalid postId",success:false});
  const comments = await getComments(req.params.id,req.params.userId);
  return res.status(200).send({comments:comments,success:true})
})

//**************************** profile update bio and password */
router.post("/updatepassword",[
  check("userId").not().isEmpty().withMessage("userId is Required"),
 
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({message:errors,success: false}) // validation errors


  let  user = await Student.findById(req.body.userId)
  if(!user)  user = await Doctor.findById(req.body.userId)
  if(!user) return res.status(400).send({message:"userNotFound",success:false})

  


  if(req.body.newPassword){
    if(!(ComparePassword(req.body.oldPassword,user.Password))) return res.status(400).send({message:"old password is incorrect",success:false})
    user.Password = hashPassword(req.body.newPassword);
  }
 

  user.bio = req.body.bio;
  const doc = await user.save()
  if(!doc) return res.status(400).send({message:"bad request",success:false})



  return res.status(200).send({message:"user updated successfully",updatedUser:_.pick(doc,['_id','bio','Name','Email','ProfileImagePath']),success:true})

  

})

//*************************** students search by doc */
router.post('/studentsSearchByDoc',[
  check('userId').not().isEmpty().withMessage("student id is required"),
  check('searchKey').not().isEmpty().withMessage("searchKey is required"),
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({messages:errors,success: false}) // validation errors

  let user = Doctor.findById(req.body.userId);
  if(!user) return res.status(404).send({message:"user not found",success:false});


  const students = await studentsSearchbyDoctor(req.body.searchKey);
  return res.status(200).send({students:students,success:true})

})

//************************ all student of my level */
router.get("/studentsByDoc/:id",async(req,res)=>{
  if (!mongoose.Types.ObjectId.isValid(req.params.id))  return res.status(404).send({message:"invalid userId",success:false});

  let doc = await Doctor.findById(req.params.id);
  if(!doc) doc = await Admin.findById(req.params.id);
  if(!doc) return res.status(404).send({message:"doctor not found",success:false});

  const students = await getStudentsByDoc();

  return res.status(200).send({students:students,success:true});
})


//*************************** students search by doc */
router.post('/studentsSearchByDoc',[
  check('userId').not().isEmpty().withMessage("student id is required"),
  check('searchKey').not().isEmpty().withMessage("searchKey is required"),
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({messages:errors,success: false}) // validation errors

  let user =await Doctor.findById(req.body.userId);
  if(!user) user =await Admin.findById(req.body.userId);
  if(!user) return res.status(404).send({message:"user not found",success:false});


  const students = await studentsSearchbyDoctor(req.body.searchKey);
  return res.status(200).send({students:students,success:true})

})


//******************************** update quiz Question */
router.post("/updateQuestion",[
  check('doctorId').not().isEmpty().withMessage("quizId id is required"),
  check('quizId').not().isEmpty().withMessage("quizId id is required"),
  check('questionId').not().isEmpty().withMessage("questionId id is required"),
  check("question").not().isEmpty().withMessage("question  is required"),
  check("answer").not().isEmpty().withMessage("answer is required"),
  check("option1").not().isEmpty().withMessage("option1 is required"),
  check("option2").not().isEmpty().withMessage("option2 is required"),
  check("option3").not().isEmpty().withMessage("option3 is required"),
  check("option4").not().isEmpty().withMessage("option4 is required"),
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({message:errors,success: false}) // validation errors


  const doctor = await Doctor.findById(req.body.doctorId);
  if(!doctor) return res.status(404).send({message:"doctoe not found",success:false});

  const quiz = await Quiz.findById(req.body.quizId)
  if(!quiz) return res.status(404).send({message:"quiz not found",success:false});

  const question = await Questoion.findById(req.body.questionId)
  if(!question) return res.status(404).send({message:"Question not found",success:false});

  const isbelong = quiz.questions.includes(question._id)
  if(!isbelong) return res.status(400).send({message:"Question not belong to this quiz",success:false});

  if(((quiz.QuizCreator).toString() != (doctor._id).toString()))  return res.status(400).send({message:"you are not the quiz creator you have no permission",success:false});


  question.question =req.body.question;
  question.answer =req.body.answer;
  question.option1 =req.body.option1;
  question.option2 =req.body.option2;
  question.option3 =req.body.option3;
  question.option4 =req.body.option4;

  const doc = await question.save();
  if(!doc) return res.status(400).send({message:"Bad Request",success:false});


  const theUpdatedquestion= await getquesions([doc._id]);
  console.log(theUpdatedquestion)

  return res.status(200).send({message:"question updated successfully",updatedQuestion:theUpdatedquestion[0],success:true});

})



//******************************** delete quiz Question */
router.post("/deletQuestion",[
  check('doctorId').not().isEmpty().withMessage("quizId id is required"),
  check('quizId').not().isEmpty().withMessage("quizId id is required"),
  check('questionId').not().isEmpty().withMessage("questionId id is required"),
 
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({message:errors,success: false}) // validation errors


  const doctor = await Doctor.findById(req.body.doctorId);
  if(!doctor) return res.status(404).send({message:"doctoe not found",success:false});

  const quiz = await Quiz.findById(req.body.quizId)
  if(!quiz) return res.status(404).send({message:"quiz not found",success:false});

  const question = await Questoion.findById(req.body.questionId)
  if(!question) return res.status(404).send({message:"Question not found",success:false});

  const isbelong = quiz.questions.includes(question._id)
  if(!isbelong) return res.status(400).send({message:"Question not belong to this quiz",success:false});

  if(!((quiz.QuizCreator).toString() == (doctor._id).toString()))  return res.status(400).send({message:"you are not the quiz creator you have no permission",success:false});


  
  const doc = await Questoion.deleteOne({_id:question._id});
  if(!doc) return res.status(400).send({message:"Bad request",success:false});

   quiz.questions.pop(question._id)
   const doc2 = quiz.save()
  if(!doc2) return res.status(400).send({message:"Bad request",success:false});


  const questionAfterDeletion = await getquesions(quiz.questions);

  return res.status(200).send({message:"question deleted successfully",questions:questionAfterDeletion,success:true});

})


//********************** update post By post owner */
router.post("/postUpdate",[
  check('userId').not().isEmpty().withMessage("userId id is required"),
  check('postId').not().isEmpty().withMessage("userId id is required"),
  check('postContent').not().isEmpty().withMessage("userId id is required"),
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({message:errors,success: false}) // validation errors

  let user = await Student.findById(req.body.userId)
  if(!user) user = await Doctor.findById(req.body.userId)
  if(!user) return res.status(404).send({message:"this id not belongs to stoudent or doctor",success: false})

  const post = await Post.findById(req.body.postId)
  if(!post) return res.status(404).send({message:"post not found",success: false})

  //check if this post belongs to this user 
  if(!((post.postCreator).toString() == (user._id).toString())) return res.status(404).send({message:"you have no permission to update this post",success: false})

  post.content = req.body.postContent;
  const doc = await post.save()
  if(!doc) return res.status(400).send({message:"Bad request",success: false})

  const theNewPost = await getOnePost(doc._id,user._id);

  return res.status(200).send({message:"post updated successfully",newPost:theNewPost,success: true})
})


//1
//******************* delete post  By post owner*/
router.post("/deletePost",[
  check('userId').not().isEmpty().withMessage("userId id is required"),
  check('postId').not().isEmpty().withMessage("userId id is required"),
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({message:errors,success: false}) // validation errors

  let user = await Student.findById(req.body.userId)
  if(!user) user = await Doctor.findById(req.body.userId)
  if(!user) return res.status(404).send({message:"this id not belongs to stoudent or doctor",success: false})

  const post = await Post.findById(req.body.postId)
  if(!post) return res.status(404).send({message:"post not found",success: false})

  //check if this post belongs to this user 
  if(!(post.postCreator == user._id)) return res.status(404).send({message:"you have no permission to update this post",success: false})

  const doc = await post.deleteOne(post._id)
  if(!doc) return res.status(400).send({message:"Bad request",success: false})


  return res.status(200).send({message:"post deleted successfully",success: true})
})


//************************ all Doctors of my level */
router.get("/doctorsByDoc/:id",async(req,res)=>{
  if (!mongoose.Types.ObjectId.isValid(req.params.id))  return res.status(404).send({message:"invalid userId",success:false});

  let doc = await Doctor.findById(req.params.id);
  if(!doc) doc = await Student.findById(req.params.id)
  if(!doc) return res.status(404).send({message:"doctor not found",success:false});

  const doctors = await getDoctors(doc._id);

  return res.status(200).send({doctors:doctors,success:true});

})

//*************************** doctor search by doc or student */
router.post('/doctorsSearch',[
  check('userId').not().isEmpty().withMessage("student id is required"), 
  check('searchKey').not().isEmpty().withMessage("searchKey is required"),
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({messages:errors,success: false}) // validation errors

  let user = await Doctor.findById(req.body.userId);
  if(!user)  user = await Student.findById(req.body.userId)
  if(!user) return res.status(404).send({message:"user not found",success:false});


  const doctors = await doctorsSearch(user._id,req.body.searchKey);
  return res.status(200).send({doctors:doctors,success:true})

})


//************************* upload materials By Doctor */
router.post("/uploadMaterial",fileUploader.upload.single("file"),[
  check('userId').not().isEmpty().withMessage("userId id is required"), 
  check('description').not().isEmpty().withMessage("description id is required"), 
  check('level').not().isEmpty().withMessage("description id is required"), 
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({messages:errors,success: false}) // validation errors


  if(!req.file) return res.status(404).send({message:"file is required",success:false})
  console.log(req.file)

  const doctor = await Doctor.findById(req.body.userId);
  if(!doctor) return res.status(404).send({message:"doctor Not found",success:false})

  let filePath= domainName+req.file.filename;
  const newmaterial = new Material({
    description:req.body.description,
    Level:req.body.level,
    FilePath:filePath,
    DocId:doctor._id,
    materialType:req.file.contentType,
  })

  const doc =await newmaterial.save();
  if(!doc) return res.status(400).send({message:"bad request",success:false})

  doctor.materials.push(doc._id)

  const doc2= await doctor.save()
  if(!doc2) return res.status(400).send({message:"bad request",success:false})

  doc.materialuploader= await Doctor.findById(doc.DocId).select('Name Email title ProfileImagePath Gender')
  doc.DocId=undefined;

  return res.status(200).send({message:"material uploadded successfully",material:doc,success:true})


})


// get material by student  level
router.get("/getMaterial/:level",async(req,res)=>{
  const material = await getMaterialsByLevel(req.params.level)
  return res.status(200).send({material:material,success:true})
})


// get material that is belongs to the doctor
router.get("/getDoctorMaterial/:id",async(req,res)=>{
  if (!mongoose.Types.ObjectId.isValid(req.params.id))  return res.status(404).send({message:"invalid userId",success:false});

  const doctor = await Doctor.findById(req.params.id);
  if(!doctor) return res.status(404).send({message:"Doctor not found",success:false})

  const material = await getDoctorMaterial(doctor.materials)
  return res.status(200).send({material:material,success:true})
})


//************************get  quizes that doctor upload it */
router.get("/doctorUploadedQuizes/:id",async(req,res)=>{
  if (!mongoose.Types.ObjectId.isValid(req.params.id))  return res.status(404).send({message:"invalid userId",success:false});

  let user = await Doctor.findById(req.params.id);
  if(!user) user = await Student.findById(req.params.id);
  if(!user) return res.status(404).send({message:"user  neither doctor nor student found",success:true});

  console.log(user.quizes)
  const quizes = await getDoctorUpladedQuizes(user.quizes)

  return res.status(200).send({quizes:quizes,success:true})
})


///******************************* create Post by doctor or student */ 
router.post('/createPostVersion3',fileUploader.upload.single('file'),[
  check("postContent").not().isEmpty().withMessage("post content is Required"),
  check("userId").not().isEmpty().withMessage("userId is Required"),
  check("level").not().isEmpty().withMessage("level is Required"),
  check("postType").not().isEmpty().withMessage("PostType is Required"),
],async(req,res)=>{
 const errors= await validate(req); 
  if(errors) return res.status(400).send({message:errors,success: false}) // validation errors

  //*********************** check if post is spaces or empty */
  if(isNullOrEmpty(req.body.postContent)) return res.status(400).send({message:"post content cant be empty",success:false})

  //check is valid id format or not
  if (!mongoose.Types.ObjectId.isValid(req.body.userId))  return res.status(404).send({message:"invalid studentId",success:false});

  //get student and check if he found or not
  let user= await Student.findById(req.body.userId);
  if(!user) user = await Doctor.findById(req.body.userId);
  if(!user) return res.status(404).send({message:"this id nither a student nor a doctor",success:false});
  
  
  const date=(await getDate()).toString();
  const sortDate=new Date()
  let filePath=''
  let postType=null

 if(req.file){
   console.log(req.file)
  filePath=domainName+req.file.filename;   // set file name to atteched file
  postType=req.body.postType  //get file type from file
 } 
 console.log(req.file)

 const newPost=new Post({
  content:req.body.postContent,
  postCreator:req.body.userId,
  timestemp:date,
  sortDate:sortDate,
  Level:(req.body.level).toString(),
  postType:postType,
  filePath:filePath
 })

 //********** push atteched file */
//  newPost.fileAttatched.push(filePath);
 const doc=await newPost.save()
 console.log(doc)

 if(!doc) return res.status(400),send({message:"bad request",success:false});

 user.posts.push(doc._id)
 const doc3=await user.save()

 //***************handel retrived data of the new post */
  // doc.likesNum=doc.Likes.length
  // doc.commentsNum=doc.comments.length
  // doc.postUploader= _.pick(user,['Name','Email','ProfileImagePath','_id','grade'])
  // doc.Likes=undefined;
  // doc.comments=undefined;
  // doc.postCreator=undefined
  // doc.sortDate=undefined

  const theNewPost = await getOnePost(doc._id,user._id)

 return res.status(200).send({message:"post aded successfully",newPost:theNewPost,success:true})


})

//*************** Get the Quiz Results */
router.get("/getQuizResult/:id",async(req,res)=>{
  if (!mongoose.Types.ObjectId.isValid(req.params.id))  return res.status(404).send({message:"invalid userId",success:false});

  const quiz = await Quiz.findById(req.params.id)
  if(!quiz) return res.status(404).send({message:"quiz not found",success:false})

  const results = await getQuizResult(quiz.StudentDone);
  quiz.QuestionNum=quiz.questions.length;
  quiz.quizUploader=await Doctor.findById(quiz.QuizCreator).select('Name ProfileImagePath _id');

  return res.status(200).send({results:results,quiz:_.pick(quiz,['_id','Title','QuestionNum','quizUploader']),success:true})
})


//************************* upload materials version 2 */
router.post("/uploadMaterialVersio2",fileUploader.upload.single("file"),[
  check('userId').not().isEmpty().withMessage("userId id is required"), 
  check('description').not().isEmpty().withMessage("description id is required"), 
  check('level').not().isEmpty().withMessage("description id is required"), 
  check('materialType').not().isEmpty().withMessage("materialType  is required"), 
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({messages:errors,success: false}) // validation errors


  if(!req.file) return res.status(404).send({message:"file is required",success:false})
  console.log(req.file)

  const doctor = await Doctor.findById(req.body.userId);
  if(!doctor) return res.status(404).send({message:"doctor Not found",success:false})

  let filePath= domainName+req.file.filename;
  const newmaterial = new Material({
    description:req.body.description,
    Level:req.body.level,
    FilePath:filePath,
    DocId:doctor._id,
    materialType:req.body.materialType,
  })

  const doc =await newmaterial.save();
  if(!doc) return res.status(400).send({message:"bad request",success:false})

  doctor.materials.push(doc._id)

  const doc2= await doctor.save()
  if(!doc2) return res.status(400).send({message:"bad request",success:false})

  doc.materialuploader= await Doctor.findById(doc.DocId).select('Name Email title ProfileImagePath Gender')
  doc.DocId=undefined;

  return res.status(200).send({message:"material uploadded successfully",material:doc,success:true})


})


//*********************** Create Admin */
router.post('/createAdmin',[
  check("email").not().isEmpty().withMessage("email is Required"),
  check("Name").not().isEmpty().withMessage("student Name Required"),
  check("Password").not().isEmpty().withMessage("password Required"),
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({message:errors,success: false}) // validation errors

  const isFresisteredBefore = await Student.findOne({Email:req.body.email});
  if(isFresisteredBefore)  return res.status(400).send({message:"this student registered before",success: false}) 


 const newAdmin=new Admin({
  Email:req.body.email,
  Name:req.body.Name,
  Password:hashPassword(req.body.Password),
  isadmin:true,
  ProfileImagePath:domainName+'c7d26e23d4a53ebe1516c549c6366b9a.png'
 })
 const doc =await newAdmin.save();
 if(!doc) return res.status(400).send({message:"bad request",success:false})

 return res.status(200).send({message:"Admin created succefully",newAdmin:_.pick(doc,['_id','Name','Email','ProfileImagePath','isadmin']),success:true})
})

 
/// Create Event  By Admin*
router.post('/addEvent',fileUploader.upload.single('file'),[
  check("description").not().isEmpty().withMessage("description is Required"),
  check("Title").not().isEmpty().withMessage("Title is Required"),
  check("adminId").not().isEmpty().withMessage("adminId is Required"),
],async(req,res)=>{
 const errors= await validate(req); 
  if(errors) return res.status(400).send({message:errors,success: false}) // validation errors

  //*********************** check if post is spaces or empty */
  if(isNullOrEmpty(req.body.description)) return res.status(400).send({message:"description  cant be empty",success:false})

  //check is valid id format or not
  if (!mongoose.Types.ObjectId.isValid(req.body.adminId))  return res.status(404).send({message:"invalid adminId",success:false});

  //get student and check if he found or not
  let user= await Admin.findById(req.body.adminId);
  if(!user) return res.status(404).send({message:"Admin Not found",success:false});
  
  
  const date=(await getDate()).toString();
  const sortDate=new Date()
  const day=sortDate.getDay()
  let filePath=''

  console.log(req.file)

 if(req.file){
   console.log(req.file)
  filePath=domainName+req.file.filename;   // set file name to atteched file
 } 

 const newEvent=new Event({
  Description:req.body.description,
  title:req.body.Title,
  eventCreator:req.body.adminId,
  uploadDate:date,
  sortDate:sortDate,
  image:filePath
 })

 //********** push atteched file */
 const doc=await newEvent.save()
 console.log(doc)

 if(!doc) return res.status(400),send({message:"bad request",success:false});

 user.events.push(doc._id)
 const doc3=await user.save()


  const theNewEvent = _.pick(doc,['title','Description','image','uploadDate','_id'])

 return res.status(200).send({message:"Event aded successfully",newEvent:theNewEvent,success:true})


})


//***************************** Get Events *
router.get("/getEvents",async(req,res)=>{

  const events= await Event.find().select('title Description image uploadDate _id');

  return res.status(200).send({events:events.reverse(),success:true})
})


//***************************************Update Events *
/// Create Event  By Admin */ 2
router.post('/updateEvent',fileUploader.upload.single('file'),[
  check("description").not().isEmpty().withMessage("description is Required"),
  check("Title").not().isEmpty().withMessage("Title is Required"),
  check("adminId").not().isEmpty().withMessage("adminId is Required"),
  check("eventId").not().isEmpty().withMessage("eventId is Required"),
],async(req,res)=>{
 const errors= await validate(req); 
  if(errors) return res.status(400).send({message:errors,success: false}) // validation errors

  //*********************** check if post is spaces or empty */
  if(isNullOrEmpty(req.body.description)) return res.status(400).send({message:"description  cant be empty",success:false})

  //check is valid id format or not
  if (!mongoose.Types.ObjectId.isValid(req.body.adminId))  return res.status(404).send({message:"invalid adminId",success:false});

  //get student and check if he found or not
  let user= await Admin.findById(req.body.adminId);
  if(!user) return res.status(404).send({message:"Admin Not found",success:false});


  const event = await Event.findById(req.body.eventId);
  if(!event) return res.status(404).send({message:"Event Not found",success:false});
  
  
  let filePath=''

  console.log(req.file)

 if(req.file){
   console.log(req.file)
  filePath=domainName+req.file.filename;   // set file name to atteched file
  event.image=filePath;
 } 

 event.Description=req.body.Description;
 event.title=req.body.Title;
 event.Description=req.body.description;
 


 //********** push atteched file */
 const doc=await event.save()
 console.log(doc)
 if(!doc) return res.status(400),send({message:"bad request",success:false});


 const theUpdatedEvent = _.pick(doc,['title','Description','image','uploadDate',])

 return res.status(200).send({message:"Event updated successfully",updatedEvent:theUpdatedEvent,success:true})


})


//***************************************Block student reasult by admin
/// Create Event  By Admin */ 2
router.post('/disableStudent',fileUploader.upload.single('file'),[
  check("adminId").not().isEmpty().withMessage("adminId is Required"),
  check("studentId").not().isEmpty().withMessage("eventId is Required"),
],async(req,res)=>{
 const errors= await validate(req); 
  if(errors) return res.status(400).send({message:errors,success: false}) // validation errors

  //*********************** check if post is spaces or empty */

  //check is valid id format or not
  if (!mongoose.Types.ObjectId.isValid(req.body.adminId))  return res.status(404).send({message:"invalid adminId",success:false});

  //get admin
  let user= await Admin.findById(req.body.adminId);
  if(!user) return res.status(404).send({message:"Admin Not found",success:false});


  const student = await Student.findById(req.body.studentId);
  if(!student) return res.status(404).send({message:"student  Not found",success:false});
  
  student.isDisabled = !student.isDisabled;
  const doc =await student.save()
  if(!doc) return res.status(400).send({message:"bad request",success:false});

 return res.status(200).send({message:"student disabled successfully",success:true})


})


// /// Create Event  By Admin */ 2
// router.post('/addMessage',fileUploader.upload.any('file'),[
//   check("senderId").not().isEmpty().withMessage("senderId is Required"),
//   check("reciverId").not().isEmpty().withMessage("reciverId is Required"),
//   check("message").not().isEmpty().withMessage("message is Required"),
// ],async(req,res)=>{
//  const errors= await validate(req); 
//   if(errors) return res.status(400).send({message:errors,success: false}) // validation errors

//   //*********************** check if post is spaces or empty */

//   //check is valid id format or not
//   if (!mongoose.Types.ObjectId.isValid(req.body.senderId))  return res.status(404).send({message:"invalid senderId",success:false});
//   if (!mongoose.Types.ObjectId.isValid(req.body.reciverId))  return res.status(404).send({message:"invalid senderId",success:false});

//   //get sender and check if he found or not
//   let user= await Admin.findById(req.body.senderId);
//   if(!user) user= await Student.findById(req.body.senderId);
//   if(!user) user= await Doctor.findById(req.body.senderId);
//   if(!user) return res.status(404).send({message:"senderId not belongs to nither student nor Doctor nor Admin",success:false});


//     //get reciver and check if he found or not
//     let user1= await Admin.findById(req.body.reciverId);
//     if(!user1) user1= await Student.findById(req.body.reciverId);
//     if(!user1) user1= await Doctor.findById(req.body.reciverId);
//     if(!user1) return res.status(404).send({message:"reciverId not belongs to nither student nor Doctor nor Admin",success:false});


//    //get day of now
//     const date=(await getDate()).toString();
//     const sortDate=new Date()

//     const newMessage = new Message({
//       content:req.body.message,
//       sender:req.body.senderId,
//       reciver:req.body.reciverId,
//       timestemp:date,
//       sortDate:sortDate,
//     })

//     const doc = await newMessage.save()
//     if(!doc) return res.status(400).send({message:"Bad Reaquest",success:false})

   

//  return res.status(200).send({message:"message added successfully",theNewMessage:doc,success:true})


// })


//***************************** Get Messages between tow person */ 
router.get("/getMessages/:currentUserId/:secondUserId",async(req,res)=>{
  if (!mongoose.Types.ObjectId.isValid(req.params.currentUserId))  return res.status(404).send({message:"invalid senderId",success:false});
  if (!mongoose.Types.ObjectId.isValid(req.params.secondUserId))  return res.status(404).send({message:"invalid senderId",success:false});

  const messages= await Message.find({});

  let i = 0
  let temp = []

  for(i ; i < messages.length ; i++){
      if(((messages[i].sender == req.params.currentUserId) && (messages[i].reciver == req.params.secondUserId))  ||
       ((messages[i].reciver == req.params.currentUserId) && (messages[i].sender == req.params.secondUserId))){

         let reciver = await  Student.findById(messages[i].reciver).select('Name email ProfileImagePath')
         if(!reciver) reciver = await  Doctor.findById(messages[i].reciver).select('Name email ProfileImagePath')
         if(!reciver) reciver = await  Admin.findById(messages[i].reciver).select('Name email ProfileImagePath')

         let sender = await  Student.findById(messages[i].sender).select('Name email ProfileImagePath')
         if(!sender) sender = await  Doctor.findById(messages[i].sender).select('Name email ProfileImagePath')
         if(!sender) sender = await  Admin.findById(messages[i].sender).select('Name email ProfileImagePath')

         messages[i].sender1 = sender
         messages[i].reciver1 = reciver

         if(messages[i].sender ==  req.params.currentUserId){
          messages[i].sender = "me"
         }

         await temp.push(messages[i])

      }
  }


  if( i ==  messages.length){

    return res.status(200).send({messages:temp,success:true})

  }
})

//Get user Contacts in chat
router.get('/messagesContacts/:id',async(req,res)=>{
  if (!mongoose.Types.ObjectId.isValid(req.params.id))  return res.status(404).send({message:"invalid senderId",success:false});

  let user= await Admin.findById(req.params.id);
  if(!user) user= await Student.findById(req.params.id);
  if(!user) user= await Doctor.findById(req.params.id);
  if(!user) return res.status(404).send({message:"id not belongs to nither student nor Doctor nor Admin",success:false});

  let i = 0 ;
  let temp = []

  for(i ; i < user.contacts.length ; i++){
    let contactPerson= await Admin.findById(user.contacts[i]).select('Name email ProfileImagePath _id');
    if(!contactPerson) contactPerson= await Student.findById(user.contacts[i]).select('Name email ProfileImagePath _id');
    if(!contactPerson) contactPerson= await Doctor.findById(user.contacts[i]).select('Name email ProfileImagePath _id');
    
    let messages = await getMessages(user._id,contactPerson._id);
    let lastMessage= messages.slice(-1)[0];
    contactPerson.lastMessage = _.pick(lastMessage,['content','timestemp','messageType','sender'])

     temp.push(contactPerson)
  }

  if(i == user.contacts.length){
    return res.status(200).send({contacts:temp.reverse(),success:true})
  } 

})


//get total number of unreaded messages of user
router.get("/unreadMessages/:id",async(req,res) =>{
  if (!mongoose.Types.ObjectId.isValid(req.params.id))  return res.status(404).send({message:"invalid senderId",success:false});
  const messages = await Message.find({reciver:req.params.id});
  let counter = 0 , i =0;

  for( i ; i< messages.length ; i++){
    if(!messages[i].read) counter++
  }
  
 if(i == messages.length){
   return res.status(200).send({unreadMessages:counter,success:true})
 }

})


//assign messages between 2 users as readed
router.get("/readedMessges/:reciver/:sender",async(req,res) =>{
  if (!mongoose.Types.ObjectId.isValid(req.params.reciver))  return res.status(404).send({message:"invalid senderId",success:false});
  if (!mongoose.Types.ObjectId.isValid(req.params.sender))  return res.status(404).send({message:"invalid senderId",success:false});
  const messages = await Message.find({reciver:req.params.reciver,sender:req.params.sender});
  let counter = 0 , i =0 , j=0;

  for( i ; i< messages.length ; i++){
     messages[i].read = true;
     await messages[i].save()
  }
  
 if(i == messages.length){
    const messages1 = await Message.find({reciver:req.params.reciver});
    for( j ; j< messages1.length ; j++){
      if(!messages1[j].read) counter++
    }
    

    if(j == messages1.length){
      return res.status(200).send({unreadMessages:counter,success:true})
    }
  }

})

//get  number of unreaded messages between 2users
router.get("/unreadMessagesBetween2Users/:user1/:user2",async(req,res) =>{
  if (!mongoose.Types.ObjectId.isValid(req.params.user1))  return res.status(404).send({message:"user1 id not valid",success:false});
  if (!mongoose.Types.ObjectId.isValid(req.params.user2))  return res.status(404).send({message:"user2 id not valid",success:false});
  
  const messages = await Message.find({reciver:req.params.user1,sender:req.params.user2});
  let counter = 0 , i =0;

  for( i ; i< messages.length ; i++){
    if(!messages[i].read) counter++
  }
  
 if(i == messages.length){
   return res.status(200).send({unreadMessages:counter,success:true})
 }

})

// contact search */ 
router.post("/contactsSearch",[
  check("key").not().isEmpty().withMessage("key search required"),
  check("userId").not().isEmpty().withMessage("key search required")
],async(req,res)=>{
  const errors= await validate(req); 
  if(errors) return res.status(400).send({message:errors,success: false}) // validation errors

  let user= await Admin.findById(req.body.userId);
  if(!user) user= await Student.findById(req.body.userId);
  if(!user) user= await Doctor.findById(req.body.userId);
  if(!user) return res.status(404).send({message:"id not belongs to nither student nor Doctor nor Admin",success:false});

  let contacts = await contactsSearch(user,req.body.key);

 return res.status(200).send({contacts:contacts,success:true})

})








///************************************************************* Helper Function */****************************************************** */

/////// send email function ******************************////////
async function  main1(to,message,subject){
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: 'OAuth2',
      clientId: '523815564268-d9r77qhps1l7tlcushd3vh3b8qo65481.apps.googleusercontent.com',
      clientSecret: '33cHAN2MMWCoUp2PLPNvgjgB',
      user: 'abanoabfciwadeea@gmail.com',
      refreshToken: '1//04orrZhI2RQCtCgYIARAAGAQSNwF-L9IryyJ2jxZrsJF7u7Ag_YiVOw7SnIVYiplwCx5ZuKUBztgqfUv2DM_GHOodz2aFYKQ1Eo8',
      accessToken: 'ya29.a0AfH6SMAFUqAYCq1lDZCmoYoldC-cMKZhwvo-AWweCadZxOdD-Rz7-LFpcMoJ8glgWmaAxv2RihhQcmvSRyFKufBfsm_hBPU8ntQTjtxU_UCxhnCYLcjxWE_UVJdJVnyh_wtG6ihUO-adc_5VxtUCAnlLfRM8Wty2cvo',
  },
})

transporter.set('oauth2_provision_cb', (user, renew, callback) => {
    let accessToken = userTokens[user];
    if(!accessToken){
        return callback(new Error('Unknown user'));
    }else{
        return callback(null, accessToken);
    }
});

transporter.sendMail({
   from: 'abanoabfciwadeea@gmail.com', // sender address
   to: to,  // list of receivers
   subject: subject, // Subject line
   text: message, // plain text body
});

}

//check if input is space or empty
function isNullOrEmpty(str) {
  return !str || !str.trim();
}

//******* Encrypt  Password */**** */
function hashPassword(password) {
  var salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

//*******  Decrypt Password */**** */
function ComparePassword(password, passwordDB) {
  return bcrypt.compareSync(password, passwordDB);
}

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

//============================helpLogin================
async function helpLoginFunc(req, res, schema) {
  const user = await schema.findOne({ Email: req.body.email });
  if(!user) return res.status(404).send({ message: "invalid email or password",success: false });
  //check if this email  exists or not in db

  if (user) {
    if (ComparePassword(req.body.password, user.Password)) {

      return res.status(200).send({ message: "Success",userId:user._id,level:user.level,isadmin:user.isadmin,  success: true });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid Email Or Password", success: false });
    }
  } else {
    return res
      .status(400)
      .json({ message: "Invalid Email Or Password", success: false });
  }

  //.................................
}

//**************************************** Login func */
async function login(req, res) {
  const errors= await validate(req); 
  if(errors) return res.status(400).send({message:errors,success: false}) // validation errors

  if (req.body) {
    if (req.body.title == "Student") {
      helpLoginFunc(req, res, Student);
    } else if (req.body.title == "Doctor") {
      //..............doc login..................
      helpLoginFunc(req, res, Doctor);
    }else if (req.body.title == "Admin") {
      //..............doc login..................
      helpLoginFunc(req, res, Admin);
    } else {
      return res.status(404).send({
        message:
          "This Title Not Found Choose one of(Student,Doctor,Admin) Titls",
        success: false
      });
    }
  } else {
    return res.status(404).send({
      message:
        "email and password and title(Student, Doctor,Admin) is required",
      success: false
    });
  }
}

//************************** Get posts by leve*/****** */
async function getPostsByLevel(level,currentuserId){
  const posts = await Post.find({Level:level});
  console.log(posts,'posts')
  let i=0;
  let temp=[]
  for(i ; i <posts.length ; i++){
    posts[i].likesNum=posts[i].Likes.length;
    posts[i].commentsNum=posts[i].comments.length;
   
    if(posts[i].postCreator == currentuserId){
      posts[i].mine=true
    }else{
      posts[i].mine=false
    }
    posts[i].postCreator=await Student.findById(posts[i].postCreator).select(' _id Name  Email ProfileImagePath');
    posts[i].isLiked=posts[i].Likes.includes(currentuserId);
    posts[i].comments = await getComments(posts[i]._id,currentuserId)

    posts[i].fileAttatched=undefined;
    posts[i].Likes=undefined;
    // posts[i].comments=undefined;

    temp.push(posts[i])

  }

  if(i == posts.length){
    return temp
  }
}

async function getOnePost(postId,currentuserId){
  const post = await Post.findById(postId);

  post.likesNum=post.Likes.length;
  post.commentsNum=post.comments.length;
 
  if((post.postCreator).toString() == currentuserId.toString()){
    post.mine=true
  }else{
    post.mine=false
  }


  
  let postCreator;
  postCreator = await Student.findById(post.postCreator).select(' _id Name  Email ProfileImagePath Department');
  
  if(postCreator == null)  postCreator = await Doctor.findById(post.postCreator).select(' _id Name  Email ProfileImagePath');
  
  // posts[i].postCreator = postCreator
  post.postUploader = postCreator
  post.isLiked=post.Likes.includes(currentuserId);
  post.comments = await getComments(post._id,currentuserId)

  post.fileAttatched=undefined;
  post.Likes=undefined;
  // posts[i].comments=undefined;

  return post
}

//********************* get post  */
async function getPostbyIds(ides){
  if(!ides) return []

  let i=0;
  let temp=[]

  for(i; ides.length ;i++){
    let post= await Post.findById(ides[i])

    console.log(post)
    post.postUploader=await Student.findById(post.postCreator).select('Name ProfileImagePath Email')
    post.likesNum=post.Likes.length;
    post.commentsNum=post.comments.length;
    
   
    post.fileAttatched=undefined;
    post.Likes=undefined;
    post.comments=undefined;

    temp.push(post);
  }

  if(i == ides.length){
    return temp;
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
//************** get post comments */
async function getOneCommentById(commentId,currentUserId){

    const comment = await Comment.findById(commentId);

    let uploader = await Student.findById(comment.commntCreator).select("Name Email ProfileImagePath _id level");
    if(!uploader) uploader = await Doctor.findById(comment.commntCreator).select("Name Email ProfileImagePath _id level");
    comment.commentUploader= uploader
    // comment.replayes= await getReplayes(comment._id)   // comment replayes
    comment.isLiked=comment.Likes.includes(currentUserId)
    comment.likesNum=comment.Likes.length

    comment.commntCreator=undefined;
    comment.Likes = undefined

    console.log(comment)
    return comment;

}


//************** get post comments */
async function getComments(postId,currentUserId){

  const post = await Post.findById(postId);

  let i=0;
  let temp = [];

  for(i ; i< post.comments.length ; i++ ){
    let comment =await Comment.findById(post.comments[i]);

    let uploader = await Student.findById(comment.commntCreator).select("Name Email ProfileImagePath _id level");
    if(!uploader) uploader = await Doctor.findById(comment.commntCreator).select("Name Email ProfileImagePath _id level");
    comment.commentUploader= uploader

    comment.replayes= await getReplayes(comment._id)   // comment replayes
    comment.isLiked=comment.Likes.includes(currentUserId)
    comment.likesNum=comment.Likes.length
    console.log(comment)

    comment.Likes=undefined
    comment.commntCreator=undefined;

    temp.push(comment);
  }

  if(i == post.comments.length){
    return temp.reverse();
  }
}

//********************** comment replayes */
async function getReplayes(comentId){
  const comment = await Comment.findById(comentId);

  let i=0;
  let temp=[]

  for(i ; i < comment.replayes.length ;i++){
    let replay = await Replay.findById(comment.replayes[i]);
   let user = await Student.findById(replay.replayCreator).select("Name Email ProfileImagePath");
   if(!user) user = await Doctor.findById(replay.replayCreator).select("Name Email ProfileImagePath");

    replay.likesNum= replay.Likes.length
    replay.replayUploader = user
    replay.isLiked = replay.Likes.includes(user._id)

    replay.Likes =undefined;
    replay.replayCreator=undefined;

    temp.push(replay)
  }

  if(i == comment.replayes.length){
    return temp;
  }
}

//********************** */
async function getreplayById(replayId){
  const replay= await Replay.findById(replayId);

  let user = await Student.findById(replay.replayCreator).select("Name Email ProfileImagePath");
  if(!user) user = await Doctor.findById(replay.replayCreator).select("Name Email ProfileImagePath");

  replay.replayUploader = user
  replay.likesNum=replay.Likes.length;

  replay.replayCreator = undefined;
  replay.Likes = undefined;

  return replay;
}

//*********************** get quizes of the same level */
async function getQuizes(studentLevel,currentUserId){
  const quizes = await Quiz.find({Level:studentLevel});

  let ii=0 
  let i=0 
  let j=0 
  let temp = []
  let nestedTemp = false

  for(i ; i<quizes.length ; i++ ){
    quizes[i].questions = await getquesions(quizes[i].questions);
    quizes[i].quizUploader = await Doctor.findById(quizes[i].QuizCreator).select("Name Email  city ProfileImagePath title")
    quizes[i].QuestionNum= quizes[i].questions.length;
    quizes[i].QuizCreator= undefined;
  
      temp.push(quizes[i])

  // quizes[i].StudentDone= undefined;
  // quizes[i].questions=undefined;
 
  }


  if(i == quizes.length){
    return temp.reverse();
  }

}

//************************* get questions */
async function getquesions(qides){

  let i=0;
  let temp=[]

  for(i ; i< qides.length ; i++ ){
    let question = await Questoion.findById(qides[i]);

    temp.push(question);
  }

  if(i == qides.length){
    return temp;
  }
}

//********************** get one quiz byid */
async function getQuiz(quizId){
  const quiz= await Quiz.findById(quizId);

  quiz.questions = await getquesions(quiz.questions);
  quiz.quizUploader = await Doctor.findById(quiz.QuizCreator).select("Name Email  city ProfileImagePath")
    
  quiz.QuizCreator= undefined;
  quiz.StudentDone= undefined;

  return quiz;
}

//************ get students of the same level */
async function getStudents(level,currentuserId){
  const students = await Student.find({level:level}).select('Name Email ProfileImagePath grade city Address level Gender Department')
  
  let i =0;
  let temp = []

  for(i ; i < students.length ; i++){
    if(!((students[i]._id).toString() == currentuserId.toString())){
      temp.push(students[i])
    }
  }

  if(i == students.length){
    return temp
  }
}

//************ get students of the same level */
async function getStudentsByDoc(){
  const students = await Student.find({}).select('Name Email ProfileImagePath grade city Address level Gender Department isDisabled')
    return students
}


//*******************students search */
async function studentsSearch(studentId,key,level){
  const result = await Student.find({ Name: { $regex: key, $options: "i" },level:level}).select('Name Email ProfileImagePath grade city Address level Gender Department');

  let i =0;
  let temp = []

  for(i ; i<result.length; i++){
    if(!((result[i]._id).toString() == studentId.toString())){
      temp.push(result[i])
    }
  }

  if(i == result.length){

    return temp
  }
}

///************************ doctor search  */
async function doctorsSearch(userId,key){
  const result = await Doctor.find({ Name: { $regex: key, $options: "i" }}).select('Name Email ProfileImagePath grade city Address title Gender Department');

  let i =0;
  let temp = []

  for(i ; i<result.length; i++){
    if(!((result[i]._id).toString() == userId.toString())){
      temp.push(result[i])
    }
  }

  if(i == result.length){

    return temp
  }
}

//*******************students search */
async function studentsSearchbyDoctor(key){
  const result = await Student.find({ Name: { $regex: key, $options: "i" }}).select('Name Email ProfileImagePath grade city Address level Gender Department isDisabled');
    return result
}

//************************** Get posts by leve*/****** */
async function getPostsByLevelByDocOrStudent(level,currentuserId){
  const posts = await Post.find({Level:level});
  console.log(posts,'posts')

  let i=0;
  let temp=[]
  for(i ; i <posts.length ; i++){
    posts[i].likesNum=posts[i].Likes.length;
    posts[i].commentsNum=posts[i].comments.length;
   
    if((posts[i].postCreator._id).toString() == (currentuserId).toString()){
      posts[i].mine=true
    }else{
      posts[i].mine=false
    }

    //check and get post uploader if doc or student
    let postCreator;
    postCreator =await Student.findById(posts[i].postCreator).select(' _id Name  Email ProfileImagePath Department');
    
    if(postCreator == null)  postCreator = await Doctor.findById(posts[i].postCreator).select(' _id Name  Email ProfileImagePath');
    console.log(postCreator,"jjjjjjjjjjjjjjjjjjjjjjj")
    
    // posts[i].postCreator = postCreator
    posts[i].postUploader = postCreator

    console.log(posts[i].postCreator,"iiiiiiiiiiiii000000000000")
   
    posts[i].isLiked=posts[i].Likes.includes(currentuserId);
    posts[i].comments = await getComments(posts[i]._id,currentuserId)

    posts[i].fileAttatched=undefined;
    posts[i].Likes=undefined;
    // posts[i].comments=undefined;

    temp.push(posts[i])

  }

  if(i == posts.length){
    return temp
  }
}

// get all doctors
async function getDoctors(userId){
  const doctors = await Doctor.find({});

  let i =0;
  let temp = []

  for(i ; i<doctors.length ; i++){
    if(!(userId.toString() == (doctors[i]._id).toString())){
      doctors[i].quizes=undefined;
      doctors[i].Likes=undefined;
      doctors[i].posts=undefined;
      doctors[i].materials=undefined;
      doctors[i].Password=undefined;
      temp.push(doctors[i])
    }
  }

  if(i == doctors .length){
    return temp;
  }
}

//get material bey student level
async function getMaterialsByLevel(level){
  const materials =await Material.find({Level:level});

  let i=0;
  let temp=[]

  for(i ; i<materials.length ; i++){
    materials[i].materialuploader = await Doctor.findById(materials[i].DocId).select('Name Email title ProfileImagePath Gender');
    materials[i].DocId=undefined;
    temp.push(materials[i])
  }

  if(i == materials.length){
    return temp.reverse();
  }
}

// get  doctor material
async function getDoctorMaterial(materialIdes){
  let i=0;
  let temp =[]

  for(i ; i < materialIdes.length ; i++){
    let material =await Material.findById(materialIdes[i]);
    material.materialuploader = await Doctor.findById(material.DocId).select('Name Email title ProfileImagePath Gender');
    material.DocId=undefined;

    temp.push(material)
  }

  if(i == materialIdes.length){
    return temp.reverse();
  }
}

// get  doctor qyizes
async function getDoctorUpladedQuizes(quizesIdes){

  if(!quizesIdes) return []
  let i= 0;
  let temp = []

  for(i ; i < quizesIdes.length ; i++){
      let quiz = await Quiz.findById(quizesIdes[i]);
      if(!quiz) continue;
        let q=0
        if(!quiz.questions){

        }else{
          q=quiz.questions.length
        }
        quiz.QuestionNum=q
        quiz.quizUploader = await Doctor.findById(quiz.QuizCreator).select("Name Email title  city ProfileImagePath")
        quiz.questions=undefined
        quiz.QuizCreator=undefined
        quiz.StudentDone=undefined
        quiz.StudentDone=undefined
        quiz.questions=undefined
        temp.push(quiz)
  }

  if(i == quizesIdes.length){
    return temp.reverse();
  }
}


async function getQuizResult(studentDoneIdes){
  if(!studentDoneIdes)  return []

  let j= 0;
  let temp2 = []

  for(j ; j < studentDoneIdes.length ; j++){
    let studentDone = await Result.findById(studentDoneIdes[j]);
     studentDone.student = await  Student.findById(studentDone.studentId).select('Name Email title ProfileImagePath Gender level isDisabled');
    //  studentDone.student.isDisabled=false;
     if(studentDone.student.isDisabled == true){
      studentDone.Result='disabled'
     }

     studentDone.studentId= undefined;
     temp2.push(studentDone)
  }


  if( j == studentDoneIdes.length){
    return temp2
  }


}



async function getMessages(currentUserId,secondUserId){
  const messages= await Message.find({});

  let i = 0
  let temp = []

  for(i ; i < messages.length ; i++){
      if(((messages[i].sender ==currentUserId) && (messages[i].reciver ==secondUserId))  ||
       ((messages[i].reciver == currentUserId) && (messages[i].sender == secondUserId))){

         let reciver = await  Student.findById(messages[i].reciver).select('Name email ProfileImagePath')
         if(!reciver) reciver = await  Doctor.findById(messages[i].reciver).select('Name email ProfileImagePath')
         if(!reciver) reciver = await  Admin.findById(messages[i].reciver).select('Name email ProfileImagePath')

         let sender = await  Student.findById(messages[i].sender).select('Name email ProfileImagePath')
         if(!sender) sender = await  Doctor.findById(messages[i].sender).select('Name email ProfileImagePath')
         if(!sender) sender = await  Admin.findById(messages[i].sender).select('Name email ProfileImagePath')

         messages[i].sender1 = sender
         messages[i].reciver1 = reciver

         if(messages[i].sender ==  currentUserId){
          messages[i].sender = "me"
         }

         await temp.push(messages[i])

      }
    }

    if(i ==  messages.length){
      return temp
    }
}

//message contacts search
///************************ doctor search  */
async function contactsSearch(user,key){

  let i = 0 ;
  let j = 0 ;
  let temp = []
  let temp2 = []

  for(i ; i < user.contacts.length ; i++){
    let contactPerson= await Admin.findById(user.contacts[i]).select('Name email ProfileImagePath _id');
    if(!contactPerson) contactPerson= await Student.findById(user.contacts[i]).select('Name email ProfileImagePath _id');
    if(!contactPerson) contactPerson= await Doctor.findById(user.contacts[i]).select('Name email ProfileImagePath _id');
    
    let messages = await getMessages(user._id,contactPerson._id);
    let lastMessage= messages.slice(-1)[0];
    contactPerson.lastMessage = _.pick(lastMessage,['content','timestemp','messageType','sender'])

     temp.push(contactPerson)
  }

  if(i == user.contacts.length){
    for(j ; j < temp.length; j++){
      if(((temp[j].Name).toLowerCase()).includes(key.toLowerCase())){
        temp2.push(temp[j])
      }
    }

    if(j == temp.length){

      return temp2
    }
  } 
}


module.exports = router;
