window.onload = () => {
    document.getElementById("date-picker").value = formatDate(new Date());

    document.getElementById("create-task-button").addEventListener("click", function () {
        openModal();
    });

    document.getElementById("create-task-button").addEventListener("click", function () {
        document.getElementById("create_task_modal").classList.remove("hidden");
    });

    document.getElementById("task-date-input").value = new Date().toISOString().split('T')[0];

    let tasksTable = document.getElementById("tasks-table");

    document.getElementById("test-button").addEventListener("click", function () {
        let result = GetTasksByDate({date: "12.07.2020"});
        document.getElementById("test-area").textContent = result;
        let tasksTableBody = tasksTable.getElementsByTagName("tbody");
        result = JSON.parse(result);
        for (let i = 0; i < result.length; i++){
            tasksTableBody[0].innerHTML += `<tr class="hover">
                            <td>${i+1}</td>
                            <td>${result[i].taskName}</td>
                            <td>${result[i].startTime}</td>
                            <td>${result[i].endTime}</td>
                        </tr>`

        }
    });




    document.getElementById("save-task-modal-button").addEventListener("click", function (event) {
        event.preventDefault();
        let taskName = document.getElementById("task-name-input").value;
        let date = document.getElementById("task-date-input").value;
        let startTime = document.getElementById("task-start-input").value;
        startTime = convertTime(startTime);
        if (startTime == null) {
            //TODO: error handling
            return;
        }

        let endTime = document.getElementById("task-end-input").value;
        endTime = convertTime(endTime);

        if (endTime == null) {
            //TODO: error handling
            return;
        }
        let comment = document.getElementById("task-comment-textarea").value;

        let values = [taskName, date, startTime, endTime];

        if (values.some(item => item == null || item === "")) {
            //TODO: error handling
            return;
        }

        clearTaskModal()
        document.getElementById("create_task_modal").classList.add("hidden");
        SaveTask({taskName: taskName, date: date, startTime: startTime, endTime: endTime, comment: comment});
    });

    document.getElementById("close-task-modal-button").addEventListener("click", function (event) {
        event.preventDefault();
        clearTaskModal();
    });

    let currentDate = formatDate(new Date());

    let result = GetTasksByDate({date: currentDate});
    document.getElementById("test-area").textContent = result;
    let tasksTableBody = tasksTable.getElementsByTagName("tbody");
    result = JSON.parse(result);
    for (let i = 0; i < result.length; i++){
        tasksTableBody[0].innerHTML += `<tr class="hover">
                            <td>${i+1}</td>
                            <td>${result[i].taskName}</td>
                            <td>${result[i].startTime}</td>
                            <td>${result[i].endTime}</td>
                        </tr>`
        //TODO: format times and fix dates in all datepickers
    }

}
function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    const year = date.getFullYear();

    // Add leading zero to day and month if needed
    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;

    return `${formattedDay}.${formattedMonth}.${year}`;
}

function convertTime(time) {
    if (time == null) {
        return null;
    }
    let timeArray = time.split(":");
    if (timeArray.length <= 1) {
        return null;
    }

    time = parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
    if (isNaN(time)) {
        return null;
    }
    return time;
}

function clearTaskModal() {
    document.getElementById("task-comment-textarea").value = "";
    document.getElementById("task-end-input").value = "";
    document.getElementById("task-start-input").value = "";
    document.getElementById("task-date-input").value = new Date().toISOString().split('T')[0];
    document.getElementById("task-name-input").value = "";
    document.getElementById("create_task_modal").classList.add("hidden");
}

function openModal() {
    document.getElementById("create_task_modal").showModal();
}