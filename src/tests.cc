#include <gtest/gtest.h>
#include "Encdec.h"
#include "DatabaseHelper.h"
#include "libraries/sqlite/sqlite3.h"



TEST(EncryptionTest, BasicAssertions){
    //given
    Encdec encrypter;
    std::string original = "Hello World! 123 ~~";

    //when
    std::string encrypted = encrypter.encrypt(original);
    std::string decrypted = encrypter.decrypt(encrypted);

    //then
    EXPECT_EQ(original, decrypted);
}

TEST(DatabaseIntegrationTest, BasicAssertions){
    //given
    DatabaseHelper databaseHelper;
    sqlite3 *db;
    sqlite3_open("Testing.db", &db);

    //when
    databaseHelper.CreateTasksTableIfNotExist(db);

    //then
    const char *sql = "SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'";
    sqlite3_stmt *stmt;
    int rc = sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr);
    string nameString;
    while (sqlite3_step(stmt) == SQLITE_ROW) {
        const char *name = reinterpret_cast<const char *>(sqlite3_column_text(stmt, 0));
        nameString = name;
    }
    sqlite3_finalize(stmt);
    sqlite3_close(db);

    EXPECT_EQ("tasks", nameString);
}