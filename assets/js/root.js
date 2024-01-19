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
        let task = tasks[i];
        if (task == null) {
            continue;
        }

        let rowId = i + 1;
        tasksTableBody[0].innerHTML += `<tr class="hover">
                            <td></td>
                            <td>${task.taskName}</td>
                            <td>${convertMinutesIntoTimeFormat(task.startTime)}</td>
                            <td>${convertMinutesIntoTimeFormat(task.endTime)}</td>
                            <td style="float: right">${getEditAndDeleteButtonHTML(task.id)}</td>
                        </tr>`

        document.getElementById("edit_" + task.id).addEventListener("click", function (e) {
            let taskId = e.currentTarget.getAttribute('data-taskId');
            // if (CppAPI.updateTask(taskId)) {
            //
            // }
        });
        document.getElementById("delete_" + task.id).addEventListener("click", function (e) {
            let taskId = e.currentTarget.getAttribute('data-taskId');

            if (CppAPI.deleteTaskById(taskId)) {
                let parentElement = e.currentTarget.parentNode; // div

                // continue moving up the DOM tree until a 'tr' element is found
                while (parentElement && parentElement.tagName !== 'TR') {
                    parentElement = parentElement.parentNode;
                }

                if (parentElement && parentElement.tagName === 'TR') {
                    parentElement.remove();
                }
            }
        });
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

function getEditAndDeleteButtonHTML(taskId) {
    return `<div class="flex flex-row items-center justify-between" role="group">
                <button id="${"edit_" + taskId}" data-taskId="${taskId}" type="button" class="pr-1 border-0 text-sm font-medium text-gray-500 border-gray-200 dark:border-gray-600 dark:text-gray-300">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                        <path d="M12.687 14.408a3.01 3.01 0 0 1-1.533.821l-3.566.713a3 3 0 0 1-3.53-3.53l.713-3.566a3.01 3.01 0 0 1 .821-1.533L10.905 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V11.1l-3.313 3.308Zm5.53-9.065.546-.546a2.518 2.518 0 0 0 0-3.56 2.576 2.576 0 0 0-3.559 0l-.547.547 3.56 3.56Z"/>
                        <path d="M13.243 3.2 7.359 9.081a.5.5 0 0 0-.136.256L6.51 12.9a.5.5 0 0 0 .59.59l3.566-.713a.5.5 0 0 0 .255-.136L16.8 6.757 13.243 3.2Z"/>
                    </svg>
                </button>
                <button id="${"delete_" + taskId}" data-taskId="${taskId}" type="button" class="border-0 text-sm font-medium text-gray-500 border-gray-200 dark:border-gray-600 dark:text-gray-300">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                        <path d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z"/>
                    </svg>
                </button>
            </div>`
}