const name = document.getElementById('name')
const sideName = document.getElementById('sideName')
const grade = document.getElementById('grade')
const bio = document.getElementById('bio')
const email = document.getElementById('email')
const imageSide = document.getElementById('imageSide')
const userProfileImage = document.getElementById('userProfileImage')
const maiImage = document.getElementById('maiImage')
const modelImage = document.getElementById('modelImage')
let editButton = document.getElementById('editButton')
let changePhoto = document.getElementById('changePhoto')
const userId=window.location.pathname.slice(9)  //get user id from url
const userIdFromStorage = localStorage.getItem('userId')
const timeLine = document.getElementById('timeLine')
const studentsSideBarLink=document.getElementById("studentsSideBarLink")
const studentssideBar2=document.getElementById("studentssideBar2")
const logoutLink=document.getElementById("logoutLink")
const savePhoto=document.getElementById("savePhoto")
const photo=document.getElementById("photo")
const profileLink=document.getElementById("profileLink")
const heartModel=document.getElementById("heartModel")
const updatedbio=document.querySelector(".updatedbio")
const oldPassword=document.querySelector(".oldPassword")
const newPassword=document.querySelector(".newPassword")
const updateSubmit=document.getElementById("updateSubmit")
let error =document.getElementById('error')
const doctorSideBarLink=document.getElementById("doctorSideBarLink")
const doctorssideBar2=document.getElementById("doctorssideBar2")
const quizesLink=document.getElementById('quizesLink')
let isDoc =localStorage.getItem('doc');
const materialLink=document.getElementById("materialLink")
let timlinePath;
console.log(userId)
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




///************ handling get student timeLine link when clicked */
timeLine.addEventListener("click",(e)=>{
    if(isDoc == true || isDoc == "true"){
        timlinePath = `/docDashBoard/${userId}`
    }else{
        timlinePath = `/feedes/${userId}`
    }

    e.preventDefault()
    timeLine.href=timlinePath
    location.href=timlinePath
    
})

 ///************ handling get all quizes link when clicked */
 quizesLink.addEventListener("click",(e)=>{
   
    
    if(isDoc == true || isDoc == "true"){
        quizPath=`/createQiz/${userIdFromStorage}`;
    }else{
        quizPath=`/quizes/${userIdFromStorage}`;
      
    }
    e.preventDefault()
    e.preventDefault()
    quizesLink.href=quizPath
    location.href=quizPath
    
    
})


///************ handling get all student link when clicked */
studentsSideBarLink.addEventListener("click",(e)=>{
    e.preventDefault()
    studentsSideBarLink.href=`/students/${userIdFromStorage}`
    location.href=`/students/${userIdFromStorage}`
    
})

///************ handling get all student link when clicked */
studentssideBar2.addEventListener("click",(e)=>{
    e.preventDefault()
    studentsSideBarLink.href=`/students/${userIdFromStorage}`
    location.href=`/students/${userIdFromStorage}`
    
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


//check if profile belong me or not
if(!(userId == userIdFromStorage)){
    editButton.style='display:none'
    changePhoto.style='display:none'
    savePhoto.style='display:none'
}

/// logout like handel href when click
logoutLink.addEventListener("click",(e)=>{
    // e.preventDefault()
    localStorage.removeItem("userId");
    localStorage.removeItem("doc");
    logoutLink.href='/login'
})

/// profile like handel href when click
profileLink.addEventListener("click",(e)=>{
    e.preventDefault()
    location.href=`/profile/${userIdFromStorage}`
})


heartModel.addEventListener("click",(e)=>{
    e.preventDefault()
    if(heartModel.className == 'far fa-heart fa-lg'){
        heartModel.className= 'fas fa-heart fa-lg'
        heartModel.style='color:red'
    }else{
        heartModel.className= 'far fa-heart fa-lg'
        heartModel.style='none'
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
           maiImage.src=`${User.ProfileImagePath}`
           modelImage.src=`${User.ProfileImagePath}`
           name.innerHTML= `${User.Name}`
           email.innerHTML=User.Email+email.innerHTML
           grade.innerHTML=`${User.Department}(${User.level})`
           bio.innerHTML=User.bio
           updatedbio.value=User.bio

           if(User.title){
             grade.innerHTML=`${User.city}(${User.Gender})`
             name.innerHTML= `${User.title}/${User.Name}`
           }
       }
})

////******************** get current usert  */
fetch('/api/studentOrDocInfo/'+userIdFromStorage).then(res=>{
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



///****************update profile image */
savePhoto.addEventListener("click",(e)=>{
    e.preventDefault()

    if(!photo.files[0]){
        console.log("file is empty")
    }
    const body=new FormData()
    body.append('file',photo.files[0])
    body.append('userId',userId)

   

console.log(photo.files[0])
fetch('/api/updateProfileImage',{
    method: 'POST', 
    // headers: {
    // 'Content-Type': 'application/json'
    // // 'Content-Type': 'application/x-www-form-urlencoded',
    // },
    body:body
}).then(response=>{
    return response.json()
}).then(json=>{
    console.log(json)
    if(json.success == true){
        let User= json.user;
        userProfileImage.src=`${User.ProfileImagePath}`
        imageSide.src=`${User.ProfileImagePath}`
        maiImage.src=`${User.ProfileImagePath}`
        modelImage.src=`${User.ProfileImagePath}`
    }
    

})
})



///********************* on file chenged */
photo.addEventListener("input",(e)=>{
    e.preventDefault()
    maiImage.src=URL.createObjectURL(e.target.files[0]) 
    modelImage.src=URL.createObjectURL(e.target.files[0]) 
})




updatedbio.addEventListener("input",(e)=>{
    error.innerHTML = ''
})

oldPassword.addEventListener("input",(e)=>{
    error.innerHTML = ''
})

newPassword.addEventListener("input",(e)=>{
    error.innerHTML = ''
})


//****************update profile image */
updateSubmit.addEventListener("click",(e)=>{
    e.preventDefault()

    const body={
        oldPassword:oldPassword.value,
        newPassword:newPassword.value,
        userId:userId,
        bio:updatedbio.value,
    }
    
    console.log(body)

   

console.log(photo.files[0])
fetch('/api/updatepassword',{
    method: 'POST', 
    headers: {
    'Content-Type': 'application/json'
    // // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body:JSON.stringify(body)
}).then(response=>{
    return response.json()
}).then(json=>{
    console.log(json)
    if(json.success == true){
        error.innerHTML=`<div class="alert alert-success">${json.message}</div>`
        bio.innerHTML=json.updatedUser.bio
        oldPassword.value=''
        newPassword.value=''
    }else if(json.message == 'old password is incorrect'){
        error.innerHTML = `<div class="alert alert-danger">old password is incorrect</div>`
    }else{
        error.innerHTML = json.message.map(error=>{
            return `
                <div class="alert alert-danger">${error}</div>
              `
        })
    }
    

})
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