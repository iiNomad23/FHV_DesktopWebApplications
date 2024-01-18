window.onload = () => {
    let todayDate = formatDate(new Date());

    document.getElementById("date-picker").value = todayDate;
    document.getElementById("task-date-input").value = todayDate;

    setEvents();

    let tasksJSON = GetTasksByDate({
        date: todayDate,
    });

    insertTasksIntoTable(tasksJSON);
}

function insertTasksIntoTable(tasksJSON) {
    tasksJSON = tasksJSON ?? [];

    // for testing purposes
    document.getElementById("test-area").textContent = tasksJSON;
    // /

    let tasksTableBody = document
        .getElementById("tasks-table")
        .getElementsByTagName("tbody");

    let tasks = JSON.parse(tasksJSON);
    for (let i = 0; i < tasks.length; i++) {
        tasksTableBody[0].innerHTML += `<tr class="hover">
                            <td>${i + 1}</td>
                            <td>${tasks[i].taskName}</td>
                            <td>${tasks[i].startTime}</td>
                            <td>${tasks[i].endTime}</td>
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
    document.getElementById("task-date-input").value = formatDate(new Date());
    document.getElementById("task-name-input").value = "";
    document.getElementById("create_task_modal").classList.add("hidden");
}

function openModal() {
    let createTaskModalEl = document.getElementById("create_task_modal");
    if (createTaskModalEl == null) {
        return; // :(
    }

    createTaskModalEl.showModal();
    createTaskModalEl.classList.remove("hidden");
}

function closeModal() {
    clearTaskModal();

    let createTaskModalEl = document.getElementById("create_task_modal");
    if (createTaskModalEl == null) {
        return; // :(
    }

    createTaskModalEl.classList.add("hidden");
}

function setEvents() {
    document.getElementById("create-task-button").addEventListener("click", function () {
        openModal();
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

        closeModal();
        SaveTask({taskName: taskName, date: date, startTime: startTime, endTime: endTime, comment: comment});
    });

    document.getElementById("close-task-modal-button").addEventListener("click", function (event) {
        event.preventDefault();
        closeModal();
    });

    // for testing purposes
    document.getElementById("test-button").addEventListener("click", function () {
        let tasksJSON = GetTasksByDate({
            date: "12.07.2020",
        });

        insertTasksIntoTable(tasksJSON);
    });
}