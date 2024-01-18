//TODO: format times and fix dates in all datepickers

window.onload = () => {
    CppAPI.consoleLog("Welcome to our TimeTracker frontend");

    let todayDate = formatDate(new Date());

    document.getElementById("date-picker").value = todayDate;
    document.getElementById("task-date-input").value = todayDate;

    setEvents();

    let tasksJSON = CppAPI.getTasksByDate(todayDate);
    insertTasksIntoTable(tasksJSON);
}

function insertTasksIntoTable(tasksJSON = '[]') {
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
                            <td>${convertMinutesIntoTimeFormat(tasks[i].startTime)}</td>
                            <td>${convertMinutesIntoTimeFormat(tasks[i].endTime)}</td>
                        </tr>`
    }
}

function convertMinutesIntoTimeFormat(minutes = "0") {
    minutes = parseInt(minutes);

    let hours = Math.floor(minutes / 60);
    if (hours < 10) {
        hours *= 10;
    }

    let currentMinutes = minutes % 60;
    if (currentMinutes < 10) {
        currentMinutes *= 10;
    }

    return hours + ":" + currentMinutes;
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

function clearTaskModal(clearValues = true) {
    let taskNameInputEl = document.getElementById("task-name-input");
    let dateInputEl = document.getElementById("task-date-input");
    let startTimeInputEl = document.getElementById("task-start-input");
    let endTimeInput = document.getElementById("task-end-input");
    let commentTextareaEl = document.getElementById("task-comment-textarea");

    if (clearValues) {
        taskNameInputEl.value = "";
        dateInputEl.value = formatDate(new Date());
        startTimeInputEl.value = "";
        endTimeInput.value = "";
        commentTextareaEl.value = "";
    }

    let els = [taskNameInputEl, dateInputEl, startTimeInputEl, endTimeInput];
    for (let i = 0; i < els.length; i++) {
        els[i].classList.remove("ring-rose-300");
    }

    document.getElementById("create_task_modal").classList.add("hidden");
}

function openModal() {
    let createTaskModalEl = document.getElementById("create_task_modal");
    if (createTaskModalEl == null) {
        return; // :(
    }

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

        let taskNameInputEl = document.getElementById("task-name-input");
        let dateInputEl = document.getElementById("task-date-input");
        let startTimeInputEl = document.getElementById("task-start-input");
        let endTimeInput = document.getElementById("task-end-input");
        let commentTextareaEl = document.getElementById("task-comment-textarea");

        let taskName = taskNameInputEl.value;
        let date = dateInputEl.value;
        let startTime = startTimeInputEl.value;
        let endTime = endTimeInput.value;
        let comment = commentTextareaEl.value;

        startTime = convertTime(startTime);
        endTime = convertTime(endTime);

        let validationObject = {
            taskName: {
                el: taskNameInputEl,
                value: taskName,
                isValid: false,
            },
            date: {
                el: dateInputEl,
                value: date,
                isValid: false,
            },
            startTime: {
                el: startTimeInputEl,
                value: startTime,
                isValid: false,
            },
            endTime: {
                el: endTimeInput,
                value: endTime,
                isValid: false,
            }
        }

        let invalidFieldExist = false;
        for (const valueObj of Object.values(validationObject)) {
            if (valueObj.value != null && valueObj.value !== "") {
                valueObj.isValid = true;
                valueObj.el.classList.remove("ring-rose-300");
            } else {
                valueObj.el.classList.add("ring-rose-300");
                invalidFieldExist = true;
            }
        }

        if (invalidFieldExist) {
            return;
        }

        let success = CppAPI.saveTask({
            taskName: taskName,
            date: date,
            startTime: startTime,
            endTime: endTime,
            comment: comment
        });

        if (success) {
            closeModal();
        } else {
            console.warn("[root] Error at saving task!");
        }
    });

    document.getElementById("close-task-modal-button").addEventListener("click", function (event) {
        event.preventDefault();
        closeModal();
    });

    // for testing purposes
    document.getElementById("test-button").addEventListener("click", function () {
        let tasksJSON = CppAPI.getTasksByDate("12.07.2020");
        insertTasksIntoTable(tasksJSON);
    });
}