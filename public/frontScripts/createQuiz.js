const timeLine = document.getElementById('timeLine')
const profileLink=document.getElementById("profileLink")
const userId=window.location.pathname.slice(11)  //get user id from url
const userProfileImage=document.getElementById("userProfileImage")
const logoutLink=document.getElementById("logoutLink")
const sideBarImage=document.getElementById("sideBarImage")
const sideBarName=document.getElementById("sideBarName")
const studentsSideBarLink=document.getElementById("studentsSideBarLink")
const studentssideBar2=document.getElementById("studentssideBar2")
const addQuestion=document.getElementById('addQuestion')
const quizName=document.getElementById('quizName')
const quizLevel=document.getElementById('quizLevel')
const firstQuiz=document.getElementById('firstQuiz')
const unreadMessages=document.getElementById("unreadMessages")
const socket = io.connect()
const op1=document.getElementById('op1')
const op2=document.getElementById('op2')
const op3=document.getElementById('op3')
const op4=document.getElementById('op4')
const op5=document.getElementById('op5')
const ans=document.querySelector('.ans')
let quizid;
let iscreateOnce = true;
let counter =1;
const questionssContainer =document.getElementById('questionss')
const intialQuuestion=document.getElementById('intialQuuestion')
const doctorSideBarLink=document.getElementById("doctorSideBarLink")
const doctorssideBar2=document.getElementById("doctorssideBar2")
const quizesLink=document.getElementById('quizesLink')
const isDoc =localStorage.getItem("doc")
const addingValidation =document.getElementById("addingValidation")

//add Question  inputs

const questionAdd=document.getElementById('questionAdd')
const opA=document.getElementById('opA')
const opB=document.getElementById('opB')
const opC=document.getElementById('opC')
const opD=document.getElementById('opD')
const opE=document.getElementById('opE')
const ansR=document.getElementById('ansR')
const addQ=document.getElementById('addQ')
let quizPath;
const materialLink=document.getElementById("materialLink")
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




/// profile like handel href when click
profileLink.addEventListener("click",(e)=>{
    e.preventDefault()
    location.href=`/profile/${userId}`
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

 ///************ handling get all quizes link when clicked */
 quizesLink.addEventListener("click",(e)=>{
   
    
    if(isDoc == true || isDoc == "true"){
        quizPath=`#`;
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


addQuestion.addEventListener("click",(e)=>{
    e.preventDefault()
    addQuestion.setAttribute('data-target','#exampleModalCenter')


    if(iscreateOnce){
           // add question to quiz
            const data={
                title:quizName.value,
                level:quizLevel.value,
                doctorId:userId
            }
            console.log(data)
            
            fetch('/api/createQuizByDoc',{
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
                    iscreateOnce = false
                    
                    
                    quizid=json.newQuiz._id;
                    console.log(quizid)
                    let newQuiz0=json.newQuiz

                    //addd intial quiz

                        const data1={
                        quizId:quizid,
                        question:firstQuiz.value,
                        answer:ans.value,
                        option1:op1.value,
                        option2:op2.value,
                        option3:op3.value,
                        option4:op4.value,
                    }
                    console.log(data)
                    
                        fetch('/api/addQuetion',{
                            method: 'POST', 
                            headers: {
                            'Content-Type': 'application/json'
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body:JSON.stringify(data1)
                        }).then(response=>{
                        return response.json()})
                        .then(json=>{
                            console.log(json)
                        let newQuestion = `
                                <form action="">
                                <div class="form-group mt-5">
                                    <!-- --------------Name of Quiz--------------------- -->

                                    <div  id="intialQuiz">
                                    <div class="row">
                                    
                                        <div class="input-group mb-3 col-md-6">
                                        <input type="text" class="form-control" placeholder="Name of Quiz " id="quizName" value="${newQuiz0.Title}" readonly>
                                        </div>

                                        <!-- --------------Choose...Levels--------------------- -->

                                        <div class="input-group mb-3 col-md-6 mb-3">
                                        <select class=value="${newQuiz0.Level}" id="quizLevel" readonly>
                                            <option selected>${newQuiz0.Level}</option>
                                           
                                        </select>
                                        </div>
                                    </div>
                                    <!---->
                                    <br/><br/>
                                    </div>

                                <div id="allq${json.newQuestion._id}">
                                        <!-- ---------------Enter A question-------------- -->
                                        <div class="input-group mb-3 ">
                                            <div class="input-group-prepend">
                                            <span class="input-group-text " id="basic-addon1">Q <sub>${counter}</sub></span>
                                            </div>
                                            <input type="text" class="form-control" placeholder="Enter A question " aria-label="Username" aria-describedby="basic-addon1" id="updatedQ${json.newQuestion._id}"  value="${json.newQuestion.question}" readonly>
                                        </div>
                                    </div>
                                    <!-- ----------------Answer-------------------- -->
                                    <div class="row justify-content-around">
                                        
                                        <div class="input-group mb-3 col-md-6">
                                            <div class="input-group-prepend">
                                            <span class="input-group-text " id="basic-addon1">a</span>
                                            </div>
                                            <input type="text" class="form-control" placeholder="Answer 1" aria-label="Username" aria-describedby="basic-addon1" id="updatedop1${json.newQuestion._id}" value="${json.newQuestion.option1}" readonly>
                                        </div>
                                        <!-- ------------------- -->

                                        <div class="input-group mb-3 col-md-6">
                                            <div class="input-group-prepend">
                                            <span class="input-group-text" id="basic-addon1">b</span>
                                            </div>
                                            <input type="text" class="form-control" placeholder="Answer 2" aria-label="Username" aria-describedby="basic-addon1" id="updatedop2${json.newQuestion._id}"   value="${json.newQuestion.option2}" readonly>
                                        </div>
                                        <!-- ------------------- -->

                                        <div class="input-group mb-3 col-md-6">
                                            <div class="input-group-prepend">
                                            <span class="input-group-text" id="basic-addon1">c</span>
                                            </div>
                                            <input type="text" class="form-control" placeholder="Answer 3" aria-label="Username" aria-describedby="basic-addon1"  id="updatedop3${json.newQuestion._id}"   value="${json.newQuestion.option3}" readonly>
                                        </div>
                                        <!-- ------------------- -->

                                        <div class="input-group mb-3 col-md-6">
                                            <div class="input-group-prepend">
                                            <span class="input-group-text" id="basic-addon1">d</span>
                                            </div>
                                            <input type="text" class="form-control" placeholder="Answer 4" aria-label="Username" aria-describedby="basic-addon1" id="updatedop4${json.newQuestion._id}"   value="${json.newQuestion.option4}" readonly>
                                        </div>
                                        <!-- ------------------- -->
                                        <div class="input-group mb-3 col">
                                            <select class="custom-select ans " id="updatedans${json.newQuestion._id}" readonly>
                                            <option selected> ${json.newQuestion.answer}</option>
                                        
                                            </select>
                                        </div>
                                    
                                    </div>
                                   
                                    
                                <button class="float-right" style="all: unset; color: #00a0dc;" data-toggle="modal" data-target="#q${json.newQuestion._id}" type="button">
                                    <i class="fas fa-edit mr-3 float-right fa-lg"></i>
                                    </button>
                
                                    <div id"updateValidation"></div>
                                    <!-- ***** End Edit Button-->
                                    <!-- ******************************************** -->
                                    <!-- *****  Edit Icon-->
                                    <div class="modal fade" id="q${json.newQuestion._id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                                        <div class="modal-content">
                                        <div class="modal-header">
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <!-- ***************** -->
                                                <div id"updateValidation"></div>
                                            <div class="form-group">
                                            <label for="exampleFormControlTextarea1"
                                                >Enter new Quation</label
                                            >
                                            <input
                                                class="form-control"
                                                id="question${json.newQuestion._id}"
                                                value="${json.newQuestion.question}"
                                                rows="3"
                                                placeholder="${json.newQuestion.question}"
                                            />
                                            </div>
                                            <div class="form-row mb-3">
                                            <div class="col">
                                                <label for="" style="color: #006699;"><b>A</b></label>
                                                <input
                                                id="op1${json.newQuestion._id}"
                                                value="${json.newQuestion.option1}"
                                                type="text"
                                                class="form-control"
                                                placeholder="Answer A"
                                                />
                                            </div>
                                            <div class="col">
                                                <label for="" style="color: #006699;"><b>B</b></label>
                                                <input
                                                id="op2${json.newQuestion._id}"
                                                value="${json.newQuestion.option2}"
                                                type="text"
                                                class="form-control"
                                                placeholder="Answer B"
                                                />
                                            </div>
                                            </div>
                                            <div class="form-row mb-3">
                                            <div class="col">
                                                <label for="" style="color: #006699;"><b>C</b></label>
                                                <input
                                                id="op3${json.newQuestion._id}"
                                                value="${json.newQuestion.option3}"
                                                type="text"
                                                class="form-control"
                                                placeholder="Answer C"
                                                />
                                            </div>
                                            <div class="col">
                                                <label for="" style="color: #006699;"><b>D</b></label>
                                                <input
                                                id="op4${json.newQuestion._id}"
                                                value="${json.newQuestion.option4}"
                                                type="text"
                                                class="form-control"
                                                placeholder="Answer D"
                                                />
                                            </div>
                                            </div>
                                            <div class="form-row mb-3">
                                            <div class="col-6">
                                                
                                            </div>
                                            </div>
                        
                                            <div class="form-group">
                                            <label for="exampleFormControlSelect1"
                                                >Select right Answer</label
                                            >
                                            <select class="form-control" id="ans${json.newQuestion._id}" value="${json.newQuestion.answer}">
                                                <option value="1">A</option>
                                                <option value="2">B</option>
                                                <option value="3">C</option>
                                                <option value="4">D</option>
                                                <option value="5">E</option>
                                            </select>
                                            </div>
                                            <!-- *************** -->
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-primary"  onclick="updateQuestion('${json.newQuestion._id}')">Update Quation</button>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                    <!-- ***** End Edit Icon-->
                            </div>
                              
                        `
                        intialQuuestion.innerHTML=newQuestion
                        
                    
                    })
                    
                }
                
            })


            // add intial quiz
            

    }else{

       console.log('kkkkkk')
    }

})








addQ.addEventListener("click",(e)=>{
    e.preventDefault()


     // add question to quiz
     const data={
        quizId:quizid,
        question:questionAdd.value,
        answer:ansR.value,
        option1:opA.value,
        option2:opB.value,
        option3:opC.value,
        option4:opD.value,
    }
    console.log(data)
    
    fetch('/api/addQuetion',{
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
            questionAdd.value=''
            ansR.value=''
            opA.value=''
            opB.value=''
            opC.value=''
            opD.value=''
            opE.value=''
            counter++


            
            let newQuestion = `
        <div id="delete${json.newQuestion._id}">
            <br/><br/><br/>
                    <!-- ---------------Enter A question-------------- -->
                    <div class="input-group mb-3 ">
                        <div class="input-group-prepend">
                        <span class="input-group-text " id="basic-addon1">Q <sub>${counter}</sub></span>
                        </div>
                        <input type="text" class="form-control" placeholder="Enter A question " aria-label="Username" aria-describedby="basic-addon1" id="updatedQ${json.newQuestion._id}"  value="${json.newQuestion.question}" readonly>
                    </div>
                </div>
                <!-- ----------------Answer-------------------- -->
                <div class="row justify-content-around">
                    
                    <div class="input-group mb-3 col-md-6">
                        <div class="input-group-prepend">
                        <span class="input-group-text " id="basic-addon1">a</span>
                        </div>
                        <input type="text" class="form-control" placeholder="Answer 1" aria-label="Username" aria-describedby="basic-addon1" id="updatedop1${json.newQuestion._id}" value="${json.newQuestion.option1}" readonly>
                    </div>
                    <!-- ------------------- -->

                    <div class="input-group mb-3 col-md-6">
                        <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">b</span>
                        </div>
                        <input type="text" class="form-control" placeholder="Answer 2" aria-label="Username" aria-describedby="basic-addon1" id="updatedop2${json.newQuestion._id}"   value="${json.newQuestion.option2}" readonly>
                    </div>
                    <!-- ------------------- -->

                    <div class="input-group mb-3 col-md-6">
                        <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">c</span>
                        </div>
                        <input type="text" class="form-control" placeholder="Answer 3" aria-label="Username" aria-describedby="basic-addon1"  id="updatedop3${json.newQuestion._id}"   value="${json.newQuestion.option3}" readonly>
                    </div>
                    <!-- ------------------- -->

                    <div class="input-group mb-3 col-md-6">
                        <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">d</span>
                        </div>
                        <input type="text" class="form-control" placeholder="Answer 4" aria-label="Username" aria-describedby="basic-addon1" id="updatedop4${json.newQuestion._id}"   value="${json.newQuestion.option4}" readonly>
                    </div>
                    <!-- ------------------- -->
                    <div class="input-group mb-3 col">
                        <select class="custom-select ans " id="updatedans${json.newQuestion._id}" readonly>
                        <option selected> ${json.newQuestion.answer}</option>
                    
                        </select>
                    </div>
                
                </div>
                <button class="float-right" style="all: unset; color: red;" onclick="deleteQuestion('${json.newQuestion._id}')"> 
                <i class="fas fa-trash-alt mr-3 float-right fa-lg"></i> ooo</button>
                
            <button class="float-right" style="all: unset; color: #00a0dc;" data-toggle="modal" data-target="#q${json.newQuestion._id}" type="button">
                <i class="fas fa-edit mr-3 float-right fa-lg"></i>
                </button>


                <!-- ***** End Edit Button-->
                <!-- ******************************************** -->
                <!-- ***** End Edit Button-->
                                <!-- ******************************************** -->
                                <!-- *****  Edit Icon-->
                                <div class="modal fade" id="q${json.newQuestion._id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                                    <div class="modal-content">
                                      <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                          <span aria-hidden="true">&times;</span>
                                        </button>
                                      </div>
                                      <div class="modal-body">
                                         <!-- ***************** -->
                                         <div id"updateValidation"></div>
                                         <div class="form-group">
                                          <label for="exampleFormControlTextarea1"
                                            >Enter new Quation</label
                                          >
                                          <input
                                            class="form-control"
                                            id="question${json.newQuestion._id}"
                                            value="${json.newQuestion.question}"
                                            rows="3"
                                            placeholder="${json.newQuestion.question}"
                                          />
                                        </div>
                                        <div class="form-row mb-3">
                                          <div class="col">
                                            <label for="" style="color: #006699;"><b>A</b></label>
                                            <input
                                              id="op1${json.newQuestion._id}"
                                              value="${json.newQuestion.option1}"
                                              type="text"
                                              class="form-control"
                                              placeholder="Answer A"
                                            />
                                          </div>
                                          <div class="col">
                                            <label for="" style="color: #006699;"><b>B</b></label>
                                            <input
                                              id="op2${json.newQuestion._id}"
                                              value="${json.newQuestion.option2}"
                                              type="text"
                                              class="form-control"
                                              placeholder="Answer B"
                                            />
                                          </div>
                                        </div>
                                        <div class="form-row mb-3">
                                          <div class="col">
                                            <label for="" style="color: #006699;"><b>C</b></label>
                                            <input
                                             id="op3${json.newQuestion._id}"
                                             value="${json.newQuestion.option3}"
                                              type="text"
                                              class="form-control"
                                              placeholder="Answer C"
                                            />
                                          </div>
                                          <div class="col">
                                            <label for="" style="color: #006699;"><b>D</b></label>
                                            <input
                                              id="op4${json.newQuestion._id}"
                                              value="${json.newQuestion.option4}"
                                              type="text"
                                              class="form-control"
                                              placeholder="Answer D"
                                            />
                                          </div>
                                        </div>
                                        <div class="form-row mb-3">
                                          <div class="col-6">
                                            
                                          </div>
                                        </div>
                      
                                        <div class="form-group">
                                          <label for="exampleFormControlSelect1"
                                            >Select right Answer</label
                                          >
                                          <select class="form-control" id="ans${json.newQuestion._id}" value="${json.newQuestion.answer}">
                                            <option value="1">A</option>
                                            <option value="2">B</option>
                                            <option value="3">C</option>
                                            <option value="4">D</option>
                                            <option value="5">E</option>
                                          </select>
                                        </div>
                                        <!-- *************** -->
                                      </div>
                                      <div class="modal-footer">
                                        <button type="button" class="btn btn-primary"  onclick="updateQuestion('${json.newQuestion._id}')">Update Quation</button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <!-- ***** End Edit Icon-->
            </div>
            `

            questionssContainer.innerHTML=questionssContainer.innerHTML+newQuestion;
            addingValidation.innerHTML=`<div class="alert alert-success">${json.messages}</div>`
        }
        
    })

})



//*********************** helper functions */

async function updateQuestion(questionId){
    let question = document.getElementById(`question${questionId}`)
    let op1 = document.getElementById(`op1${questionId}`)
    let op2 = document.getElementById(`op2${questionId}`)
    let op3 = document.getElementById(`op3${questionId}`)
    let op4 = document.getElementById(`op4${questionId}`)
    let ans = document.getElementById(`ans${questionId}`)

    //// setting updated question
    let uQ=document.getElementById(`updatedQ${questionId}`)
    let uop1=document.getElementById(`updatedop1${questionId}`)
    let uop2=document.getElementById(`updatedop2${questionId}`)
    let uop3=document.getElementById(`updatedop3${questionId}`)
    let uop4=document.getElementById(`updatedop4${questionId}`)
    let uans=document.getElementById(`updatedans${questionId}`)


 

    // update question to quiz
    const data={
        quizId:quizid,
        question:question.value,
        questionId:questionId,
        doctorId:userId,
        answer:ans.value,
        option1:op1.value,
        option2:op2.value,
        option3:op3.value,
        option4:op4.value,
    }
    console.log(data)
    
    fetch('/api/updateQuestion',{
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
            uQ.value =json.updatedQuestion.question; 
            uop1.value =json.updatedQuestion.option1; 
            uop2.value =json.updatedQuestion.option2; 
            uop3.value =json.updatedQuestion.option3; 
            uop4.value =json.updatedQuestion.option4; 
            uans.value =json.updatedQuestion.answer; 
        }
    })


}



//********************** delete question */
async function deleteQuestion(questionId){
    // update question to quiz
    const data={
        quizId:quizid,
        questionId:questionId,
        doctorId:userId,
    }
    console.log(data)
    
    fetch('/api/deletQuestion',{
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
        if(json.success ==true){
           let count =1

            const questionsss = json.questions
            questionssContainer.innerHTML =json.questions.map(question=>{
                count++;
                if( count == 2){
                    return ''
                }
                return `
                <br/><br/><br/>
                <!-- ---------------Enter A question-------------- -->
                <div class="input-group mb-3 ">
                    <div class="input-group-prepend">
                    <span class="input-group-text " id="basic-addon1">Q <sub>${count}</sub></span>
                    </div>
                    <input type="text" class="form-control" placeholder="Enter A question " aria-label="Username" aria-describedby="basic-addon1" id="updatedQ${question._id}"  value="${question.question}" readonly>
                </div>
            </div>
            <!-- ----------------Answer-------------------- -->
            <div class="row justify-content-around">
                
                <div class="input-group mb-3 col-md-6">
                    <div class="input-group-prepend">
                    <span class="input-group-text " id="basic-addon1">a</span>
                    </div>
                    <input type="text" class="form-control" placeholder="Answer 1" aria-label="Username" aria-describedby="basic-addon1" id="updatedop1${question._id}" value="${question.option1}" readonly>
                </div>
                <!-- ------------------- -->

                <div class="input-group mb-3 col-md-6">
                    <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">b</span>
                    </div>
                    <input type="text" class="form-control" placeholder="Answer 2" aria-label="Username" aria-describedby="basic-addon1" id="updatedop2${question._id}"   value="${question.option2}" readonly>
                </div>
                <!-- ------------------- -->

                <div class="input-group mb-3 col-md-6">
                    <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">c</span>
                    </div>
                    <input type="text" class="form-control" placeholder="Answer 3" aria-label="Username" aria-describedby="basic-addon1"  id="updatedop3${question._id}"   value="${question.option3}" readonly>
                </div>
                <!-- ------------------- -->

                <div class="input-group mb-3 col-md-6">
                    <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">d</span>
                    </div>
                    <input type="text" class="form-control" placeholder="Answer 4" aria-label="Username" aria-describedby="basic-addon1" id="updatedop4${question._id}"   value="${question.option4}" readonly>
                </div>
                <!-- ------------------- -->
                <div class="input-group mb-3 col">
                    <select class="custom-select ans " id="updatedans${question._id}" readonly>
                    <option selected> ${question.answer}</option>
                
                    </select>
                </div>
            
            </div>
            <button class="float-right" style="all: unset; color: red;" onclick="deleteQuestion('${question._id}')"> 
            <i class="fas fa-trash-alt mr-3 float-right fa-lg"></i> </button>
            
        <button class="float-right" style="all: unset; color: #00a0dc;" data-toggle="modal" data-target="#q${question._id}" type="button">
            <i class="fas fa-edit mr-3 float-right fa-lg"></i>ooo
            </button>


            <!-- ***** End Edit Button-->
            <!-- ******************************************** -->
            <!-- ***** End Edit Button-->
                            <!-- ******************************************** -->
                            <!-- *****  Edit Icon-->
                            <div class="modal fade" id="q${question._id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                              <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                                <div class="modal-content">
                                  <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                      <span aria-hidden="true">&times;</span>
                                    </button>
                                  </div>
                                  <div class="modal-body">
                                     <!-- ***************** -->
                                     <div id"updateValidation"></div>
                                     <div class="form-group">
                                      <label for="exampleFormControlTextarea1"
                                        >Enter new Quation</label
                                      >
                                      <input
                                        class="form-control"
                                        id="question${question._id}"
                                        value="${question.question}"
                                        rows="3"
                                        placeholder="${question.question}"
                                      />
                                    </div>
                                    <div class="form-row mb-3">
                                      <div class="col">
                                        <label for="" style="color: #006699;"><b>A</b></label>
                                        <input
                                          id="op1${question._id}"
                                          value="${question.option1}"
                                          type="text"
                                          class="form-control"
                                          placeholder="Answer A"
                                        />
                                      </div>
                                      <div class="col">
                                        <label for="" style="color: #006699;"><b>B</b></label>
                                        <input
                                          id="op2${question._id}"
                                          value="${question.option2}"
                                          type="text"
                                          class="form-control"
                                          placeholder="Answer B"
                                        />
                                      </div>
                                    </div>
                                    <div class="form-row mb-3">
                                      <div class="col">
                                        <label for="" style="color: #006699;"><b>C</b></label>
                                        <input
                                         id="op3${question._id}"
                                         value="${question.option3}"
                                          type="text"
                                          class="form-control"
                                          placeholder="Answer C"
                                        />
                                      </div>
                                      <div class="col">
                                        <label for="" style="color: #006699;"><b>D</b></label>
                                        <input
                                          id="op4${question._id}"
                                          value="${question.option4}"
                                          type="text"
                                          class="form-control"
                                          placeholder="Answer D"
                                        />
                                      </div>
                                    </div>
                                    <div class="form-row mb-3">
                                      <div class="col-6">
                                        
                                      </div>
                                    </div>
                  
                                    <div class="form-group">
                                      <label for="exampleFormControlSelect1"
                                        >Select right Answer</label
                                      >
                                      <select class="form-control" id="ans${question._id}" value="${question.answer}">
                                        <option value="1">A</option>
                                        <option value="2">B</option>
                                        <option value="3">C</option>
                                        <option value="4">D</option>
                                        <option value="5">E</option>
                                      </select>
                                    </div>
                                    <!-- *************** -->
                                  </div>
                                  <div class="modal-footer">
                                    <button type="button" class="btn btn-primary"  onclick="updateQuestion('${question._id}')">Update Quation</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <!-- ***** End Edit Icon-->
                
                `
            })
        }
    })
}






// ************************************** Helper Functions /* ******
async function myQuizes(){
  location.href=`/myQuizes/${userId}`
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