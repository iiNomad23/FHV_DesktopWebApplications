//
// Created by Adrian on 20/01/2024.
//

#ifndef MYAPP_DATABASEHELPER_H
#define MYAPP_DATABASEHELPER_H
#include "libraries/sqlite/sqlite3.h"

class DatabaseHelper {
public:
    int CreatePresetsTableIfNotExist(sqlite3 *db);
    int CreateTasksTableIfNotExist(sqlite3 *db);
};


#endif //MYAPP_DATABASEHELPER_H
