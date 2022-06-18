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
let isDoc=localStorage.getItem("doc")
let gloabalStudentContainer;
const doctorSideBarLink=document.getElementById("doctorSideBarLink")
const doctorssideBar2=document.getElementById("doctorssideBar2")
const quizesLink=document.getElementById('quizesLink')
const materialLink=document.getElementById("materialLink")
let quizPath;
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
        materialLink.href=`/uploadMaterial/${userId}`
        location.href=`/uploadMaterial/${userId}`
    }else{
        materialLink.href=`/materials/${userId}`
        location.href=`/materials/${userId}`
    }
    
    
})



if(isDoc == true || isDoc =="true"){
    quizesLink.innerHTML="Create Quiz"
}else{
    quizesLink.innerHTML="Quizes"
}


if(isDoc == true || isDoc=="true"){
    timlinePath = `/docDashBoard/${userId}`

    /********************* get all students of the same level */
    fetch(`/api/studentsByDoc/${userId}`)
    .then(json=> json.json())
    .then(json=>{
        console.log(json)
        if(json.success  == true){
            students.innerHTML = json.students.map(student=>{
                return `
                            <div class="profile clearfix mb-3">
                            <div class="left">
                                <img src="${student.ProfileImagePath}" alt="profileImage">
                            </div>
                            <div class="mid ">
                                <a href="/profile/${student._id}" style="text-decoration:none"><h6>${student.Name}</h6></a>
                                <p class="text-muted">
                                    <i class="fas fa-map-marker-alt"></i>
                                    ${student.Email} &nbsp;${student.Gender}<br>
                                </p>
                                <span> ${student.Department} (${student.level})</span>
                            </div>
                            <div class="right ">
                            <button type="submit" class="btn btn-danger float-right mt-1" onclick="profile('${student._id}')">Profile</button>
                            <a
                                onclick="chat('${student._id}')"
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

            gloabalStudentContainer= students.innerHTML

        }
})

}else{
    timlinePath = `/feedes/${userId}`

    /********************* get all students of the same level */
        fetch(`/api/students/${userId}`)
        .then(json=> json.json())
        .then(json=>{
            console.log(json)
            if(json.success  == true){
                students.innerHTML = json.students.map(student=>{
                    return `
                                <div class="profile clearfix mb-3">
                                <div class="left">
                                    <img src="${student.ProfileImagePath}" alt="profileImage">
                                </div>
                                <div class="mid ">
                                    <a href="/profile/${student._id}" style="text-decoration:none"><h6>${student.Name}</h6></a>
                                    <p class="text-muted">
                                        <i class="fas fa-map-marker-alt"></i>
                                        ${student.Email} &nbsp;${student.Gender}<br>
                                    </p>
                                    <span> ${student.Department} (${student.level})</span>
                                </div>
                                <div class="right ">
                                <button type="submit" class="btn btn-danger float-right mt-1" onclick="profile('${student._id}')">Profile</button>
                                <a
                                    onclick="chat('${student._id}')"
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
                gloabalStudentContainer= students.innerHTML
            }
        })
}

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
        timeLine.innerHTML ='DashBored'
    }else{
        quizPath=`/quizes/${userId}`;
        timeLine.innerHTML ='feedes'
      
    }
    e.preventDefault()
    e.preventDefault()
    quizesLink.href=quizPath
    location.href=quizPath
    
    
})




//*********************** Students search area */
searchInput.addEventListener("input",(e)=>{
    e.preventDefault();

    //if search input is empty set all students
    if(searchInput.value == ''){
        students.innerHTML=gloabalStudentContainer
        return
    }

    if(isDoc == true || isDoc=="true"){

        const data={
            userId:userId,
            searchKey:searchInput.value,
        }

        fetch('/api/studentsSearchByDoc',{
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
                students.innerHTML = json.students.map(student=>{
                    return `
                                <div class="profile clearfix mb-3">
                                <div class="left">
                                    <img src="${student.ProfileImagePath}" alt="profileImage">
                                </div>
                                <div class="mid ">
                                    <a href="#" style="text-decoration:none"><h6>${student.Name}</h6></a>
                                    <p class="text-muted">
                                        <i class="fas fa-map-marker-alt"></i>
                                        ${student.city} &nbsp;${student.Gender}<br>
                                    </p>
                                    <span> ${student.Department} (${student.level})</span>
                                </div>
                                <div class="right ">
                                <button type="submit" class="btn btn-danger float-right mt-1" onclick="profile('${student._id}')">Profile</button>
                                <a
                                    onclick="chat('${student._id}')"
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

    }else{
        const data={
            studentId:userId,
            searchKey:searchInput.value,
        }
    
        
       fetch('/api/studentsSearch',{
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
               students.innerHTML = json.students.map(student=>{
                   return `
                               <div class="profile clearfix mb-3">
                               <div class="left">
                                   <img src="${student.ProfileImagePath}" alt="profileImage">
                               </div>
                               <div class="mid ">
                                   <a href="#" style="text-decoration:none"><h6>${student.Name}</h6></a>
                                   <p class="text-muted">
                                       <i class="fas fa-map-marker-alt"></i>
                                       ${student.city} &nbsp;${student.Gender}<br>
                                   </p>
                                   <span> ${student.Department} (${student.level})</span>
                               </div>
                               <div class="right ">
                               <button type="submit" class="btn btn-danger float-right mt-1" onclick="profile('${student._id}')">Profile</button>
                               <a
                                   onclick="chat('${student._id}')"
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
    }
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