const userId1 = localStorage.getItem('userId');


if(!userId1){
    location.href= '/login'
}