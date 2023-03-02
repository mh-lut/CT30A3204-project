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
    const authtoken = localStorage.getItem("auth_token");
    if (!authtoken) {
        //remove useless
        document.getElementById("commenting-form").remove();
        return;
    };
    document.getElementById("commenting-form").addEventListener("submit", onSubmit);
}

function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    //get message id from url
    const url = window.location.href;
    const parts = url.split("/");
    const id = parts[parts.length -1];
    //get token
    const authtoken = localStorage.getItem("auth_token");
    //make post
    fetch("/api/comment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + authtoken
        },
        body: JSON.stringify({
            "comment": formData.get("text"),
            "messageId": id
        })
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.ok) {
            window.location.reload(true); // reload page
        } else {
            if (data.message) {
                document.getElementById("error").innerHTML = data.message;
            } else {
                document.getElementById("error").innerHTML = "????????";
            }
        }
    });
}
