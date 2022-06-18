const email = document.getElementById("emailInput")
const password = document.getElementById("password")
const userName = document.getElementById("userName")
const dateofBirth = document.getElementById("dateofBirth")
const Dept = document.getElementById("Dept")
const level = document.getElementById("level")
const gender = document.getElementById("gender")
const submitbtn = document.getElementById("submitbtn")
let validation = document.getElementById("validation")
let backBtn = document.getElementById("backBtn")
const city = document.getElementById("city")

email.addEventListener("input",(e)=>{
    validation.innerHTML=''
})

userName.addEventListener("input",(e)=>{
    validation.innerHTML=''
})

password.addEventListener("input",(e)=>{
    validation.innerHTML=''
})

Dept.addEventListener("input",(e)=>{
    validation.innerHTML=''
})

dateofBirth.addEventListener("input",(e)=>{
    validation.innerHTML=''
})

gender.addEventListener("input",(e)=>{
    validation.innerHTML=''
})

level.addEventListener("input",(e)=>{
    validation.innerHTML=''
})

backBtn.addEventListener("click",(e)=>{
    e.preventDefault()
    location.href='/events'
})

city.addEventListener("input",(e)=>{
    validation.innerHTML=''
})






submitbtn.addEventListener("click",(e)=>{
    e.preventDefault()
    const body ={
        email:email.value,
        Name:userName.value,
        Password:password.value,
        Department:Dept.value,
        Dof:dateofBirth.value,
        Gender:gender.value,
        level:level.value,
        city:city.value,
    }


    fetch('/api/createStudent',{
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
            validation.innerHTML = `<div class="alert alert-success">${json.message}</div>`
        }else{
            try{
                validation.innerHTML = json.message.map(err=>{
                    return `<div class="alert alert-danger">${err}</div>`
                })
            }catch(ex){
                validation.innerHTML = `<div class="alert alert-danger">${json.message}</div>`
            }
           
        }
    })
})