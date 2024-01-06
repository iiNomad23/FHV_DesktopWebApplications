window.onload = () => {
    document.getElementById("date-picker").value = new Date().toISOString().split('T')[0];


    document.getElementById("create-task-button").addEventListener("click", function (){
        openModal();
    })

    document.getElementById("create-task-button").addEventListener("click", function (){
        document.getElementById("create_task_modal").classList.remove("hidden");
    })

    document.getElementById("save-task-modal-button").addEventListener("click", function (event){
        event.preventDefault();
        let taskName = document.getElementById("task-name-input").value;
        let date = document.getElementById("task-date-input").value;
        let startTime = document.getElementById("task-start-input").value;
        let endTime = document.getElementById("task-end-input").value;
        let comment = document.getElementById("task-comment-textarea").value;

        let values = [taskName, date, startTime, endTime];

        // if(taskName == null || taskName === ""){
        //     console.log("test");
        //     document.getElementById("create_task_modal").classList.remove("hidden");
        //     return;
        // }
        if(values.some(item => item == null || item === "")){
            return;
        }

        clearTaskModal()
        document.getElementById("create_task_modal").classList.add("hidden");
        SaveTask({taskName: taskName, date: date, startTime: startTime, endTime: endTime, comment: comment});
    })

    document.getElementById("close-task-modal-button").addEventListener("click", function (){
        clearTaskModal();
    })
}


function clearTaskModal(){
    document.getElementById("task-comment-textarea").value = "";
    document.getElementById("task-end-input").value = "";
    document.getElementById("task-start-input").value = "";
    document.getElementById("task-date-input").value = "";
    document.getElementById("task-name-input").value = "";
    document.getElementById("create_task_modal").classList.add("hidden");
}
function openModal(){
    document.getElementById("create_task_modal").showModal();
}