const logLink=document.getElementById('loginLink');
const loginBtn=document.getElementById('loginBtn');
const timeLineLink=document.getElementById('timeLineLink');
const isadmin=localStorage.getItem("admin")
const userId=localStorage.getItem("userId")
const isDoc=localStorage.getItem('doc')


console.log(timeLineLink.innerHTML)
if(isadmin == true || isadmin == "true"){
    timeLineLink.innerHTML = 'Events'
}else if(isDoc == true || isDoc == "true"){
    timeLineLink.innerHTML = 'DashBored'
}else if(userId){
    timeLineLink.innerHTML = 'Feedes'
}else{
    timeLineLink.innerHTML = ''
}


if(userId ==null){
    logLink.innerText="login"
    loginBtn.innerText="login";
}else{
    logLink.innerText="logout"
    loginBtn.innerText="logout";
}


logLink.addEventListener('click',(e)=>{
    e.preventDefault()
    if(logLink.innerText == "logout"){
        localStorage.removeItem('userId')
        localStorage.removeItem("doc");
        e.target.href='/login'
        location.href='/login'
    }else{
        e.target.href='/login'
        location.href='/login'
    }
  
})


timeLineLink.addEventListener("click",(e)=>{
    e.preventDefault()

    if(isadmin == true || isadmin == "true"){
        timeLineLink.href=`/events`
        location.href=`/events`
    }else if(isDoc == true || isDoc == "true"){
        timeLineLink.href = `/docDashBoard/${userId}`
        location.href=`/docDashBoard/${userId}`
       
    }else{
        timeLineLink.href=`/feedes/${userId}`
        location.href=`/feedes/${userId}`
    }
})


loginBtn.addEventListener("click",(e)=>{
    e.preventDefault()
    if(loginBtn.innerText == "logout"){
        localStorage.removeItem('userId')
        localStorage.removeItem("doc");
        e.target.href='/login'
        location.href='/login'
    }else{
        e.target.href='/login'
        location.href='/login'
    }
})