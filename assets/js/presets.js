window.onload = () => {

    document.getElementById("add-preset-button").addEventListener("click", function (){
        CppAPI.savePreset(document.getElementById("add-preset-input").value);
    });

}
