project(MyApp C CXX)
cmake_minimum_required(VERSION 3.3.2)
set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Google Test Configuration
include(FetchContent)
FetchContent_Declare(
        googletest
        URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)
enable_testing()

# Application Source Files
set(APP_SOURCES
        "src/MyApp.h"
        "src/MyApp.cpp"
        "src/main.cpp"
        "src/Encdec.h"
        "src/Encdec.cpp"
        "src/DatabaseHelper.cpp"
        "src/DatabaseHelper.h"
        "src/libraries/sqlite/sqlite3.c"
        "src/libraries/sqlite/sqlite3.h"
        "src/libraries/sqlite/sqlite3ext.h"
        "src/libraries/sqlite/shell.c"
        # Include other source files here
)

# Test Source Files
set(TEST_SOURCES
        "src/hello_test.cc"
        "src/DatabaseHelper.h"
        "src/DatabaseHelper.cpp"
        "src/libraries/sqlite/sqlite3.h"
        "src/libraries/sqlite/sqlite3.c"
        # Include other test files here
)

# Test Executable
add_executable(hello_test ${TEST_SOURCES} "src/Encdec.cpp")
target_link_libraries(hello_test GTest::gtest_main)
#target_link_libraries(hello_test sqlite3)
include(GoogleTest)
gtest_discover_tests(hello_test)

# Main Application Executable
include(cmake/App.cmake)
add_app("${APP_SOURCES}")
