#include <gtest/gtest.h>
#include "Encdec.h"

//// Demonstrate some basic assertions.
//TEST(HelloTest, BasicAssertions) {
//// Expect two strings not to be equal.
//EXPECT_STRNE("hello", "world");
//// Expect equality.
//EXPECT_EQ(7 * 6, 42);
//}

TEST(HelloTest, BassicAssertions){
    Encdec encrypter;

    const char* original = "Hello World 42!";
    string encrypted = encrypter.encrypt(original);

    const char* decrypted = (encrypter.decrypt(encrypted).c_str());

    EXPECT_STREQ(original, decrypted);


}