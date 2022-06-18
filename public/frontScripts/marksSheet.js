const profileLink=document.getElementById("profileLink")
const userProfileImage=document.getElementById("userProfileImage")
const logoutLink=document.getElementById("logoutLink")
const sideBarImage=document.getElementById("sideBarImage")
const sideBarName=document.getElementById("sideBarName")
const studentsSideBarLink=document.getElementById("studentsSideBarLink")
const studentssideBar2=document.getElementById("studentssideBar2")
const timeLine = document.getElementById('timeLine')
const doctorSideBarLink=document.getElementById("doctorSideBarLink")
const doctorssideBar2=document.getElementById("doctorssideBar2")
// const userId=window.location.pathname.slice(8)  //get user id from url
const userId=localStorage.getItem("userId")  //get user id from url
const quizId=window.location.pathname.slice(12) 
const isDoc= localStorage.getItem("doc")
console.log(userId)
const materialLink=document.getElementById("materialLink")
const Results=document.getElementById("Results")
const quizTitle=document.getElementById("quizTitle")
const NameAndToTalMarks=document.getElementById("NameAndToTalMarks")
const doneQuizesLink=document.getElementById("doneQuizes")
const unreadMessages=document.getElementById("unreadMessages")
const socket = io.connect()



if(isDoc == true || isDoc =="true"){
    doneQuizesLink.innerHTML = 'uploaded Quizes'
    quizesLink.innerHTML="Create Quiz"
    timeLine.innerHTML ='DashBored'
    
}else{
    doneQuizesLink.innerHTML = 'Done Quizes'
    quizesLink.innerHTML="Quizes"
    timeLine.innerHTML ='feedes'
    
}



///************ handling get all quizes link when clicked */
doneQuizesLink.addEventListener("click",(e)=>{
    e.preventDefault()
    if(isDoc == true || isDoc =="true"){
        doneQuizesLink.href=`/myQuizes/${userId}`
        location.href=`/myQuizes/${userId}`
    }else{
        doneQuizesLink.href=`/myQuizes/${userId}`
        location.href=`/myQuizes/${userId}`
    }
    
    
})

 ///************ handling get all quizes link when clicked */
 quizesLink.addEventListener("click",(e)=>{
   
    
    if(isDoc == true || isDoc == "true"){
        quizPath=`/createQiz/${userId}`;
    }else{
        quizPath=`/quizes/${userId}`;
      
    }
    e.preventDefault()
    e.preventDefault()
    quizesLink.href=quizPath
    location.href=quizPath
    
    
})

///************ handling get all quizes link when clicked */
materialLink.addEventListener("click",(e)=>{
    e.preventDefault()
    if(isDoc == true || isDoc =="true"){
        materialLink.href=`/uploadMaterial/${userId}`
        location.href=`/uploadMaterial/${userId}`
    }else{
        materialLink.href=`/materials/${userId}`
        location.href=`/materials/${userId}`
    }
    
    
})






////******************** get student meta data */
fetch('/api/studentOrDocInfo/'+userId).then(res=>{
    return res.json()
   }).then(json=>{
       console.log(json)
       if(json.success == true){
           const User=json.user
           localStorage.setItem("imageProfile",User.ProfileImagePath)
           userProfileImage.src=`${User.ProfileImagePath}`
           sideBarImage.src=`${User.ProfileImagePath}`
           sideBarName.innerHTML= `${User.Name}`
       }
})


///************ handling get student timeLine link when clicked */
timeLine.addEventListener("click",(e)=>{
    e.preventDefault()

    if(isDoc == true  || isDoc == "true"){
        location.href=`/docDashBoard/${userId}`
    }else{
        location.href=`/feedes/${userId}`
    }
    
})


///************ handling get all student link when clicked */
studentsSideBarLink.addEventListener("click",(e)=>{
    e.preventDefault()
    studentsSideBarLink.href=`/students/${userId}`
    location.href=`/students/${userId}`
    
})

///************ handling get all student link when clicked */
studentssideBar2.addEventListener("click",(e)=>{
    e.preventDefault()

    studentsSideBarLink.href=`/students/${userId}`
    location.href=`/students/${userId}`
    
})



//************ handling get all doctors link when clicked */
doctorssideBar2.addEventListener("click",(e)=>{
    e.preventDefault()
    doctorssideBar2.href=`/doctors/${userId}`
    location.href=`/doctors/${userId}`
    
})

///************ handling get all doctors link when clicked */
doctorSideBarLink.addEventListener("click",(e)=>{
    e.preventDefault()
    doctorSideBarLink.href=`/doctors/${userId}`
    location.href=`/doctors/${userId}`
    
})


/// logout like handel href when click
logoutLink.addEventListener("click",(e)=>{
    // e.preventDefault()
    localStorage.removeItem("userId");
    localStorage.removeItem("doc");
    logoutLink.href='/login'
})

/// logout like handel href when click
profileLink.addEventListener("click",(e)=>{
    e.preventDefault()
    location.href=`/profile/${userId}`
})


fetch(`/api/getQuizResult/${quizId}`).then(response=>{
    return response.json()
}).then(json=>{
    console.log(json)
    if(json.success  == true){
        let counter=0;

        quizTitle.innerHTML = json.quiz.Title
        NameAndToTalMarks.innerHTML = `Dr : ${json.quiz.quizUploader.Name} &nbsp; Total : ${json.quiz.QuestionNum}`
        Results.innerHTML = json.results.map(result=>{
            counter++
            return `
                        <tr>
                            <th scope="row">${counter}</th>
                            <td>${result.student.Name}</td>
                            <td>${result.Result}</td>
                        </tr>
                        
                `
        })
    }
})


//get number of un readed messages
fetch(`/api/unreadMessages/${userId}`).then(response=>{
    return response.json()
  }).then(json=>{
    console.log(json)
    if(json.success == true){
        unreadMessages.innerHTML = `${json.unreadMessages}`
    }
  })
  //********************* socket area */
  //************************* socket Area */
  socket.on("newMessage",(data)=>{
    if(data.reciver == userId){
        fetch(`/api/unreadMessages/${userId}`).then(response=>{
            return response.json()
        }).then(json=>{
            console.log(json)
            if(json.success == true){
                unreadMessages.innerHTML = `${json.unreadMessages}`
            }
        })
    }
  })