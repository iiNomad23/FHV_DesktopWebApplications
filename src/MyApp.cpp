#include "MyApp.h"
#include <iostream>
#include <cstdio>
#include <vector>
#include "./libraries/sqlite/sqlite3.h"
#include "Encdec.h"
#include "Task.h"
#include "json.hpp"
#include "DatabaseHelper.h"

#define WINDOW_WIDTH  1024
#define WINDOW_HEIGHT 768

using namespace std;
using json = nlohmann::json;

void printJSValue(JSContextRef ctx, JSValueRef value);

void PrintJSObject(JSContextRef ctx, JSObjectRef object);
int GetMostRecentTaskId();
void to_json(json &j, const Task &task);

string GetValueOfProperty(JSContextRef ctx, JSObjectRef object, const char *name);

MyApp::MyApp() {
    ///
    /// Create our main App instance.
    ///
    app_ = App::Create();

    ///
    /// Create a resizable window by passing by OR'ing our window flags with
    /// kWindowFlags_Resizable.
    ///
    window_ = Window::Create(
            app_->main_monitor(),
            WINDOW_WIDTH,
            WINDOW_HEIGHT,
            false,
            kWindowFlags_Titled | kWindowFlags_Resizable | kWindowFlags_Maximizable
    );

    ///
    /// Center the window on startup
    ///
    window_->MoveToCenter();

    ///
    /// Create our HTML overlay-- we don't care about its initial size and
    /// position because it'll be calculated when we call OnResize() below.
    ///
    overlay_ = Overlay::Create(window_, 1, 1, 0, 0);

    ///
    /// Force a call to OnResize to perform size/layout of our overlay.
    ///
    OnResize(window_.get(), window_->width(), window_->height());

    ///
    /// Load a page into our overlay's View
    ///
    overlay_->view()->LoadURL("file:///app.html");

    ///
    /// Register our MyApp instance as an AppListener so we can handle the
    /// App's OnUpdate event below.
    ///
    app_->set_listener(this);

    ///
    /// Register our MyApp instance as a WindowListener so we can handle the
    /// Window's OnResize event below.
    ///
    window_->set_listener(this);

    ///
    /// Register our MyApp instance as a LoadListener so we can handle the
    /// View's OnFinishLoading and OnDOMReady events below.
    ///
    overlay_->view()->set_load_listener(this);

    ///
    /// Register our MyApp instance as a ViewListener so we can handle the
    /// View's OnChangeCursor and OnChangeTitle events below.
    ///
    overlay_->view()->set_view_listener(this);
}

MyApp::~MyApp() {
}

void MyApp::Run() {
    app_->Run();
}

void MyApp::OnUpdate() {
    ///
    /// This is called repeatedly from the application's update loop.
    ///
    /// You should update any app logic here.
    ///
}

void MyApp::OnClose(ultralight::Window *window) {
    app_->Quit();
}

void MyApp::OnResize(ultralight::Window *window, uint32_t width, uint32_t height) {
    ///
    /// This is called whenever the window changes size (values in pixels).
    ///
    /// We resize our overlay here to take up the entire window.
    ///
    if (width < 400) {
        width = 400;
    }
    if (height < 400) {
        height = 400;
    }

    overlay_->Resize(width, height);
}

void MyApp::OnFinishLoading(ultralight::View *caller,
                            uint64_t frame_id,
                            bool is_main_frame,
                            const String &url) {
    ///
    /// This is called when a frame finishes loading on the page.
    ///
}

void MyApp::OnDOMReady(ultralight::View *caller,
                       uint64_t frame_id,
                       bool is_main_frame,
                       const String &url) {
    ///
    /// This is called when a frame's DOM has finished loading on the page.
    ///
    /// This is the best time to setup any JavaScript bindings.
    ///

    RefPtr<JSContext> context = caller->LockJSContext();
    SetJSContext(context->ctx());

    JSObject global = JSGlobalObject();

    global["SaveTask"] = BindJSCallbackWithRetval(&MyApp::SaveTask);
    global["GetTasksByDate"] = BindJSCallbackWithRetval(&MyApp::GetTasksByDate);
    global["GetTaskById"] = BindJSCallbackWithRetval(&MyApp::GetTaskById);
    global["CppConsoleLog"] = BindJSCallback(&MyApp::CppConsoleLog);
    global["DeleteTaskById"] = BindJSCallbackWithRetval(&MyApp::DeleteTaskById);
    global["UpdateTask"] = BindJSCallbackWithRetval(&MyApp::UpdateTask);
    global["SavePreset"] = BindJSCallbackWithRetval(&MyApp::SavePreset);
    global["GetAllPresets"] = BindJSCallbackWithRetval(&MyApp::GetAllPresets);
    global["DeletePreset"] = BindJSCallbackWithRetval(&MyApp::DeletePreset);
}

void MyApp::OnChangeCursor(ultralight::View *caller,
                           Cursor cursor) {
    ///
    /// This is called whenever the page requests to change the cursor.
    ///
    /// We update the main window's cursor here.
    ///
    window_->SetCursor(cursor);
}

void MyApp::OnChangeTitle(ultralight::View *caller,
                          const String &title) {
    ///
    /// This is called whenever the page requests to change the title.
    ///
    /// We update the main window's title here.
    ///
    window_->SetTitle(title.utf8().data());
}

///
/// Our native JavaScript callback. This function will be called from JavaScript by calling
/// GetMessage(). We bind the callback within the DOMReady callback defined below.
///
JSValue MyApp::SaveTask(const ultralight::JSObject &thisObject, const ultralight::JSArgs &args) {
    ///
    /// Return our message to JavaScript as a JSValue.
    ///

    cout << "Called: SaveTask" << endl;
    cout << args.data() << endl;
    if (args.size() != 1) {
        return 0;
    }

    // parse values
    ultralight::JSObject ultraObject = args[0];
    cout << "values:" << endl;
    string taskName = GetValueOfProperty(ultraObject.context(), ultraObject, "taskName");
    string date = GetValueOfProperty(ultraObject.context(), ultraObject, "date");
    string startTime = GetValueOfProperty(ultraObject.context(), ultraObject, "startTime");
    string endTime = GetValueOfProperty(ultraObject.context(), ultraObject, "endTime");
    string comment = GetValueOfProperty(ultraObject.context(), ultraObject, "comment");

    string strings[] = {taskName, date, startTime, endTime, comment};
    for (const std::string &str: strings) {
        cout << str << endl;
    }

    // write to db
    sqlite3 *db;
    int rc = sqlite3_open("TimeTracker.db", &db);

    if (rc) {
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        return (0);
    }
    DatabaseHelper databaseHelper;
    if(!databaseHelper.CreateTasksTableIfNotExist(db)){
        cout << "error creating table" << endl;
        return 0;
    }

    const char *sql = "INSERT INTO tasks(taskName, date, startTime, endTime, comment) VALUES (?, ?, ?, ?, ?)";

    sqlite3_stmt *stmt;
    rc = sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr);

    if (rc != SQLITE_OK) {
        cout << "error preparing sql statement" << endl;
        return 0;
    }

    Encdec encrypter;
    sqlite3_bind_text(stmt, 1, encrypter.encrypt(taskName).c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 2, date.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 3, startTime.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 4, endTime.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 5, encrypter.encrypt(comment).c_str(), -1, SQLITE_TRANSIENT);

    rc = sqlite3_step(stmt);
    if (rc != SQLITE_DONE) {
        cout << "error executing sql statement" << endl;
        return 0;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    int taskId = GetMostRecentTaskId();

    fprintf(stderr, "successfully saved to database\n");

    return taskId;
}

int GetMostRecentTaskId(){
    sqlite3 *db;
    int rc = sqlite3_open("TimeTracker.db", &db);
    if (rc) {
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        return (0);
    }

    int taskId;
    const char *getCurrentTaskIdSQL = "SELECT * FROM tasks ORDER BY id DESC LIMIT 1";
    sqlite3_stmt *getTaskIdStmt;
    rc = sqlite3_prepare_v2(db, getCurrentTaskIdSQL, -1, &getTaskIdStmt, nullptr);

    if (rc != SQLITE_OK) {
        cout << "error preparing sql statement" << endl;
        return 0;
    }

    while (sqlite3_step(getTaskIdStmt) == SQLITE_ROW) {
        taskId = sqlite3_column_int(getTaskIdStmt, 0);
    }
    sqlite3_finalize(getTaskIdStmt);
    sqlite3_close(db);
    return taskId;
}

JSValue MyApp::DeleteTaskById(const ultralight::JSObject &thisObject, const ultralight::JSArgs &args) {
    cout << "Called: DeleteTasksById" << endl;

    if (args.size() != 1) {
        return 0;
    }

    int taskId = args[0];
    sqlite3 *db;
    int rc = sqlite3_open("TimeTracker.db", &db);
    if (rc) {
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        return (0);
    }
    DatabaseHelper databaseHelper;
    if(!databaseHelper.CreateTasksTableIfNotExist(db)){
        cout << "error creating table" << endl;
        return 0;
    }

    const char *sql = "DELETE FROM tasks WHERE id = ?";

    sqlite3_stmt *stmt;
    rc = sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr);

    if (rc != SQLITE_OK) {
        cout << "error preparing sql statement" << endl;
        return 0;
    }

    sqlite3_bind_int(stmt, 1, taskId);

    rc = sqlite3_step(stmt);
    if (rc != SQLITE_DONE) {
        cout << "error executing sql statement" << endl;
        return 0;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    fprintf(stderr, "successfully deleted task\n");

    return 1;

}

JSValue MyApp::UpdateTask(const ultralight::JSObject &thisObject, const ultralight::JSArgs &args) {
    cout << "Called: UpdateTasksById" << endl;

    if (args.size() != 1) {
        return 0;
    }

    // parse values
    ultralight::JSObject ultraObject = args[0];
    cout << "values:" << endl;
    string idString = GetValueOfProperty(ultraObject.context(), ultraObject, "id");
    cout << idString << endl;
    int id = stoi(idString);
    cout << "stoi end" << endl;
    string taskName = GetValueOfProperty(ultraObject.context(), ultraObject, "taskName");
    string date = GetValueOfProperty(ultraObject.context(), ultraObject, "date");
    string startTime = GetValueOfProperty(ultraObject.context(), ultraObject, "startTime");
    string endTime = GetValueOfProperty(ultraObject.context(), ultraObject, "endTime");
    string comment = GetValueOfProperty(ultraObject.context(), ultraObject, "comment");

    cout << "values end" << endl;

    sqlite3 *db;
    int rc = sqlite3_open("TimeTracker.db", &db);
    if (rc) {
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        return (0);
    }

    DatabaseHelper databaseHelper;
    if(!databaseHelper.CreateTasksTableIfNotExist(db)){
        cout << "error creating table" << endl;
        return 0;
    }

    const char *sql = "UPDATE tasks "
                      "SET taskName = ?,"
                      "date = ?,"
                      "startTime = ?,"
                      "endTime = ?,"
                      "comment = ?"
                      "WHERE id = ?";

    sqlite3_stmt *stmt;
    rc = sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr);

    if (rc != SQLITE_OK) {
        cout << "error preparing sql statement" << endl;
        return 0;
    }

    Encdec encrypter;
    sqlite3_bind_text(stmt, 1, encrypter.encrypt(taskName).c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 2, date.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 3, startTime.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 4, endTime.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 5, encrypter.encrypt(comment).c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_int(stmt, 6, id);

    rc = sqlite3_step(stmt);
    if (rc != SQLITE_DONE) {
        cout << "error executing sql statement" << endl;
        return 0;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    cout << "successfully updated task" << endl;

    return 1;

}


JSValue MyApp::GetTasksByDate(const ultralight::JSObject &thisObject, const ultralight::JSArgs &args) {
    cout << "Called: GetTasksByDate" << endl;

    if (args.size() != 1) {
        return 0;
    }

    // parse values
    ultralight::JSObject ultraObject = args[0];
    cout << "values:" << endl;
    string date = GetValueOfProperty(ultraObject.context(), ultraObject, "date");
    cout << date << endl;

    sqlite3 *db;
    int rc = sqlite3_open("TimeTracker.db", &db);

    if (rc) {
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        return (0);
    }

    DatabaseHelper databaseHelper;
    if(!databaseHelper.CreateTasksTableIfNotExist(db)){
        cout << "error creating table" << endl;
        return 0;
    }

    const char *sql = "SELECT * FROM tasks WHERE date = ?";

    sqlite3_stmt *stmt;
    rc = sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr);

    if (rc != SQLITE_OK) {
        cout << "error preparing sql statement" << endl;
        return 0;
    }

    Encdec encrypter;
    sqlite3_bind_text(stmt, 1, date.c_str(), -1, SQLITE_TRANSIENT);

    vector<Task> tasks;
    // Execute the query and process the results
    while (sqlite3_step(stmt) == SQLITE_ROW) {
        int id = sqlite3_column_int(stmt, 0);
        const char *name = reinterpret_cast<const char *>(sqlite3_column_text(stmt, 1));
        const char *date = reinterpret_cast<const char *>(sqlite3_column_text(stmt, 2));
        const char *startTime = reinterpret_cast<const char *>(sqlite3_column_text(stmt, 3));
        const char *endTime = reinterpret_cast<const char *>(sqlite3_column_text(stmt, 4));
        const char *comment = reinterpret_cast<const char *>(sqlite3_column_text(stmt, 5));

        std::string str(name);
        tasks.emplace_back(id, name, date, startTime, endTime, comment);
    }

    json result;
    for (const auto &task: tasks) {
        cout << task.taskName << endl;
        cout << task.date << endl;
        cout << task.startTime << endl;
        cout << task.endTime << endl;
        cout << task.comment << endl;
        cout << "------------------" << endl;

        result.push_back(
                json{
                        {"id", task.id},
                        {"taskName",  encrypter.decrypt(task.taskName)},
                        {"date",      task.date},
                        {"startTime", task.startTime},
                        {"endTime",   task.endTime},
                        {"comment",   encrypter.decrypt(task.comment)}
                }
        );
    }

    cout << "done" << endl;
    sqlite3_finalize(stmt);
    sqlite3_close(db);

    cout << result << endl;
    string resultString = result.dump();
    cout << "end" << endl;

    return resultString.c_str();
}

JSValue MyApp::GetTaskById(const ultralight::JSObject &thisObject, const ultralight::JSArgs &args) {
    cout << "Called: GetTasksByDate" << endl;

    if (args.size() != 1) {
        return 0;
    }

    // parse values
    int id = args[0];

    sqlite3 *db;
    int rc = sqlite3_open("TimeTracker.db", &db);

    if (rc) {
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        return (0);
    }

    DatabaseHelper databaseHelper;
    if(!databaseHelper.CreateTasksTableIfNotExist(db)){
        cout << "error creating table" << endl;
        return 0;
    }

    const char *sql = "SELECT * FROM tasks WHERE id = ?";

    sqlite3_stmt *stmt;
    rc = sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr);

    if (rc != SQLITE_OK) {
        cout << "error preparing sql statement" << endl;
        return 0;
    }

    Encdec encrypter;
    sqlite3_bind_int(stmt, 1, id);

    vector<Task> tasks;
    // Execute the query and process the results
    while (sqlite3_step(stmt) == SQLITE_ROW) {
        int id = sqlite3_column_int(stmt, 0);
        const char *name = reinterpret_cast<const char *>(sqlite3_column_text(stmt, 1));
        const char *date = reinterpret_cast<const char *>(sqlite3_column_text(stmt, 2));
        const char *startTime = reinterpret_cast<const char *>(sqlite3_column_text(stmt, 3));
        const char *endTime = reinterpret_cast<const char *>(sqlite3_column_text(stmt, 4));
        const char *comment = reinterpret_cast<const char *>(sqlite3_column_text(stmt, 5));

        std::string str(name);
        tasks.emplace_back(id, name, date, startTime, endTime, comment);
    }

    json result;
    for (const auto &task: tasks) {
        cout << task.taskName << endl;
        cout << task.date << endl;
        cout << task.startTime << endl;
        cout << task.endTime << endl;
        cout << task.comment << endl;
        cout << "------------------" << endl;

        result.push_back(
                json{
                        {"id", task.id},
                        {"taskName",  encrypter.decrypt(task.taskName)},
                        {"date",      task.date},
                        {"startTime", task.startTime},
                        {"endTime",   task.endTime},
                        {"comment",   encrypter.decrypt(task.comment)}
                }
        );
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    string resultString = result.dump();
    return resultString.c_str();
}

JSValue MyApp::SavePreset(const ultralight::JSObject &thisObject, const ultralight::JSArgs &args) {
    ///
    /// Return our message to JavaScript as a JSValue.
    ///

    cout << "Called: SavePreset" << endl;

    if (args.size() != 1) {
        return 0;
    }

    // parse values
    ultralight::String presetUltralightString = args[0];
    string preset = presetUltralightString.utf8().data();

    // write to db
    sqlite3 *db;
    int rc = sqlite3_open("TimeTracker.db", &db);
    if (rc) {
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        return (0);
    }

    DatabaseHelper databaseHelper;
    if(!databaseHelper.CreatePresetsTableIfNotExist(db)){
        cout << "error creating table" << endl;
        return 0;
    }

    const char *sql = "INSERT INTO presets(name) VALUES (?)";

    sqlite3_stmt *stmt;
    rc = sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr);

    if (rc != SQLITE_OK) {
        cout << "error preparing sql statement" << endl;
        return 0;
    }

    Encdec encrypter;
    sqlite3_bind_text(stmt, 1, encrypter.encrypt(preset).c_str(), -1, SQLITE_TRANSIENT);

    rc = sqlite3_step(stmt);
    if (rc != SQLITE_DONE) {
        cout << "error executing sql statement" << endl;
        return 0;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    fprintf(stderr, "successfully saved to database\n");

    return 1;
}

JSValue MyApp::GetAllPresets(const ultralight::JSObject &thisObject, const ultralight::JSArgs &args) {
    cout << "Called: GetAllPresets" << endl;

    sqlite3 *db;

    int rc = sqlite3_open("TimeTracker.db", &db);

    if (rc) {
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        return (0);
    }


    DatabaseHelper databaseHelper;
    if(!databaseHelper.CreatePresetsTableIfNotExist(db)){
        cout << "error creating table" << endl;
        return 0;
    }

    const char *sql = "SELECT * FROM presets";

    sqlite3_stmt *stmt;
    rc = sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr);

    if (rc != SQLITE_OK) {
        cout << "error preparing sql statement" << endl;
        return 0;
    }

    Encdec encrypter;

    vector<std::string> presets;
    // Execute the query and process the results
    while (sqlite3_step(stmt) == SQLITE_ROW) {
        const char *name = reinterpret_cast<const char *>(sqlite3_column_text(stmt, 0));
        presets.emplace_back(name);
    }



    json result;
    for (const auto &preset: presets) {
        cout << preset << endl;

        cout << "------------------" << endl;

        result.push_back(
                json{
                        {"preset", encrypter.decrypt(preset)},
                }
        );
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    string resultString = result.dump();
    return resultString.c_str();

}

JSValue MyApp::DeletePreset(const ultralight::JSObject &thisObject, const ultralight::JSArgs &args){
    ///
    /// Return our message to JavaScript as a JSValue.
    ///

    cout << "Called: DeletePreset" << endl;

    if (args.size() != 1) {
        return 0;
    }

    // parse values
    ultralight::String presetUltralightString = args[0];
    string preset = presetUltralightString.utf8().data();

    // write to db
    sqlite3 *db;
    int rc = sqlite3_open("TimeTracker.db", &db);

    if (rc) {
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        return (0);
    }

    DatabaseHelper databaseHelper;
    if(!databaseHelper.CreatePresetsTableIfNotExist(db)){
        cout << "error creating table" << endl;
        return 0;
    }

    const char *sql = "DELETE FROM presets WHERE name = ?";

    sqlite3_stmt *stmt;
    rc = sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr);

    if (rc != SQLITE_OK) {
        cout << "error preparing sql statement" << endl;
        return 0;
    }

    Encdec encrypter;
    sqlite3_bind_text(stmt, 1, encrypter.encrypt(preset).c_str(), -1, SQLITE_TRANSIENT);

    rc = sqlite3_step(stmt);
    if (rc != SQLITE_DONE) {
        cout << "error executing sql statement" << endl;
        return 0;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    fprintf(stderr, "successfully deleted preset\n");

    return 1;
}


void MyApp::CppConsoleLog(const ultralight::JSObject &thisObject, const ultralight::JSArgs &args) {
    cout << "Called: CppConsoleLog" << endl;

    if (args.size() == 1) {
        ultralight::String jsMessage = args[0];
        cout << jsMessage.utf8().data() << endl;
    }
}

void to_json(json &j, const Task &task) {
    j = json{{"taskName",  task.taskName},
             {"date",      task.date},
             {"startTime", task.startTime},
             {"endTime",   task.endTime},
             {"comment",   task.comment}};
}

std::string createString() {
    return "temporary string";
}

void printJSValue(JSContextRef ctx, JSValueRef value) {
    // Check if the value is an exception or a valid value
    if (JSValueIsUndefined(ctx, value) || JSValueIsNull(ctx, value)) {
        std::cout << "Value is undefined or null" << std::endl;
        return;
    }

    // Convert JSValueRef to a JSStringRef (string representation)
    JSStringRef stringRef = JSValueToStringCopy(ctx, value, nullptr);

    // Convert JSStringRef to a standard C++ string
    size_t maxBufferSize = JSStringGetMaximumUTF8CStringSize(stringRef);
    vector<char> buffer(maxBufferSize);
    size_t actualSize = JSStringGetUTF8CString(stringRef, &buffer[0], maxBufferSize);

    std::string valueStr(buffer.begin(), buffer.begin() + actualSize - 1); // -1 to exclude the null terminator

    // Print the value
    std::cout << "JSValue is: " << valueStr << std::endl;

    // Release the JSStringRef
    JSStringRelease(stringRef);
}


string GetValueOfProperty(JSContextRef ctx, JSObjectRef object, const char *name) {
    // Create JavaScript strings for the property names
    JSStringRef propName = JSStringCreateWithUTF8CString(name);

    // Get property values from the JavaScript object
    JSValueRef propertyValue = JSObjectGetProperty(ctx, object, propName, nullptr);

    // Convert the JSValueRef to a UTF-8 encoded C-string
    JSStringRef propertyValueStringRef = JSValueToStringCopy(ctx, propertyValue, nullptr);
    size_t taskNameSize = JSStringGetMaximumUTF8CStringSize(propertyValueStringRef);
    char *taskNameCString = new char[taskNameSize];
    JSStringGetUTF8CString(propertyValueStringRef, taskNameCString, taskNameSize);

    // Copy the C-string into a std::string, managing memory correctly
    string result = taskNameCString;

    // Clean up memory
    delete[] taskNameCString;
    JSStringRelease(propertyValueStringRef);
    JSStringRelease(propName);

    return result;
}

//int MyApp::CreateTasksTableIfNotExist(sqlite3 *db){
//
//    const char *createDBSql = "CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY AUTOINCREMENT, taskName TEXT, date TEXT, startTime TEXT, endTime TEXT, comment TEXT)";
//
//    sqlite3_stmt *createDBStatement;
//    int rc = sqlite3_prepare_v2(db, createDBSql, -1, &createDBStatement, nullptr);
//
//    if (rc != SQLITE_OK) {
//        cout << "error preparing sql statement" << endl;
//        return 0;
//    }
//
//    rc = sqlite3_step(createDBStatement);
//    if (rc != SQLITE_DONE) {
//        cout << "error executing sql statement" << endl;
//        return 0;
//    }
//
//    sqlite3_finalize(createDBStatement);
//
//    return 1;
//}
//
//int CreatePresetsTableIfNotExist(sqlite3 *db){
//    cout << "Create Presets Table If Not Exist called" << endl;
//    const char *createDBSql = "CREATE TABLE IF NOT EXISTS presets(name TEXT PRIMARY KEY)";
//
//    sqlite3_stmt *createDBStatement;
//    int rc = sqlite3_prepare_v2(db, createDBSql, -1, &createDBStatement, nullptr);
//
//    if (rc != SQLITE_OK) {
//        cout << "error preparing sql statement" << endl;
//        return 0;
//    }
//
//    rc = sqlite3_step(createDBStatement);
//    if (rc != SQLITE_DONE) {
//        cout << "error executing sql statement" << endl;
//        return 0;
//    }
//
//    sqlite3_finalize(createDBStatement);
//    cout << "Create Presets Table If Not Exist completed" << endl;
//    return 1;
//}