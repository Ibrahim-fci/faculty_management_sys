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
const userId = localStorage.getItem("userId")
console.log(userId)
const doneQuizesLink=document.getElementById("doneQuizes")
const contacts=document.getElementById("contacts")
let affairs=document.getElementById("affairs")
const gradesGroup2=document.getElementById("gradesGroup2")
const gradesGroup=document.getElementById("gradesGroup")
const isadmin = localStorage.getItem("admin")
let gloabalContacts = [] ;
let gloabelUsersContacts  = [] ;
let gloabalContactsSearch  = [] ;
const socket = io.connect()
const unreadMessages=document.getElementById("unreadMessages")
const searchInput=document.getElementById("searchInput")




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


if(isDoc == true || isDoc =="true"){
    doneQuizesLink.innerHTML = 'uploaded Quizes'
    quizesLink.innerHTML="Create Quiz"
    timeLine.innerHTML ='DashBored'
    affairs.style='display:none'
    
}else if(isadmin == true || isadmin =="true"){
    timeLine.innerHTML ='Events'
    
}else{
    doneQuizesLink.innerHTML = 'Done Quizes'
    quizesLink.innerHTML="Quizes"
    timeLine.innerHTML ='feedes'
    affairs.style='display:none'
}

/// profile like handel href when click
profileLink.addEventListener("click",(e)=>{
    e.preventDefault()
    location.href=`/profile/${userIdFromStorage}`
})

/// logout like handel href when click
logoutLink.addEventListener("click",(e)=>{
    // e.preventDefault()
    localStorage.removeItem("userId");
    localStorage.removeItem("doc");
    localStorage.removeItem("admin");
    logoutLink.href='/login'
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


















///************ handling get student timeLine link when clicked */
///************ handling get student timeLine link when clicked */
timeLine.addEventListener("click",(e)=>{
    if(isDoc == true || isDoc == "true"){
        timlinePath = `/docDashBoard/${userId}`
    }else if(isadmin == true || isadmin =="true" ){
        timlinePath = `/events`
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
    if(isadmin == true || isadmin == "true"){
      studentsSideBarLink.href=`/adminStudents`
      location.href=`/adminStudents`
    }else{
      studentsSideBarLink.href=`/students/${userIdFromStorage}`
      location.href=`/students/${userIdFromStorage}`
    }
    
})

///************ handling get all student link when clicked */
studentssideBar2.addEventListener("click",(e)=>{
  e.preventDefault()
  if(isadmin == true || isadmin == "true"){
    studentsSideBarLink.href=`/adminStudents`
    location.href=`/adminStudents`
  }else{
    studentsSideBarLink.href=`/students/${userIdFromStorage}`
    location.href=`/students/${userIdFromStorage}`
  }
  
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

affairs.addEventListener("click",(e)=>{
    e.preventDefault()
    
    if(isadmin == true || isadmin =="true"){
      affairs.hrf=`/addDoc`
      location.href=`/addDoc`
    }else{
      
    }
  
  })


//Get Contacts user
fetch(`/api/messagesContacts/${userId}`).then(response=>{
    return response.json()
}).then(json=>{
    console.log(json)
    if(json.success == true){
        
        contacts.innerHTML = json.contacts.map(user=>{
            gloabalContacts.push(user._id)
            let flag ;
            let lastImageSender;

            if(user.lastMessage.messageType == 'image'){
                flag="image"
            }else if(user.lastMessage.messageType == 'record'){
                flag="record"
            }else{
                flag=user.lastMessage.content
            } 

            if(user.lastMessage.sender == "me"){
                lastImageSender = "you"
            }else{
                lastImageSender = "he"
            }

            return `
            <a href="#" class="list-group-item-action" onclick="chatClicked('${user._id}')">
                <div class="user clearfix ">
                    <div class="left">
                        <img src="${user.ProfileImagePath}" alt="userImage">
                    </div>
                    <div class="mid pl-1">
                        <h6>${user.Name}<span class="badge badge-primary float-right mr-3" id="unread${user._id}"><!--#unreadMessages--></span></h6>
                        
                        <p class="text-muted">
                            <span id="typing${user._id}">${lastImageSender}:${flag}</span><br> ${user.lastMessage.timestemp}
                        </p>
                       
                    </div>
                </div>
                <div class="dropdown-divider"></div>
            </a>
            `
        })
    }
}).then(()=>{
    gloabelUsersContacts = contacts.innerHTML ;
    for(let i =0 ; i< gloabalContacts.length ; i++) {
        fetch(`/api/unreadMessagesBetween2Users/${userId}/${gloabalContacts[i]}`).then(response=>{
            return response.json()
        }).then(json=>{
            console.log(json)
            if(json.success == true){
                let numOfUnread = document.getElementById(`unread${gloabalContacts[i]}`)
                numOfUnread.innerHTML = `${json.unreadMessages}`
            }
        })
      }
})



socket.on("userTyping",(data)=>{ 
    if(gloabalContacts.includes(data.sender)  &&  data.reciver == userId ){
        let typingText = document.getElementById(`typing${data.sender}`)
        console.log(data,"typing")
        typingText.innerHTML= `typing....`
        setTimeout(()=>{
            typingText.innerHTML= ``
        },10000)
        
    }
})


socket.on("userRecording",(data)=>{ 
    if(gloabalContacts.includes(data.sender)  &&  data.reciver == userId ){
        let typingText = document.getElementById(`typing${data.sender}`)
        console.log(data,"recording")
        typingText.innerHTML= `recording...`
        setTimeout(()=>{
            typingText.innerHTML= ``
        },10000)
        
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
    if(gloabalContacts.includes(data.sender)  &&  data.reciver == userId ){
        fetch(`/api/unreadMessagesBetween2Users/${userId}/${data.sender}`).then(response=>{
            return response.json()
        }).then(json=>{
            console.log(json)
            if(json.success == true){
                let numOfUnread = document.getElementById(`unread${data.sender}`)
                numOfUnread.innerHTML = `${json.unreadMessages}`
            }
        })
    }


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


//************** Helper function */
async function chatClicked(id){
    fetch(`/api/readedMessges/${userId}/${id}`).then(response=>{
        return response.json()
      }).then(json=>{
        console.log(json)
        if(json.success == true){
            unreadMessages.innerHTML = `${json.unreadMessages}`
        }
      }).then(()=>{

          location.href=`/chat/${id}`
      })

}


//*********************** Search Area */

//*********************** Students search area */
searchInput.addEventListener("input",(e)=>{
    e.preventDefault();

    //if search input is empty set all students
    if(searchInput.value == ''){
        contacts.innerHTML=gloabelUsersContacts;
        for(let i =0 ; i< gloabalContacts.length ; i++) {
            fetch(`/api/unreadMessagesBetween2Users/${userId}/${gloabalContacts[i]}`).then(response=>{
                return response.json()
            }).then(json=>{
                console.log(json)
                if(json.success == true){
                    let numOfUnread = document.getElementById(`unread${gloabalContacts[i]}`)
                    numOfUnread.innerHTML = `${json.unreadMessages}`
                }
            })
          }
        return
    }

   

        const data={
            userId:userId,
            key:searchInput.value,
        }

        fetch('/api/contactsSearch',{
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
                contacts.innerHTML = json.contacts.map(user=>{
                    gloabalContactsSearch.push(user._id)
                    let flag ;
                    let lastImageSender;
        
                    if(user.lastMessage.messageType == 'image'){
                        flag="image"
                    }else if(user.lastMessage.messageType == 'record'){
                        flag="record"
                    }else{
                        flag=user.lastMessage.content
                    } 
        
                    if(user.lastMessage.sender == "me"){
                        lastImageSender = "you"
                    }else{
                        lastImageSender = "he"
                    }
        
                    return `
                    <a href="#" class="list-group-item-action" onclick="chatClicked('${user._id}')">
                        <div class="user clearfix ">
                            <div class="left">
                                <img src="${user.ProfileImagePath}" alt="userImage">
                            </div>
                            <div class="mid pl-1">
                                <h6>${user.Name}<span class="badge badge-primary float-right mr-3" id="unreads${user._id}"><!--#unreadMessages--></span></h6>
                                
                                <p class="text-muted">
                                    <span id="typing${user._id}">${lastImageSender}:${flag}</span><br> ${user.lastMessage.timestemp}
                                </p>
                               
                            </div>
                        </div>
                        <div class="dropdown-divider"></div>
                    </a>
                    `
                })
      
      
            }
        })

})