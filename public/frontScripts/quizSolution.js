const sideName = document.getElementById('sideName')
const userProfileImage = document.getElementById('userProfileImage')
const imageSide = document.getElementById('imageSide')
const quizId=window.location.pathname.slice(6)  //get user id from url
const userId=localStorage.getItem("userId") //get user id from url
const studentsSideBarLink=document.getElementById("studentsSideBarLink")
const studentssideBar2=document.getElementById("studentssideBar2")
const logoutLink=document.getElementById("logoutLink")
const questionContainer=document.querySelector('.questionContainer')
const finishBtn =document.getElementById('finishBtn')
const doctorSideBarLink=document.getElementById("doctorSideBarLink")
const doctorssideBar2=document.getElementById("doctorssideBar2")
let gloabalQuiz = []
console.log(userId)
const timeLine = document.getElementById('timeLine')
const quizesLink=document.getElementById('quizesLink')
const isDoc=localStorage.getItem("doc")
const materialLink=document.getElementById("materialLink")
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


///************ handling get student timeLine link when clicked */
timeLine.addEventListener("click",(e)=>{
  e.preventDefault()
  location.href = `/feedes/${userId}`
  
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

/// logout like handel href when click
logoutLink.addEventListener("click",(e)=>{
    e.preventDefault()
    localStorage.removeItem("userId");
    localStorage.removeItem("doc");
    location.href='/login'
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

// get the quiz
 
fetch(`/api/getQuiz/${userId}/${quizId}`).then(response=>{
    return response.json()
}).then(json=>{
    console.log(json)
    if(json.success == true){
        gloabalQuiz=json.quiz;
        let counter=0
        questionContainer.innerHTML=json.quiz.questions.map(question=>{
            counter++
            return `
            
            <li class="list-group-item p-3">
                  <h6 class="mb-3">${counter}- ${question.question} ?</h6>
                  <div class="col-12">
                    <div class="form-check form-check-inline mb-3 col-lg-5">
                      <b style="color: #006699;">A &nbsp;</b>
                      <input
                        class="form-check-input"
                        type="radio"
                        name="${question._id}"
                        id="gridRadios1"
                        value="${question.option1}"
                      />
                      <label class="form-check-label" for="gridRadios1">
                        ${question.option1}
                      </label>
                    </div>
                    <div class="form-check form-check-inline mb-3 col-lg-5">
                      <b style="color: #006699;">B &nbsp;</b>
                      <input
                        class="form-check-input"
                        type="radio"
                        name="${question._id}"
                        id="gridRadios1"
                        value="${question.option2}"
                      />
                      <label class="form-check-label" for="gridRadios1">
                        ${question.option2}
                      </label>
                    </div>
                    <div class="form-check form-check-inline mb-3 col-lg-5">
                      <b style="color: #006699;">C &nbsp;</b>
                      <input
                        class="form-check-input"
                        type="radio"
                        name="${question._id}"
                        id="gridRadios1"
                        value="${question.option3}"
                      />
                      <label class="form-check-label" for="gridRadios1">
                      ${question.option3}
                      </label>
                    </div>
                    <div class="form-check form-check-inline mb-3 col-lg-5">
                      <b style="color: #006699;">D &nbsp;</b>
                      <input
                        class="form-check-input"
                        type="radio"
                        name="${question._id}"
                        id="gridRadios1"
                        value="${question.option4}"
                      />
                      <label class="form-check-label" for="gridRadios1">
                      ${question.option4}
                      </label>
                    </div>
                  </div>
                </li>
            `
        })
    }else {
      questionContainer.innerHTML=`<div class="alert alert-primary">${json.message}</div>`
      finishBtn.style='display:none'
    }
})



/////finish buttonnnnnnnnnnn

finishBtn.addEventListener('click',async(e) => {
    let count=0;
    e.preventDefault()
    console.log(gloabalQuiz,"gloabalQuiz")
    await gloabalQuiz.questions.forEach(question => {
        //get the check box values just checked 
        var values = [].filter.call(document.getElementsByName(question._id), function(c) {
            return c.checked;
          }).map(function(c) {
            return c.value;
          });
        console.log(values[0])
        console.log(question["option"+question.answer])
        if(values[0] == question["option"+question.answer]){
             count++;
        }

    });

    console.log(count)
    const inputdata={
        studentId:userId,
        quizId:quizId,
        result:count
    }

    fetch('/api/quizResult',{
        method: 'POST', 
        headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:JSON.stringify(inputdata)
    }).then(response=>{
        return response.json()
    }).then(json=>{
     console.log(json)
     location.href=`/myQuizes/${userId}`

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