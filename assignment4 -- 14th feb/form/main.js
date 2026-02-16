const form = document.getElementById("regi");

form.addEventListener("submit", function(event){

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();

    if(name.length <= 3){
        alert("Name should be more than 3 char.");
        event.preventDefault();
        return
    }

    let pattern = /^[a-zA-Z0-9@.]+$/;

    if(!patter.test(email)){
        alert("Email should not contain any special char.");
        event.preventDefault();
        return;
    }

    alert("form submitted");
})