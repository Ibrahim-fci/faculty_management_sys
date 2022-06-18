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
const userId=localStorage.getItem('userId') //get user id from url
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
const gradesGroup2=document.getElementById("gradesGroup2")
const gradesGroup=document.getElementById("gradesGroup")
let addEventBtn=document.getElementById("addEventBtn")
let isadmin =localStorage.getItem('admin')
const postBtn=document.getElementById("postBtn")
const description=document.getElementById("description")
const title=document.getElementById("title")
const file=document.getElementById("file")
let eventsContainer=document.getElementById("eventsContainer")
let flag =false
let validationErrors= document.getElementById("validationErrors")
let affairs=document.getElementById("affairs")
let affairs2=document.getElementById("affairs2")
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
    affairs2.innerHTML=`Add Doctor`

}else{
  affairs.style='display:none'
  affairs2.style='display:none'
}


affairs.addEventListener("click",(e)=>{
  e.preventDefault()
  
  if(isadmin == true || isadmin =="true"){
    affairs.hrf=`/addDoc`
    location.href=`/addDoc`
  }else{
    
  }

})


affairs2.addEventListener("click",(e)=>{
  e.preventDefault()
  
  if(isadmin == true || isadmin =="true"){
    affairs2.hrf=`/addDoc`
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
    }else if(isadmin == false || isadmin =="false" || !isadmin){
        quizesLink.href=`/materials/${userId}`
        location.href=`/materials/${userId}`
    }
})




///************ handling get student timeLine link when clicked */
timeLine.addEventListener("click",(e)=>{
    if(isDoc == true || isDoc == "true"){
        timlinePath = `/docDashBoard/${userId}`
    }else if(isadmin == true || isadmin =="true" ){
        timlinePath = `#`
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

///Get Events*/3
  
fetch(`/api/getEvents`).then(response=>{
    return response.json()
}).then(json=>{
    if(json.success==true){
        let newEvent;
        eventsContainer.innerHTML=json.events.map(event=>{
            if(event.image){
               return `
                      <div class="container-fluid">
                        <div class="events clearfix mb-4">
                        <div class="event-img mr-4 mb-3">
                            <button type="button" data-toggle="modal" data-target="#im${event._id}">
    
                                <img src="${event.image}" alt=""  id="olodImage${event._id}">
                            </button>
                        </div>
                    <div class="eventleft">
                        <!-- ***************************************************** -->
                        ${flag?`
                            <div class=" float-right">
                                <button style="all: unset;color: #006699;" class="mr-2" type="button" data-toggle="modal" data-target="#updateEvent${event._id}">
                                    <i class="fas fa-edit fa-lg"></i>
                                </button>
                                <button style="all: unset; color: red;"><i class="fas fa-trash-alt fa-lg"></i></button>
                            </div>
                       `:``}
                       
                        <!-- ********************************************************* -->
                        <div class="event-title mb-2" id="oldTitle${event._id}">
                            ${event.title}
                        </div>
                        <div class="event-date ">
                            <span class="mb-2 text-muted">Sunday</span>
                            <span class="mb-3 text-muted">${event.uploadDate}</span>
                        </div>
                        <div class="event-text" id="oldDesc${event._id}">
                           ${event.Description}
                            
                        </div>
                    </div>
                    
                    </div>
                </div>
    
                <!-- ******************************popUP******************************** -->
                <div class="modal fade" id="im${event._id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body eventphoto">
                          <img src="${event.image}" alt="" id="oldImagePopUp${event._id}">
                        </div>
                      </div>
                    </div>
                  </div>
                <!-- ******************************End-popUP**************************** -->


                <!-- ********************PopUp2 For Updating*************************** -->
            <div class="modal fade" id="updateEvent${event._id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalCenterTitle">Update Events</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div  id="validation${event._id}"></div>
                    <div class="modal-body">
                        <!-- ********************form**************** -->
                        <div class="pho mb-3">
                     <label for="updatedFile2${event._id}">
                            <img src="../images/Events-Images/plus-icon-plus-math-icon-download-icons-9.png" alt="">
                        </label>
                    </div>
                     <input type="file" id="updatedFile2${event._id}" class="updatedFile2${event._id}">

                     <form>
                        <div class="form-group">
                          
                          <input type="text" class="form-control" id="newTitle${event._id}" placeholder="Event Title..." value="${event.title}">
                        </div>
                        <div class="form-group">
                            <textarea class="form-control" id="newDesc${event._id}">${event.Description}</textarea>
                          </div>
                        </form>
                     <!-- ************************************************* -->
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary"  onclick="updateEvent('${event._id}')">Update</button>
                    </div>
                  </div>
                </div>
              </div>
            <!-- ********************End-PopUp*************************** -->
                `
    
            }else{
                return`
                <div class="container-fluid">
                <div class="events clearfix mb-5">
                       
                     <div class="eventleft" style="width: 100%;">
                       <!-- ********************************************* -->
                       ${flag?`
                        <div class=" float-right">
                            <button style="all: unset;color: #006699;" class="mr-2" type="button" data-toggle="modal" data-target="#updateEvent${event._id}">
                                <i class="fas fa-edit fa-lg"></i>
                            </button>
                            <button style="all: unset; color: red;"><i class="fas fa-trash-alt fa-lg"></i></button>
                        </div>
                       `:``}
                       <!-- ********************************************* -->
                       
                       <div class="event-title mb-2"  id="oldTitle${event._id}">
                           ${event.title}
                       </div>
                       <div class="event-date ">
                           <span class="mb-2 text-muted">Monday</span>
                           <span class="mb-3 text-muted">${event.uploadDate}</span>
                       </div>
                       <div class="event-text" id="oldDesc${event._id}">
                         ${event.Description}
                           
                       </div>
                     </div>
                   </div>
               </div>


               <!-- ********************PopUp2 For Updating*************************** -->
               <input type="file" id="updatedFile2${event._id}" class="updatedFile2${event._id}" style="display:none">
            <div class="modal fade" id="updateEvent${event._id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalCenterTitle">Update Events</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                        <!-- ********************form**************** -->
                        <div  id="validation${event._id}"></div>

                     <form>
                        <div class="form-group">
                          
                          <input type="text" class="form-control" id="newTitle${event._id}" placeholder="Event Title..." value="${event.title}">
                        </div>
                        <div class="form-group">
                            <textarea class="form-control" id="newDesc${event._id}">${event.Description}</textarea>
                          </div>
                        </form>
                     <!-- ************************************************* -->
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary"  onclick="updateEvent('${event._id}')">Update</button>
                    </div>
                  </div>
                </div>
              </div>
            <!-- ********************End-PopUp*************************** -->
                `
            }
        })
       
    }
    console.log(json)
})










postBtn.addEventListener("click",(e)=>{
    const body=new FormData()
    body.append('description',description.value)
    body.append('Title',title.value)
    body.append('adminId',userId)
    body.append('file',file.files[0])

    file.value=''
    description.value=''
    title.value=''
  
     
    fetch('/api/addEvent',{
        method: 'POST', 
        body:body
    }).then(response=>{
        return response.json()
    }).then(json=>{
        if(json.success==true){
            let newEvent;
            if(json.newEvent.image){
                newEvent=`
                      <div class="container-fluid">
                        <div class="events clearfix mb-4">
                        <div class="event-img mr-4 mb-3">
                            <button type="button" data-toggle="modal" data-target="#im${json.newEvent._id}">

                                <img src="${json.newEvent.image}" alt="" id="olodImage${json.newEvent._id}">
                            </button>
                        </div>
                    <div class="eventleft">
                        <!-- ***************************************************** -->
                        <div class=" float-right">
                            <button style="all: unset;color: #006699;" class="mr-2" type="button" data-toggle="modal" data-target="#updateEvent${json.newEvent._id}">
                                <i class="fas fa-edit fa-lg"></i>
                            </button>
                            <button style="all: unset; color: red;"><i class="fas fa-trash-alt fa-lg"></i></button>
                        </div>
                        <!-- ********************************************************* -->
                        <div class="event-title mb-2" id="oldTitle${json.newEvent._id}">
                            ${json.newEvent.title}
                        </div>
                        <div class="event-date ">
                            <span class="mb-2 text-muted">Sunday</span>
                            <span class="mb-3 text-muted">${json.newEvent.uploadDate}</span>
                        </div>
                        <div class="event-text" id="oldDesc${json.newEvent._id}">
                           ${json.newEvent.Description}
                            
                        </div>
                    </div>
                    
                    </div>
                </div>

                <!-- ******************************popUP******************************** -->
                <div class="modal fade" id="im${json.newEvent._id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body eventphoto">
                          <img src="${json.newEvent.image}" alt="" id="oldImagePopUp${json.newEvent._id}">
                        </div>
                      </div>
                    </div>
                  </div>
                <!-- ******************************End-popUP**************************** -->

                <!-- ********************PopUp2 For Updating*************************** -->
                <div class="modal fade" id="updateEvent${json.newEvent._id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalCenterTitle">Update Events</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div  id="validation${json.newEvent._id}"></div>
                        <div class="modal-body">
                            <!-- ********************form**************** -->
                            <div class="pho mb-3">
                         <label for="updatedFile2${json.newEvent._id}">
                                <img src="../images/Events-Images/plus-icon-plus-math-icon-download-icons-9.png" alt="">
                            </label>
                        </div>
                         <input type="file" id="updatedFile2${json.newEvent._id}" class="updatedFile2${json.newEvent._id}">
    
                         <form>
                            <div class="form-group">
                              
                              <input type="text" class="form-control" id="newTitle${json.newEvent._id}" placeholder="Event Title..." value="${json.newEvent.title}">
                            </div>
                            <div class="form-group">
                                <textarea class="form-control" id="newDesc${json.newEvent._id}">${json.newEvent.Description}</textarea>
                              </div>
                            </form>
                         <!-- ************************************************* -->
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary"  onclick="updateEvent('${json.newEvent._id}')">Update</button>
                        </div>
                      </div>
                    </div>
                  </div>
                <!-- ********************End-PopUp*************************** -->
                `

                eventsContainer.innerHTML=newEvent+eventsContainer.innerHTML;
                validationErrors.innerHTML = `<div class="alert alert-success">${json.message}</div>`
            }else{
                newEvent=`
                <div class="container-fluid">
                <div class="events clearfix mb-5">
                       
                     <div class="eventleft" style="width: 100%;">
                       <!-- ********************************************* -->
                       <div class=" float-right">
                           <button style="all: unset;color: #006699;" class="mr-2" type="button" data-toggle="modal" data-target="#updateEvent${json.newEvent._id}">
                               <i class="fas fa-edit fa-lg"></i>
                           </button>
                           <button style="all: unset; color: red;"><i class="fas fa-trash-alt fa-lg"></i></button>
                       </div>
                       <!-- ********************************************* -->
                       
                       <div class="event-title mb-2"  id="oldTitle${json.newEvent._id}">
                           ${json.newEvent.title}
                       </div>
                       <div class="event-date ">
                           <span class="mb-2 text-muted">Sunday</span>
                           <span class="mb-3 text-muted">${json.newEvent.uploadDate}</span>
                       </div>
                       <div class="event-text" id="oldDesc${json.newEvent._id}">
                         ${json.newEvent.Description}
                           
                       </div>
                     </div>
                   </div>
               </div>

               <!-- ********************PopUp2 For Updating*************************** -->
               <input type="file" id="updatedFile2${json.newEvent._id}" class="updatedFile2${json.newEvent._id}" style="display:none">
            <div class="modal fade" id="updateEvent${json.newEvent._id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalCenterTitle">Update Events</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                        <!-- ********************form**************** -->
                        <div  id="validation${json.newEvent._id}"></div>

                     <form>
                        <div class="form-group">
                          
                          <input type="text" class="form-control" id="newTitle${json.newEvent._id}" placeholder="Event Title..." value="${json.newEvent.title}">
                        </div>
                        <div class="form-group">
                            <textarea class="form-control" id="newDesc${json.newEvent._id}">${json.newEvent.Description}</textarea>
                          </div>
                        </form>
                     <!-- ************************************************* -->
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary"  onclick="updateEvent('${json.newEvent._id}')">Update</button>
                    </div>
                  </div>
                </div>
              </div>
            <!-- ********************End-PopUp*************************** -->


                `
                eventsContainer.innerHTML=newEvent+eventsContainer.innerHTML;
                validationErrors.innerHTML = `<div class="alert alert-success">${json.message}</div>`
            }
        }else{
            validationErrors.innerHTML = `<div class="alert alert-danger">${json.message}</div>`
        }
        console.log(json)
    })
})



//***************************** Helper Function */
async function updateEvent(id){

// current Event Data
    let oldTitle = document.getElementById(`oldTitle${id}`)
    let oldDesc = document.getElementById(`oldDesc${id}`)
    let oldImage = document.getElementById(`olodImage${id}`)
    let oldImagePopUp = document.getElementById(`oldImagePopUp${id}`)


///// updated form values
    let newTitle = document.getElementById(`newTitle${id}`)
    let newDesc = document.getElementById(`newDesc${id}`)
    let newImage = document.querySelector(`.updatedFile2${id}`)



    let validation = document.getElementById(`validation${id}`)

    

    const body=new FormData()
    body.append('description',newDesc.value)
    body.append('Title',newTitle.value)
    body.append('adminId',userId)
    body.append('eventId',id)
    if(!newImage.files[0]){

    }else{
        body.append('file',newImage.files[0])

    }

    file.files[0]=''
     
    fetch('/api/updateEvent',{
        method: 'POST', 
        body:body
    }).then(response=>{
        return response.json()
    }).then(json=>{
        console.log(json)
        if(json.success == true){
            
            oldTitle.innerHTML = json.updatedEvent.title;
            oldDesc.innerHTML = json.updatedEvent.Description;

            try{

                oldImage.src = json.updatedEvent.image;
                oldImagePopUp.src = json.updatedEvent.image;
            }catch{

            }

            validation.innerHTML=`<div class="alert alert-success">${json.message}</div>`
        }else{
            validation.innerHTML=`<div class="alert alert-danger">${json.message}</div>`
        }
    })




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