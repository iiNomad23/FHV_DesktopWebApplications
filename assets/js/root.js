window.onload = () => {
    document.getElementById("date-picker").value = new Date().toISOString().split('T')[0];


    document.getElementById("create-task-button").addEventListener("click", function (){
        openModal();
    })

    document.getElementById("create-task-button").addEventListener("click", function (){
        document.getElementById("create_task_modal").classList.remove("hidden");
    })

    document.getElementById("save-task-modal-button").addEventListener("click", function (){
        document.getElementById("create_task_modal").classList.add("hidden");
        SaveTask({taskName: "margop", date: "42"});
    })

    document.getElementById("close-task-modal-button").addEventListener("click", function (){
        document.getElementById("task-comment-textarea").value = "";
        document.getElementById("task-end-input").value = "";
        document.getElementById("task-start-input").value = "";
        document.getElementById("task-date-input").value = "";
        document.getElementById("task-name-input").value = "";
        document.getElementById("create_task_modal").classList.add("hidden");
    })
}

function openModal(){
    document.getElementById("create_task_modal").showModal();
}