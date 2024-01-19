#include <gtest/gtest.h>
#include "Encdec.h"
#include "MyApp.h"

JSObject CreateJSObject();

TEST(EncryptionTest, BassicAssertions){
    Encdec encrypter;

    std::string original = "Hello World! 123 ~~";
    std::string encrypted = encrypter.encrypt(original);
    std::string decrypted = encrypter.decrypt(encrypted);

    EXPECT_EQ(original, decrypted);
}
//
//TEST(DatabaseTest, BassicAssertions){
//    //given
//    MyApp myApp;
//    sqlite3 *db;
//    sqlite3_open("Testing.db", &db);
//
//    //when
//    myApp.CreateTasksTableIfNotExist(db);
//
//    //then
//    const char *sql = "SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'";
//    sqlite3_stmt *stmt;
//    int rc = sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr);
//    string nameString;
//    while (sqlite3_step(stmt) == SQLITE_ROW) {
//        const char *name = reinterpret_cast<const char *>(sqlite3_column_text(stmt, 0));
//        nameString = name;
//    }
//    sqlite3_finalize(stmt);
//    sqlite3_close(db);
//
//
//
//    EXPECT_EQ("tasks", nameString);
//
//
//
//}
//
//JSObject CreateJSObject() {
//    // Get the JSContext
//    JSContextRef ctx = JSGlobalContextCreate(NULL);;
//    JSObjectRef jsObject = JSObjectMake(ctx, NULL, NULL);
//
//    // Create a JS string value
//    JSStringRef taskNameProperty = JSStringCreateWithUTF8CString("taskName");
//    JSStringRef dateProperty = JSStringCreateWithUTF8CString("date");
//    JSStringRef startTimeProperty = JSStringCreateWithUTF8CString("startTime");
//    JSStringRef endTimeProperty = JSStringCreateWithUTF8CString("endTime");
//    JSStringRef commentProperty = JSStringCreateWithUTF8CString("endTime");
//    JSStringRef taskNameValue = JSStringCreateWithUTF8CString("Integration Testing");
//    JSStringRef dateValue = JSStringCreateWithUTF8CString("19.01.2024");
//    JSStringRef startTimeValue = JSStringCreateWithUTF8CString("14:00");
//    JSStringRef endTimeValue = JSStringCreateWithUTF8CString("15:00");
//    JSStringRef commentValue = JSStringCreateWithUTF8CString("I hope this test works");
//
//    // Set the property on the object
//    JSObjectSetProperty(ctx, jsObject, taskNameProperty, JSValueMakeString(ctx, taskNameValue), kJSPropertyAttributeNone, NULL);
//    JSObjectSetProperty(ctx, jsObject, dateProperty, JSValueMakeString(ctx, dateValue), kJSPropertyAttributeNone, NULL);
//    JSObjectSetProperty(ctx, jsObject, startTimeProperty, JSValueMakeString(ctx, startTimeValue), kJSPropertyAttributeNone, NULL);
//    JSObjectSetProperty(ctx, jsObject, endTimeProperty, JSValueMakeString(ctx, endTimeValue), kJSPropertyAttributeNone, NULL);
//    JSObjectSetProperty(ctx, jsObject, commentProperty, JSValueMakeString(ctx, commentValue), kJSPropertyAttributeNone, NULL);
//
//    // Release the JS strings
//    JSStringRelease(taskNameProperty);
//    JSStringRelease(dateProperty);
//    JSStringRelease(startTimeProperty);
//    JSStringRelease(endTimeProperty);
//    JSStringRelease(commentProperty);
//    JSStringRelease(taskNameValue);
//    JSStringRelease(dateValue);
//    JSStringRelease(startTimeValue);
//    JSStringRelease(endTimeValue);
//    JSStringRelease(commentValue);
//
//    return jsObject;
//}
