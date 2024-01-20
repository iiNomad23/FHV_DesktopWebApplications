class CppAPI {
    static consoleLog(str = "") {
        try {
            CppConsoleLog(str);
        } catch (e) {
            console.warn("[CppAPI] ultralight binding error - function 'CppConsoleLog'");
        }
    }

    static getTasksByDate(todayDate = new Date()) {
        try {
            let jsonStr = GetTasksByDate({
                date: todayDate,
            });

            return JSON.parse(jsonStr);
        } catch (e) {
            CppAPI.consoleLog("[CppAPI] ultralight binding error - function 'GetTasksByDate'");
        }

        return [];
    }

    static getTaskById(taskId) {
        if (taskId == null) {
            return [{}];
        }

        taskId = parseInt(taskId);
        if (isNaN(taskId) || taskId < 1) {
            return [{}];
        }

        try {
            let jsonStr = GetTaskById(taskId);
            return JSON.parse(jsonStr);
        } catch (e) {
            CppAPI.consoleLog("[CppAPI] ultralight binding error - function 'GetTasksById'");
        }

        return [{}];
    }

    static saveTask(task) {
        if (task == null) {
            return 0;
        }

        try {
            return SaveTask(task);
        } catch (e) {
            CppAPI.consoleLog("[CppAPI] ultralight binding error - function 'SaveTask'");
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
            CppAPI.consoleLog("[CppAPI] ultralight binding error - function 'DeleteTaskById'");
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
            CppAPI.consoleLog("[CppAPI] ultralight binding error - function 'UpdateTask'");
        }

        return false;
    }

    static savePreset(preset) {
        if (preset == null) {
            return 0;
        }

        try {
            return SavePreset(preset);
        } catch (e) {
            CppAPI.consoleLog("[CppAPI] ultralight binding error - function 'SavePreset'");
        }

        return 0;
    }

    static deletePreset(preset) {
        if (preset == null) {
            return 0;
        }

        try {
            return DeletePreset(preset);
        } catch (e) {
            CppAPI.consoleLog("[CppAPI] ultralight binding error - function 'DeletePreset'");
        }

        return 0;
    }

    static getAllPresets(todayDate = new Date()) {
        try {
            let jsonStr = GetAllPresets()();

            return JSON.parse(jsonStr);
        } catch (e) {
            CppAPI.consoleLog("[CppAPI] ultralight binding error - function 'getAllPresets'");
        }

        return [];
    }
}