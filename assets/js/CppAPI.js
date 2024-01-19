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
            return GetTasksByDate({
                date: todayDate,
            });
        } catch (e) {
            console.warn("[CppAPI] ultralight binding error - function 'GetTasksByDate'");
        }

        return '[]';
    }

    static saveTask(task) {
        if (task == null) {
            return false;
        }

        try {
            let statusCode = SaveTask(task);
            if (statusCode) {
                return true;
            }
        } catch (e) {
            console.warn("[CppAPI] ultralight binding error - function 'SaveTask'");
        }

        return false;
    }

    static deleteTaskById(taskId) {
        if (taskId == null) {
            return false;
        }

        taskId = parseInt(taskId);
        if (isNaN(taskId)) {
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