//
// Created by Adrian on 14/01/2024.
//

#include "encdec.h"

// Function to encrypt the plain text
std::string encdec::encrypt(std::string text) {
    std::string result = "";

    // Traverse the text
    for (int i = 0; i < text.length(); i++) {
        // Apply transformation to each character
        // Encrypt Uppercase letters
        if (isupper(text[i]))
            result += char(int(text[i] + s - 65) % 26 + 65);

            // Encrypt Lowercase letters
        else
            result += char(int(text[i] + s - 97) % 26 + 97);
    }

    return result;
}

// Function to decrypt the encrypted text
std::string encdec::decrypt(std::string text) {
    std::string result = "";

    // Traverse the text
    for (int i = 0; i < text.length(); i++) {
        // Apply transformation to each character
        // Encrypt Uppercase letters
        if (isupper(text[i]))
            result += char(int(text[i] + (26 - s) - 65) % 26 + 65);

            // Encrypt Lowercase letters
        else
            result += char(int(text[i]+ (26 - s) - 97) % 26 + 97);
    }

    return result;
}

