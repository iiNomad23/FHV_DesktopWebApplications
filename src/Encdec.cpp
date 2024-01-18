//
// Created by Adrian on 14/01/2024.
//
// Takes ASCII Values starting from 32 (Space) up to 127.
// This includes all lower and uppercase letters as well as numbers
// and special characters.
//

#include "Encdec.h"

std::string Encdec::encrypt(std::string text) {
    std::string result = "";

    for (int i = 0; i < text.length(); i++) {
        int base = 32;
        int rangeSize = 95; // 32+95 = 127 (all remaining ascii characters)

        result += char((int(text[i] - base + s) % rangeSize) + base);
    }

    return result;
}

std::string Encdec::decrypt(std::string text) {
    std::string result = "";

    for (int i = 0; i < text.length(); i++) {
        int base = 32;
        int rangeSize = 95;

        result += char((int(text[i] - base - s + rangeSize) % rangeSize) + base);
    }

    return result;
}


