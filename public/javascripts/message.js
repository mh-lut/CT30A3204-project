//0608560
//CT30A3204 Advanced Web Applications
//Project
//1.3.2023
//Help received: Coursematerial

if (document.readyState !== "loading") {
    initializeCodeMessage();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        initializeCodeMessage();
    });
}

function initializeCodeMessage() {
    document.getElementById("message-form").addEventListener("submit", onSubmit);
}

function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target); // get data from form

    const authtoken = localStorage.getItem("auth_token");
    if (!authtoken) {
        window.location.href= "/"; //go back to home page
    };
    //make post
    fetch("/api/message", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + authtoken
        },
        body: JSON.stringify({
            "headline": formData.get("headline"),
            "content": formData.get("content")
        })
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.ok) { // if ok -> go to the newly created page
            window.location.href= "/item/" + data.id;
        } else {
            if (data.message) { //show errors to user
                document.getElementById("error").innerHTML = data.message;
            } else {
                document.getElementById("error").innerHTML = "????????";
            }
        }
    });
}
