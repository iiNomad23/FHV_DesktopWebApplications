//
// Created by Adrian on 14/01/2024.
//

#ifndef MYAPP_ENCDEC_H
#define MYAPP_ENCDEC_H

#include <fstream>
using namespace std;

class Encdec {
    int key;
    int s = 1;

public:
    std::string encrypt(string text);
    std::string decrypt(string text);
};

#endif //MYAPP_ENCDEC_H
