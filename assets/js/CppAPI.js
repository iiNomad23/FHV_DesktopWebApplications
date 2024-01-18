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
            console.warn("[root] ultralight binding error - function 'GetTasksByDate'");
        }

        return [];
    }

    static saveTask(task) {
        if (task == null) {
            return;
        }

        try {
            SaveTask(task);
        } catch (e) {
            console.warn("[root] ultralight binding error - function 'SaveTask'");
        }
    }
}