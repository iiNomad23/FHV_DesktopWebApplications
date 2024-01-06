project(MyApp C CXX)
cmake_minimum_required(VERSION 3.3.2)

include(cmake/App.cmake)

set(SOURCES "src/MyApp.h"
            "src/MyApp.cpp"
            "src/main.cpp"
            "src/libraries/sqlite/sqlite3.c"
            "src/libraries/sqlite/sqlite3.h"
            "src/libraries/sqlite/sqlite3ext.h"
            "src/libraries/sqlite/shell.c"
)

add_app("${SOURCES}")

#find_package(SQLite3)
#include_directories(/src/libraries/sqlite)
#
#add_executable(MyApp2 main.cpp)
#
#target_link_libraries(MyApp2 /src/libraries/sqlite)

