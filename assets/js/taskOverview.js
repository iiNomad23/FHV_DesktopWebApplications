window.onload = () => {
    CppAPI.consoleLog("Welcome to our TimeTracker frontend");

    let todayDate = formatDate(new Date());

    document.getElementById("date-picker").value = todayDate;
    document.getElementById("task-date-input").value = todayDate;

    setEvents();

    let tasks = CppAPI.getTasksByDate(todayDate);
    document.getElementById("taskTableContainer").innerHTML = createTaskTableHTML(tasks.length > 0);

    insertTasksIntoTable(tasks);
}

function insertTasksIntoTable(tasks = []) {
    let tasksTable = document.getElementById("tasks-table");
    if (tasksTable == null) {
        if (tasks.length <= 0) {
            return;
        }

        document.getElementById("taskTableContainer").innerHTML = createTaskTableHTML(true);
    }

    let tasksTableBody = document
        .getElementById("tasks-table")
        .getElementsByTagName("tbody");

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        if (task == null) {
            continue;
        }

        tasksTableBody[0].innerHTML += `<tr id="${"row_" + task.id}" class="hover">
                            <td></td>
                            <td>${task.taskName}</td>
                            <td>${convertMinutesIntoTimeFormat(task.startTime)}</td>
                            <td>${convertMinutesIntoTimeFormat(task.endTime)}</td>
                            <td style="float: right">${getEditAndDeleteButtonHTML(task.id)}</td>
                        </tr>`;
    }

    let editBtnEls = document.querySelectorAll('[id^="edit_"]');
    editBtnEls.forEach(function (editBtnEl) {
        editBtnEl.addEventListener("click", function (e) {
            let taskId = e.currentTarget.getAttribute('data-taskId');
            let task = CppAPI.getTaskById(taskId)[0];
            if (Object.keys(task).length === 0) {
                CppAPI.consoleLog("[root] Error at GetTaskById!");
                return; // :(
            }

            openModal(task);
        });
    });

    let deleteBtnEls = document.querySelectorAll('[id^="delete_"]');
    deleteBtnEls.forEach(function (deleteBtnEl) {
        deleteBtnEl.addEventListener("click", function (e) {
            let taskId = e.currentTarget.getAttribute('data-taskId');
            if (CppAPI.deleteTaskById(taskId)) {
                removeTableRow(taskId);

                let tableEl = document.getElementById("tasks-table");
                let tbodyRowCount = tableEl.tBodies[0].rows.length;
                if (tbodyRowCount <= 0) {
                    document.getElementById("taskTableContainer").innerHTML = createTaskTableHTML(false);
                }
            }
        });
    });
}

function removeTableRow(taskId) {
    let rowEl = document.getElementById("row_" + taskId);
    if (rowEl == null) {
        CppAPI.consoleLog("[root] Error removing task table row!");
        return; // :(
    }

    rowEl.remove();
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

function openModal(task) {
    let createTaskModalEl = document.getElementById("create_task_modal");
    if (createTaskModalEl == null) {
        CppAPI.consoleLog("[root] Error opening modal!");
        return; // :(
    }

    let tagEl = createTaskModalEl.getElementsByTagName("h3")[0];
    if (tagEl == null) {
        CppAPI.consoleLog("[root] Error opening modal!");
        return; // :(
    }

    addDataListOptions(CppAPI.getAllPresets());

    if (task != null) {
        tagEl.textContent = "Edit Task";
        tagEl.setAttribute('data-taskId', task.id);
        document.getElementById("task-name-input").value = task.taskName;
        document.getElementById("task-date-input").value = task.date;
        document.getElementById("task-start-input").value = convertMinutesIntoTimeFormat(task.startTime);
        document.getElementById("task-end-input").value = convertMinutesIntoTimeFormat(task.endTime);
        document.getElementById("task-comment-textarea").value = task.comment;
    } else {
        tagEl.textContent = "Create Task";
        tagEl.removeAttribute('data-taskId');
    }

    createTaskModalEl.classList.remove("hidden");
}

function closeModal() {
    clearTaskModal();

    let createTaskModalEl = document.getElementById("create_task_modal");
    if (createTaskModalEl == null) {
        CppAPI.consoleLog("[root] Error closing modal!");
        return; // :(
    }

    createTaskModalEl.classList.add("hidden");
}

function addDataListOptions(options = []) {
    options.unshift({"preset": "-"});

    let taskNameDatalistEl = document.getElementById("task-name-datalist");
    taskNameDatalistEl.innerHTML = createSelectBoxHTML(options);

    document.getElementById("task-name-select").addEventListener("change", function () {
        let value = this.value;
        if (value == null || value === "-") {
            value = "";
        }

        document.getElementById("task-name-input").value = value;
    });
}

function setEvents() {
    document.getElementById("create-task-button").addEventListener("click", function () {
        openModal();
    });

    document.getElementById("search-button").addEventListener("click", function () {
        let tasks = CppAPI.getTasksByDate(document.getElementById("date-picker").value);
        document.getElementById("taskTableContainer").innerHTML = createTaskTableHTML(tasks.length > 0);

        insertTasksIntoTable(tasks);
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
            },
            date: {
                el: dateInputEl,
                value: date,
            },
            startTime: {
                el: startTimeInputEl,
                value: startTime,
            },
            endTime: {
                el: endTimeInput,
                value: endTime,
            }
        };

        let invalidFieldExist = false;
        for (const [key, valueObj] of Object.entries(validationObject)) {
            let isValidValue = false;

            if (valueObj.value != null && valueObj.value !== "") {
                switch (key) {
                    case "startTime":
                        isValidValue = valueObj.value < validationObject.endTime.value;
                        break;
                    case "endTime":
                        isValidValue = valueObj.value > validationObject.startTime.value;
                        break;
                    case "date":
                        let dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
                        isValidValue = dateRegex.test(valueObj.value);
                        break;
                    default:
                        isValidValue = true;
                }
            }

            if (isValidValue) {
                valueObj.el.classList.remove("ring-rose-300");
            } else {
                valueObj.el.classList.add("ring-rose-300");
                invalidFieldExist = true;
            }
        }

        if (invalidFieldExist) {
            return;
        }

        let task = {
            taskName: taskName,
            date: date,
            startTime: startTime,
            endTime: endTime,
            comment: comment
        };

        if (isEditWindow()) {
            let createTaskModalEl = document.getElementById("create_task_modal");
            if (createTaskModalEl == null) {
                CppAPI.consoleLog("[root] Error at updating task!");
                return; // :(
            }

            let tagEl = createTaskModalEl.getElementsByTagName("h3")[0];
            if (tagEl == null) {
                CppAPI.consoleLog("[root] Error at updating task!");
                return; // :(
            }

            task["id"] = tagEl.getAttribute("data-taskId");

            let success = CppAPI.updateTask(task);
            if (success) {
                closeModal();
                rememberTaskName(task.taskName);

                removeTableRow(task.id);
                insertTasksIntoTable([task]);
            } else {
                CppAPI.consoleLog("[root] Error at updating task!");
            }
        } else {
            let taskId = CppAPI.saveTask(task);
            if (taskId > 0) {
                closeModal();
                rememberTaskName(task.taskName);

                if (validationObject.date.value === formatDate(new Date())) {
                    task["id"] = taskId;
                    insertTasksIntoTable([task]);
                }
            } else {
                CppAPI.consoleLog("[root] Error at saving task!");
            }
        }
    });

    document.getElementById("close-task-modal-button").addEventListener("click", function (event) {
        event.preventDefault();
        closeModal();
    });
}

function rememberTaskName(taskName) {
    let taskNameRememberCheckboxEl = document.getElementById("task-name-remember-checkbox");
    if (taskNameRememberCheckboxEl == null || !taskNameRememberCheckboxEl.checked) {
        return;
    }

    CppAPI.savePreset(taskName);
}

function isEditWindow() {
    let createTaskModalEl = document.getElementById("create_task_modal");
    if (createTaskModalEl == null) {
        return false;
    }

    let tagEl = createTaskModalEl.getElementsByTagName("h3")[0];
    if (tagEl == null) {
        return false;
    }

    return tagEl.textContent === "Edit Task";
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
            </div>`;
}

function createTaskTableHTML(tasksExist) {
    if (tasksExist) {
        return `<table id="tasks-table" class="table w-full">
                    <colgroup>
                        <col style="width: 0">
                        <col style="width: 40%">
                        <col style="width: 20%">
                        <col style="width: 20%">
                        <col style="width: 20%">
                    </colgroup>
                    
                    <thead>
                    <tr>
                        <th></th>
                        <th>Task Name</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th></th>
                    </tr>
                    </thead>
                    
                    <tbody>
                    </tbody>
                </table>`;
    } else {
        return `<p>No completed tasks today</p>`;
    }
}

function createSelectBoxHTML(options) {
    let optionsHTML = "";

    for (let i = 0; i < options.length; i++) {
        optionsHTML += `<option value="${options[i].preset}">${options[i].preset}</option>`;
    }

    return `<label for="task-name-select"></label>
            <select id="task-name-select" class="ring-1 ring-inset ring-gray-300" style="width: 20px;">
                ${optionsHTML}
            </select>`;
}