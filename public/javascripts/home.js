//0608560
//CT30A3204 Advanced Web Applications
//Project
//1.3.2023
//Help received: Coursematerial

if (document.readyState !== "loading") {
    initializeCode();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        initializeCode();
    });
}

function initializeCode() {

    const authtoken = localStorage.getItem("auth_token");
    if (!authtoken) { // if no authtoken get only links
        getLinks();
        return;
    } else { // if authtoken get links and username
        getLinks();
        getUsername(authtoken);
    }
}

// get and create links to old posts
function getLinks() {
    fetch("/api/list/posts" , {
        method: "GET",
    })
    .then((response) => response.json())
    .then((text) => {
        if (text.headlines.length == 0) { //if no old messages
            const noneMessage = document.getElementById("message");
            noneMessage.innerHTML = "No old questions :I";
        }else{
            const noneMessage = document.getElementById("message");
            noneMessage.remove();
        }

        const linkList = document.getElementById("links");
        linkList.innerHTML = "Old questions:";
        
        //append links
        for (let i = 0; i < text.headlines.length; i++) {
            const listItem = document.createElement('li');
            const linkItem = document.createElement('a');
            linkItem.href = "/item/" + text.ids[i];
            linkItem.textContent = text.headlines[i];
            listItem.appendChild(linkItem);
            linkList.appendChild(listItem);
        }
    })
    .catch((e) => {
        console.log(e);
    })
    
}
//get username and make it visible
function getUsername(authtoken) {
    fetch("/api/username" , {
        method: "GET",
        headers: {
            "authorization": "Bearer " + authtoken
        }
    })
    .then((response) => response.json())
    .then((response) => {
        const usernameDiv = document.getElementById("username");
        
        usernameDiv.innerHTML = "Hello " + response.username;
    })
    .catch((e) => {
        console.log(e);
    })
    
}