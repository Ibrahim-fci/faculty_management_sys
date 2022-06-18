let backButton=document.getElementById('back');
let emailInput=document.getElementById('email')
let passwordInput=document.getElementById('password')
let titleInput=document.getElementById('gridRadios1')
let submitBtn=document.getElementById('submitBtn')
const validationError=document.querySelector('.validationError');




submitBtn.addEventListener('click',(e)=>{
    e.preventDefault()

      //get the check box values just checked 
      var values = [].filter.call(document.getElementsByName('gridRadios'), function(c) {
        return c.checked;
      }).map(function(c) {
        return c.value;
      });
      console.log(values[0])

    const data={
        email:emailInput.value,
        password:passwordInput.value,
        title:values[0]
    }
    console.log(data)
     
    fetch('/api/login',{
        method: 'POST', 
        headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:JSON.stringify(data)
    }).then(response=>{
        return response.json()
    }).then(result=>{
        console.log(result)
        if(result.success == true){
            validationError.innerHTML=''
           localStorage.setItem("userId",result.userId)
           localStorage.setItem("level",result.level)
           
        
           
           if(!result.level && !result.isadmin){
              location.href=`/docDashBoard/${result.userId}`;
              localStorage.setItem("doc",true)
              localStorage.setItem("admin",false)
           }else if(!result.isadmin){
            location.href=`/feedes/${result.userId}`;
            localStorage.setItem("doc",false)
            localStorage.setItem("admin",false)
           }else{
            location.href=`/events`;
            localStorage.setItem("admin",true)
            localStorage.setItem("doc",false)
           }
          
        }else{
            validationError.innerHTML=`<div class="alert alert-danger" role="alert" >${result.message}</div>`
        }
    })
     
})


backButton.addEventListener('click',(e)=>{
    console.log('back clicked')
    location.href=`/`;
})
