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
            SaveTask(task);
            return true;
        } catch (e) {
            console.warn("[CppAPI] ultralight binding error - function 'SaveTask'");
        }

        return false;
    }
}