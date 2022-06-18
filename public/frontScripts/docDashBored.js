const timeLine = document.getElementById('timeLine')
const profileLink=document.getElementById("profileLink")
const userId=window.location.pathname.slice(14)  //get user id from url
const userProfileImage=document.getElementById("userProfileImage")
const logoutLink=document.getElementById("logoutLink")
const sideBarImage=document.getElementById("sideBarImage")
const sideBarName=document.getElementById("sideBarName")
const studentsSideBarLink=document.getElementById("studentsSideBarLink")
const studentssideBar2=document.getElementById("studentssideBar2")
const doctorSideBarLink=document.getElementById("doctorSideBarLink")
const doctorssideBar2=document.getElementById("doctorssideBar2")
const isDoc =localStorage.getItem("doc")
const quizesLink=document.getElementById('quizesLink')
const materialLink=document.getElementById("materialLink")
const doneQuizesLink=document.getElementById("doneQuizes")
const  welcomMesage=document.querySelector('.welcome-message')
const unreadMessages=document.getElementById("unreadMessages")
const socket = io.connect()


/////animation Area
let text = document.getElementById('text');
window.addEventListener('scroll', function () {
  let value = window.scrollY;
  text.style.marginBottom = value * 2 + 'px';
});

/////End animation Area

if(isDoc == true || isDoc =="true"){
    doneQuizesLink.innerHTML = 'uploaded Quizes'
    
}else{
    doneQuizesLink.innerHTML = 'Done Quizes'
    
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
///if is doctor change links
if(isDoc == true || isDoc =="true"){
    quizesLink.innerHTML="Create Quiz"
}else{
    quizesLink.innerHTML="Quizes"
}


///************ handling get all quizes link when clicked */
materialLink.addEventListener("click",(e)=>{
    e.preventDefault()
    if(isDoc == true || isDoc =="true"){
        quizesLink.href=`/uploadMaterial/${userId}`
        location.href=`/uploadMaterial/${userId}`
    }else{
        quizesLink.href=`/materials/${userId}`
        location.href=`/materials/${userId}`
    }
    
    
})

/// profile like handel href when click
profileLink.addEventListener("click",(e)=>{
    e.preventDefault()
    location.href=`/profile/${userId}`
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

/// logout like handel href when click
logoutLink.addEventListener("click",(e)=>{
    e.preventDefault()
    localStorage.removeItem("userId");
    localStorage.removeItem("doc");
    location.href='/login'
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
           welcomMesage.innerHTML=`Hi Dr ${User.Name}`
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