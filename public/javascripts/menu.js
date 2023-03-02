//0608560
//CT30A3204 Advanced Web Applications
//Project
//1.3.2023
//Help received: Coursematerial

if (document.readyState !== "loading") {
    initializeCodeMenu();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        initializeCodeMenu();
    });
}

function initializeCodeMenu() {
    const authtoken = localStorage.getItem("auth_token");
    if (!authtoken) {
        //remove useless links
        document.getElementById("createLink").remove();
        document.getElementById("createLinkBase").remove();
        document.getElementById("logoutLink").remove();
        document.getElementById("logoutBase").remove();
        return;
    }else {
        //remove useless links
        document.getElementById("loginLink").remove();
        document.getElementById("loginLinkBase").remove();
        document.getElementById("registerLink").remove();
        document.getElementById("registerLinkBase").remove();
        document.getElementById("logoutLink").addEventListener("click", function(event) {
            event.preventDefault();
            localStorage.removeItem("auth_token");
            window.location.href = "/";
        });
        return;
    };
}