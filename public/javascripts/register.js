//0608560
//CT30A3204 Advanced Web Applications
//Project
//1.3.2023
//Help received: Coursematerial

if (document.readyState !== "loading") {
    initializeCodeLogin();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        initializeCodeLogin();
    });
}

function initializeCodeLogin() {
    document.getElementById("login-form").addEventListener("submit", onSubmit);
}

function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target); //get data from form
    //make post
    fetch("/api/user/register", {
        method: "POST",
        body: formData
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            window.location.href= "/login.html"; //go to login page
        } else {
            if (data.message) { //show errors to user
                console.log(data.message)
                document.getElementById("error").innerHTML = data.message;
            } else {
                document.getElementById("error").innerHTML = "????????";
            }
        }
    });
}
