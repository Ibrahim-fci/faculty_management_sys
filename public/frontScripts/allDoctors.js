const doctors = document.querySelector('.doctors');
const userId=window.location.pathname.slice(9)  //get user id from url 
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
let isDoc=localStorage.getItem("doc")
let gloabalDoctorstContainer;
const studentsSideBarLink=document.getElementById("studentsSideBarLink")
const studentssideBar2=document.getElementById("studentssideBar2")
const quizesLink=document.getElementById('quizesLink')
const materialLink=document.getElementById("materialLink")

const doneQuizesLink=document.getElementById("doneQuizes")
const unreadMessages=document.getElementById("unreadMessages")
const socket = io.connect()


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


console.log(userId)



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


if(isDoc == true || isDoc =="true"){
    quizesLink.innerHTML="Create Quiz"
    timeLine.innerHTML ='DashBored'
}else{
    quizesLink.innerHTML="Quizes"
    timeLine.innerHTML ='feedes'
}




///************ handling get all student link when clicked */
studentsSideBarLink.addEventListener("click",(e)=>{
    studentsSideBarLink.href=`/students/${userId}`
    location.href=`/students/${userId}`
    e.preventDefault()
    
})

///************ handling get all student link when clicked */
studentssideBar2.addEventListener("click",(e)=>{
    e.preventDefault()
    studentsSideBarLink.href=`/students/${userId}`
    location.href=`/students/${userId}`
    
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




/********************* get all doctors */
fetch(`/api/doctorsByDoc/${userId}`)
.then(json=> json.json())
.then(json=>{
        console.log(json)
    if(json.success  == true){
          doctors.innerHTML = json.doctors.map(doctor=>{
                return `
                   <div class="profile clearfix mb-3">
                        <div class="left">
                            <img src="${doctor.ProfileImagePath}" alt="profileImage">
                        </div>
                        <div class="mid ">
                        <a href="/profile/${doctor._id}" style="text-decoration:none"><h6>${doctor.title}/${doctor.Name}</h6></a>
                            
                            <p class="text-muted">
                                <i class="fas fa-map-marker-alt"></i>
                                ${doctor.city} &nbsp; ${doctor.Gender} <br>
                            </p>
                            <span>${doctor.Email}</span>
                            
                        </div>
                        <div class="right ">
                        <button type="submit" class="btn btn-danger float-right mt-1" onclick="profile('${doctor._id}')">Profile</button>
                        <a
                            onclick="chat('${doctor._id}')"
                            type="submit"
                            class="btn btn-primary float-right mr-1 mt-1"
                            style="color: #fff;"
                            >
                            <i class="fas fa-comment-dots"></i>
                        </a>
                        </div>
                    
                    </div>
                            
                    `
            })

            gloabalDoctorstContainer= doctors.innerHTML

    }
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

           if(User.title){
             isDoc=true;
           }
       }
})

/


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





//*********************** Students search area */
searchInput.addEventListener("input",(e)=>{
    e.preventDefault();

    //if search input is empty set all students
    if(searchInput.value == ''){
        doctors.innerHTML=gloabalDoctorstContainer
        return
    }

   

        const data={
            userId:userId,
            searchKey:searchInput.value,
        }

        fetch('/api/doctorsSearch',{
            method: 'POST', 
            headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body:JSON.stringify(data)
        }).then(response=>{
            return response.json()
        }).then(json=>{
            console.log(json)
            if(json.success  == true){
                doctors.innerHTML = json.doctors.map(doctor=>{
                            return `
                            <div class="profile clearfix mb-3">
                            <div class="left">
                                <img src="${doctor.ProfileImagePath}" alt="profileImage">
                            </div>
                            <div class="mid ">
                            <a href="/profile/${doctor._id}" style="text-decoration:none"><h6>${doctor.title}/${doctor.Name}</h6></a>
                                
                                <p class="text-muted">
                                    <i class="fas fa-map-marker-alt"></i>
                                    ${doctor.city} &nbsp; ${doctor.Gender} <br>
                                </p>
                                <span>${doctor.Email}</span>
                                
                            </div>
                            <div class="right ">
                                <button type="submit" class="btn btn-danger float-right mt-1" onclick="profile('${doctor._id}')">Profile</button>
                                <a
                                    onclick="chat('${doctor._id}')"
                                    type="submit"
                                    class="btn btn-primary float-right mr-1 mt-1"
                                    style="color: #fff;"
                                    >
                                    <i class="fas fa-comment-dots"></i>
                                </a>
                            </div>
                        
                        </div>
                                  
                          `
                  })
      
      
            }
        })

})




//when viewProfile clicked
async function profile(id){
    location.href=`/profile/${id}`
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

async function chat(id){
    location.href = `/chat/${id}`
}




// socket area 
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