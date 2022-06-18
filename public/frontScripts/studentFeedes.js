
const post=document.querySelector('.jj');
const validationError=document.querySelector('.validationError');
const profileLink=document.getElementById("profileLink")
const userProfileImage=document.getElementById("userProfileImage")
const logoutLink=document.getElementById("logoutLink")
const sideBarImage=document.getElementById("sideBarImage")
const sideBarName=document.getElementById("sideBarName")
const studentsSideBarLink=document.getElementById("studentsSideBarLink")
const studentssideBar2=document.getElementById("studentssideBar2")
let file = document.getElementById("file")
const level= localStorage.getItem('level')
const PostContent=document.getElementById('PostContent')
const postCreateBtn=document.getElementById('createPost')
const quizesLink=document.getElementById('quizesLink')
const materialLink=document.getElementById('materialLink')
const doctorSideBarLink=document.getElementById("doctorSideBarLink")
const doctorssideBar2=document.getElementById("doctorssideBar2")
// const profileLink=document.getElementById('profileLink')
const isDoc =localStorage.getItem('doc')
const timeLine =document.getElementById("timeLine")
const socket = io.connect()

// const userId=localStorage.getItem("userId")
// const imageName=localStorage.getItem("imageProfile")
const userId=window.location.pathname.slice(8)  //get user id from url
console.log(userId)

const doneQuizesLink=document.getElementById("doneQuizes")
const unreadMessages=document.getElementById("unreadMessages")








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

///************ handling get all quizes link when clicked */
materialLink.addEventListener("click",(e)=>{
    e.preventDefault()
    quizesLink.href=`/materials/${userId}`
    location.href=`/materials/${userId}`
    
})


///****************************** get student feedes an setr it in his time line */
fetch(`/api/postsByLevel/${userId}/${level}`).then(response=>{
    return response.json()
}).then(result=>{
    console.log(result)
    const posts=result.posts;
    post.innerHTML=posts.map(post=>{
        let liked=false;
        if(post.isLiked) liked=true

            let haveComment;
            if(post.comments.length >0){
                haveComment=true
            }else{
                haveComment=false
            }

        const comments = post.comments.map(comment=>{
            let replayes = comment.replayes.map(replay=>{
                return  `
                    <br/>
                    <span class="mb-3 ml-5"><b style="color: #006699;"> ${replay.replayUploader.Name}: &nbsp;</b> ${replay.content}
                                
                    <button style="all: unset;" onclick="replayLike('${replay._id}')">
                     ${replay.isLiked?`<i class="fas fa-heart ml-3" style="color: red;" id="replayHeart${replay._id}"></i><span id="replayesNum${replay._id}">${replay.likesNum}</span>`:
                     `<i class="far fa-heart ml-3" id="replayHeart${replay._id}"></i><span id="replayesNum${replay._id}">${replay.likesNum}</span>`
                    }
                        
                        </i> Like</button>
                    </span>
                    <br/>
                `
            })

            if(comment.isLiked){ 

                return  `<span class="mb-3"><b style="color: #006699;">${comment.commentUploader.Name} : &nbsp;</b> ${comment.content}<i class="fas fa-heart ml-3" style="color:red; cursor: pointer;" id="commentLike${comment._id}" onclick="commentLike('${comment._id}')"></i></span>
                <button style="all: unset;" type="button" data-toggle="collapse" data-target="#R${comment._id}" aria-expanded="false" aria-controls="collapseExample"><i class="far fa-comment-dots ml-3"></i> Replay</button>
                <!-- *********************************ReplayComment***************************** -->
                <div class="collapse mt-3" id="R${comment._id}">
                         ${replayes}
                <div class="input-group  ">
                    <input type="text" class="form-control mt-2" placeholder="Replay..."  id="replayInput${comment._id}">
                    <div class="input-group-append">
                        <button class="btn btn-outline-primary" type="button"  onclick="replay('${comment._id}')">Replay</button>
                    </div>
                    </div>
                </div>
                
                `

            }else{
                return  `<span class="mb-3"><b style="color: #006699;">${comment.commentUploader.Name} : &nbsp;</b> ${comment.content}<i class="far fa-heart ml-3" style="color:none; cursor: pointer;" id="commentLike${comment._id}" onclick="commentLike('${comment._id}')"></i></span>
                <button style="all: unset;" type="button" data-toggle="collapse" data-target="#R${comment._id}" aria-expanded="false" aria-controls="collapseExample"><i class="far fa-comment-dots ml-3"></i> Replay</button>
                <!-- *********************************ReplayComment***************************** -->
                <div class="collapse mt-3" id="R${comment._id}">
                   ${replayes}
                <div class="input-group  ">
                    <input type="text" class="form-control mt-2" placeholder="Replay..."  id="replayInput${comment._id}">
                    <div class="input-group-append">
                        <button class="btn btn-outline-primary" type="button"  onclick="replay('${comment._id}')">Replay</button>
                    </div>
                    </div>
                </div>
                `
            }
        })

        if(!post.postType || post.postType =='none'){

            return  `
            
                    <!-- *******************************************Post***************************************** -->
                    <div class="post mb-3">
                    <div class="top">
                        <img src="${post.postUploader.ProfileImagePath}" class="float-left mr-4">
                        <a href="/profile/${post.postUploader._id}"><h5> ${post.postUploader.Name}</h5></a>
                            <span class="text-muted"> ${post.postUploader.Email}<br>
                            ${post.timestemp}</span>

                    </div>

                    <div class="dropdown-divider"></div>

                    <div class="down">
                        <p id="oldPostContent${post._id}">
                        ${post.content}
                        </p>
                        <div class="dropdown-divider"></div>
                        ${
                            liked?`<a><i class="fas fa-heart  ml-3" style="color:red" id="${post._id}" onclick="like('${post._id}')" ></i></a><span id="h${post._id}">${post.likesNum}</span>`:
                            ` <a><i class="far fa-heart  ml-3" id="${post._id}" onclick="like('${post._id}')"></i></a> <span id="h${post._id}">${post.likesNum}</span>`
                        }
                        <!-- **** -->
                            <a  data-toggle="collapse" href="#n${post._id}" role="button" aria-expanded="false" aria-controls="collapseExample">
                                <i class="far fa-comment ml-3"></i><span id="commentNum${post._id}">${post.commentsNum}</span>
                            </a>
                        <!-- **** -->
                        <!-- **********************************End Edit & Delete********************** -->
                        <!-- **********************************End Edit & Delete********************** -->
                        ${
                            post.mine?
                            `<!-- **********************************End Edit & Delete********************** -->
                            <button type="button" class="float-right" data-toggle="modal" data-target="#EditPost${post._id}" style="all: unset; color: #006699; cursor: pointer;"><i class="fas fa-edit fa-lg "></i></button>
                            <button class="float-right mr-3 " style="all: unset; color: red; cursor: pointer;"><i class="fas fa-trash-alt fa-lg"></i></button>
                            <!-- **********************************End Edit & Delete********************** -->` 
                            :' '
                        }



                        <!--****************************** EDIT MODEL*************************************-->
                        <!-- **************************************EditPost************************************************ -->
                        <div class="modal fade" id="EditPost${post._id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalCenterTitle">Edit Post</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                </div>
                                <div class="modal-body">
                                <!-- ************************************************** -->
                                <div class="creatPost mb-3 mt-5 " style="margin: 0;width: 100%;">
                                    <form action="">
                                        <textarea placeholder="Write SomeThing..."  id="newPostContent${post._id}">${post.content}</textarea>
                                    </form>
                                    <div class="tool clearfix">
                                        
            
                                        
                                    </div>
                                </div>
                                <!-- ************************************************** -->
                                </div>
                                <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" onclick="updatePost('${post._id}')">Save</button>
                                </div>
                            </div>
                            </div>
                        </div>
                      <!--****************************** EDIT MODEL*************************************-->
                    <!-- **************************************End-EditPost************************************************ -->
                        <!-- **********************************End Edit & Delete********************** -->
                        <!-- *** -->
                        <div class="collapse mt-3" id="n${post._id}">
                            <div class="card card-body" id="cc${post._id}">
                               ${comments}
                               <!-- <span class="mb-3"><b style="color: #006699;">Ahmed Mahmoud : &nbsp;</b> thank you<i class="far fa-heart ml-3"></i></span>
                                <span class="mb-3"><b style="color: #006699;">Khaled Mahmoud : &nbsp;</b> Nice Comment<i class="fas fa-heart ml-3" style="color: red;"></i></span>-->
                                <!-- *************************Replay******************* -->
                               
                                <!------------------------------------->
                            <div class="input-group">
                                <input type="text" class="form-control mt-2" placeholder="Replay..." id="c${post._id}">
                                <div class="input-group-append">
                                <button class="btn btn-outline-primary" type="button" onclick="comment('${post._id}')">Comment</button>
                                </div>
                            </div>
                                <!-- *************************End-Replay******************* -->
                                
                            </div>
                        
                            
                            
                        </div>

                    </div>
                </div>
                <!-- *******************************************End Post***************************************** -->
            
            `

        }else{

            //Know file type//*********************** */
            let type='';
            let path='';

            if(post.postType.includes('image')){
                type='image'
                path=post.filePath

            }else if(post.postType.includes('pdf')){
                type='pdf'
                path='../images/pdf-powerPoint-images/pdf.jpg'
            }else if(post.postType.includes('presentation')){
                type='powerPoint'
                path='../images/pdf-powerPoint-images/word.jpg'
            }else if(post.postType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')){
                type='word'
                path='../images/pdf-powerPoint-images/word.jpg'
            }else if(post.postType.includes('zip')){
                type='zip'
                path='../images/pdf-powerPoint-images/zip.png'
            }


            

            return  `
            
                    <!-- *******************************************Post***************************************** -->
                    <div class="post mb-3">
                    <div class="top">
                        <img src="${post.postUploader.ProfileImagePath}" class="float-left mr-4">
                        <a href="/profile/${post.postUploader._id}"><h5> ${post.postUploader.Name}</h5></a>
                            <span class="text-muted"> ${post.postUploader.Email}<br>
                            ${post.timestemp}</span>

                    </div>

                    <div class="dropdown-divider"></div>

                    <div class="down">
                        <p id="oldPostContent${post._id}">
                          ${post.content}
                        </p>
                        <img src="${path}" alt="" style="width: 100px; height: 100px; cursor: pointer;" onclick="attatchCliked('${post.filePath}')" id="${post.filePath}">
                        <div class="dropdown-divider"></div>
                        ${
                            liked?`<a><i class="fas fa-heart  ml-3" style="color:red" id="${post._id}" onclick="like('${post._id}')" ></i></a><span id="h${post._id}">${post.likesNum}</span>`:
                            ` <a><i class="far fa-heart  ml-3" id="${post._id}" onclick="like('${post._id}')"></i></a> <span id="h${post._id}">${post.likesNum}</span>`
                        }
                        <!-- **** -->
                            <a  data-toggle="collapse" href="#n${post._id}" role="button" aria-expanded="false" aria-controls="collapseExample">
                                <i class="far fa-comment ml-3"></i><span id="commentNum${post._id}">${post.commentsNum}</span>
                            </a>
                        <!-- **** -->
                        <!-- **********************************End Edit & Delete********************** -->
                        <!-- **********************************End Edit & Delete********************** -->
                        ${
                            post.mine?
                            `<!-- **********************************End Edit & Delete********************** -->
                            <button type="button" class="float-right" data-toggle="modal" data-target="#EditPost${post._id}" style="all: unset; color: #006699; cursor: pointer;"><i class="fas fa-edit fa-lg "></i></button>
                            <button class="float-right mr-3 " style="all: unset; color: red; cursor: pointer;"><i class="fas fa-trash-alt fa-lg"></i></button>
                            <!-- **********************************End Edit & Delete********************** -->` 
                            :' '
                        }



                        <!--****************************** EDIT MODEL*************************************-->
                        <!-- **************************************EditPost************************************************ -->
                        <div class="modal fade" id="EditPost${post._id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalCenterTitle">Edit Post</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                </div>
                                <div class="modal-body">
                                <!-- ************************************************** -->
                                <div class="creatPost mb-3 mt-5 " style="margin: 0;width: 100%;">
                                    <form action="">
                                        <textarea placeholder="Write SomeThing..."  id="newPostContent${post._id}">${post.content}</textarea>
                                    </form>
                                    <div class="tool clearfix">
                                        
            
                                        
                                    </div>
                                </div>
                                <!-- ************************************************** -->
                                </div>
                                <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" onclick="updatePost('${post._id}')">Save</button>
                                </div>
                            </div>
                            </div>
                        </div>
                      <!--****************************** EDIT MODEL*************************************-->
                    <!-- **************************************End-EditPost************************************************ -->
                        <!-- **********************************End Edit & Delete********************** -->
                        <!-- *** -->
                        <div class="collapse mt-3" id="n${post._id}">
                            <div class="card card-body" id="cc${post._id}">
                            ${comments}
                            <!--<span class="mb-3"><b style="color: #006699;">Ahmed Mahmoud : &nbsp;</b> thank you<i class="far fa-heart ml-3"></i></span>
                                <span class="mb-3"><b style="color: #006699;">Khaled Mahmoud : &nbsp;</b> Nice Comment<i class="fas fa-heart ml-3" style="color: red;"></i></span>-->
                                <!-- *************************Replay******************* -->
                            <div class="input-group">
                                <input type="text" class="form-control mt-2" placeholder="Replay..."  id="c${post._id}">
                                <div class="input-group-append">
                                <button class="btn btn-outline-primary" type="button" onclick="comment('${post._id}')">Comment</button>
                                </div>
                            </div>
                                <!-- *************************End-Replay******************* -->
                                
                            </div>
                        
                            
                            
                        </div>

                    </div>
                </div>
                <!-- *******************************************End Post***************************************** -->
            
               `
        }
        
       
    })
 
})
 



///// handelin uploading post by student
postCreateBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    const body=new FormData()
        body.append('file',file.files[0])
        body.append('postContent',PostContent.value)
        body.append('userId',userId)
        body.append('level',level)
        

       

    console.log(file.files[0])
    fetch('/api/createPostByDocOrStudent',{
        method: 'POST', 
        // headers: {
        // 'Content-Type': 'application/json'
        // // 'Content-Type': 'application/x-www-form-urlencoded',
        // },
        body:body
    }).then(response=>{
        return response.json()
    }).then(result=>{

        console.log(result)
        // file.files[0]=''
        file.value=''
        
        if(result.success == true){
            const newpost=result.newPost;
            let addedPost; 
            let liked=false;
            if(newpost.isLiked) liked=true

            if(!newpost.postType || newpost.postType =='none'){

                addedPost=`
                               <!-- *******************************************Post***************************************** -->
                               <div class="post mb-3">
                               <div class="top">
                                   <img src="${newpost.postUploader.ProfileImagePath}" class="float-left mr-4">
                                   <a href="/profile/${newpost.postUploader._id}"><h5> ${newpost.postUploader.Name}</h5></a>
                                       <span class="text-muted"> ${newpost.postUploader.Email}<br>
                                       ${newpost.timestemp}</span>
   
                               </div>
   
                               <div class="dropdown-divider"></div>
   
                               <div class="down">
                                   <p id="oldPostContent${newpost._id}">
                                   ${newpost.content}
                                   </p>
                                   <div class="dropdown-divider"></div>
                                   ${
                                       liked?`<a><i class="fas fa-heart  ml-3" style="color:red" id="${newpost._id}" onclick="like('${newpost._id}')" ></i></a><span id="h${newpost._id}">${newpost.likesNum}</span>`:
                                       ` <a><i class="far fa-heart  ml-3" id="${newpost._id}" onclick="like('${newpost._id}')"></i></a> <span id="h${newpost._id}">${newpost.likesNum}</span>`
                                   }
                                   <!-- **** -->
                                       <a  data-toggle="collapse" href="#n${newpost._id}" role="button" aria-expanded="false" aria-controls="collapseExample">
                                           <i class="far fa-comment ml-3"></i><span id="commentNum${newpost._id}">${newpost.commentsNum}</span>
                                       </a>
                                   <!-- **** -->
                                   <!-- **********************************End Edit & Delete********************** -->
                                   <!-- **********************************End Edit & Delete********************** -->
                                   ${
                                     newpost.mine?
                                     `<!-- **********************************End Edit & Delete********************** -->
                                     <button type="button" class="float-right" data-toggle="modal" data-target="#EditPost${newpost._id}" style="all: unset; color: #006699; cursor: pointer;"><i class="fas fa-edit fa-lg "></i></button>
                                     <button class="float-right mr-3 " style="all: unset; color: red; cursor: pointer;"><i class="fas fa-trash-alt fa-lg"></i></button>
                                     <!-- **********************************End Edit & Delete********************** -->` 
                                     :' '
                                 }
         
         
         
                                 <!--****************************** EDIT MODEL*************************************-->
                                 <!-- **************************************EditPost************************************************ -->
                                 <div class="modal fade" id="EditPost${newpost._id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                     <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                                     <div class="modal-content">
                                         <div class="modal-header">
                                         <h5 class="modal-title" id="exampleModalCenterTitle">Edit Post</h5>
                                         <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                             <span aria-hidden="true">&times;</span>
                                         </button>
                                         </div>
                                         <div class="modal-body">
                                         <!-- ************************************************** -->
                                         <div class="creatPost mb-3 mt-5 " style="margin: 0;width: 100%;">
                                             <form action="">
                                                 <textarea placeholder="Write SomeThing..."  id="newPostContent${newpost._id}">${newpost.content}</textarea>
                                             </form>
                                             <div class="tool clearfix">
                                                 
                     
                                                 
                                             </div>
                                         </div>
                                         <!-- ************************************************** -->
                                         </div>
                                         <div class="modal-footer">
                                         <button type="button" class="btn btn-secondary" onclick="updatePost('${newpost._id}')">Save</button>
                                         </div>
                                     </div>
                                     </div>
                                 </div>
                               <!--****************************** EDIT MODEL*************************************-->
                                   <!-- **********************************End Edit & Delete********************** -->
                                   <!-- *** -->
                                   <div class="collapse mt-3" id="n${newpost._id}">
                                       <div class="card card-body" id="cc${newpost._id}">
                                       <!--<span class="mb-3"><b style="color: #006699;">Ahmed Mahmoud : &nbsp;</b> thank you<i class="far fa-heart ml-3"></i></span>
                                           <span class="mb-3"><b style="color: #006699;">Khaled Mahmoud : &nbsp;</b> Nice Comment<i class="fas fa-heart ml-3" style="color: red;"></i></span>-->
                                           <!-- *************************Replay******************* -->
                                       <div class="input-group">
                                           <input type="text" class="form-control mt-2" placeholder="Replay..." id="c${newpost._id}">
                                           <div class="input-group-append">
                                           <button class="btn btn-outline-primary" type="button" onclick="comment('${newpost._id}')">Comment</button>
                                           </div>
                                       </div>
                                           <!-- *************************End-Replay******************* -->
                                           
                                       </div>
                                   
                                       
                                       
                                   </div>
   
                               </div>
                           </div>
                           <!-- *******************************************End Post***************************************** -->`
            }else {
                let type='';
                let path='';
    
                if(newpost.postType.includes('image')){
                    type='image'
                    path=newpost.filePath
    
                }else if(newpost.postType.includes('pdf')){
                    type='pdf'
                    path='../images/pdf-powerPoint-images/pdf.jpg'
                }else if(newpost.postType.includes('presentation')){
                    type='powerPoint'
                    path='../images/pdf-powerPoint-images/word.jpg'
                }else if(newpost.postType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')){
                    type='word'
                    path='../images/pdf-powerPoint-images/word.jpg'
                }else if(newpost.postType.includes('zip')){
                    type='zip'
                    path='../images/pdf-powerPoint-images/zip.png'
                }


                addedPost=`      <!-- *******************************************Post***************************************** -->
                                  <div class="post mb-3">
                                  <div class="top">
                                      <img src="${newpost.postUploader.ProfileImagePath}" class="float-left mr-4">
                                      <a href="/profile/${newpost.postUploader._id}"><h5> ${newpost.postUploader.Name}</h5></a>
                                          <span class="text-muted"> ${newpost.postUploader.Email}<br>
                                          ${newpost.timestemp}</span>
      
                                  </div>
      
                                  <div class="dropdown-divider"></div>
      
                                  <div class="down">
                                      <p id="oldPostContent${newpost._id}">
                                      ${newpost.content}
                                      </p>
                                      <img src="${path}" alt="" style="width: 100px; height: 100px; cursor: pointer;" onclick="attatchCliked('${newpost.filePath}')" id="${newpost.filePath}">
                                      <div class="dropdown-divider"></div>
                                      ${
                                          liked?`<a><i class="fas fa-heart  ml-3" style="color:red" id="${newpost._id}" onclick="like('${newpost._id}')" ></i></a><span id="h${newpost._id}">${newpost.likesNum}</span>`:
                                          ` <a><i class="far fa-heart  ml-3" id="${newpost._id}" onclick="like('${newpost._id}')"></i></a> <span id="h${newpost._id}">${newpost.likesNum}</span>`
                                      }
                                      <!-- **** -->
                                          <a  data-toggle="collapse" href="#n${newpost._id}" role="button" aria-expanded="false" aria-controls="collapseExample">
                                              <i class="far fa-comment ml-3"></i><span id="commentNum${newpost._id}">${newpost.commentsNum}</span>
                                          </a>
                                      <!-- **** -->
                                      <!-- **********************************End Edit & Delete********************** -->
                                      <!-- **********************************End Edit & Delete********************** -->
                                      ${
                                        newpost.mine?
                                        `<!-- **********************************End Edit & Delete********************** -->
                                        <button type="button" class="float-right" data-toggle="modal" data-target="#EditPost${newpost._id}" style="all: unset; color: #006699; cursor: pointer;"><i class="fas fa-edit fa-lg "></i></button>
                                        <button class="float-right mr-3 " style="all: unset; color: red; cursor: pointer;"><i class="fas fa-trash-alt fa-lg"></i></button>
                                        <!-- **********************************End Edit & Delete********************** -->` 
                                        :' '
                                    }
            
            
            
                                    <!--****************************** EDIT MODEL*************************************-->
                                    <!-- **************************************EditPost************************************************ -->
                                    <div class="modal fade" id="EditPost${newpost._id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalCenterTitle">Edit Post</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                            </div>
                                            <div class="modal-body">
                                            <!-- ************************************************** -->
                                            <div class="creatPost mb-3 mt-5 " style="margin: 0;width: 100%;">
                                                <form action="">
                                                    <textarea placeholder="Write SomeThing..."  id="newPostContent${newpost._id}">${newpost.content}</textarea>
                                                </form>
                                                <div class="tool clearfix">
                                                    
                        
                                                    
                                                </div>
                                            </div>
                                            <!-- ************************************************** -->
                                            </div>
                                            <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" onclick="updatePost('${newpost._id}')">Save</button>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                  <!--****************************** EDIT MODEL*************************************-->
                                      <!-- **********************************End Edit & Delete********************** -->
                                      <!-- *** -->
                                      <div class="collapse mt-3" id="n${newpost._id}">
                                          <div class="card card-body" id="cc${newpost._id}">
                                          <!--<span class="mb-3"><b style="color: #006699;">Ahmed Mahmoud : &nbsp;</b> thank you<i class="far fa-heart ml-3"></i></span>
                                              <span class="mb-3"><b style="color: #006699;">Khaled Mahmoud : &nbsp;</b> Nice Comment<i class="fas fa-heart ml-3" style="color: red;"></i></span>-->
                                              <!-- *************************Replay******************* -->
                                          <div class="input-group">
                                              <input type="text" class="form-control mt-2" placeholder="Replay..." id="c${newpost._id}">
                                              <div class="input-group-append">
                                              <button class="btn btn-outline-primary" type="button" onclick="comment('${newpost._id}')">Comment</button>
                                              </div>
                                          </div>
                                              <!-- *************************End-Replay******************* -->
                                              
                                          </div>
                                      
                                          
                                          
                                      </div>
      
                                  </div>
                              </div>
                              <!-- *******************************************End Post***************************************** -->`
            }
            post.innerHTML=addedPost+post.innerHTML;
            // post.insertAdjacentHTML('afterbegin',addedPost);
            PostContent.value=' ' 
        }
    })
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





//******************************************* Helper methods */

//***********************add like to post/*
async function like(postId){
    const data={
        postId:postId,
        userId:userId,
    }
     
    fetch(`/api/postLike`,{
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
            let likeHeartBtn=document.getElementById(postId);
            let likesNum=document.getElementById('h'+postId);

            if(json.message == 'like removed successfully'){
                likeHeartBtn.className='far fa-heart  ml-3 '
                likeHeartBtn.style='color:none'
                likesNum.innerHTML=json.likesNum
            
            }else{
                likeHeartBtn.className='fas fa-heart  ml-3'
                likeHeartBtn.style='color:red'
                likesNum.innerHTML=json.likesNum
            }
        }
    })
}

async function profileSettingClicked(e){
    e.preventDefault()
    location.href=`/profile/${userId}`
}

async function attatchCliked(filePath){
    location.href=filePath
}

async function comment(postId){
    const content =document.getElementById(`c${postId}`);
    const commentContainer =document.getElementById(`cc${postId}`);
    const commentsNum =document.getElementById(`commentNum${postId}`);

    const data={
        commentContent:content.value,
        postId:postId,
        studentId:userId,
    }
     
    fetch(`/api/createComment`,{
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
            commentsNum.innerHTML = json.commentsNum
            let newwComment =`
                              <span class="mb-3"><b style="color: #006699;">${json.newComment.commentUploader.Name} : &nbsp;</b> ${json.newComment.content}<i class="far fa-heart ml-3" style:" cursor: pointer;"  id="commentLike${json.newComment._id}" onclick="commentLike('${json.newComment._id}')"></i></span>
                              <button style="all: unset;" type="button" data-toggle="collapse" data-target="#R${json.newComment._id}" aria-expanded="false" aria-controls="collapseExample"><i class="far fa-comment-dots ml-3"></i> Replay</button>
                              <div class="collapse mt-3" id="R${json.newComment._id}">
                                  <!--------Replayes HERE-->
                              <div class="input-group  ">
                                  <input type="text" class="form-control mt-2" placeholder="Replay..."  id="replayInput${json.newComment._id}">
                                  <div class="input-group-append">
                                      <button class="btn btn-outline-primary" type="button"  onclick="replay('${json.newComment._id}')">Replay</button>
                                  </div>
                                  </div>
                              </div>

                             ` 
            commentContainer.innerHTML=newwComment+commentContainer.innerHTML;
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

//*************comment Like */
async function commentLike(commentId){
    const heart =document.getElementById(`commentLike${commentId}`);
    

    const data={
        commentId:commentId,
        studentId:userId,
    }
     
    fetch(`/api/commentLike`,{
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
           if(json.message == 'like added successfully'){
            heart.className = 'fas fa-heart ml-3'
            heart.style ='color:red; cursor: pointer;'
           }else{
            heart.className = 'far fa-heart ml-3'
            heart.style ='color:none;  cursor: pointer;'
           }
        }
    })
}

async function replay(commentId){
    const replayContainer =document.getElementById(`R${commentId}`);
    const replayContent =document.getElementById(`replayInput${commentId}`);

    const data={
        replayComment:replayContent.value,
        commentId:commentId,
        studentId:userId,
    }
     
    fetch(`/api/comentReplay`,{
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
            // commentsNum.innerHTML = json.commentsNum
            let newReplay =`
                               <br/>
                                <span class="mb-3 ml-5"><b style="color: #006699;"> ${json.newReplay.replayUploader.Name}: &nbsp;</b> ${json.newReplay.content}
                                            
                                <button style="all: unset;" onclick="replayLike('${json.newReplay._id}')">
                                    <i class="far fa-heart ml-3"  id="replayHeart${json.newReplay._id}">
                                    </i><span id="replayesNum${json.newReplay._id}">${json.newReplay.likesNum}</span> Like</button>
                                </span>
                                <br/>

                             `
            replayContainer.innerHTML=newReplay+replayContainer.innerHTML;
        }
    })
}


async function replayLike(replayId){
    const heart =document.getElementById(`replayHeart${replayId}`);
    const replayesNum =document.getElementById(`replayesNum${replayId}`);
    

    const data={
        replayId:replayId,
        studentId:userId,
    }
     
    fetch(`/api/replayLike`,{
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
            replayesNum.innerHTML=json.likesNum;
           if(json.message == 'like added successfully'){
            heart.className = 'fas fa-heart ml-3'
            heart.style ='color:red; cursor: pointer;'
           }else{
            heart.className = 'far fa-heart ml-3'
            heart.style ='color:none;  cursor: pointer;'
           }
        }
    })
}

async function updatePost(postId){
    const newPostContent = document.getElementById(`newPostContent${postId}`)
    const oldPostContent = document.getElementById(`oldPostContent${postId}`)

    const data={
        postId:postId,
        userId:userId,
        postContent:newPostContent.value,
    }
     
    fetch(`/api/postUpdate`,{
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
            oldPostContent.innerHTML= json.newPost.content;
        }
       
    })

}