const chatMessages = document.getElementById("chatMessages")
const chatProfileImage = document.getElementById("chatProfileImage")
const chatPersonName = document.getElementById("chatPersonName")
const messageText = document.getElementById("messageText")
const sendBtn = document.getElementById("sendBtn")
const userId = localStorage.getItem("userId")
const userId2 = window.location.pathname.slice(6)  //get user id from url 
const socket = io.connect()
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
console.log(userId)
const doneQuizesLink=document.getElementById("doneQuizes")
const isadmin = localStorage.getItem("admin")
const gradesGroup2=document.getElementById("gradesGroup2")
const gradesGroup=document.getElementById("gradesGroup")
let affairs=document.getElementById("affairs")
let files=document.getElementById("files")
let typing=document.getElementById("typing")
let micBtn=document.getElementById("micBtn")
const unreadMessages=document.getElementById("unreadMessages")



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


/// logout like handel href when click
logoutLink.addEventListener("click",(e)=>{
    // e.preventDefault()
    localStorage.removeItem("userId");
    localStorage.removeItem("doc");
    logoutLink.href='/login'
})





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




////******************** get current usert  */
fetch('/api/studentOrDocInfo/'+userId2).then(res=>{
    return res.json()
   }).then(json=>{
       console.log(json)
       if(json.success == true){
           const User=json.user
           localStorage.setItem("imageProfile",User.ProfileImagePath)
           chatProfileImage.src=`${User.ProfileImagePath}`
           chatPersonName.innerHTML= `${User.Name}`

       }
})




fetch(`/api/getMessages/${userId}/${userId2}`).then(response=>{
    return response.json()
}).then(json=>{
  console.log(json)
  if(json.success == true){
      let lastElement;
    chatMessages.innerHTML = json.messages.map(message=>{
        lastElement=message._id;
        if(message.sender == "me"){

            if(message.messageType == 'image'){
                return message.images.map(image=>{
                    return`
                        <!-- ********************photo****************** -->
                        <div class="chatMidRight mb-3 d-flex justify-content-end" id="new${message._id}">
                            <span class="text-muted mt-2 mr-1">${message.timestemp}</span>
                            <div class="right" style="max-width:50%">
                            <img src="${image}" alt="" />
                            </div>
                        </div>
                    `
                })
            
            }else if(message.messageType == 'record'){
                return`
                <div class="chatMidRight mb-3 d-flex justify-content-end" id="new${message._id}">
                    <span class="text-muted mt-2 mr-1">${message.timestemp}</span>
                    <div class="right" style="max-width:50%">
                    <audio controls src="${message.images[0]}"></audio>
                    </div>
                </div> 
                `
            }else{
                return `
                </div>
                    <div class="chatMidRight mb-3 d-flex justify-content-end " id="new${message._id}">
                    <span class="text-muted mt-2 mr-1"> ${message.timestemp}</span>  
                    <div class="right">
                        ${message.content} 
                    </div>
                </div>
                `
            }
           
        }else{

            if(message.messageType == 'image'){
                return message.images.map(image=>{
                    return`
                     <div class="chatMidLeft mb-3 d-flex justify-content-start" id="new${message._id}">
                        <div class="left" style="max-width:50%">
                        <img  src="${image}" alt="" />
                        </div>
                        <span class="text-muted mt-2 ml-1">${message.timestemp}</span>
                    </div>
                    `
                })
            
            }else if(message.messageType == 'record'){
                return`
               <div class="chatMidLeft mb-3 d-flex justify-content-start" id="new${message._id}">
                    <div class="left " style="max-width:50%">
                    <audio controls src="${message.images[0]}"></audio>
                    </div>
                    <span class="text-muted mt-2 ml-1">${message.timestemp}</span>
                </div>
                `
            }else{
                return `
                <div class="chatMidLeft mb-3 d-flex justify-content-start " id="new${message._id}">
                    <div class="left" style="background-color:none">
                    ${message.content}
                    </div> 
                    <span class="text-muted mt-2 ml-1">${message.timestemp}</span>
                </div>
                `
                
            }



        }
       
    })

     
    
  }
}).then(()=>{
    let uploader = 
    `<div class="chatMidRight mb-3 d-flex justify-content-end" >
       <div class="" style="background:none;color:#000" id="uploadingLoader">
           
       </div>
    
    </div>
    `
    chatMessages.innerHTML =  chatMessages.innerHTML + uploader
    location.href=`#uploadingLoader`;
})





files.addEventListener('change',(e)=>{
    e.preventDefault()
    console.log(files.files)
    let uploadingLoader = document.getElementById("uploadingLoader")
    uploadingLoader.innerHTML =`
    <div class="sk-circle">
        <div class="sk-circle1 sk-child"></div>
        <div class="sk-circle2 sk-child"></div>
        <div class="sk-circle3 sk-child"></div>
        <div class="sk-circle4 sk-child"></div>
        <div class="sk-circle5 sk-child"></div>
        <div class="sk-circle6 sk-child"></div>
        <div class="sk-circle7 sk-child"></div>
        <div class="sk-circle8 sk-child"></div>
        <div class="sk-circle9 sk-child"></div>
        <div class="sk-circle10 sk-child"></div>
        <div class="sk-circle11 sk-child"></div>
        <div class="sk-circle12 sk-child"></div>
    </div>
    `
    
    const body = new FormData()
    body.append('message',' ')
    body.append('messageType','image')
    body.append('senderId',userId)
    body.append('reciverId',userId2)

    for(const file of files.files){
        body.append('files',file)
    }

    console.log(body)

     fetch('/api/addMessage', {
         method: 'POST',
         body:body
         
     })
     .then(res => res.json())
     .then(json =>{
         console.log(json)
         uploadingLoader.innerHTML = ''
         if(json.success == true){
            messageText.value=''
            let newMessage;
            if(json.theNewMessage.sender == userId){

                if(json.theNewMessage.messageType == 'image'){
                    newMessage =json.theNewMessage.images.map(image=>{
                        return`

                        <!-- ********************photo****************** -->
                        <div class="chatMidRight mb-3 d-flex justify-content-end" id="new${json.theNewMessage._id}">
                            <span class="text-muted mt-2 mr-1">${json.theNewMessage.timestemp}</span>
                            <div class="right" style="max-width:50%">
                            <img src="${image}" alt="" />
                            </div>
                        </div>
                        `
                    })
                
                }else{
                    newMessage = `
                    </div>
                        <div class="chatMidRight mb-3 d-flex justify-content-end " id="new${json.theNewMessage._id}">
                        <span class="text-muted mt-2 mr-1"> ${json.theNewMessage.timestemp}</span>  
                        <div class="right">
                            ${json.theNewMessage.content} 
                        </div>
                    </div>
                    `
                }

            }else{

            }

            chatMessages.innerHTML =  chatMessages.innerHTML + newMessage
            location.href = `#uploadingLoader`
        }
     }) 
})



//send message
sendBtn.addEventListener("click",(e)=>{
    e.preventDefault()


    const data={
        message:messageText.value,
        senderId:userId,
        reciverId:userId2,
        messageType:'text'
    }
    console.log(data)
     
    fetch('/api/addMessage',{
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
            messageText.value=''
            let newMessage;
            if(json.theNewMessage.sender == userId){

                if(json.theNewMessage.messageType == 'image'){
                    newMessage =json.theNewMessage.images.map(image=>{
                        return`
                        <!-- ********************photo****************** -->
                        <div class="chatMidRight mb-3 d-flex justify-content-start"  id="new${json.theNewMessage._id}">
                            <div class="chatMidRight mb-3 d-flex justify-content-end">
                            <span class="text-muted mt-2 mr-1">${json.theNewMessage.timestemp}</span>
                            <div class="right" style="max-width:50%">
                                <img src="${image}" alt="" />
                            </div>
                        </div>
                        `
                    })
                }else{
                    newMessage = `
                    </div>
                        <div class="chatMidRight mb-3 d-flex justify-content-end " id="new${json.theNewMessage._id}">
                        <span class="text-muted mt-2 mr-1"> ${json.theNewMessage.timestemp}</span>  
                        <div class="right">
                            ${json.theNewMessage.content} 
                        </div>
                    </div>
                    `
                }

            }else{

            }

            chatMessages.innerHTML =  chatMessages.innerHTML + newMessage
            location.href = `#new${json.theNewMessage._id}`
        }
    })
})



//************************* socket Area */
socket.on("newMessage",(data)=>{
    console.log(data,"socketData")
    if(data.reciver == userId  && data.sender == userId2 ){
        let  newMessage ;
        if(data.messageType == 'image'){
            newMessage = data.images.map(image=>{
                return`
                 <div class="chatMidLeft mb-3 d-flex justify-content-start" id="new${data._id}">
                    <div class="left" style="max-width:50%">
                    <img  src="${image}" alt="" />
                    </div>
                    <span class="text-muted mt-2 ml-1">${data.timestemp}</span>
                </div>
                `
            })
        
        }else if(data.messageType == 'record'){
            console.log(data.images[0])
            newMessage =`
           <div class="chatMidLeft mb-3 d-flex justify-content-start" id="new${data._id}">
                <div class="left " style="max-width:50%">
                <audio controls src="${data.images[0]}"></audio>
                </div>
                <span class="text-muted mt-2 ml-1">${data.timestemp}</span>
            </div>
            `
        }else{
            newMessage = `
                <div class="chatMidLeft mb-3 d-flex justify-content-start " id="new${data._id}">
                    <div class="left">
                    ${data.content}
                    </div> 
                    <span class="text-muted mt-2 ml-1">${data.timestemp}</span>
                </div>
            `
        }



        chatMessages.innerHTML =  chatMessages.innerHTML + newMessage
        location.href = `#new${data._id}`
    }


    fetch(`/api/readedMessges/${userId}/${userId2}`).then(response=>{
        return response.json()
      }).then(json=>{
        console.log(json)
        if(json.success == true){
            unreadMessages.innerHTML = `${json.unreadMessages}`
        }
      })
})











//////Audio RECORDING  ****************************last update


let chuncks=[];
let recorder;

function recorder2(){
    micBtn.style = "color:green" // set style of recording button on starting recording
    socket.emit("recording",{sender:userId,reciver:userId2})
   

  let device= navigator.mediaDevices.getUserMedia({audio:true})
  device.then(streem=>{
     recorder=new MediaRecorder(streem);

     recorder.ondataavailable=e=>{
          chuncks.push(e.data)

          if(recorder.state ='inactive'){
              let blob= new Blob(chuncks,{type:'audio/mp3'})
              let uploadingLoader = document.getElementById("uploadingLoader")
                uploadingLoader.innerHTML =`
                <div class="sk-circle">
                    <div class="sk-circle1 sk-child"></div>
                    <div class="sk-circle2 sk-child"></div>
                    <div class="sk-circle3 sk-child"></div>
                    <div class="sk-circle4 sk-child"></div>
                    <div class="sk-circle5 sk-child"></div>
                    <div class="sk-circle6 sk-child"></div>
                    <div class="sk-circle7 sk-child"></div>
                    <div class="sk-circle8 sk-child"></div>
                    <div class="sk-circle9 sk-child"></div>
                    <div class="sk-circle10 sk-child"></div>
                    <div class="sk-circle11 sk-child"></div>
                    <div class="sk-circle12 sk-child"></div>
                </div>
                `

           var form = new FormData();
                form.append('files', blob);
                chuncks=[]
                recorder.stream.getAudioTracks().forEach(function(track){track.stop();});
                form.append('message',' ')
                form.append('messageType','record')
                form.append('senderId',userId)
                form.append('reciverId',userId2)
              
              fetch('/api/addMessage',{
                method:"POST",
                body:form
              }).then(res => res.json())
              .then(json=>{
                console.log(json)
                  if(json.success ==true){
                    uploadingLoader.innerHTML =''
                        let newMessage = `
                        <div class="chatMidRight mb-3 d-flex justify-content-end" id="new${json.theNewMessage._id}">
                            <span class="text-muted mt-2 mr-1">${json.theNewMessage.timestemp}</span>
                            <div class="right" style="max-width:50%">
                            <audio controls src="${json.theNewMessage.images[0]}"></audio>
                            </div>
                        </div> 
                        `
                        chatMessages.innerHTML =  chatMessages.innerHTML + newMessage
                         location.href = `#new${json.theNewMessage._id}`
                  }
                   
              })
               
          }
     }
     

  

    
      recorder.start()
      setTimeout(()=>{
        if(isRecordStopped ==false){

          recorder.stop()
          recorder.stream.getAudioTracks().forEach(function(track){track.stop();});
        }
      },10000)
     
 })

}

function stopRecorder(){
  micBtn.style = "" // set style of recording button on stopping recording
  recorder.stop()
  recorder.stream.getAudioTracks().forEach(function(track){track.stop();});
  isRecordStopped=true;
}

function blobToFile(theBlob, fileName){
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

///////Audio RECORDING  ****************************last update


//***************** Emmit Events */
messageText.addEventListener("keyup",(e)=>{
    socket.emit("typing",{sender:userId,reciver:userId2})
})

socket.on("userTyping",(data)=>{ 
    if(data.reciver == userId && data.sender == userId2){
        console.log(data,"typing")
        typing.innerHTML= `typing...`
        setTimeout(()=>{
            typing.innerHTML= `Last Seen 2:00 am`
        },2000)
        
    }
})


 
socket.on("userRecording",(data)=>{ 
    if(data.reciver == userId && data.sender == userId2){
        console.log(data,"Recording")
        typing.innerHTML= `recording...`
        setTimeout(()=>{
            typing.innerHTML= `Last Seen 2:00 am`
        },2000)
        
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
