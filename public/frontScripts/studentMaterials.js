const quizesLink=document.getElementById('quizesLink')
const doctorSideBarLink=document.getElementById("doctorSideBarLink")
const doctorssideBar2=document.getElementById("doctorssideBar2")
const profileLink=document.getElementById("profileLink")
const userProfileImage=document.getElementById("userProfileImage")
const logoutLink=document.getElementById("logoutLink")
const sideBarImage=document.getElementById("imageSide")
const sideBarName=document.getElementById("sideBarName")
const studentsSideBarLink=document.getElementById("studentsSideBarLink")
const studentssideBar2=document.getElementById("studentssideBar2")
const userId=window.location.pathname.slice(11)  //get user id from url
const isDoc=localStorage.getItem("doc")
const level=localStorage.getItem("level")
const material=document.getElementById("material")
const timeLine=document.getElementById("timeLine")
console.log(userId)

const doneQuizesLink=document.getElementById("doneQuizes")








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
       }
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
    e.preventDefault()
    quizesLink.href=`/quizes/${userId}`
    location.href=`/quizes/${userId}`
    
})

/// logout like handel href when click
logoutLink.addEventListener("click",(e)=>{
    // e.preventDefault()
    localStorage.removeItem("userId");
    localStorage.removeItem("doc");
    logoutLink.href='/login'
})

/// logout like handel href when click
profileLink.addEventListener("click",(e)=>{
    e.preventDefault()
    location.href=`/profile/${userId}`
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


fetch(`/api/getMaterial/${level}`)
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
                <div class="card col-lg-3 col-md-6 mb-3  row d-flex justify-content-between" style="widows: 18rem;">
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

 


//*********************************** Helper Functions */
async function download(filePath){
    location.href=filePath
}