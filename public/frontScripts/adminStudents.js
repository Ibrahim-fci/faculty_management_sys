const students = document.querySelector('.students');
const userId=localStorage.getItem('userId') //get user id from url 
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
let isadmin=localStorage.getItem("admin")
let gloabalStudentContainer;
const doctorSideBarLink=document.getElementById("doctorSideBarLink")
const doctorssideBar2=document.getElementById("doctorssideBar2")
const quizesLink=document.getElementById('quizesLink')
const materialLink=document.getElementById("materialLink")
let quizPath;
console.log(userId)
let affairs=document.getElementById("affairs")
const doneQuizesLink=document.getElementById("doneQuizes")
const gradesGroup2=document.getElementById("gradesGroup2")
const gradesGroup=document.getElementById("gradesGroup")
const enentslink=document.getElementById("enentslink")
const enentslink2=document.getElementById("enentslink2")
const unreadMessages=document.getElementById("unreadMessages")
const socket = io.connect()






if(isadmin == true || isadmin =="true"){
    flag=true
    quizesLink.style='display:none'
    materialLink.style='display:none'
    doneQuizesLink.style='display:none'
    gradesGroup2.style='display:none'
    gradesGroup.style='display:none'
    profileLink.style='display:none'
    doctorSideBarLink.innerHTML='<i class="fas fa-users mr-2"></i>Add Student'
    doctorssideBar2.innerHTML=' <i class="fas fa-users mr-2"></i>Add Student'
    affairs.innerHTML=`<i class="fas fa-user-shield mr-2"></i>Add Doctor`

}


affairs.addEventListener("click",(e)=>{
  e.preventDefault()
  
  if(isadmin == true || isadmin =="true"){
    affairs.hrf=`/addDoc`
    location.href=`/addDoc`
  }else{
    
  }

})




if(isDoc == true || isDoc =="true"){
    doneQuizesLink.innerHTML = 'uploaded Quizes'
    quizesLink.innerHTML="Create Quiz"
    timeLine.innerHTML ='DashBored'
    addEventBtn.style='display:none'
    
}else if(isadmin == true || isadmin =="true"){
    timeLine.innerHTML ='Events'
    
}else{
    doneQuizesLink.innerHTML = 'Done Quizes'
    quizesLink.innerHTML="Quizes"
    timeLine.innerHTML ='feedes'
    addEventBtn.style='display:none'
}


///************ handling get student timeLine link when clicked */
timeLine.addEventListener("click",(e)=>{
    e.preventDefault()
    timlinePath = `/events`
    timeLine.href=timlinePath
    location.href=timlinePath
    
})


enentslink.addEventListener("click",(e)=>{
    e.preventDefault()
    timlinePath = `/events`
    timeLine.href=timlinePath
    location.href=timlinePath
})

enentslink2.addEventListener("click",(e)=>{
    e.preventDefault()
    timlinePath = `/events`
    timeLine.href=timlinePath
    location.href=timlinePath
})

//************ handling get all doctors link when clicked */
doctorssideBar2.addEventListener("click",(e)=>{
    e.preventDefault()
    if(isadmin == true || isadmin =="true"){
      doctorssideBar2.href=`/signUp`
      location.href=`/signUp`
    }else{

        doctorssideBar2.href=`/doctors/${userId}`
        location.href=`/doctors/${userId}`
    }
    
})

///************ handling get all doctors link when clicked */
doctorSideBarLink.addEventListener("click",(e)=>{
    e.preventDefault()
    if(isadmin == true || isadmin =="true"){
      doctorssideBar2.href=`/signUp`
      location.href=`/signUp`
    }else{

        doctorssideBar2.href=`/doctors/${userId}`
        location.href=`/doctors/${userId}`
    }
    
    
})


/// logout like handel href when click
logoutLink.addEventListener("click",(e)=>{
    // e.preventDefault()
    localStorage.removeItem("userId");
    localStorage.removeItem("doc");
    logoutLink.href='/login'
})


    //********************* get all students of the same level */
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
                                    <a href="#" style="text-decoration:none"><h6>${student.Name}</h6></a>
                                    <p class="text-muted">
                                        <i class="fas fa-map-marker-alt"></i>
                                        ${student.Email} &nbsp;${student.Gender}<br>
                                    </p>
                                    <span> ${student.Department} (${student.level})</span>
                                </div>
                                <div class="right ">
                                    ${student.isDisabled?` <button type="submit" class="btn btn-dark float-right mt-1" onclick="disable('${student._id}')"  id="btn${student._id}">UnBlock</button>
                                    <a
                                        onclick="chat('${student._id}')"
                                        type="submit"
                                        class="btn btn-primary float-right mr-1 mt-1"
                                        style="color: #fff;"
                                        >
                                        <i class="fas fa-comment-dots"></i>
                                    </a>
                                    `
                                    :` <button type="submit" class="btn btn-danger float-right mt-1" onclick="disable('${student._id}')"  id="btn${student._id}">Block</button>
                                    <a
                                        onclick="chat('${student._id}')"
                                        type="submit"
                                        class="btn btn-primary float-right mr-1 mt-1"
                                        style="color: #fff;"
                                        >
                                        <i class="fas fa-comment-dots"></i>
                                    </a>
                                    `}
                                   
                                </div>
                            </div>


                        `


                })
                gloabalStudentContainer= students.innerHTML
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







//*********************** Students search area */
searchInput.addEventListener("input",(e)=>{
    e.preventDefault();

    //if search input is empty set all students
    if(searchInput.value == ''){
        students.innerHTML=gloabalStudentContainer
        return
    }

   
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
                                    ${student.isDisabled?` <button type="submit" class="btn btn-dark float-right mt-1" onclick="disable('${student._id}')"  id="btn${student._id}">UnBlock</button>
                                    <a
                                        onclick="chat('${student._id}')"
                                        type="submit"
                                        class="btn btn-primary float-right mr-1 mt-1"
                                        style="color: #fff;"
                                        >
                                        <i class="fas fa-comment-dots"></i>
                                    </a>
                                    `
                                    :` <button type="submit" class="btn btn-danger float-right mt-1" onclick="disable('${student._id}')"  id="btn${student._id}">Block</button>
                                    <a
                                        onclick="chat('${student._id}')"
                                        type="submit"
                                        class="btn btn-primary float-right mr-1 mt-1"
                                        style="color: #fff;"
                                        >
                                        <i class="fas fa-comment-dots"></i>
                                    </a>
                                    `}
                                   
                                </div>
                            </div>
                                
                           `
                })
            }
        })

   
})




//when disable clicked
async function disable(id){
    const btn= document.getElementById(`btn${id}`)

    if(btn.className == 'btn btn-danger float-right mt-1'){
        btn.className= 'btn btn-dark float-right mt-1'
        btn.innerHTML='UnBlock'
    }else if(btn.className == 'btn btn-dark float-right mt-1'){
        btn.className= 'btn btn-danger float-right mt-1'
        btn.innerHTML='Block'
    }

    const data={
        adminId:userId,
        studentId:id,
    }

    fetch('/api/disableStudent',{
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
        if(json.success == true){

        }
    })
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