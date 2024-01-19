#include <gtest/gtest.h>
#include "Encdec.h"

TEST(HelloTest, BassicAssertions){
    Encdec encrypter;

    std::string original = "Hello World! 123 ~~";
    std::string encrypted = encrypter.encrypt(original);
    std::string decrypted = encrypter.decrypt(encrypted);

    EXPECT_EQ(original, decrypted);
}