
window.onload = () => {
    let button = document.getElementById("adrian");
    button.addEventListener("click", function (event) {
        this.style.background = "red";
    });

    let button2 = document.getElementById("test");
    button2.addEventListener("click", function (event) {

        this.innerHTML = GetMessage();
        this.style.background = "red";

    });
}
