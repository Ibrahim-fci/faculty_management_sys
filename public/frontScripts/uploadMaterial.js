const doctorSideBarLink=document.getElementById("doctorSideBarLink")
const doctorssideBar2=document.getElementById("doctorssideBar2")
const quizesLink=document.getElementById('quizesLink')
let isDoc =localStorage.getItem('doc');
const materialLink=document.getElementById("materialLink")
const profileLink=document.getElementById("profileLink")
// const userId=window.location.pathname.slice(16)  //get user id from url
const userIdFromStorage = localStorage.getItem('userId')
const timeLine = document.getElementById('timeLine')
const studentsSideBarLink=document.getElementById("studentsSideBarLink")
const studentssideBar2=document.getElementById("studentssideBar2")
const imageSide = document.getElementById('imageSide')
const userProfileImage = document.getElementById('userProfileImage')
const sideName = document.getElementById('sideName')
const material = document.getElementById('material')
const userId =localStorage.getItem('userId')

const uploadBtn = document.getElementById('uploadBtn')
const file = document.getElementById('uploadfile')
const description = document.getElementById('description')
const level = document.getElementById('level')

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


//******************************************* */
uploadBtn.addEventListener("click",(e)=>{
    e.preventDefault()

    const data=new FormData();
    data.append("userId",userId)
    data.append("description",description.value)
    data.append("level",level.value)
    data.append("file",file.files[0])
    data.append("materialType","iii")

    file.value=''


    ///******************** get current usert  */
    fetch('/api/uploadMaterial',{
        method: 'POST', 
        // headers: {
        // 'Content-Type': 'application/json'
        // // 'Content-Type': 'application/x-www-form-urlencoded',
        // },
        body:data
    }).then(response=>{
        return response.json()
    }).then(json=>{
        console.log(json)
        if(json.success == true){
                let item=json.material;

                let type='';
                let path='../images/pdf-powerPoint-images/download.png';
                if(item.materialType){
            
                    if(item.materialType.includes('image')){
                        type='image'
                        path=item.FilePath
            
                    }else if(item.materialType.includes('pdf')){
                        type='pdf'
                        path='../images/pdf-powerPoint-images/pdf.jpg'
                    }else if(item.materialType.includes('presentation')){
                        type='powerPoint'
                        path='../images/pdf-powerPoint-images/powerpoint.png'
                    }else if(item.materialType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')){
                        type='word'
                        path='../images/pdf-powerPoint-images/word.jpg'
                    }else if(item.materialType.includes('zip')){
                        type='zip'
                        path='../images/pdf-powerPoint-images/zip.png'
                    }else if(item.materialType.includes('video')){
                        type='video'
                        path='../images/pdf-powerPoint-images/video.png'
                    }else{
                        type='file'
                        path='../images/pdf-powerPoint-images/download.png'
                    }
                }
            
                let newFile= `
                    <!-- ****************************item************************ -->
                    <div class="card col-lg-3 col-md-6 mb-3 row d-flex justify-content-between" style="widows: 18rem;">
                        <img src="${path}" class="card-img-top" >
                        <div class="card-body">
                            <h5 class="card-title">${item.Level}</h5>
                            <p class="card-text">${item.description}</p>
                            <p class="card-text">${item.materialuploader.title}/${item.materialuploader.Name}</p>
                            <button class="btn btn-danger "  onclick="download('${item.FilePath}')">
                                <i class="fas fa-download"></i>
                                Download
                            </button>
                        </div>
                    </div>
                    <!-- ****************************end-item************************ --> 
            
            
            
                
            `
            material.innerHTML=newFile+material.innerHTML;
        }

    })

})



////******************** get current usert  */
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



//**************************************************** */
file.addEventListener("input",(e)=>{
    
})



///////***************************** */


fetch(`/api/getDoctorMaterial/${userId}`)
.then(json=> json.json())
.then(json=>{
    console.log(json)
    if(json.success  == true){

            


        material.innerHTML = json.material.map(item=>{

            let type='';
                let path='../images/pdf-powerPoint-images/download.png';
             if(item.materialType){

                 if(item.materialType.includes('image')){
                     type='image'
                     path=item.FilePath
     
                 }else if(item.materialType.includes('pdf')){
                     type='pdf'
                     path='../images/pdf-powerPoint-images/pdf.jpg'
                 }else if(item.materialType.includes('presentation')){
                     type='powerPoint'
                     path='../images/pdf-powerPoint-images/powerpoint.png'
                 }else if(item.materialType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')){
                     type='word'
                     path='../images/pdf-powerPoint-images/word.jpg'
                 }else if(item.materialType.includes('zip')){
                     type='zip'
                     path='../images/pdf-powerPoint-images/zip.png'
                 }else if(item.materialType.includes('video')){
                    type='video'
                    path='../images/pdf-powerPoint-images/video.png'
                }else{
                    type='file'
                    path='../images/pdf-powerPoint-images/download.png'
                 }
             }

            return `
                <!-- ****************************item************************ -->
                <div class="card col-lg-3 col-md-6 mb-3 row d-flex justify-content-between" style="widows: 18rem;">
                    <img src="${path}" class="card-img-top" >
                    <div class="card-body">
                        <h5 class="card-title">${item.Level}</h5>
                        <p class="card-text">${item.description}</p>
                        <p class="card-text">${item.materialuploader.title}/${item.materialuploader.Name}</p>
                        <button class="btn btn-danger "  onclick="download('${item.FilePath}')">
                            <i class="fas fa-download"></i>
                            Download
                        </button>
                    </div>
                </div>
                <!-- ****************************end-item************************ --> 



            
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


  

///******************** help functions  */
//*********************************** Helper Functions */
async function download(filePath){
    location.href=filePath
}



