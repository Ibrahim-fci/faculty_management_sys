const isD=localStorage.getItem('doc')
const id=localStorage.getItem('userId')

if(isD == true || isD == "true"){
    location.href =`/docDashBoard/${id}`

}else{
}