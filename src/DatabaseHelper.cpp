//
// Created by Adrian on 20/01/2024.
//
#include <iostream>
#include "DatabaseHelper.h"

using namespace std;

int DatabaseHelper::CreatePresetsTableIfNotExist(sqlite3 *db){
    cout << "Create Presets Table If Not Exist called" << endl;
    const char *createDBSql = "CREATE TABLE IF NOT EXISTS presets(name TEXT PRIMARY KEY)";

    sqlite3_stmt *createDBStatement;
    int rc = sqlite3_prepare_v2(db, createDBSql, -1, &createDBStatement, nullptr);

    if (rc != SQLITE_OK) {
        cout << "error preparing sql statement" << endl;
        return 0;
    }

    rc = sqlite3_step(createDBStatement);
    if (rc != SQLITE_DONE) {
        cout << "error executing sql statement" << endl;
        return 0;
    }

    sqlite3_finalize(createDBStatement);
    cout << "Create Presets Table If Not Exist completed" << endl;
    return 1;
}


int DatabaseHelper::CreateTasksTableIfNotExist(sqlite3 *db){

    const char *createDBSql = "CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY AUTOINCREMENT, taskName TEXT, date TEXT, startTime TEXT, endTime TEXT, comment TEXT)";

    sqlite3_stmt *createDBStatement;
    int rc = sqlite3_prepare_v2(db, createDBSql, -1, &createDBStatement, nullptr);

    if (rc != SQLITE_OK) {
        cout << "error preparing sql statement" << endl;
        return 0;
    }

    rc = sqlite3_step(createDBStatement);
    if (rc != SQLITE_DONE) {
        cout << "error executing sql statement" << endl;
        return 0;
    }

    sqlite3_finalize(createDBStatement);

    return 1;
}
