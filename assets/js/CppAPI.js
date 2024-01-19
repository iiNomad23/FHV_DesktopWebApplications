class CppAPI {
    static consoleLog(str = "") {
        try {
            CppConsoleLog(str);
        } catch (e) {
            console.log(str);
        }
    }

    static getTasksByDate(todayDate = new Date()) {
        try {
            let jsonStr = GetTasksByDate({
                date: todayDate,
            });

            return JSON.parse(jsonStr);
        } catch (e) {
            console.warn("[CppAPI] ultralight binding error - function 'GetTasksByDate'");
        }

        return [];
    }

    static getTasksById(taskId) {
        if (taskId == null) {
            return {};
        }

        taskId = parseInt(taskId);
        if (isNaN(taskId) || taskId < 1) {
            return {};
        }

        try {
            let jsonStr = GetTasksById(taskId);
            return JSON.parse(jsonStr);
        } catch (e) {
            console.warn("[CppAPI] ultralight binding error - function 'GetTasksById'");
        }

        return {};
    }

    static saveTask(task) {
        if (task == null) {
            return 0;
        }

        try {
            return SaveTask(task);
        } catch (e) {
            console.warn("[CppAPI] ultralight binding error - function 'SaveTask'");
        }

        return 0;
    }

    static deleteTaskById(taskId) {
        if (taskId == null) {
            return false;
        }

        taskId = parseInt(taskId);
        if (isNaN(taskId) || taskId < 1) {
            return false;
        }

        try {
            let statusCode = DeleteTaskById(taskId);
            if (statusCode) {
                return true;
            }
        } catch (e) {
            console.warn("[CppAPI] ultralight binding error - function 'DeleteTaskById'");
        }

        return false;
    }

    static updateTask(task) {
        if (task == null) {
            return false;
        }

        try {
            let statusCode = UpdateTask(task);
            if (statusCode) {
                return true;
            }
        } catch (e) {
            console.warn("[CppAPI] ultralight binding error - function 'UpdateTask'");
        }

        return false;
    }
}