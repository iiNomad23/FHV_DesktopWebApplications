#include "MyApp.h"
#include <iostream>
#include <cstdio>
#include <vector>
#include "./libraries/sqlite/sqlite3.h"

#define WINDOW_WIDTH  600
#define WINDOW_HEIGHT 400

using namespace std;
void printJSValue(JSContextRef ctx, JSValueRef value);
void PrintJSObject(JSContextRef ctx, JSObjectRef object);
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
    window_ = Window::Create(app_->main_monitor(), WINDOW_WIDTH, WINDOW_HEIGHT,
                             false, kWindowFlags_Titled | kWindowFlags_Resizable);

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

    if(args.size() == 1){

        ultralight::JSObject ultraObject = args[0];
        cout << "value:" << endl;
        cout <<GetValueOfProperty(ultraObject.context(), ultraObject, "taskName") << endl;
//        // Convert Ultralight String to a C-style string (const char*)
//        const char* cString = ultraString.utf8().data();
//
//        // Print the C-style string
//        std::cout << "The Ultralight String is: " << cString << std::endl;


//        ultralight::String test = args[0];
//        cout << "arg:"<< endl;
//        cout << test << endl;
    }

    cout << thisObject.HasProperty(ultralight::JSString("taskname")) <<endl;
    JSValueRef test = JSObjectGetProperty(thisObject.context(), thisObject, ultralight::JSString("name"), nullptr);
    printJSValue(thisObject.context(), test);


    sqlite3 *db;
    char *zErrMsg = 0;
    int rc;

    rc = sqlite3_open("TimeTracker.db", &db);

    if( rc ) {

        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        return(0);
    }

    fprintf(stderr, "Opened database successfully\n");


    sqlite3_close(db);


    cout << "test123" << endl;
    return JSValue("Hello from C++!");
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
    char* taskNameCString = new char[taskNameSize];
    JSStringGetUTF8CString(propertyValueStringRef, taskNameCString, taskNameSize);

    // Copy the C-string into a std::string, managing memory correctly
    string result = taskNameCString;

    // Clean up memory
    delete[] taskNameCString;
    JSStringRelease(propertyValueStringRef);
    JSStringRelease(propName);

    return result;
}