const email = document.getElementById("emailInput")
const password = document.getElementById("password")
const userName = document.getElementById("userName")
const dateofBirth = document.getElementById("dateofBirth")
const title = document.getElementById("title")
const city = document.getElementById("city")
const gender = document.getElementById("gender")
const submitbtn = document.getElementById("submitbtn")
let validation = document.getElementById("validation")
let backBtn = document.getElementById("backBtn")


email.addEventListener("input",(e)=>{
    validation.innerHTML=''
})

userName.addEventListener("input",(e)=>{
    validation.innerHTML=''
})

password.addEventListener("input",(e)=>{
    validation.innerHTML=''
})

title.addEventListener("input",(e)=>{
    validation.innerHTML=''
})

dateofBirth.addEventListener("input",(e)=>{
    validation.innerHTML=''
})

gender.addEventListener("input",(e)=>{
    validation.innerHTML=''
})

city.addEventListener("input",(e)=>{
    validation.innerHTML=''
})

backBtn.addEventListener("click",(e)=>{
    e.preventDefault()
    location.href='/events'
})







submitbtn.addEventListener("click",(e)=>{
    e.preventDefault()
    const body ={
        email:email.value,
        Name:userName.value,
        Password:password.value,
        title:title.value,
        Dof:dateofBirth.value,
        Gender:gender.value,
        city:city.value,
    }


    fetch('/api/createDoc',{
        method: 'POST', 
        headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:JSON.stringify(body)
    }).then(response=>{
        return response.json()
    }).then(json=>{
        console.log(json)
        if(json.success == true){
            email.value=''
            password.value=''
            userName.value=''
            validation.innerHTML = `<div class="alert alert-success">${json.messages}</div>`
        }else{
            try{
                validation.innerHTML = json.messages.map(err=>{
                    return `<div class="alert alert-danger">${err}</div>`
                })
            }catch(ex){
                validation.innerHTML = `<div class="alert alert-danger">${json.messages}</div>`
            }
           
        }
    })
})