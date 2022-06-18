const students = document.querySelector('.students');
const userId=window.location.pathname.slice(10)  //get user id from url 
const userId11=document.getElementById("userId")  //get user id from url 
const logoutLink=document.getElementById("logoutLink")
const searchInput=document.getElementById("searchInput")
const profileLink=document.getElementById("profileLink")
const timeLine = document.getElementById('timeLine')
const sideBarImage=document.getElementById("sideBarImage23")
const sideBarName=document.getElementById("sideBarName")
const userProfileImage = document.getElementById('userProfileImage')
const imageSide = document.getElementById('imageSide')
const sideName = document.getElementById('sideName')
const studentsSideBarLink=document.getElementById("studentsSideBarLink")
const studentssideBar2=document.getElementById("studentssideBar2")
const materialLink=document.getElementById("materialLink")
let gloabalStudentContainer;
let isDoc=localStorage.getItem('doc');
const doctorSideBarLink=document.getElementById("doctorSideBarLink")
const doctorssideBar2=document.getElementById("doctorssideBar2")
console.log(userId)
const doneQuizesLink=document.getElementById("doneQuizes")
const header=document.getElementById("header")
const unreadMessages=document.getElementById("unreadMessages")
const socket = io.connect()




if(isDoc == true || isDoc =="true"){
    quizesLink.innerHTML="Create Quiz"
    timeLine.innerHTML ='DashBored'
    doneQuizesLink.innerHTML = 'uploaded Quizes'
    header.innerHTML='All Uploaded Quizes'
}else{
    quizesLink.innerHTML="Quizes"
    timeLine.innerHTML ='feedes'
    doneQuizesLink.innerHTML = 'Done Quizes'
    header.innerHTML='All Done Quizes'
}

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

fetch('/api/studentOrDocInfo/'+userId).then(res=>{
    return res.json()
   }).then(json=>{
       console.log(json)
       if(json.success == true){
           const User=json.user
           localStorage.setItem("imageProfile",User.ProfileImagePath)
           userProfileImage.src=`${User.ProfileImagePath}`
           imageSide.src=`${User.ProfileImagePath}`
           sideName.innerHTML= `${User.Name}`

       }
})
 


fetch(`/api/doctorUploadedQuizes/${userId}`).then(response=>{
    return response.json()
}).then(json=>{
    console.log(json)
    if(json.success  == true){
        students.innerHTML = json.quizes.map(quiz=>{
            return `
                        <div class="profile clearfix mb-3">
                        <div class="left">
                            <img src="${quiz.quizUploader.ProfileImagePath}" alt="profileImage">
                        </div>
                        <div class="mid ">
                            <a href="/profile/${quiz.quizUploader._id}" style="text-decoration:none"><h6>${quiz.quizUploader.title}/${quiz.quizUploader.Name}</h6></a>
                          
                            <p class="text-muted"> ${quiz.Title}</p>
                            <p class="text-muted"> ${quiz.QuestionNum}  Questions</p>
                            <span> ${quiz.quizUploader.Email} </span>
                        </div>
                        
                        <div class="right ">
                            <i class="fas fa-star fa-lg "  onclick="star('${quiz._id}')" id="s${quiz._id}"></i>
                            <button type="submit" class="btn btn-primary"  onclick="StartQuizBtn('${quiz._id}')">Show Result</button>
                        </div>
                    </div>
                        
                   `
        })
    }
})







/// logout like handel href when click
logoutLink.addEventListener("click",(e)=>{
    e.preventDefault()
    localStorage.removeItem("userId");
    localStorage.removeItem("doc");
    location.href='/login'
})

/// logout like handel href when click
profileLink.addEventListener("click",(e)=>{
    e.preventDefault()
    location.href=`/profile/${userId}`
})

///************ handling get student timeLine link when clicked */
///************ handling get student timeLine link when clicked */
timeLine.addEventListener("click",(e)=>{
    if(isDoc == true || isDoc=="true"){
        timlinePath = `/docDashBoard/${userId}`
    }else{
        timlinePath = `/feedes/${userId}`
    }

    e.preventDefault()
    timeLine.href=timlinePath
    location.href=timlinePath
    
})






    

//when viewProfile clicked
async function StartQuizBtn(id){
    location.href=`/quizResult/${id}`
}


async function star(id){
    console.log(id)
let star =document.getElementById(`s${id}`)

    if(star.className == 'far fa-star fa-lg'){
        star.className='fas fa-star fa-lg'
    }else{
        star.className = 'far fa-star fa-lg'
    }
}


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